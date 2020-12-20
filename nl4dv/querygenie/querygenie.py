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

        # Convert to lowercase
        query_lower = ' '.join(parsed_tokens).lower()

        return query_lower

    def clean_query_and_get_query_tokens(self, query, reserve_words, ignore_words):

        # Clean sentence of non-alphanumerical characters
        query_alphanumeric = re.sub(r'[^A-Za-z0-9]+', ' ', query)

        # Set the stopwords from reserve words and ignore words
        self.stopwords_set = self.stopwords_set.difference(set(reserve_words)).union(set(ignore_words))

        # Create token set and filter out standard stopwords
        query_tokens = list(filter(lambda token: token not in self.stopwords_set, word_tokenize(query_alphanumeric)))

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
