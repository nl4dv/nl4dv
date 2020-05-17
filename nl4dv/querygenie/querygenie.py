from nl4dv.utils import constants, helpers
import re
import nltk
from nltk import word_tokenize
from si_prefix import si_parse
from nltk.corpus import stopwords


class QueryGenie:
    def __init__(self, nl4dv_instance):
        self.nl4dv_instance = nl4dv_instance

        # Stopwords
        self.stopwords_set = set(stopwords.words('english'))

    def process_query(self, query):

        # Try to infer and convert numerical shorthands to machine understandable format, e.g. 100M = 100*1,000,000
        parsed_tokens = []
        for token in word_tokenize(query):
            try:
                parsed_tokens.append(str(int(si_parse(token))))
            except Exception as e:
                parsed_tokens.append(token)

        # Clean sentence of non-alphanumerical characters
        query_processed = re.sub(r'[^A-Za-z0-9]+', ' ', ' '.join(parsed_tokens))

        # Convert to lowercase
        query_lower = query_processed.lower()

        return query_lower

    def clean_query_and_get_query_tokens(self, query, reserve_words, ignore_words):

        # Set the stopwords from reserve words and ignore words
        self.stopwords_set = self.stopwords_set.difference(set(reserve_words)).union(set(ignore_words))

        # Create token set and filter out standard stopwords
        query_tokens = list(filter(lambda token: token not in self.stopwords_set, word_tokenize(query)))

        return query_tokens

    # 1-time generation of query N-GRAMS
    def get_query_ngrams(self, query):
        ngrams = dict()
        for i in range(len(query.split()), 0, -1):
            for ngram in helpers.get_ngrams(query, i):
                ngram_str = ((' '.join(map(str, ngram))).rstrip()).lower()
                ngrams[ngram_str] = dict()
                ngrams[ngram_str]['raw'] = ngram
                ngrams[ngram_str]['lower'] = ngram_str
                ngrams[ngram_str]['stemmed_lower'] = ' '.join(self.nl4dv_instance.porter_stemmer_instance.stem(t) for t in nltk.word_tokenize(ngram_str))

        return ngrams

    # Create a parts of speech map from the Query Tokens
    def get_query_pos_map(self, query_tokens):
        pos_map = dict()
        pos_list = nltk.pos_tag(query_tokens)
        for pos in pos_list:
            pos_map[pos[0]] = pos[1]

    # Create  a Dependency Tree from the query
    def create_dependency_tree(self, query):

        if self.nl4dv_instance.dependency_parser == "spacy":
            doc = self.nl4dv_instance.dependency_parser_instance(query)
            dependencies = [[]]
            for token in doc:
                dependency = [(token.head.text, token.head.tag_), token.dep_, (token.text, token.tag_)]
                dependencies[0].append(dependency)
                # print(
                #     "text:", token.text, " | "
                #     "pos:", token.pos_,  " | "
                #     "tag:", token.tag_,  " | "
                #     "dependency:", token.dep_,  " | "
                #     "htext:", token.head.text, " | "
                #     "hpos:", token.head.pos_,  " | "
                #     "htag:", token.head.tag_,  " | "
                #     "hdependency:", token.head.dep_,  " | "
                #     "subtree:", [s for s in token.subtree],
                #     "treechildren:", [child for child in token.children]
                #     # "lemma:", token.lemma_,  " | "
                #     # "shape:", token.shape_,  " | "
                #     # "isalphabet:", token.is_alpha, " | "
                #     # "isstopword:", token.is_stop,  " | "
                # )
                # print("{2}({3}-{6}, {0}-{5})".format(token.text, token.tag_, token.dep_, token.head.text, token.head.tag_, token.i+1, token.head.i+1))

            # print("\nSpacy Noun Chunks:")
            # print("------------------------------")
            # for chunk in doc.noun_chunks:
            #     print(
            #        "text:", chunk.text,
            #         "rtext:", chunk.root.text,
            #         "rdep:", chunk.root.dep_,
            #         "htext:", chunk.root.head.text
            #     )
            #
            # print("\nSpacy Named Entity Recognition:")
            # print("------------------------------")
            # for ent in doc.ents:
            #     print(ent.text, ent.start_char, ent.end_char, ent.label_)

            return dependencies

        elif self.nl4dv_instance.dependency_parser == "corenlp":
            dependencies = [list(parse.triples()) for parse in self.nl4dv_instance.dependency_parser_instance.raw_parse(query)]

            # Encode every string in tree to utf8 so string matching will work
            for dependency in dependencies[0]:
                dependency[0][0].encode('utf-8')
                dependency[0][1].encode('utf-8')
                dependency[1].encode('utf-8')
                dependency[2][0].encode('utf-8')
                dependency[2][1].encode('utf-8')

            return dependencies

        elif self.nl4dv_instance.dependency_parser == "corenlp-server":
            dependencies = [list(parse.triples()) for parse in self.nl4dv_instance.dependency_parser_instance.raw_parse(query)]

            # Encode every string in tree to utf8 so string matching will work
            for dependency in dependencies[0]:
                dependency[0][0].encode('utf-8')
                dependency[0][1].encode('utf-8')
                dependency[1].encode('utf-8')
                dependency[2][0].encode('utf-8')
                dependency[2][1].encode('utf-8')

            return dependencies
