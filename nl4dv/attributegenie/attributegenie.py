from nl4dv.utils import constants, helpers
import copy
import nltk


class AttributeGenie:
    def __init__(self, nl4dv_instance):
        self.nl4dv_instance = nl4dv_instance
        
    def detect_attributes_by_token_similarity(self, query, attribute_list, data_attributes):

        # 1) Using FuzzyWuzzy, for each word string, find similarity score of that string with the attribute.
        # 2) Using PorterStemmer, stem each word and do 1) for it.
        # 3) If match crosses our threshold, append as a tuple to a list.

        for attr in attribute_list:

            attr_lower = attr.lower()
            stemmed_attr = ' '.join(self.nl4dv_instance.porter_stemmer_instance.stem(t.lower()) for t in nltk.word_tokenize(attr_lower))
            # stemmed_attr = self.nl4dv_instance.porter_stemmer_instance.stem(attr_lower)

            # CREATE n-grams equivalent to the number of WORDS in the attribute
            for i in range(len(attr.split()), 0, -1):
                for ngram in helpers.get_ngrams(query, i):

                    # convert ngrams into string for some operations
                    ngram_str = (' '.join(map(str, ngram))).rstrip()
                    stemmed_ngram = self.nl4dv_instance.porter_stemmer_instance.stem(ngram_str)

                    curr_score = 0
                    add_attribute = False

                    # Direct Match
                    if attr_lower in ngram_str or stemmed_attr.lower() in stemmed_ngram:
                        add_attribute = True
                        curr_score = 100
                    else:
                        # Compute similarity
                        string_similarity_score = helpers.compute_similarity(ngram_str, attr_lower, 'token_similarity')
                        if string_similarity_score >= self.nl4dv_instance.match_thresholds['string_similarity']:
                            add_attribute = True
                            curr_score = string_similarity_score
                        else:
                            # Compute similarity
                            stemmed_string_similarity_score = helpers.compute_similarity(stemmed_ngram, stemmed_attr, 'token_similarity')
                            if stemmed_string_similarity_score >= self.nl4dv_instance.match_thresholds['string_similarity']:
                                add_attribute = True
                                curr_score = stemmed_string_similarity_score

                    if add_attribute:
                        if attr not in data_attributes or data_attributes[attr]["meta"]["score"] < curr_score:
                            data_attributes[attr] = {
                                'name': attr,
                                "queryPhrase": [ngram_str],
                                'inferenceType': constants.attribute_reference_types['EXPLICIT'],
                                'matchScore': self.nl4dv_instance.match_scores['attribute_similarity_match'],
                                'metric': ['attribute_similarity_match'],
                                'isLabel': self.nl4dv_instance.data_processor_instance.data_attribute_map[attr]["isLabelAttribute"],
                                'encode': not self.nl4dv_instance.data_processor_instance.data_attribute_map[attr]["isLabelAttribute"],
                                'isAmbiguous': False,
                                'ambiguity': list(),
                                'meta': {
                                    'score': curr_score,
                                    'threshold': self.nl4dv_instance.match_thresholds['string_similarity'],
                                    'alias': None,
                                    'query_phrase_type': 'attribute',
                                    'ambiguity': {}
                                }
                            }

                            if ngram_str not in self.nl4dv_instance.keyword_attribute_mapping:
                                self.nl4dv_instance.keyword_attribute_mapping[ngram_str] = dict()
                            self.nl4dv_instance.keyword_attribute_mapping[ngram_str][attr] = data_attributes[attr]['matchScore']

                            if attr not in self.nl4dv_instance.attribute_keyword_mapping:
                                self.nl4dv_instance.attribute_keyword_mapping[attr] = dict()
                            self.nl4dv_instance.attribute_keyword_mapping[attr][ngram_str] = data_attributes[attr]['matchScore']

        return data_attributes

    def detect_attributes_by_alias_similarity(self, query, attribute_list, data_attributes):
 
        # Go over each ngram to check for matches in attribute aliases
        # Check if the word is in one of the attribute aliases
        for attr in attribute_list:
            # If already found, continue
            if attr in data_attributes and any(a for a in data_attributes[attr]["metric"] if a in ["attribute_similarity_match"]):
                continue
            
            # If a best match is already found, continue.
            attr_lower = attr.lower()
            stemmed_attr = ' '.join(self.nl4dv_instance.porter_stemmer_instance.stem(t.lower()) for t in nltk.word_tokenize(attr_lower))
            # stemmed_attr = self.nl4dv_instance.porter_stemmer_instance.stem(attr_lower)

            for alias in self.nl4dv_instance.data_processor_instance.data_attribute_map[attr]['aliases']:
                alias_lower = alias.lower()
                stemmed_alias = ' '.join(self.nl4dv_instance.porter_stemmer_instance.stem(t.lower()) for t in nltk.word_tokenize(alias_lower))
                # stemmed_alias = self.nl4dv_instance.porter_stemmer_instance.stem(alias_lower)

                # CREATE n-grams equivalent to the number of WORDS in the ALIAS.
                for i in range(len(alias.split()), 0, -1):
                    for ngram in helpers.get_ngrams(query, i):

                        # convert ngrams into string for some operations
                        ngram_str = (' '.join(map(str, ngram))).rstrip()
                        stemmed_ngram = self.nl4dv_instance.porter_stemmer_instance.stem(ngram_str)

                        add_attribute = False
                        curr_score = 0
                        # Direct Match
                        if ngram_str == alias_lower or stemmed_ngram == stemmed_alias.lower():
                            add_attribute = True
                            curr_score = 100
                        else:
                            # Compute similarity
                            string_similarity_score = helpers.compute_similarity(ngram_str, attr_lower, 'token_similarity')
                            if string_similarity_score == 100:
                                add_attribute = True
                                curr_score = string_similarity_score
                            else:
                                # Compute similarity
                                stemmed_string_similarity_score = helpers.compute_similarity(stemmed_ngram, stemmed_attr, 'token_similarity')
                                if stemmed_string_similarity_score == 100:
                                    add_attribute = True
                                    curr_score = stemmed_string_similarity_score

                        if add_attribute:
                            if attr not in data_attributes:
                                data_attributes[attr] = {
                                    'name': attr,
                                    "queryPhrase": [ngram_str],
                                    'inferenceType': constants.attribute_reference_types['EXPLICIT'],
                                    'matchScore': self.nl4dv_instance.match_scores['attribute_alias_similarity_match'],
                                    'metric': 'attribute_alias_similarity_match',
                                    'isLabel': self.nl4dv_instance.data_processor_instance.data_attribute_map[attr]["isLabelAttribute"],
                                    'encode': not self.nl4dv_instance.data_processor_instance.data_attribute_map[attr]["isLabelAttribute"],
                                    'isAmbiguous': False,
                                    'ambiguity': list(),
                                    'meta': {
                                        'score': curr_score,
                                        'threshold': self.nl4dv_instance.match_thresholds['string_similarity'],
                                        'alias': alias,
                                        'query_phrase_type': 'attribute',
                                        'ambiguity': {}
                                    }
                                }

                                if ngram_str not in self.nl4dv_instance.keyword_attribute_mapping:
                                    self.nl4dv_instance.keyword_attribute_mapping[ngram_str] = dict()
                                self.nl4dv_instance.keyword_attribute_mapping[ngram_str][attr] = data_attributes[attr]['matchScore']

                                if attr not in self.nl4dv_instance.attribute_keyword_mapping:
                                    self.nl4dv_instance.attribute_keyword_mapping[attr] = dict()
                                self.nl4dv_instance.attribute_keyword_mapping[attr][ngram_str] = data_attributes[attr]['matchScore']

        return data_attributes

    def detect_attributes_by_token_synonymity(self, query, attribute_list, data_attributes):

        # Go over each ngram to check for matches in attribute aliases
        # Check if the word is in one of the attribute aliases

        for attr in attribute_list:

            # If already found, continue
            if attr in data_attributes and any(a for a in data_attributes[attr]["metric"] if a in ["attribute_similarity_match","attribute_alias_similarity_match"]):
                continue

            attr_lower = attr.lower()
            # NOTE: Trying to compute wordnet similarity (synonymity) for STEMMED words can be error prone.
            # stemmed_attr = ' '.join(self.nl4dv_instance.porter_stemmer_instance.stem(t.lower()) for t in nltk.word_tokenize(attr_lower))
            # stemmed_attr = self.nl4dv_instance.porter_stemmer_instance.stem(attr_lower)

            # CREATE n-grams equivalent to the number of WORDS in the ALIAS.
            for i in range(len(attr.split()), 0, -1):
                for ngram in helpers.get_ngrams(query, i):

                    # convert ngrams into string for some operations
                    ngram_str = (' '.join(map(str, ngram))).rstrip()
                    # stemmed_ngram = self.nl4dv_instance.porter_stemmer_instance.stem(ngram_str)
                    
                    # NOTE: Trying to compute wordnet similarity (synonymity) for STEMMED words can be error prone.
                    synonym_match_score = helpers.synonymity_score(ngram_str, attr_lower)
                    if synonym_match_score >= self.nl4dv_instance.match_thresholds['synonymity']:
                        data_attributes[attr] = {
                            'name': attr,
                            "queryPhrase": [ngram_str],
                            'matchScore': self.nl4dv_instance.match_scores['attribute_synonym_match'],
                            'inferenceType': constants.attribute_reference_types['EXPLICIT'],
                            'metric': ['attribute_synonym_match'],
                            'isLabel': self.nl4dv_instance.data_processor_instance.data_attribute_map[attr]["isLabelAttribute"],
                            'encode': not self.nl4dv_instance.data_processor_instance.data_attribute_map[attr]["isLabelAttribute"],
                            'isAmbiguous': False,
                            'ambiguity': list(),
                            'meta': {
                                'score': synonym_match_score,
                                'threshold': self.nl4dv_instance.match_thresholds['synonymity'],
                                'alias': None,
                                'query_phrase_type': 'attribute',
                                'ambiguity': {}
                            }
                        }

                        if ngram_str not in self.nl4dv_instance.keyword_attribute_mapping:
                            self.nl4dv_instance.keyword_attribute_mapping[ngram_str] = dict()
                        self.nl4dv_instance.keyword_attribute_mapping[ngram_str][attr] = data_attributes[attr]['matchScore']

                        if attr not in self.nl4dv_instance.attribute_keyword_mapping:
                            self.nl4dv_instance.attribute_keyword_mapping[attr] = dict()
                        self.nl4dv_instance.attribute_keyword_mapping[attr][ngram_str] = data_attributes[attr]['matchScore']

        return data_attributes

    def detect_attributes_by_domain_value_match(self, query, attribute_list, data_attributes):

        # 1) Using FuzzyWuzzy, for each word string, find similarity score of that string with the attribute.
        # 2) Using PorterStemmer, stem each word and do 1) for it.
        # 3) If match crosses our threshold, append as a tuple to a list.

        value_keyword_mapping = dict()
        keyword_value_mapping = dict()

        for attr in attribute_list:

            # if attr in data_attributes and data_attributes[attr]["metric"] in ["attribute_similarity_match","attribute_alias_similarity_match","attribute_synonym_match"]:
            #     continue

            # CREATE n-grams equivalent to the number of WORDS in the attribute
            data_summary = self.nl4dv_instance.data_processor_instance.data_attribute_map[attr]
            domain = data_summary['domain']
            datatype = data_summary["dataType"]

            if datatype not in ['N','O']:
                continue

            # RESET for each Attribute
            value_keyword_mapping[attr] = dict()
            keyword_value_mapping[attr] = dict()
            
            # safe to split by query here as it will mostly be faster and smaller than iterating through the domain to find longest word.
            for i in range(len(query.split()), 0, -1):
                for ngram in helpers.get_ngrams(query, i):

                    # convert ngrams into string for some operations
                    ngram_str = (' '.join(map(str, ngram))).rstrip()

                    # Do NOT check for n_grams with numeric entities in the domain. They tend to produce erroneous results, especially due to the TOKEN based similarity algorithm.
                    ngram_str = ''.join([i for i in ngram_str if not i.isdigit()])
    
                    # ToDo:- Let's NOT look for domain value matches in the Label Attribute. Very controversial.
                    if attr == self.nl4dv_instance.label_attribute:
                        continue
                        
                    # Check for word within  only nominal, ordinal columns.
                    # For timeseries and quantitative  attribute types, it is difficult to map numbers to attributes AND this is computationally inefficient due to their domain size.

                    add_attribute = False
                    # Let's start iterating over the domain
                    for d in domain:
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
                            if string_similarity_score == 100:
                                # Value - Keyword
                                value_keyword_mapping[attr][value_raw] = ngram_str

                                # Keyword - Value
                                if len(ngram_str.split()) <= len(value.split()):
                                    if ngram_str not in keyword_value_mapping[attr]:
                                        keyword_value_mapping[attr][ngram_str] = set()
                                    keyword_value_mapping[attr][ngram_str].add(value_raw)

                                add_attribute = True

                    if add_attribute:
                        for k1 in keyword_value_mapping[attr].copy():
                            for k2 in keyword_value_mapping[attr].copy():
                                if k1!=k2 and k1 in k2:
                                    if k1 in keyword_value_mapping[attr]:
                                        del keyword_value_mapping[attr][k1]

                        # When attribuites are double defined
                        metrics = ["attribute_domain_value_match"]
                        if attr in data_attributes:
                            # Update it's metric
                            metrics = data_attributes[attr]["metric"]
                            if "attribute_domain_value_match" not in data_attributes[attr]["metric"]:
                                metrics.append("attribute_domain_value_match")

                        data_attributes[attr] = {
                            'name': attr,
                            "queryPhrase": list(keyword_value_mapping[attr].keys()),
                            'inferenceType': constants.attribute_reference_types['IMPLICIT'],
                            'matchScore': self.nl4dv_instance.match_scores['attribute_domain_value_match'],
                            'metric': metrics,
                            'isLabel': self.nl4dv_instance.data_processor_instance.data_attribute_map[attr]["isLabelAttribute"],
                            'isAmbiguous': False,
                            'ambiguity': list(),
                            'encode': False,
                            'meta': {
                                'score': None,
                                'threshold': None,
                                'alias': None,
                                'query_phrase_type': 'domain_value',
                                'ambiguity': {}
                            }
                        }

                        op = dict()
                        for k,v in keyword_value_mapping[attr].items():
                            op[k] = list(v)
                        data_attributes[attr]["meta"]['ambiguity'] = op

                        # keep this out
                        if ngram_str not in self.nl4dv_instance.keyword_attribute_mapping:
                            self.nl4dv_instance.keyword_attribute_mapping[ngram_str] = dict()
                        self.nl4dv_instance.keyword_attribute_mapping[ngram_str][attr] = data_attributes[attr]['matchScore']

                        if attr not in self.nl4dv_instance.attribute_keyword_mapping:
                            self.nl4dv_instance.attribute_keyword_mapping[attr] = dict()
                        self.nl4dv_instance.attribute_keyword_mapping[attr][ngram_str] = data_attributes[attr]['matchScore']

        return data_attributes

    def extract_attributes(self, query, tokens):
        """
        Return relevant attributes of query

        """
        # Values to be returned
        data_attributes = dict()

        # Map between attribute and (score, corresponding word) from the query
        self.nl4dv_instance.attribute_keyword_mapping = dict()

        # Map between keyword and the attribute to find ambiguous attributes
        self.nl4dv_instance.keyword_attribute_mapping = dict()

        # # Create a parts of speech map
        # Note: Now used in taskgenie in dependency parsing
        # pos_map = dict()
        # pos_list = nltk.pos_tag(tokens)
        # for pos in pos_list:
        #     pos_map[pos[0]] = pos[1]
            
        # list of attributes
        attribute_list = list(self.nl4dv_instance.data_processor_instance.data_attribute_map.keys())

        # Detect attributes by token similarity
        data_attributes = self.detect_attributes_by_token_similarity(query, attribute_list, data_attributes)

        # Detect attributes by similarity
        data_attributes = self.detect_attributes_by_alias_similarity(query, attribute_list, data_attributes)

        # Detect attributes by synonymity
        data_attributes = self.detect_attributes_by_token_synonymity(query, attribute_list, data_attributes)

        # Detect attributes by synonymity
        data_attributes = self.detect_attributes_by_domain_value_match(query, attribute_list, data_attributes)

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

        for attr in data_attributes:
            keywords = data_attributes[attr]["queryPhrase"]
            score = data_attributes[attr]['matchScore']
            for keyword in keywords:
                if keyword in self.nl4dv_instance.keyword_attribute_mapping:
                    used_keyword_attribute_mapping[keyword] = self.nl4dv_instance.keyword_attribute_mapping[keyword]

                for _attr in self.nl4dv_instance.keyword_attribute_mapping[keyword]:
                    if score > self.nl4dv_instance.keyword_attribute_mapping[keyword][_attr]:
                        attributes_to_delete.add(_attr)
                    elif score < self.nl4dv_instance.keyword_attribute_mapping[keyword][_attr]:
                        attributes_to_delete.add(attr)

        # Delete unused keywords from the main self.nl4dv_instance.keyword_attribute_mapping dictionary
        for key in self.nl4dv_instance.keyword_attribute_mapping.copy():
            if key not in used_keyword_attribute_mapping and key in self.nl4dv_instance.keyword_attribute_mapping:
                del self.nl4dv_instance.keyword_attribute_mapping[key]

        # Create a copy to avoid dictionary traversal / modification errors
        copy_keyword_attribute_mapping = copy.deepcopy(self.nl4dv_instance.keyword_attribute_mapping)
        copy_attribute_keyword_mapping = copy.deepcopy(self.nl4dv_instance.attribute_keyword_mapping)

        # Now, again delete a few attributes if they are coming from different keywords. Ensure 1 keyword contributes to 1 attribute
        for key in copy_keyword_attribute_mapping:
            for _attr in copy_keyword_attribute_mapping[key]:
                if key not in data_attributes[_attr]["queryPhrase"]:
                    del self.nl4dv_instance.keyword_attribute_mapping[key][_attr]
        # ---------------------------------------------------------------------------------------------------

        # ---------------------------------------------------------------------------------------------------
        # If a keyword is a subset of another keyword
        # DISCARD the attributes with the smaller keyword
        # For e.g, "highway miles per gallon" should select only "highway miles per gallon" and not "city miles per gallon" (due to "miles per gallon")
        # ---------

        # Create a new copy to avoid dictionary traversal / modification errors
        for k1 in copy_keyword_attribute_mapping:
            for k2 in copy_keyword_attribute_mapping:
                if k1 != k2 and k1 in k2:
                    for _attr in copy_keyword_attribute_mapping[k1]:
                        attributes_to_delete.add(_attr)
                    if k1 in self.nl4dv_instance.keyword_attribute_mapping:
                        del self.nl4dv_instance.keyword_attribute_mapping[k1]
        # ---------------------------------------------------------------------------------------------------

        # ---------
        #  Delete the now-unwanted attributes.
        for attr in attributes_to_delete:
            if attr in data_attributes:
                del data_attributes[attr]
                del self.nl4dv_instance.attribute_keyword_mapping[attr]

        # ---------
        #  Delete unused KEYS as well within the self.nl4dv_instance.attribute_keyword_mapping
        for k_req in self.nl4dv_instance.keyword_attribute_mapping:
            for attr in self.nl4dv_instance.keyword_attribute_mapping[k_req]:
                for k in copy_attribute_keyword_mapping[attr]:
                    if k != k_req:
                        if attr in self.nl4dv_instance.attribute_keyword_mapping and k in self.nl4dv_instance.attribute_keyword_mapping[attr]:
                            del self.nl4dv_instance.attribute_keyword_mapping[attr][k]

        # ---------
        #  Mark attributes as AMBIGUOUS OR NOT. If Ambiguous, append the ambiguities
        for attr in data_attributes:
            # Iterate over it's keywords
            keywords = data_attributes[attr]["queryPhrase"]
            for keyword in keywords:
                if len(self.nl4dv_instance.keyword_attribute_mapping[keyword].keys()) > 1:
                    for ambiguous_attr in self.nl4dv_instance.keyword_attribute_mapping[keyword]:
                        if 'ambiguity' not in data_attributes[attr]:
                            data_attributes[attr]['ambiguity'] = list()

                        # Mark it as ambiguous
                        data_attributes[attr]['isAmbiguous'] = True

                        if ambiguous_attr not in data_attributes[attr]["ambiguity"] and ambiguous_attr != attr:
                            data_attributes[attr]["ambiguity"].append(ambiguous_attr)

                    # Since ambiguous attributes so far have the same score, we compute Ratio Similarity to disambiguate among them.
                    data_attributes[attr]["meta"]["confidence"] = round(helpers.compute_similarity(attr, keyword, "ratio_similarity"), 3)
                else:
                    # Set as unambiguous by default
                    data_attributes[attr]['isAmbiguous'] = False
                    data_attributes[attr]["ambiguity"] = list()
                    data_attributes[attr]["meta"]["confidence"] = 100

        return data_attributes

    def get_encodable_attributes_from_only_attributes(self):
        encodeable_keyword_attribute_mapping = dict()
        # Just Take in those attributes, that are tagged as "ENCODE"
        for attr in self.nl4dv_instance.extracted_attributes.keys():
            if self.nl4dv_instance.extracted_attributes[attr]["encode"]:
                for k in self.nl4dv_instance.attribute_keyword_mapping[attr]:
                    if k not in encodeable_keyword_attribute_mapping:
                        encodeable_keyword_attribute_mapping[k] = set()
                    encodeable_keyword_attribute_mapping[k].add(attr)

        return encodeable_keyword_attribute_mapping

    def get_encodable_attributes(self):
        attribute_list = list()
        encodable_keyword_attribute_mapping = self.get_encodable_attributes_from_only_attributes()

        # Refine ATTRIBUTES based ON TASKS until now (e.g. attributes affected by filter should be excluded from the vis)
        if "filter" in self.nl4dv_instance.extracted_tasks:
            for task_obj in self.nl4dv_instance.extracted_tasks["filter"]:
                # NOTE: remove attributes that are mapped to Filter tasks. We don't ENCODE them explicitly in the VIS.
                for attr in task_obj['attributes']:
                    if attr in self.nl4dv_instance.extracted_attributes:
                        # If the attribute is detected from domain value that too only IMPLICITLY (as in was not also EXPLICITLY detected), encode it to False
                        if "attribute_domain_value_match" in self.nl4dv_instance.extracted_attributes[attr]["metric"]:
                            if self.nl4dv_instance.extracted_attributes[attr]["inferenceType"] == constants.attribute_reference_types['IMPLICIT']:
                                self.nl4dv_instance.extracted_attributes[attr]["encode"] = False

                        # If the attribute is part of some FILTER (e.g. budget more than 50) but also exists standalone (e.g. correlate budget and gross for budget more than 50)
                        # Simple heuristic check for now: Check for multiple occurrences of the attribute's keyword in the raw query.
                        else:
                            keyword = list(self.nl4dv_instance.attribute_keyword_mapping[attr].keys())[0]
                            if self.nl4dv_instance.query_processed.count(keyword) == 1:
                                # ToDO:- Check if this is the ONLY encodeable attribute from the extracted_attributes dict().
                                if len(encodable_keyword_attribute_mapping) > 1:
                                    self.nl4dv_instance.extracted_attributes[attr]["encode"] = False

        # If correlation as a task is detected, then ensure attributes are ENCODED, even if it means the FILTER ones.
        if "correlation" in self.nl4dv_instance.extracted_tasks:
            for task_obj in self.nl4dv_instance.extracted_tasks["correlation"]:
                for attr in task_obj['attributes']:
                    self.nl4dv_instance.extracted_attributes[attr]["encode"] = True

        # Just Take in those attributes, that are tagged as "ENCODE"
        for attr in self.nl4dv_instance.extracted_attributes.keys():
            if self.nl4dv_instance.extracted_attributes[attr]["encode"]:
                attribute_list.append(attr)

        # If the length is 0, then add the Label Attribute.
        if len(attribute_list) == 0:
            # If vis_objects is EMPTY, check if JUST the LABEL attribute was requested!
            if self.nl4dv_instance.label_attribute in self.nl4dv_instance.extracted_attributes:
                if self.nl4dv_instance.extracted_attributes[self.nl4dv_instance.label_attribute]["inferenceType"] == constants.attribute_reference_types["EXPLICIT"]:
                    self.nl4dv_instance.extracted_attributes[self.nl4dv_instance.label_attribute]["encode"] = True
                    attribute_list.append(self.nl4dv_instance.label_attribute)

        return attribute_list
