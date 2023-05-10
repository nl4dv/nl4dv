from nl4dv.utils import constants, helpers
import copy
import nltk
from nltk import word_tokenize


class AttributeGenie:
    def __init__(self, nl4dv_instance):
        self.nl4dv_instance = nl4dv_instance

    # Get a sorted list of (attributes and their datatype) tuples to determine IMPLICIT TASKS as well as default VIS encodings
    def get_attr_datatype_shorthand(self, attributes):
        # Attribute-Datatype pair
        unsorted_attr_datatype = [(attr, self.nl4dv_instance.data_genie_instance.data_attribute_map[attr]['dataType']) for attr in attributes]

        # Since the `vis_combo` mapping keys are in a specific order [Q,N,O,T], we will order the list of attributes in this order
        default_sort_order = ['Q', 'N', 'O', 'T']
        sorted_attr_datatype = [(attr,attr_type) for x in default_sort_order for (attr,attr_type) in unsorted_attr_datatype if attr_type == x]
        sorted_attributes = [x[0] for x in sorted_attr_datatype]  # e.g. ['Rotten Tomatoes Rating', 'Worldwide Gross']
        sorted_attribute_datatypes = ''.join([x[1] for x in sorted_attr_datatype])  # e.g. 'QQ'

        return sorted_attributes, sorted_attribute_datatypes

    # 1-time generation of Attributes for processing
    def get_data_attributes(self):
        attribute_map = dict()
        for attr in self.nl4dv_instance.data_genie_instance.data_attribute_map:
            attr_lower = attr.lower()
            attribute_map[attr] = dict()
            attribute_map[attr]['raw'] = attr
            attribute_map[attr]['lower'] = attr_lower
            attribute_map[attr]['stemmed_lower'] = ' '.join(self.nl4dv_instance.porter_stemmer_instance.stem(t) for t in nltk.word_tokenize(attr_lower))

        return attribute_map

    # 1-time generation of Attribute Aliases for processing
    def get_attribute_aliases(self):
        attribute_aliases = dict()
        for attr in self.nl4dv_instance.data_genie_instance.data_attribute_map:
            attribute_aliases[attr] = dict()
            for alias in self.nl4dv_instance.data_genie_instance.data_attribute_map[attr]['aliases']:
                alias_lower = alias.lower()

                attribute_aliases[attr][alias] = dict()
                attribute_aliases[attr][alias]['raw'] = alias
                attribute_aliases[attr][alias]['lower'] = alias_lower
                attribute_aliases[attr][alias]['stemmed_lower'] = ' '.join(self.nl4dv_instance.porter_stemmer_instance.stem(t) for t in nltk.word_tokenize(alias_lower))

        return attribute_aliases

    # Update the state if keyword-attribute mappings
    def update_keyword_attribute_mappings(self, keyword, attribute, score):
        if keyword not in self.nl4dv_instance.keyword_attribute_mapping:
            self.nl4dv_instance.keyword_attribute_mapping[keyword] = dict()
        self.nl4dv_instance.keyword_attribute_mapping[keyword][attribute] = score

        if attribute not in self.nl4dv_instance.attribute_keyword_mapping:
            self.nl4dv_instance.attribute_keyword_mapping[attribute] = dict()
        self.nl4dv_instance.attribute_keyword_mapping[attribute][keyword] = score

    # Detect attributes by exact_match of n-grams
    def detect_attributes_by_exact_match(self, query_ngrams, data_attributes, query_attributes):
        for attr in data_attributes:
            for ngram in query_ngrams:
                # Exact Match
                if data_attributes[attr]["lower"] == query_ngrams[ngram]["lower"] or data_attributes[attr]["stemmed_lower"] == query_ngrams[ngram]["stemmed_lower"]:
                    if attr not in query_attributes:
                        query_attributes[attr] = {
                            'name': attr,
                            "queryPhrase": [query_ngrams[ngram]["lower"]],
                            'inferenceType': 'explicit',
                            'matchScore': self.nl4dv_instance.match_scores['attribute']['attribute_exact_match'],
                            'metric': ['attribute_exact_match'],
                            'isLabel': self.nl4dv_instance.data_genie_instance.data_attribute_map[attr]["isLabelAttribute"],
                            'encode': not self.nl4dv_instance.data_genie_instance.data_attribute_map[attr]["isLabelAttribute"],
                            'isAmbiguous': False,
                            'ambiguity': list(),
                            'meta': {
                                'score': 100,
                                'threshold': self.nl4dv_instance.match_thresholds['string_similarity'],
                                'alias': None,
                                'ambiguity': {},
                                'dataType': self.nl4dv_instance.data_genie_instance.data_attribute_map[attr]['dataType']
                            }
                        }

                        # Update Keyword-Attribute-Score Mappings
                        self.update_keyword_attribute_mappings(keyword=query_ngrams[ngram]["lower"], attribute=attr, score=query_attributes[attr]["matchScore"])

                        # Important! If, the attribute is detected by exact match, then break the loop. We can safely SKIP subsequent n-grams saving *some* cycles.
                        break

        return query_attributes

    # Detect attributes based on string similarity of the n-grams
    def detect_attributes_by_similarity(self, query_ngrams, data_attributes, query_attributes):

        for attr in data_attributes:

            # If already found, continue
            if attr in query_attributes and any(a for a in query_attributes[attr]["metric"] if a in ["attribute_exact_match"]):
                continue

            for ngram in query_ngrams:
                score = 0
                add_attribute = False
                # Compute similarity of tokens
                string_similarity_score = helpers.compute_similarity(data_attributes[attr]["lower"], query_ngrams[ngram]["lower"], 'token_similarity')
                if string_similarity_score >= self.nl4dv_instance.match_thresholds['string_similarity']:
                    score = string_similarity_score
                    add_attribute = True

                else:
                    # Compute similarity of stemmed tokens
                    stemmed_string_similarity_score = helpers.compute_similarity(data_attributes[attr]["stemmed_lower"], query_ngrams[ngram]["stemmed_lower"], 'token_similarity')
                    if stemmed_string_similarity_score >= self.nl4dv_instance.match_thresholds['string_similarity']:
                        score = stemmed_string_similarity_score
                        add_attribute = True

                if add_attribute:
                    if attr not in query_attributes or query_attributes[attr]["meta"]["score"] <= score:
                        query_attributes[attr] = {
                            'name': attr,
                            "queryPhrase": [query_ngrams[ngram]["lower"]],
                            'inferenceType': 'explicit',
                            'matchScore': self.nl4dv_instance.match_scores['attribute']['attribute_similarity_match'],
                            'metric': ['attribute_similarity_match'],
                            'isLabel': self.nl4dv_instance.data_genie_instance.data_attribute_map[attr]["isLabelAttribute"],
                            'encode': not self.nl4dv_instance.data_genie_instance.data_attribute_map[attr]["isLabelAttribute"],
                            'isAmbiguous': False,
                            'ambiguity': list(),
                            'meta': {
                                'score': score,
                                'threshold': self.nl4dv_instance.match_thresholds['string_similarity'],
                                'alias': None,
                                'ambiguity': {},
                                'dataType': self.nl4dv_instance.data_genie_instance.data_attribute_map[attr]['dataType']
                            }
                        }

                        # Update Keyword-Attribute-Score Mappings
                        self.update_keyword_attribute_mappings(keyword=query_ngrams[ngram]["lower"], attribute=attr, score=query_attributes[attr]["matchScore"])

        return query_attributes

    # Detect attributes by alias exact_match of n-grams
    def detect_attributes_by_alias_exact_match(self, query_ngrams, data_attributes, query_attributes, attribute_aliases):
        for attr in data_attributes:
            # If already found, continue
            if attr in query_attributes and any(a for a in query_attributes[attr]["metric"] if a in ["attribute_similarity_match"]):
                continue

            for alias in attribute_aliases[attr]:
                is_exact_match = False
                for ngram in query_ngrams:
                    is_exact_match = False
                    if query_ngrams[ngram]["lower"] == attribute_aliases[attr][alias]["lower"] or query_ngrams[ngram]["stemmed_lower"] == attribute_aliases[attr][alias]["stemmed_lower"]:
                        is_exact_match = True
                        if attr not in query_attributes:
                            query_attributes[attr] = {
                                'name': attr,
                                "queryPhrase": [query_ngrams[ngram]["lower"]],
                                'inferenceType': 'explicit',
                                'matchScore': self.nl4dv_instance.match_scores['attribute']['attribute_alias_exact_match'],
                                'metric': 'attribute_alias_exact_match',
                                'isLabel': self.nl4dv_instance.data_genie_instance.data_attribute_map[attr]["isLabelAttribute"],
                                'encode': not self.nl4dv_instance.data_genie_instance.data_attribute_map[attr]["isLabelAttribute"],
                                'isAmbiguous': False,
                                'ambiguity': list(),
                                'meta': {
                                    'score': 100,
                                    'threshold': self.nl4dv_instance.match_thresholds['string_similarity'],
                                    'alias': alias,
                                    'ambiguity': {},
                                    'dataType': self.nl4dv_instance.data_genie_instance.data_attribute_map[attr]['dataType']
                                }
                            }

                            # Update Keyword-Attribute-Score Mappings
                            self.update_keyword_attribute_mappings(keyword=query_ngrams[ngram]["lower"], attribute=attr, score=query_attributes[attr]["matchScore"])

                        if is_exact_match:
                            # Important! If, the attribute is detected by exact match, then break the loop. We can safely SKIP subsequent n-grams saving *some* cycles.
                            break

                if is_exact_match:
                    # Important! If, the attribute is detected by exact match, then break the loop. We can safely SKIP subsequent n-grams saving *some* cycles.
                    break

        return query_attributes

    # Detect attributes based on string similarity of the n-grams with the developer specified aliases
    def detect_attributes_by_alias_similarity(self, query_ngrams, data_attributes, query_attributes, attribute_aliases):

        # Go over each ngram to check for matches in attribute aliases
        # Check if the word is in one of the attribute aliases
        for attr in data_attributes:

            # If already found, continue
            if attr in query_attributes and any(a for a in query_attributes[attr]["metric"] if a in ["attribute_alias_exact_match"]):
                continue

            for alias in attribute_aliases[attr]:
                for ngram in query_ngrams:
                    score = 0
                    add_attribute = False
                    # Compute similarity
                    string_similarity_score = helpers.compute_similarity(query_ngrams[ngram]["lower"], data_attributes[attr]["lower"], 'token_similarity')
                    if string_similarity_score == 100:
                        add_attribute = True
                        score = string_similarity_score
                    else:
                        # Compute similarity
                        stemmed_string_similarity_score = helpers.compute_similarity(query_ngrams[ngram]["stemmed_lower"], data_attributes[attr]["stemmed_lower"], 'token_similarity')
                        if stemmed_string_similarity_score == 100:
                            add_attribute = True
                            score = stemmed_string_similarity_score

                    if add_attribute:
                        if attr not in query_attributes:
                            query_attributes[attr] = {
                                'name': attr,
                                "queryPhrase": [query_ngrams[ngram]["lower"]],
                                'inferenceType': 'explicit',
                                'matchScore': self.nl4dv_instance.match_scores['attribute']['attribute_alias_similarity_match'],
                                'metric': 'attribute_alias_similarity_match',
                                'isLabel': self.nl4dv_instance.data_genie_instance.data_attribute_map[attr]["isLabelAttribute"],
                                'encode': not self.nl4dv_instance.data_genie_instance.data_attribute_map[attr]["isLabelAttribute"],
                                'isAmbiguous': False,
                                'ambiguity': list(),
                                'meta': {
                                    'score': score,
                                    'threshold': self.nl4dv_instance.match_thresholds['string_similarity'],
                                    'alias': alias,
                                    'ambiguity': {},
                                    'dataType': self.nl4dv_instance.data_genie_instance.data_attribute_map[attr]['dataType']
                                }
                            }

                            # Update Keyword-Attribute-Score Mappings
                            self.update_keyword_attribute_mappings(keyword=query_ngrams[ngram]["lower"], attribute=attr, score=query_attributes[attr]["matchScore"])


        return query_attributes

    # Detect attributes based on semantic similarity of the n-grams
    def detect_attributes_by_synonymity(self, query_ngrams, data_attributes, query_attributes):

        # Go over each ngram to check for matches in attribute aliases
        # Check if the word is in one of the attribute aliases

        for attr in data_attributes:

            # If already found, continue
            if attr in query_attributes and any(a for a in query_attributes[attr]["metric"] if a in ["attribute_exact_match","attribute_alias_exact_match", "attribute_similarity_match", "attribute_alias_similarity_match"]):
                continue

            for ngram in query_ngrams:

                # NOTE: Trying to compute wordnet similarity (synonymity) for STEMMED words can be error prone.
                synonym_match_score = helpers.synonymity_score(query_ngrams[ngram]["lower"], data_attributes[attr]["lower"])
                if synonym_match_score >= self.nl4dv_instance.match_thresholds['synonymity']:
                    query_attributes[attr] = {
                        'name': attr,
                        "queryPhrase": [query_ngrams[ngram]["lower"]],
                        'matchScore': self.nl4dv_instance.match_scores['attribute']['attribute_synonym_match'],
                        'inferenceType': 'explicit',
                        'metric': ['attribute_synonym_match'],
                        'isLabel': self.nl4dv_instance.data_genie_instance.data_attribute_map[attr]["isLabelAttribute"],
                        'encode': not self.nl4dv_instance.data_genie_instance.data_attribute_map[attr]["isLabelAttribute"],
                        'isAmbiguous': False,
                        'ambiguity': list(),
                        'meta': {
                            'score': synonym_match_score,
                            'threshold': self.nl4dv_instance.match_thresholds['synonymity'],
                            'alias': None,
                            'ambiguity': {},
                            'dataType': self.nl4dv_instance.data_genie_instance.data_attribute_map[attr]['dataType']
                        }
                    }

                    # Update Keyword-Attribute-Score Mappings
                    self.update_keyword_attribute_mappings(keyword=query_ngrams[ngram]["lower"], attribute=attr, score=query_attributes[attr]["matchScore"])

        return query_attributes

    # Detect attributes based on string similarity of the n-grams with the domain values
    def detect_attributes_from_domain_value(self, query_ngrams, data_attributes, query_attributes):

        value_keyword_mapping = dict()
        keyword_value_mapping = dict()

        for attr in data_attributes:

            # NL4DV does not look for domain value matches in the Label Attribute. Controversial, but that's how we've designed this.
            # Update 1: Since the addition of two Checks below (similarity score and number_of_words matched) for a domain value match, this is NOT required.
            # Update 2: Reverting the uncommented state of this conditional because it was breaking simple query like "What are the average budgets for action and adventure movies?"
            if attr == self.nl4dv_instance.label_attribute:
                continue

            # Look for domain value matches ONLY for ordinal and nominal variables.
            # For timeseries and quantitative  attribute types, it is difficult to map numbers to attributes AND this is computationally inefficient due to their domain size.
            if self.nl4dv_instance.data_genie_instance.data_attribute_map[attr]["dataType"] in ['Q','T']:
                continue

            # RESET for each Attribute
            value_keyword_mapping[attr] = dict()
            keyword_value_mapping[attr] = dict()

            for ngram in query_ngrams:
                # We'll use the lower-case attributes
                ngram_str = query_ngrams[ngram]["lower"]

                add_attribute = False
                for d in self.nl4dv_instance.data_genie_instance.data_attribute_map[attr]['domain']:
                    value_raw = str(d)
                    value = value_raw.lower()

                    # Exact match
                    if ngram_str == value:
                        # Value - Keyword
                        value_keyword_mapping[attr][value_raw] = ngram_str

                        # Keyword - Value
                        if ngram_str not in keyword_value_mapping[attr]:
                            keyword_value_mapping[attr][ngram_str] = set()

                        keyword_value_mapping[attr][ngram_str].add(value_raw)
                        add_attribute = True

                    else:

                        string_similarity_score = helpers.compute_similarity(ngram_str, value,'token_similarity')
                                                
                        # Check 1: Token Similarity score should be 100, i.e. at least 1 word/n-gram in the query must match the attribute domain value
                        if string_similarity_score == 100:


                            # [OLD] Check 2: The matched n-gram must contain 2 or more words/tokens.
                            # if len(ngram_tokens) >= 2:
                            # NOTE: PLS FIND A BETTER CONDITIONAL
                            # Check 2: The matched attribute domain value must either be of length >= 2, i.e. 2 words OR be 1 of 2 possible words.
                            value_tokens = list(word_tokenize(value))
                            ngram_tokens = list(word_tokenize(ngram_str))
                            if len(ngram_tokens) >= 2 or (len(ngram_tokens) == 1 and len(value_tokens) == 2) or (len(ngram_tokens) == 1 and len(value_tokens) == 4):
                                # Value - Keyword
                                value_keyword_mapping[attr][value_raw] = ngram_str

                                # Keyword - Value
                                if len(ngram_str.split()) <= len(value.split()):
                                    if ngram_str not in keyword_value_mapping[attr]:
                                        keyword_value_mapping[attr][ngram_str] = set()
                                    keyword_value_mapping[attr][ngram_str].add(value_raw)


                                add_attribute = True

                if add_attribute:
                    # Required: To filter out keyword subsets that point to the same attribute, e.g. science fiction, fiction, science
                    for k1 in keyword_value_mapping[attr].copy():
                            for k2 in keyword_value_mapping[attr].copy():
                                if k1!=k2 and k1 in k2:
                                    if k1 in keyword_value_mapping[attr]:
                                        del keyword_value_mapping[attr][k1]

                    # When attributes are double defined
                    metrics = ["attribute_domain_value_match"]
                    if attr in query_attributes:
                        # Update its metric
                        metrics = query_attributes[attr]["metric"]
                        if "attribute_domain_value_match" not in query_attributes[attr]["metric"]:
                            metrics.append("attribute_domain_value_match")
                    encode = False
                    if self.nl4dv_instance.dialog and attr in self.nl4dv_instance.past_extracted_attributes:
                        encode = True


                    query_attributes[attr] = {
                        'name': attr,
                        "queryPhrase": list(keyword_value_mapping[attr].keys()),
                        'inferenceType': 'implicit',
                        'matchScore': self.nl4dv_instance.match_scores['attribute']['attribute_domain_value_match'],
                        'metric': metrics,
                        'isLabel': self.nl4dv_instance.data_genie_instance.data_attribute_map[attr]["isLabelAttribute"],
                        'isAmbiguous': False,
                        'ambiguity': list(),
                        'encode': encode,
                        'meta': {
                            'score': None,
                            'threshold': None,
                            'alias': None,
                            'ambiguity': {},
                            'dataType': self.nl4dv_instance.data_genie_instance.data_attribute_map[attr]['dataType']
                        }
                    }

                    op = dict()
                    for k,v in keyword_value_mapping[attr].items():
                        op[k] = list(v)
                    query_attributes[attr]["meta"]['ambiguity'] = op

                    # Update Keyword-Attribute-Score Mappings
                    self.update_keyword_attribute_mappings(keyword=ngram_str, attribute=attr, score=query_attributes[attr]["matchScore"])

        return query_attributes

    # Main function to extract attributes from the query (query_ngrams to be specific).
    def extract_attributes(self, query_ngrams):
        """
        Return relevant attributes of query

        """
        # Values to be returned
        query_attributes = dict()

        # Map between attribute and (score, corresponding word) from the query
        self.nl4dv_instance.attribute_keyword_mapping = dict()

        # Map between keyword and the attribute to find ambiguous attributes
        self.nl4dv_instance.keyword_attribute_mapping = dict()

        # map of attributes, and their variants - stemmed, lowercase, ...
        data_attributes = self.get_data_attributes()

        # map of attributes and their variants - stemmed, lowercase, ...
        attribute_aliases = self.get_attribute_aliases()

        # Detect attributes by token exact match
        query_attributes = self.detect_attributes_by_exact_match(query_ngrams, data_attributes, query_attributes)

        # Detect attributes by token similarity
        query_attributes = self.detect_attributes_by_similarity(query_ngrams, data_attributes, query_attributes)

        # Detect attributes by alias exact match
        query_attributes = self.detect_attributes_by_alias_exact_match(query_ngrams, data_attributes, query_attributes, attribute_aliases)

        # Detect attributes by alias similarity
        query_attributes = self.detect_attributes_by_alias_similarity(query_ngrams, data_attributes, query_attributes, attribute_aliases)

        # Detect attributes by synonymity
        query_attributes = self.detect_attributes_by_synonymity(query_ngrams, data_attributes, query_attributes)

        # Detect attributes by domain value match
        query_attributes = self.detect_attributes_from_domain_value(query_ngrams, data_attributes, query_attributes)

        # ---------------------------------------------------------------------------------------------------
        # Rule Based Filter to ensure 1 keyword maps to the best attribute(s). THIS IS BY KEYWORD AND BY SCORE
        # ---------
        # Need the one with higher score from 2 attributes selected by same keyword.
        # For eg. Querying 'date' in airplane_crashes dataset results in 'Date'  (attribute similarity match) as well as 'Summary' (attribute domain value match).
        # Choose Date and discard Summary.
        # ---------
        # If same score, retain both.
        # For eg. Querying 'expensive' in cars dataset results in 'Retail Price'  (attribute alias similarity match) as well as 'Dealer Cost' (attribute alias similarity match).
        # Retain both Retail Price and Dealer Cost
        # ---------
        attributes_to_delete = set()
        used_keyword_attribute_mapping = dict()

        for attr in query_attributes:
            keywords = query_attributes[attr]["queryPhrase"]
            score = query_attributes[attr]['matchScore']
            for keyword in keywords:
                if keyword in self.nl4dv_instance.keyword_attribute_mapping:
                    used_keyword_attribute_mapping[keyword] = self.nl4dv_instance.keyword_attribute_mapping[keyword]
                for _attr in self.nl4dv_instance.keyword_attribute_mapping[keyword]:
                    if score > self.nl4dv_instance.keyword_attribute_mapping[keyword][_attr]:
                        attributes_to_delete.add(_attr)
                    elif score < self.nl4dv_instance.keyword_attribute_mapping[keyword][_attr]:
                        attributes_to_delete.add(attr)

        # Delete unused keywords from the main self.nl4dv_instance.keyword_attribute_mapping dictionary
        copy_keyword_attribute_mapping = copy.deepcopy(self.nl4dv_instance.keyword_attribute_mapping)
        for key in copy_keyword_attribute_mapping:
            if key not in used_keyword_attribute_mapping:
                del self.nl4dv_instance.keyword_attribute_mapping[key]

        # Now, again delete a few attributes if they are coming from different keywords. Ensure 1 keyword contributes to 1 attribute
        copy_keyword_attribute_mapping = copy.deepcopy(self.nl4dv_instance.keyword_attribute_mapping)
        for _key in copy_keyword_attribute_mapping:
            for _attr in copy_keyword_attribute_mapping[_key]:
                if _key not in query_attributes[_attr]["queryPhrase"]:
                    del self.nl4dv_instance.keyword_attribute_mapping[_key][_attr]
        # ---------------------------------------------------------------------------------------------------
        # ---------------------------------------------------------------------------------------------------
        # If a keyword is a subset of another keyword
        # DISCARD the attributes with the smaller keyword
        # For e.g, "highway miles per gallon" should select only "highway miles per gallon" and not "city miles per gallon" (due to "miles per gallon")
        copy_keyword_attribute_mapping = copy.deepcopy(self.nl4dv_instance.keyword_attribute_mapping)
        for k1 in copy_keyword_attribute_mapping:
            for k2 in copy_keyword_attribute_mapping:
                if k1 != k2 and k1 in k2:
                    # Remove the "smaller" keyword (e.g. science fiction v/s fiction)
                    if k1 in self.nl4dv_instance.keyword_attribute_mapping:
                        del self.nl4dv_instance.keyword_attribute_mapping[k1]

                    # Remove the attribute of the "smaller" keyword IF it is different from the "bigger" one.
                    for _attr in copy_keyword_attribute_mapping[k1]:
                        if _attr not in copy_keyword_attribute_mapping[k2]:
                            attributes_to_delete.add(_attr)
        # ---------------------------------------------------------------------------------------------------
        # ---------------------------------------------------------------------------------------------------
        #  Delete the now-unwanted attributes and keywords mapped to these attributes.
        for attr in attributes_to_delete:
            if attr in query_attributes:
                # 1) delete unwanted attributes from the main attributes object
                del query_attributes[attr]

                # 2) delete unwanted attributes from the attribute-keyword mapping object
                del self.nl4dv_instance.attribute_keyword_mapping[attr]

                # 3) delete unwanted attributes from the keyword-attributes mapping object
                for k in self.nl4dv_instance.keyword_attribute_mapping:
                    if attr in self.nl4dv_instance.keyword_attribute_mapping[k]:
                       del self.nl4dv_instance.keyword_attribute_mapping[k][attr]

        # Delete unwanted keywords in the finalized attributes
        copy_attribute_keyword_mapping = copy.deepcopy(self.nl4dv_instance.attribute_keyword_mapping)
        for attr in copy_attribute_keyword_mapping:
            for k in copy_attribute_keyword_mapping[attr]:
                if k not in self.nl4dv_instance.keyword_attribute_mapping:
                    del self.nl4dv_instance.attribute_keyword_mapping[attr][k]

        # ---------------------------------------------------------------------------------------------------
        # ---------------------------------------------------------------------------------------------------
        #  Mark attributes as AMBIGUOUS OR NOT. If Ambiguous, append the ambiguities
        for attr in query_attributes:
            # Iterate over it's keywords
            keywords = query_attributes[attr]["queryPhrase"]
            for keyword in keywords:
                if len(self.nl4dv_instance.keyword_attribute_mapping[keyword].keys()) > 1:
                    if hasattr(self.nl4dv_instance, 'ambiguities'):
                        self.nl4dv_instance.ambiguities['attribute'][keyword] = dict()
                        self.nl4dv_instance.ambiguities['attribute'][keyword]['options'] = list(self.nl4dv_instance.keyword_attribute_mapping[keyword].keys())
                        self.nl4dv_instance.ambiguities['attribute'][keyword]['selected'] = None
                    for ambiguous_attr in self.nl4dv_instance.keyword_attribute_mapping[keyword]:
                        if 'ambiguity' not in query_attributes[attr]:
                            query_attributes[attr]['ambiguity'] = list()

                        # Mark it as ambiguous
                        query_attributes[attr]['isAmbiguous'] = True

                        if ambiguous_attr not in query_attributes[attr]["ambiguity"] and ambiguous_attr != attr:
                            query_attributes[attr]["ambiguity"].append(ambiguous_attr)

                    # Since ambiguous attributes so far have the same score, we compute Ratio Similarity to disambiguate among them.
                    query_attributes[attr]["meta"]["confidence"] = round(helpers.compute_similarity(attr, keyword, "ratio_similarity"), 3)
                else:
                    # Set as unambiguous by default
                    query_attributes[attr]['isAmbiguous'] = False
                    query_attributes[attr]["ambiguity"] = list()
                    query_attributes[attr]["meta"]["confidence"] = 100

        # Clean-up both attribute and keyword mappings, if they are EMPTY / None.
        copy_attribute_keyword_mapping = copy.deepcopy(self.nl4dv_instance.attribute_keyword_mapping)
        for attr in copy_attribute_keyword_mapping:
            if not self.nl4dv_instance.attribute_keyword_mapping[attr]:
                del self.nl4dv_instance.attribute_keyword_mapping[attr]

        copy_keyword_attribute_mapping = copy.deepcopy(self.nl4dv_instance.keyword_attribute_mapping)
        for keyword in copy_keyword_attribute_mapping:
            if not self.nl4dv_instance.keyword_attribute_mapping[keyword]:
                del self.nl4dv_instance.keyword_attribute_mapping[keyword]

        return query_attributes

    # Return just those attributes that are to be "encoded" into the visualization, i.e. along x, y, size, color, column, row, etc.
    def get_encodeable_attributes(self):
        encodeable_attributes = list()

        # Just Take in those attributes, that are tagged as "ENCODE"
        for attr in self.nl4dv_instance.extracted_attributes.keys():
            if self.nl4dv_instance.extracted_attributes[attr]["encode"]:
                encodeable_attributes.append(attr)

        return encodeable_attributes

    # Update attribute encodings based on tasks. e.g. "gross more than 50M" is a filter and the attribute "Worldwide Gross" need not be encoded into the visualization.
    def update_encodeable_attributes_based_on_tasks(self):
        # REFINE ATTRIBUTES based ON TASKS until now
        # Attributes affected by filter should be excluded from the vis UNLESS there are multiple keyword occurrences in the query
        if "filter" in self.nl4dv_instance.extracted_tasks:
            for task_obj in self.nl4dv_instance.extracted_tasks["filter"]:
                # NOTE: remove attributes that are mapped to Filter tasks. We don't ENCODE them explicitly in the VIS.
                for attr in task_obj['attributes']:
                    # If the attribute is detected from domain value that too only IMPLICITLY (as in was not also EXPLICITLY detected), encode it to False
                    if "attribute_domain_value_match" in self.nl4dv_instance.extracted_attributes[attr]["metric"]:
                        if self.nl4dv_instance.extracted_attributes[attr]["inferenceType"] == 'implicit':
                            if self.nl4dv_instance.dialog is not True and attr not in self.nl4dv_instance.past_extracted_attributes :
                                self.nl4dv_instance.extracted_attributes[attr]["encode"] = False

                    # If the attribute is part of some FILTER (e.g. budget more than 50) but also exists standalone (e.g. correlate budget and gross for budget more than 50)
                    # Simple heuristic check for now: Check for multiple occurrences of the attribute's keyword in the raw query.
                    else:
                        keyword = list(self.nl4dv_instance.attribute_keyword_mapping[attr].keys())[0]
                        if self.nl4dv_instance.query_processed.count(keyword) == 1:
                            self.nl4dv_instance.extracted_attributes[attr]["encode"] = False

        # If correlation as a task is detected, then ensure attributes are ENCODED, even if it means the FILTER ones.
        for task_name in ["correlation", "distribution", "derived_value", "find_extremum", "trend"]:
            if task_name in self.nl4dv_instance.extracted_tasks:
                for task_obj in self.nl4dv_instance.extracted_tasks[task_name]:
                    if task_obj["inferenceType"] == 'explicit':
                        for attr in task_obj['attributes']:
                            self.nl4dv_instance.extracted_attributes[attr]["encode"] = True

        # Get Encocdeable attributes
        encodeable_attributes = self.get_encodeable_attributes()

        # IF there are NO encodeable attributes and IF there are ONLY FILTER TASKs detected as EXPLICIT AND NO other ENCODEable attribute exist,
        # OR if there is a FIND_EXTREMUM task
        # Then ADD the LABEL attribute.
        add_label_attr = False
        if len(encodeable_attributes) == 0:
            if {'filter'} == self.nl4dv_instance.task_genie_instance.get_explicit_tasks():
                add_label_attr = True
        elif len(encodeable_attributes) == 1:
            if "find_extremum" in self.nl4dv_instance.extracted_tasks:
                add_label_attr = True

        if add_label_attr and self.nl4dv_instance.label_attribute is not None:
            # If label attribute was Explicitly detected in the query, "encode" it to True ELSE add it manually
            if self.nl4dv_instance.label_attribute in self.nl4dv_instance.extracted_attributes and \
                    self.nl4dv_instance.extracted_attributes[self.nl4dv_instance.label_attribute]["inferenceType"] == 'explicit':
                self.nl4dv_instance.extracted_attributes[self.nl4dv_instanc .label_attribute]["encode"] = True
            else:
                # Check if there is a task BUT no ENCODABLE attribute is detected. In this case, add the label attribute.
                self.nl4dv_instance.extracted_attributes[self.nl4dv_instance.label_attribute] = {
                    'name': self.nl4dv_instance.label_attribute,
                    "queryPhrase": None,
                    'inferenceType': 'implicit',
                    'matchScore': 0,
                    'metric': ['label_attribute'],
                    'isLabel': True,  # OBVIOUSLY
                    'isAmbiguous': False,
                    'ambiguity': [],
                    'encode': True,  # Set to TRUE
                    'meta': {
                        'score': None,
                        'threshold': None,
                        'alias': None,
                        'ambiguity': {},
                        'dataType': self.nl4dv_instance.data_genie_instance.data_attribute_map[attr]['dataType']
                    }
                }

            # Update the attribute-keyword and keyword-attribute mapping dictionaries
            self.nl4dv_instance.attribute_keyword_mapping[self.nl4dv_instance.label_attribute] = {self.nl4dv_instance.label_attribute: 1}
            self.nl4dv_instance.keyword_attribute_mapping[self.nl4dv_instance.label_attribute] = {self.nl4dv_instance.label_attribute: 1}

            # Add the label attribute to the list of encodeable_attributes.
            if self.nl4dv_instance.label_attribute not in encodeable_attributes:
                encodeable_attributes.append(self.nl4dv_instance.label_attribute)

        return encodeable_attributes

    def validate_attr_combo(self, attr_combo, query_phrase, allow_subset=False, dialog=False):
        if dialog is False:
            unique_keywords = set()

            # The combination has already incorporated the to be "encode"d attributes.
            for c in attr_combo:
                unique_keywords.add(','.join(self.nl4dv_instance.attribute_keyword_mapping[c].keys()))

            unique_attrs = set()
            for k in self.nl4dv_instance.keyword_attribute_mapping:
                is_encode = True
                for a in self.nl4dv_instance.keyword_attribute_mapping[k]:
                    if a in self.nl4dv_instance.extracted_attributes and not self.nl4dv_instance.extracted_attributes[a]["encode"]:
                        is_encode = False
                        break

                if is_encode:
                    if ','.join(self.nl4dv_instance.keyword_attribute_mapping[k].keys()) not in unique_attrs:
                        unique_attrs.add(','.join(self.nl4dv_instance.keyword_attribute_mapping[k].keys()))


            if allow_subset:
                return len(attr_combo) != len(unique_keywords) or len(attr_combo) != len(query_phrase)

            # Ensure each attribute comes from a different keyword for the visualization AND all such attributes detected form the visualization.
            return len(attr_combo) != len(unique_attrs) or (len(attr_combo) != len(unique_keywords))
