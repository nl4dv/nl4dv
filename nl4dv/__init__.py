 # In-built Libraries
import os
import time
from collections import OrderedDict
import json

# Third-Party Libraries
import spacy
import openai
import pandas as pd
import re
from nltk.stem.porter import PorterStemmer
from nltk.parse.stanford import StanfordDependencyParser
from nltk.parse.corenlp import CoreNLPDependencyParser

from vega import VegaLite

# NL4DV Imports
from nl4dv.datagenie import DataGenie
from nl4dv.querygenie import QueryGenie
from nl4dv.attributegenie import AttributeGenie
from nl4dv.taskgenie import TaskGenie
from nl4dv.visgenie import VisGenie
from nl4dv.updategenie import UpdateGenie
from nl4dv.utils import helpers, constants, error_codes
from nl4dv.conversationgenie import ConversationGenie
from nl4dv.autogenie import AutoGenie
from nl4dv.updategenie import UpdateGenie
from nl4dv.promptgenie import PromptGenie

class NL4DV:
    """
    Class exposed to users to interact with the package. Exposes modules in the package via
    public methods

    """

    def __init__(self, data_url=None,
                 data_value=None,
                 alias_url=None,
                 alias_value=None,
                 label_attribute=None,
                 ignore_words=list(),
                 reserve_words=list(),
                 explicit_followup_keywords = dict(),
                 implicit_followup_keywords = dict(),
                 dependency_parser_config=None,
                 thresholds=None,
                 importance_scores=None,
                 attribute_datatype=None,
                 verbose=False,
                 debug=False,
                 processing_mode = 'semantic-parsing',
                 gpt_api_key = ''):

        # inputs
        self.data_url = data_url
        self.data_value = data_value
        self.alias_url = alias_url
        self.alias_value = alias_value
        self.label_attribute = label_attribute
        self.ignore_words = ignore_words
        self.reserve_words = reserve_words
        self.dependency_parser_config = dependency_parser_config
        self.verbose = verbose
        self.debug = debug
        self.processing_mode = processing_mode

        # Load constants: thresholds, mappings, scores
        self.vis_keyword_map = constants.vis_keyword_map
        self.task_keyword_map = constants.task_keyword_map
        if bool(explicit_followup_keywords):
            self.followup_keyword_map = explicit_followup_keywords
        else:
            self.followup_keyword_map = constants.followup_keyword_map
        if bool(implicit_followup_keywords):
            self.implicit_followup_keyword_map = implicit_followup_keywords
        else:
            self.implicit_followup_keyword_map = constants.implicit_followup_keyword_map
        self.filter_followup_keyword_map = constants.filter_followup_keyword_map
        self.followup_reserve_words = constants.followup_reserve_words
        self.match_scores = constants.match_scores
        self.match_thresholds = constants.match_thresholds

        # Initialize intermediate/output variables
        self.execution_durations = dict()
        self.query_raw = None
        self.query_processed = ""
        self.query_for_task_inference = ""
        self.query_tokens = list()
        self.query_ngrams = dict()
        self.extracted_vis_type = None
        self.extracted_vis_token = None
        self.extracted_tasks = OrderedDict()
        self.extracted_attributes = OrderedDict()
        self.vis_list = None
        self.dependencies = list()
        self.dependency_parser = None
        self.dependency_parser_instance = None

        # Others
        self.dialog = False
        openai.api_key = gpt_api_key

        # initialize porter stemmer instance
        self.porter_stemmer_instance = PorterStemmer()

        # Initialize internal Class Instances
        self.data_genie_instance = DataGenie(self)  # initialize a DataGenie instance.
        self.query_genie_instance = QueryGenie(self)  # initialize a QueryGenie instance.
        self.attribute_genie_instance = AttributeGenie(self)   # initialize a AttributeGenie instance.
        self.task_genie_instance = TaskGenie(self)  # initialize a TaskGenie instance.
        self.vis_genie_instance = VisGenie(self)   # initialize a VisGenie instance.
        self.conversation_genie_instance = ConversationGenie(self)
        self.autogenie_instance = AutoGenie(self)
        self.updategenie_instance = UpdateGenie(self) #initalize a FollowUpGenie instance
        self.promptgenie_instance = PromptGenie(self)



        # Set the dependency parser if config is not None
        if self.dependency_parser_config is not None:
            self.set_dependency_parser(dependency_parser_config)

        # Set the thresholds, e.g., string matching
        if thresholds is not None:
            self.set_thresholds(thresholds=thresholds)

        # Set the importance scores, i.e., weights assigned to different ways in which attributes, tasks, and vis are detected/inferred.
        if importance_scores is not None:
            self.set_importance_scores(scores=importance_scores)

        # Override the attribute datatypes
        if attribute_datatype is not None:
            self.set_attribute_datatype(attr_type_obj=attribute_datatype)

    # returns a VegaLite object of the best (1st) visualization after analyzing the query.
    def render_vis(self, query, dialog=None, dialog_id = None, query_id = None):
        # type: (str, str, str, str) -> VegaLite
        response = self.analyze_query(query=query, dialog=dialog, dialog_id=dialog_id, query_id=query_id)
        if len(response['visList']) == 0:
            print("No best Viz; please try again.")
            return VegaLite({})
        return VegaLite(response['visList'][0]['vlSpec'])

    # ToDo:- Discuss support for non-ascii characters? Fallback from unicode to ascii good enough?
    # ToDo:- Discuss ERROR Handling
    # ToDo:- Utilities to perform unit conversion (eg. seconds > minutes). Problem: Tedious to infer base unit from data. - LATER
    def analyze_query(self, query=None, dialog=None, debug=None, verbose=None, dialog_id = None, query_id = None):
        # type: (str, bool, bool, bool, str, str) -> dict
        if self.processing_mode == 'semantic-parsing':
            if not bool(self.conversation_genie_instance.all_dialogs):
                return self.analyze_query_no_dialog(query, dialog, debug, verbose, dialog_id, query_id)
            if dialog == True:
                if query_id is not None:
                    query_id = str(query_id)
                return self.analyze_query_attribute(query, dialog, debug, verbose, dialog_id, query_id)
            elif dialog == False or dialog is None:
                return self.analyze_query_no_dialog(query, dialog, debug, verbose, dialog_id, query_id)
            elif dialog == 'auto':
                inferred_dialog, confidence_level = self.autogenie_instance.analyze_followup_status(query, self.reserve_words, self.ignore_words)
                if inferred_dialog is True:
                    if query_id is not None:
                        query_id = str(query_id)
                    return self.analyze_query_attribute(query, inferred_dialog, debug, verbose, dialog_id, query_id, confidence_level)
                else:
                    return self.analyze_query_no_dialog(query, inferred_dialog, debug, verbose, dialog_id, query_id, confidence_level)
            else:
                raise RuntimeError("Expected values for \'dialog\' are True, False, or \"auto\"")
        elif self.processing_mode == 'gpt':
            if not bool(self.conversation_genie_instance.all_dialogs):
                return self.analyze_query_llm(query, dialog, dialog_id, query_id)
            if dialog == True:
                if query_id is not None:
                    query_id = str(query_id)
                return self.analyze_query_llm(query, dialog, dialog_id, query_id)
            elif dialog == False or dialog is None:
                return self.analyze_query_llm(query, dialog, dialog_id, query_id)
            elif dialog == 'auto':
                inferred_dialog, confidence_level = self.autogenie_instance.analyze_followup_status(query, self.reserve_words, self.ignore_words)
                if inferred_dialog is True:
                    if query_id is not None:
                        query_id = str(query_id)
                    return self.analyze_query_llm(query, inferred_dialog, debug, verbose, dialog_id, query_id, confidence_level)
                else:
                    return self.analyze_query_llm(query, inferred_dialog, debug, verbose, dialog_id, query_id, confidence_level)
            else:
                raise RuntimeError("Expected values for \'dialog\' are True, False, or \"auto\"")



    def analyze_query_no_dialog(self, query=None, dialog=None, debug=None, verbose=None, dialog_id=None, query_id=None, confidence_level = None):
        self.execution_durations = dict()
        self.dialog = dialog if dialog is not None else self.dialog
        self.debug = debug if debug is not None else self.debug
        self.verbose = verbose if verbose is not None else self.verbose

        # If not a follow-up query, reset the output variables.
        if not self.dialog:
            self.extracted_vis_type = None
            self.extracted_vis_token = None
            self.extracted_tasks = OrderedDict()
            self.extracted_attributes = OrderedDict()
            self.vis_list = None

        self.past_extracted_tasks = OrderedDict()
        self.past_extracted_attributes = OrderedDict()

        self.ambiguities= dict()
        self.ambiguities['attribute'] = dict()
        self.ambiguities['value'] = dict()


        # CLEAN AND PROCESS QUERY
        self.query_raw = query
        helpers.cond_print("Raw Query: " + self.query_raw, self.verbose)
        st = time.time()
        self.query_processed = self.query_genie_instance.process_query(self.query_raw)
        self.query_tokens = self.query_genie_instance.clean_query_and_get_query_tokens(self.query_processed, self.reserve_words, self.ignore_words)
        self.query_ngrams = self.query_genie_instance.get_query_ngrams(' '.join(self.query_tokens))
        helpers.cond_print("Processed Query: " + self.query_processed, self.verbose)
        self.execution_durations['clean_query'] = time.time() - st

        # DETECT EXPLICIT AND IMPLICIT ATTRIBUTES
        st = time.time()
        self.extracted_attributes = self.attribute_genie_instance.extract_attributes(self.query_ngrams)
        helpers.cond_print("Final Extracted Attributes: " + str(list(self.extracted_attributes.keys())), self.verbose)
        self.execution_durations['extract_attributes'] = time.time() - st
        self.query_for_task_inference = self.task_genie_instance.prepare_query_for_task_inference(self.query_processed)


        # DETECT EXPLICIT VISUALIZATION UTTERANCES
        st = time.time()
        self.extracted_vis_type, self.extracted_vis_token = self.vis_genie_instance.extract_vis_type(self.query_ngrams)
        self.execution_durations['extract_vis_type'] = time.time() - st

        # DETECT IMPLICIT AND EXPLICIT TASKS
        st = time.time()

        self.dependencies = self.task_genie_instance.create_dependency_tree(self.query_for_task_inference)
        task_map = self.task_genie_instance.extract_explicit_tasks_from_dependencies(self.dependencies)

        # Filters from Domain Values
        task_map = self.task_genie_instance.extract_explicit_tasks_from_domain_value(task_map)

        # At this stage, which attributes are encodeable?
        encodeable_attributes = self.attribute_genie_instance.get_encodeable_attributes()

        # INFER tasks based on (encodeable) attribute Datatypes
        task_map = self.task_genie_instance.extract_implicit_tasks_from_attributes(task_map, encodeable_attributes, self.dialog)

        # From the generated TaskMap, ensure that the task "keys" are NOT EMPTY LISTS
        self.extracted_tasks = self.task_genie_instance.filter_empty_tasks(task_map)

        self.execution_durations['extract_tasks'] = time.time() - st

        # RECOMMEND VISUALIZATIONS FROM ATTRIBUTES, TASKS, and VISUALIZATIONS
        st = time.time()
        if (bool(self.extracted_tasks) + bool(self.extracted_attributes) + bool(self.extracted_vis_type)) == 0:
            self.vis_list = list()
            output = {
            'status': 'SUCCESS' if len(self.vis_list) > 0 else 'FAILURE',
            'debug': {'execution_durations': self.execution_durations},
            'query_raw': self.query_raw,
            'query': self.query_processed,
            'dataset': self.data_url if self.data_url else self.data_value,
            'alias': self.alias_url if self.alias_url else self.alias_value,
            'visList': self.vis_list,
            'attributeMap': self.extracted_attributes,
            'taskMap': self.extracted_tasks,
            'followUpQuery': self.dialog,
            'contextObj': None,
            'attributeMapping': self.attribute_keyword_mapping,
            'followUpConfidence' : confidence_level,
            'ambiguity' : self.ambiguities
            }
            return output if self.debug else helpers.delete_keys_from_dict(output, keys=constants.keys_to_delete_in_output)

        # Final list of encodeable attributes in the VIS
        final_encodeable_attributes = self.attribute_genie_instance.update_encodeable_attributes_based_on_tasks()

        self.vis_list = self.vis_genie_instance.get_vis_list(attribute_list=final_encodeable_attributes)
        self.execution_durations['get_vis_list'] = time.time() - st
        self.execution_durations['total'] = sum(self.execution_durations.values())

        # Prepare output
        output = {
            'status': 'SUCCESS' if len(self.vis_list) > 0 else 'FAILURE',
            'debug': {'execution_durations': self.execution_durations},
            'query_raw': self.query_raw,
            'query': self.query_processed,
            'dataset': self.data_url if self.data_url else self.data_value,
            'alias': self.alias_url if self.alias_url else self.alias_value,
            'visList': self.vis_list,
            'attributeMap': self.extracted_attributes,
            'taskMap': self.extracted_tasks,
            'followUpQuery': self.dialog,
            'contextObj': None,
            'attributeMapping': self.attribute_keyword_mapping,
            'followUpConfidence' : confidence_level,
            'ambiguity' : self.ambiguities
        }
        if query_id is not None:
            query_id = str(query_id)
        if dialog_id is not None:
            dialog_id = str(dialog_id)
        return_convo, return_context = self.conversation_genie_instance.add_dialog(output, dialog_id, query_id)
        output['dialogId'] = str(return_convo)
        output['queryId'] = str(return_context)

        helpers.cond_print("Dialog ID: " + str(return_convo), self.verbose)
        helpers.cond_print("Query ID: " + str(return_context), self.verbose)

        return output if self.debug else helpers.delete_keys_from_dict(output, keys=constants.keys_to_delete_in_output)

    def analyze_query_llm(self, query=None, dialog=None, dialog_id=None, query_id=None):
        if dialog is None:
            query_prompt = self.promptgenie_instance.prompt
            query_prompt = re.sub(r"https://raw\.githubusercontent\.com\S*", self.data_url, query_prompt)
            dataset_sample = pd.read_csv(self.data_url, index_col = False)
            dataset_sample = dataset_sample.head(10).to_string(index=False)
            query_prompt = re.sub(r"<INSERT DATASET HERE>", dataset_sample, query_prompt)
            query_prompt = re.sub(r"<INSERT QUERY HERE>", query, query_prompt)
            message = self.chat_with_chatgpt(query_prompt)
            if query_id is not None:
                query_id = str(query_id)
            if dialog_id is not None:
                dialog_id = str(dialog_id)
            return_convo, return_context = self.conversation_genie_instance.add_dialog(message, dialog_id, query_id)
            message['dialogId'] = str(return_convo)
            message['queryId'] = str(return_context)
            return message
        elif dialog is True:
            context_obj = None
            if dialog_id == None and query_id == None:
                key_num = self.conversation_genie_instance.key_num - 1
                key_num = str(key_num)
                context_obj = self.conversation_genie_instance.all_dialogs[key_num][-1]
            elif dialog_id != None and query_id == None:
                dialog_id = str(dialog_id)
                context_obj = self.conversation_genie_instance.all_dialogs[dialog_id][-1]
            elif dialog_id == None and query_id != None:
                return None
            else:
                dialog_id = str(dialog_id)
                if not isinstance(query_id, str):
                    raise RuntimeError("Context id must be of type string")
                query_id = int(query_id)
                context_obj = self.conversation_genie_instance.all_dialogs[dialog_id][query_id]
            query_prompt = self.promptgenie_instance.prompt
            query_prompt = re.sub(r"https://raw\.githubusercontent\.com\S*", self.data_url, query_prompt)
            dataset_sample = pd.read_csv(self.data_url, index_col = False)
            dataset_sample = dataset_sample.head(10).to_string(index=False)
            query_prompt = re.sub(r"<INSERT DATASET HERE>", dataset_sample, query_prompt)
            query_prompt = re.sub(r"<INSERT QUERY HERE>", query, query_prompt)
            query_prompt = query_prompt + "\n" + "PREVIOUS ANALYTIC SPECIFICATION" + str(context_obj)
            message = self.chat_with_chatgpt(query_prompt)
            if query_id is not None:
                query_id = str(query_id)
            if dialog_id is not None:
                dialog_id = str(dialog_id)
            return_convo, return_context = self.conversation_genie_instance.add_dialog(message, dialog, dialog_id, query_id)
            message['dialogId'] = str(return_convo)
            message['queryId'] = str(return_context)
            return message

    def chat_with_chatgpt(self, new_prompt, model="gpt-4o-mini"):
        response = openai.ChatCompletion.create(
            model=model,
            messages=[{"role": "user",
               "content": new_prompt}],
            temperature=0
        )
        message = response.choices[0].message.content
        message = message.replace("\n", "")
        message = re.sub(r' +', ' ', message)
        # message = message.replace("json", "")
        message = message.replace("None", "\"None\"")
        message = message.replace("\"\"None\"\"", "\"None\"")
        message = message.replace("True", "true")
        message = message.replace("False", "false")
        if "json" == message[3:7]:
            message = message.replace("json", "", 1)
            message = message[3:]
            message = message[:-3]
        try:
            vlSpec = json.loads(message)
        except ValueError as e:
            return 'Invalid JSON'

        return vlSpec


    #put operation in meta
    #change operation to followup_type
    #put followup_type for cold queries, put it as None
    # meta: {followup_type: (add, remove, replace), followup_details : ({add : attr_value}, {remove: attr_value})}
    # use dependency parser to detect attributes now, and see if it's add remove or replace
    #create queries to see patterns for add, remove, and replace
    #also detect vis for attribute detection
    #concatenate group by and facet by groupby and facetby
    def analyze_query_attribute(self, query=None, dialog=None, debug=None, verbose=None, dialog_id=None, query_id=None, confidence_level=None):

        self.execution_durations = dict()
        self.dialog = dialog if dialog is not None else self.dialog
        self.debug = debug if debug is not None else self.debug
        self.verbose = verbose if verbose is not None else self.verbose

        context_obj = None
        if dialog is True:

            if dialog_id == None and query_id == None:
                key_num = self.conversation_genie_instance.key_num - 1
                key_num = str(key_num)

                context_obj = self.conversation_genie_instance.all_dialogs[key_num][-1]


            elif dialog_id != None and query_id == None:
                dialog_id = str(dialog_id)
                context_obj = self.conversation_genie_instance.all_dialogs[dialog_id][-1]
            elif dialog_id == None and query_id != None:
                return None
            else:
                dialog_id = str(dialog_id)
                if not isinstance(query_id, str):
                    raise RuntimeError("Context id must be of type string")
                query_id = int(query_id)
                context_obj = self.conversation_genie_instance.all_dialogs[dialog_id][query_id]
            helpers.cond_print("Previous Query: ", self.verbose)
            helpers.cond_print(context_obj['query_raw'], self.verbose)
            self.past_extracted_attributes = context_obj['attributeMap']
            self.past_ambiguities = context_obj['ambiguity']

            self.past_extracted_tasks = context_obj['taskMap']

            self.past_extracted_vis_type = context_obj['visList'][0]['visType']

            self.past_extracted_vis_list = context_obj['visList']
            self.past_attribute_keyword_mapping = context_obj['attributeMapping']

            if bool(self.past_ambiguities['attribute']):
                for attr_query in self.past_ambiguities['attribute']:
                    if not self.past_ambiguities['attribute'][attr_query]['selected'] == "NL4DV_Resolved":
                        self.updategenie_instance.auto_handle_attribute_ambiguity()
            if bool(self.past_ambiguities['value']):
                for attr_query in self.past_ambiguities['value']:
                    if not self.past_ambiguities['value'][attr_query]['selected'] == "NL4DV_Resolved":
                        raise Error("need to resolve ambiguity for value")

            self.ambiguities= dict()
            self.ambiguities['attribute'] = dict()
            self.ambiguities['value'] = dict()

        # CLEAN AND PROCESS QUERY
            self.query_raw = query
            helpers.cond_print("Raw Query: " + self.query_raw, self.verbose)
            st = time.time()
            self.query_processed = self.query_genie_instance.process_query(self.query_raw)


            self.query_tokens = self.query_genie_instance.clean_query_and_get_query_tokens(self.query_processed, self.reserve_words, self.ignore_words, dialog=self.dialog)
            self.query_ngrams = self.query_genie_instance.get_query_ngrams(' '.join(self.query_tokens))
            helpers.cond_print("Processed Query: " + self.query_processed, self.verbose)
            self.execution_durations['clean_query'] = time.time() - st

            # DETECT EXPLICIT AND IMPLICIT ATTRIBUTES
            st = time.time()
            self.extracted_attributes = self.attribute_genie_instance.extract_attributes(self.query_ngrams)

            helpers.cond_print("Final Extracted Attributes: " + str(list(self.extracted_attributes.keys())), self.verbose)
            self.execution_durations['extract_attributes'] = time.time() - st

            self.query_for_task_inference = self.task_genie_instance.prepare_query_for_task_inference(self.query_processed, dialog=True)
            self.dependencies = self.task_genie_instance.create_dependency_tree(self.query_for_task_inference)
            davo = self.conversation_genie_instance.get_followuptype_attribute_from_dependencies(self.dependencies)

            self.extracted_vis_type, self.extracted_vis_token = self.vis_genie_instance.extract_vis_type(self.query_ngrams, self.dependencies)
            if self.extracted_vis_type is None:
                self.extracted_vis_type = self.past_extracted_vis_type
            elif self.extracted_vis_type == "REMOVE":
                self.extracted_vis_type = None

            tasks_detected = False
            if bool(self.extracted_attributes):
                task_map = self.conversation_genie_instance.get_followuptype_task_from_dependencies(self.dependencies, self.query_ngrams)
                tasks_detected = True

            if davo[0] is None and len(self.extracted_attributes.keys()) != 0:
                davo[0] = "add"

            if davo[0] == "replace":
                if len(davo[1].values()) == 1:
                    if list(davo[1].values())[0] == "replace_to_add":
                        followup_dict = davo
                        removed_key, davo = self.conversation_genie_instance.implicit_replacement(followup_dict, self.past_extracted_attributes)
                        self.extracted_attributes[removed_key] = self.past_extracted_attributes[removed_key]

            if len(davo[1].keys()) != 0:
                for attr in self.extracted_attributes.keys():
                    if attr in davo[1].keys():
                        self.extracted_attributes[attr]['meta']['followup_type'] = davo[1][attr]
                    else:
                        self.extracted_attributes[attr]['meta']['followup_type'] = 'nothing'
                self.extracted_attributes, self.attribute_keyword_mapping = self.conversation_genie_instance.followup_conversation_attribute(self.extracted_attributes, self.past_extracted_attributes,
                    self.attribute_keyword_mapping, self.past_attribute_keyword_mapping, task_map)
            else:
                self.extracted_attributes, self.attribute_keyword_mapping = self.conversation_genie_instance.merge_update(
                    self.past_extracted_attributes, self.extracted_attributes, self.past_attribute_keyword_mapping, self.attribute_keyword_mapping)

            if not tasks_detected:
                task_map = self.conversation_genie_instance.get_followuptype_task_from_dependencies(self.dependencies, self.query_ngrams)

            if len(task_map.keys()) != 0:
                if 'filter' not in task_map.keys():
                    task_map = self.conversation_genie_instance.followup_conversation_task(task_map, self.past_extracted_tasks)
            task_map = self.task_genie_instance.extract_explicit_tasks_from_domain_value(task_map)

            if len(task_map.keys()) != 0 and 'filter' in task_map.keys():
                task_map = self.conversation_genie_instance.followup_filter_task(task_map, self.past_extracted_tasks, self.query_ngrams)

            if not bool(task_map):
                for i in self.past_extracted_tasks.keys():
                    if i in ['filter', 'derived_value', 'find_extremum', 'sort']:
                        task_map[i] = self.past_extracted_tasks[i]

            task_map = self.conversation_genie_instance.remove_old_tasks(task_map)

            # At this stage, which attributes are encodeable?
            encodeable_attributes = self.attribute_genie_instance.get_encodeable_attributes()

            # INFER tasks based on (encodeable) attribute Datatypes
            task_map = self.task_genie_instance.extract_implicit_tasks_from_attributes(task_map, encodeable_attributes, self.dialog)

            # From the generated TaskMap, ensure that the task "keys" are NOT EMPTY LISTS
            self.extracted_tasks = self.task_genie_instance.filter_empty_tasks(task_map)
            self.execution_durations['extract_tasks'] = time.time() - st

            # RECOMMEND VISUALIZATIONS FROM ATTRIBUTES, TASKS, and VISUALIZATIONS
            st = time.time()

            if (bool(self.extracted_tasks) + bool(self.extracted_attributes) + bool(self.extracted_vis_type)) == 0:
                self.vis_list = list()
                output = {
                'status': 'SUCCESS' if len(self.vis_list) > 0 else 'FAILURE',
                'debug': {'execution_durations': self.execution_durations},
                'query_raw': self.query_raw,
                'query': self.query_processed,
                'dataset': self.data_url if self.data_url else self.data_value,
                'alias': self.alias_url if self.alias_url else self.alias_value,
                'visList': self.vis_list,
                'attributeMap': self.extracted_attributes,
                'taskMap': self.extracted_tasks,
                'followUpQuery': self.dialog,
                'contextObj': None,
                'attributeMapping': self.attribute_keyword_mapping,
                'followUpConfidence' : confidence_level,
                'ambiguity' : self.ambiguities
                }
                return output if self.debug else helpers.delete_keys_from_dict(output, keys=constants.keys_to_delete_in_output)

            # Final list of encodeable attributes in the VIS
            final_encodeable_attributes = self.attribute_genie_instance.update_encodeable_attributes_based_on_tasks()

            self.vis_list = self.vis_genie_instance.get_vis_list(attribute_list=final_encodeable_attributes)

            self.execution_durations['get_vis_list'] = time.time() - st
            self.execution_durations['total'] = sum(self.execution_durations.values())
            current_ambiguity = dict()
            current_ambiguity['attribute'] = dict()
            current_ambiguity['value'] = dict()

            # Prepare output
            output = {
                'status': 'SUCCESS' if len(self.vis_list) > 0 else 'FAILURE',
                'debug': {'execution_durations': self.execution_durations},
                'query_raw': self.query_raw,
                'query': self.query_processed,
                'dataset': self.data_url if self.data_url else self.data_value,
                'alias': self.alias_url if self.alias_url else self.alias_value,
                'visList': self.vis_list,
                'attributeMap': self.extracted_attributes,
                'taskMap': self.extracted_tasks,
                'followUpQuery': self.dialog,
                'contextObj': None,
                'attributeMapping': self.attribute_keyword_mapping,
                'followUpConfidence': confidence_level,
                'ambiguity' : self.ambiguities
            }

            if query_id is not None:
                query_id = str(query_id)
            if dialog_id is not None:
                dialog_id = str(dialog_id)
            return_conversation, return_context = self.conversation_genie_instance.add_dialog(output, dialog, dialog_id, query_id)
            if len(self.ambiguities['attribute']) != 0 or len(self.ambiguities['value']) != 0:
                for key in self.ambiguities['attribute']:
                    if key not in self.past_ambiguities['attribute']:
                        current_ambiguity['attribute'][key] = self.ambiguities['attribute'][key]
                    else:
                        current_ambiguity['attribute'][key] = self.past_ambiguities['attribute'][key]
                for key in self.ambiguities['value']:
                    if key not in self.past_ambiguities['value']:
                        current_ambiguity['value'][key] = self.ambiguities['value'][key]
                    else:
                        current_ambiguity['value'][key] = self.past_ambiguities['value'][key]
                self.ambiguities = current_ambiguity
                output = self.updategenie_instance.update_vis(str(return_conversation), str(return_context))

            output['dialogId'] = str(return_conversation)
            output['queryId'] = str(return_context)

            helpers.cond_print("Dialog ID: " + str(return_conversation), self.verbose)
            helpers.cond_print("Query ID: " + str(return_context), self.verbose)

            return output if self.debug else helpers.delete_keys_from_dict(output, keys=constants.keys_to_delete_in_output)

    def update_query(self, ambiguity_obj):
        if 'query_id' in ambiguity_obj.keys() and 'dialog_id' in ambiguity_obj.keys():
            query_id = ambiguity_obj['query_id']
            dialog_id = ambiguity_obj['dialog_id']
        else:
            dialog_id = self.conversation_genie_instance.most_recent_dialog_id[-1]
            query_id = self.conversation_genie_instance.most_recent_query_id[-1]
        if "attribute" in ambiguity_obj.keys():
            for key in ambiguity_obj['attribute']:
                self.ambiguities['attribute'][key]['selected'] = ambiguity_obj['attribute'][key]
        if "value" in ambiguity_obj.keys():
            for key in ambiguity_obj['value']:
                self.ambiguities['value'][key]['selected'] = ambiguity_obj['value'][key]
        return self.updategenie_instance.update_vis(dialog_id, query_id)

    # Update the attribute datatypes that were not correctly detected by NL4DV
    def set_attribute_datatype(self, attr_type_obj):
        return self.data_genie_instance.set_attribute_datatype(attr_type_obj=attr_type_obj)

    # Set Label attribute for the dataset, i.e. one that defines what the dataset is about.
    # e.g. "Correlate horsepower and MPG for sports car models" should NOT apply an explicit attribute for models since there are two explicit attributes already present.
    def set_label_attribute(self, label_attribute):
        return self.data_genie_instance.set_label_attribute(label_attribute=label_attribute)

    # WORDS that should be IGNORED in the query, i.e. NOT lead to the detection of attributes and tasks
    # `Movie` in movies dataset
    # `Car` in cars dataset
    def set_ignore_words(self, ignore_words):
        return self.data_genie_instance.set_ignore_words(ignore_words=ignore_words)

    # Custom STOPWORDS that should NOT removed from the query, as they might be present in the domain.
    # e.g. `A` in grades dataset
    def set_reserve_words(self, reserve_words):
        return self.data_genie_instance.set_reserve_words(reserve_words=reserve_words)

    # Sets the AliasMap
    def set_alias_map(self, alias_value=None, alias_url=None):
        return self.data_genie_instance.set_alias_map(alias_value=alias_value, alias_url=alias_url)

    def set_implicit_followup_keywords(self, implicit_followup_keywords=None):
        if implicit_followup_keywords is not None:
            self.implicit_followup_keyword_map = implicit_followup_keywords

    def set_explicit_followup_keywords(self, explicit_followup_keywords=None):
        if explicit_followup_keywords is not None:
            self.followup_keyword_map = explicit_followup_keywords

    # Sets the Dataset
    def set_data(self, data_url=None, data_value=None):
        return self.data_genie_instance.set_data(data_url=data_url, data_value=data_value)

    # Sets the String Matching, Domain Word Limit, ... Thresholds
    def set_thresholds(self, thresholds):
        for t in thresholds:
            if t in self.match_thresholds and (isinstance(thresholds[t], float) or isinstance(thresholds[t], int)):
                self.match_thresholds[t] = thresholds[t]

    # Sets the Scoring Weights for the way attributes / tasks and visualizations are detected.
    def set_importance_scores(self, scores):
        # domain = {'attribute', 'task', 'vis'}
        for domain in scores.keys():
            if domain in self.match_scores and isinstance(scores[domain], dict):
                # setting = {'attribute_exact_match', 'attribute_similarity_match', 'attribute_alias_exact_match', ... so on}
                for setting in scores[domain].keys():
                    if setting in self.match_scores[domain] and isinstance(scores[domain][setting], float):
                        self.match_scores[domain][setting] = scores[domain][setting]

    # Flush specific conversation and context
    def delete_dialogs(self, dialog_id=None, query_id = None):
        return self.conversation_genie_instance.delete_dialogs(dialog_id=dialog_id, query_id=query_id)

    def get_dialogs(self, dialog_id, query_id):
        return self.conversation_genie_instance.get_dialogs(dialog_id=dialog_id, query_id=query_id)

    def undo(self):
        return self.conversation_genie_instance.undo()

    # Get the dataset metadata
    def get_metadata(self):
        return json.loads(json.dumps(self.data_genie_instance.data_attribute_map, cls=helpers.CustomJSONEncoder))

    # Create a dependency parser instance
    def set_dependency_parser(self, config):
        if isinstance(config, dict):
            helpers.cond_print("Dependency Parser: " + config["name"], self.verbose)
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

            elif config["name"] == "corenlp":
                if 'CLASSPATH' not in os.environ:
                    os.environ['CLASSPATH'] = ""

                cpath = config["model"] + os.pathsep + config["parser"]
                if cpath not in os.environ['CLASSPATH']:
                    os.environ['CLASSPATH'] = cpath + os.pathsep + os.environ['CLASSPATH']

                # TODO:- DEPRECATED
                self.dependency_parser_instance = StanfordDependencyParser(path_to_models_jar=config["model"],
                                                                           encoding='utf8')
            elif config["name"] == "corenlp-server":
                # Requires the CoreNLPServer running in the background at the below URL (generally https://localhost:9000)
                # Start server by running the following command in the JARs directory.
                # `java -mx4g -cp "*" edu.stanford.nlp.pipeline.StanfordCoreNLPServer -annotators "tokenize,ssplit,pos,lemma,parse,sentiment" -port 9000 -timeout 30000`
                self.dependency_parser_instance = CoreNLPDependencyParser(url=config["url"])
