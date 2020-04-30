from .dataprocessor import DataProcessor
from .utils import helpers, constants, error_codes
from .vegawrapper import *
from .visgenie import *
from .taskgenie import *
from .attributegenie import *
from nltk.stem.porter import PorterStemmer
from vega import VegaLite
import time
import os
from collections import OrderedDict
from nltk.parse.stanford import StanfordDependencyParser
import spacy


class NL4DV:
    """
    Class exposed to users to interact with the package. Exposes modules in the package via
    public methods

    """

    def __init__(self, data_url=None, alias_url=None, alias_map=None, label_attribute=None, ignore_words=list(), reserve_words=list(),
                 dependency_parser_config=None, verbose=False):
        # type: (str) -> None

        # inputs
        self.data_url = data_url
        self.alias_url = alias_url
        self.alias_map = alias_map
        self.label_attribute = label_attribute
        self.ignore_words = ignore_words
        self.reserve_words = reserve_words
        self.verbose = verbose

        # outputs
        self.query_raw = None
        self.execution_durations = dict()
        self.query_processed = ""
        self.query_tokens = list()
        self.extracted_vis_type = None
        self.extracted_vis_token = None
        self.extracted_tasks = OrderedDict()
        self.extracted_attributes = OrderedDict()
        self.vis_list = None

        # Load constants: thresholds, mappings, scores
        self.vis_keyword_map = constants.vis_keyword_map
        self.task_keyword_map = constants.task_keyword_map
        self.match_scores = constants.match_scores
        self.match_thresholds = constants.match_thresholds

        # initialize porter stemmer instance
        self.porter_stemmer_instance = PorterStemmer()

        # Set the dependency parser
        self.dependency_parser = None
        self.dependency_parser_instance = None
        self.set_dependency_parser(dependency_parser_config)

        # initialize a DataProcessor instance.
        self.data_processor_instance = DataProcessor(self)

        # initialize a VisGenie instance.
        self.vis_genie_instance = VisGenie(self)

        # initialize a TaskGenie instance.
        self.task_genie_instance = TaskGenie(self)

        # initialize a AttributeGenie instance.
        self.attribute_genie_instance = AttributeGenie(self)

    # returns a VegaLite object of the best (1st) visualization after analyzing the query.
    def render_vis(self, query_raw):
        # type: (str) -> VegaLite
        response = self.analyze_query(query_raw)
        if len(response['visList']) == 0:
            print("No best Viz; please try again.")
            return VegaLite({})
        return VegaLite(response['visList'][0]['vlSpec'])

    # ToDo:- Discuss support for non-ascii characters? Fallback from unicode to ascii good enough?
    # ToDo:- Discuss ERROR Handling
    # ToDo:- Utilities to perform unit conversion (eg. seconds > minutes). Problem: Tedious to infer base unit from data. - LATER
    def analyze_query(self, query_raw, debug=False):
        # type: (str) -> dict

        # outputs
        self.query_raw = None
        self.execution_durations = dict()
        self.query_processed = ""
        self.query_tokens = list()
        self.extracted_vis_type = None
        self.extracted_vis_token = None
        self.extracted_tasks = OrderedDict()
        self.extracted_attributes = OrderedDict()
        self.vis_list = None

        # clean query and generate tokens
        self.query_raw = query_raw
        helpers.cond_print("Raw Query: " + self.query_raw, self.verbose)
        st = time.time()
        self.query_processed, self.query_tokens = helpers.process_query(query_raw, self.reserve_words, self.ignore_words)
        helpers.cond_print("Processed Query: " + self.query_processed, self.verbose)
        self.execution_durations['clean_query'] = time.time() - st

        # DETECT EXPLICIT AND IMPLICIT ATTRIBUTES
        st = time.time()
        self.extracted_attributes = self.attribute_genie_instance.extract_attributes(' '.join(self.query_tokens),
                                                                                     self.query_tokens)
        helpers.cond_print("Final Extracted Attributes: " + str(list(self.extracted_attributes.keys())), self.verbose)
        self.execution_durations['extract_attributes'] = time.time() - st

        # DETECT EXPLICIT VISUALIZATION UTTERANCES
        st = time.time()
        self.extracted_vis_type, self.extracted_vis_token = self.vis_genie_instance.extract_vis_type(' '.join(self.query_tokens),
                                                                                     self.query_tokens)
        self.execution_durations['extract_vis_type'] = time.time() - st

        # create a dependency tree
        dependencies = self.create_dependency_tree(self.query_processed)

        # DETECT IMPLICIT AND EXPLICIT TASKS
        st = time.time()
        # Using Dependency Parser
        task_map = self.task_genie_instance.extract_explicit_tasks_from_dependencies(dependencies)

        # Filters from Domain Values
        task_map = self.task_genie_instance.extract_explicit_tasks_from_domain_value(task_map)

        # At this stage, which attributes are encodeable?
        attribute_list = self.attribute_genie_instance.get_encodable_attributes()  # At this stage, they also get refined further

        # INFER tasks based on (encodeable) attribute Datatypes
        self.extracted_tasks = self.task_genie_instance.extract_implicit_tasks_from_attributes(task_map, attribute_list)
        self.execution_durations['extract_tasks'] = time.time() - st

        # FINAL ATTRIBUTES that are TO BE ENCODED in the VIS
        attribute_list = self.attribute_genie_instance.get_encodable_attributes()

        # RECOMMEND VISUALIZATIONS FROM ATTRIBUTES, TASKS, and VISUALIZATIONS
        st = time.time()
        vis_genie_instance = VisGenie(self)
        self.vis_list = vis_genie_instance.get_vis_list(attribute_list=attribute_list)
        self.execution_durations['get_vis_list'] = time.time() - st

        # Prepare output
        output = {
            'status': 'SUCCESS' if len(self.vis_list) > 0 else 'FAILURE',
            'debug': {'execution_durations': self.execution_durations},
            'query': self.query_processed,
            'dataset': self.data_url,
            'visList': self.vis_list,
            'extractedVis': {'vis_type': self.extracted_vis_type, 'queryPhrase': self.extracted_vis_token},
            'attributeMap': self.extracted_attributes,
            'taskMap': self.extracted_tasks,
            'followUpQuery': False,
            'contextObj': None
        }

        return output if debug else helpers.delete_keys_from_dict(output, keys=constants.keys_to_delete_in_output)

    def create_dependency_tree(self, query):

        if self.dependency_parser == "spacy":
            doc = self.dependency_parser_instance(query)
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

        elif self.dependency_parser == "stanford":
            dependencies = [list(parse.triples()) for parse in self.dependency_parser_instance.raw_parse(query)]

            # Encode every string in tree to utf8 so string matching will work
            for dependency in dependencies[0]:
                dependency[0][0].encode('utf-8')
                dependency[0][1].encode('utf-8')
                dependency[1].encode('utf-8')
                dependency[2][0].encode('utf-8')
                dependency[2][1].encode('utf-8')

            return dependencies

    # Update the attribute datatypes that were not correctly detected by NL4DV
    def set_attribute_datatype(self, attr_type_obj):
        return self.data_processor_instance.set_attribute_datatype(attr_type_obj=attr_type_obj)

    # Set Label attribute for the dataset, i.e. one that defines what the dataset is about.
    # e.g. "Correlate horsepower and MPG for sports car models" should NOT apply an explicit attribute for models since there are two explicit attributes already present.
    def set_label_attribute(self, label_attribute):
        return self.data_processor_instance.set_label_attribute(label_attribute=label_attribute)

    # WORDS that should be IGNORED in the query, i.e. NOT lead to the detection of attributes and tasks
    # `Movie` in movies dataset
    # `Car` in cars dataset
    def set_ignore_words(self, ignore_words):
        return self.data_processor_instance.set_ignore_words(ignore_words=ignore_words)

    # Custom STOPWORDS that should NOT removed from the query, as they might be present in the domain.
    # e.g. `A` in grades dataset
    def set_reserve_words(self, reserve_words):
        return self.data_processor_instance.set_reserve_words(reserve_words=reserve_words)

    # Sets the AliasMap
    def set_alias_map(self, alias_map=None, alias_url=None):
        return self.data_processor_instance.set_alias_map(alias_map=alias_map, alias_url=alias_url)

    # Sets the Dataset
    def set_data(self, data_url=None):
        return self.data_processor_instance.set_data(data_url=data_url)

    # Sets the String Matching, Domain Word Limit, ... Thresholds
    def set_thresholds(self, thresholds):
        for t in thresholds:
            if t in self.match_thresholds and (isinstance(thresholds[t], float) or isinstance(thresholds[t], int)):
                self.match_thresholds[t] = thresholds[t]
        return True

    # Sets the Scoring Weights for the way attributes / tasks and visualizations are detected.
    def set_importance_scores(self, scores):
        for s in scores.keys():
            if s in self.match_scores and isinstance(scores[s], float):
                self.match_scores[s] = scores[s]

        return True

    # Create a dependency parser instance
    def set_dependency_parser(self, config):
        if isinstance(config, dict) and all(i in ["name", "model", "parser"] for i in config.keys()):
            self.dependency_parser = config["name"]
            if config["name"] == "spacy":
                """
                    Sets the model and returns the Spacy NLP instance. Example ways from the Spacy docs:
                    spacy.load("en") # shortcut link
                    spacy.load("en_core_web_sm") # package
                    spacy.load("/path/to/en") # unicode path
                    spacy.load(Path("/path/to/en")) # pathlib Path
                """
                self.dependency_parser_instance = spacy.load(config["model"])

            elif config["name"] == "stanford":
                if 'CLASSPATH' not in os.environ:
                    os.environ['CLASSPATH'] = ""

                cpath = config["model"] + os.pathsep + config["parser"]
                if cpath not in os.environ['CLASSPATH']:
                    os.environ['CLASSPATH'] = cpath + os.pathsep + os.environ['CLASSPATH']

                self.dependency_parser_instance = StanfordDependencyParser(path_to_models_jar=config["model"],
                                                                           encoding='utf8')

    # Get the dataset metadata
    def get_metadata(self):
        return self.data_processor_instance.data_attribute_map
