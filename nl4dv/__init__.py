# In-built Libraries
import os
import time
from collections import OrderedDict
import json
import re

# Third-Party Libraries
import spacy
import litellm
from vega import VegaLite
import pandas as pd
from nltk.stem.porter import PorterStemmer
from nltk.parse.stanford import StanfordDependencyParser
from nltk.parse.corenlp import CoreNLPDependencyParser

# NL4DV Imports
from nl4dv.utils import helpers, constants, error_codes
from nl4dv.datagenie import DataGenie
from nl4dv.querygenie import QueryGenie
from nl4dv.attributegenie import AttributeGenie
from nl4dv.taskgenie import TaskGenie
from nl4dv.visgenie import VisGenie
from nl4dv.updategenie import UpdateGenie
from nl4dv.conversationgenie import ConversationGenie
from nl4dv.autogenie import AutoGenie
from nl4dv.updategenie import UpdateGenie
from nl4dv.lm_designgenie import LM_DesignGenie
from nl4dv.lm_querygenie import LM_QueryGenie

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
                 lm_config=dict(),
                 design_config=dict(),
                 processing_mode='semantic-parsing', # 'semantic-parsing', 'language-model', or 'gpt' (remnant from v3)
                 gpt_api_key='' # remnant from v3.
                ):

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
        self.gpt_api_key = gpt_api_key
        self.lm_config = lm_config
        self.lm_model = None
        self.lm_environ_var_name = None
        self.lm_api_key = None
        self.lm_api_base = None
        self.design_config = design_config

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

        # initialize porter stemmer instance
        self.porter_stemmer_instance = PorterStemmer()

        # Initialize internal Class Instances
        self.data_genie_instance = DataGenie(self)
        self.query_genie_instance = QueryGenie(self)
        self.attribute_genie_instance = AttributeGenie(self)
        self.task_genie_instance = TaskGenie(self)
        self.vis_genie_instance = VisGenie(self)
        self.conversation_genie_instance = ConversationGenie(self)
        self.auto_genie_instance = AutoGenie(self)
        self.update_genie_instance = UpdateGenie(self)
        self.lm_query_genie_instance = LM_QueryGenie(self)
        self.lm_design_genie_instance = LM_DesignGenie(self)

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
            if dialog == 'auto':
                inferred_dialog, confidence_level = self.auto_genie_instance.analyze_followup_status(query, self.reserve_words, self.ignore_words)
                if inferred_dialog is True:
                    if query_id is not None:
                        query_id = str(query_id)
                    return self.analyze_query_attribute(query, inferred_dialog, debug, verbose, dialog_id, query_id, confidence_level)
                else:
                    return self.analyze_query_no_dialog(query, inferred_dialog, debug, verbose, dialog_id, query_id, confidence_level)
            elif str(dialog) == 'True':
                if query_id is not None:
                    query_id = str(query_id)
                return self.analyze_query_attribute(query, dialog, debug, verbose, dialog_id, query_id)
            elif str(dialog) == 'False' or str(dialog) == 'None':
                return self.analyze_query_no_dialog(query, dialog, debug, verbose, dialog_id, query_id)
            else:
                raise RuntimeError("Expected values for \'dialog\' are True, False, or \"auto\"")

        elif self.processing_mode == 'gpt' or self.processing_mode == 'language-model':

            if self.processing_mode == 'gpt':
                self.lm_config = {
                    "model": "gpt-4o",
                    "environ_var_name": "OPENAI_API_KEY",
                    "api_key": self.gpt_api_key,
                    "api_base": None
                }
                # Configure language model configuration
                self.configure_litellm(self.lm_config)

            elif self.processing_mode == 'language-model':
                # Configure language model configuration
                self.configure_litellm(self.lm_config)

            if not bool(self.conversation_genie_instance.all_dialogs):
                return self.analyze_query_lm(query, dialog, dialog_id, query_id)
            
            if str(dialog) == 'True':
                if query_id is not None:
                    query_id = str(query_id)
                return self.analyze_query_lm(query, dialog, dialog_id, query_id)
            elif str(dialog) == 'False' or str(dialog) == 'None':
                return self.analyze_query_lm(query, dialog, dialog_id, query_id)
            else:
                raise RuntimeError("Expected values for \'dialog\' are True, False")


    def configure_litellm(self, lm_config):
        """
        Configure LiteLLM with API credentials and options.
        
        Args:
            lm_config: Configuration object
        """
        if lm_config is not None:
            self.lm_model = lm_config['model']
            self.lm_environ_var_name = lm_config['environ_var_name']
            self.lm_api_key = lm_config['api_key']
            self.lm_api_base = lm_config['api_base']
            
            # Set API key if provided
            if lm_config['api_key']:
                litellm.api_key = lm_config['api_key']
                os.environ[lm_config['environ_var_name']] = lm_config['api_key']
            else:
                raise RuntimeError("api_key is not provided in lm_config.")
            
            # Set API base if provided
            if lm_config['api_base']:
                litellm.api_base = lm_config['api_base']
                # Warn if api_key is not provided when using custom api_base
                if not lm_config['api_key'] and self.verbose:
                    print("Warning: api_base is set but no api_key provided. This might cause authentication issues.")
            
            if self.verbose:
                litellm.set_verbose = True


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

    def analyze_query_lm(self, query=None, dialog=None, dialog_id=None, query_id=None):

        # Prepare the prompt
        query_prompt = self.lm_query_genie_instance.prompt

        # Adjust the data URL in the prompt if needed
        query_prompt = query_prompt.replace(self.data_url, "https://raw.githubusercontent.com/" + self.data_url)

        # Read and sample the dataset
        dataset_sample = pd.read_csv(self.data_url, index_col=False).head(10).to_string(index=False)

        # Replace placeholders
        query_prompt = re.sub(r"<INSERT DATASET HERE>", dataset_sample, query_prompt)
        query_prompt = re.sub(r"<INSERT QUERY HERE>", query, query_prompt)

        context_obj = None
        if dialog:
            # Determine the context object based on IDs
            if dialog_id is None and query_id is None:
                key_num = str(self.conversation_genie_instance.key_num - 1)
                context_obj = self.conversation_genie_instance.all_dialogs[key_num][-1]
            elif dialog_id is not None and query_id is None:
                dialog_id = str(dialog_id)
                context_obj = self.conversation_genie_instance.all_dialogs[dialog_id][-1]
            elif dialog_id is None and query_id is not None:
                return None
            else:
                dialog_id = str(dialog_id)
                if not isinstance(query_id, str):
                    raise RuntimeError("Context id must be of type string")
                query_id = int(query_id)
                context_obj = self.conversation_genie_instance.all_dialogs[dialog_id][query_id]
            # Append previous analytic specification
            query_prompt += "\nPREVIOUS ANALYTIC SPECIFICATION" + str(context_obj)

        
        # First, process the Main Query Prompt
        main_query_prompt_message = {
            "type" : "text",
            "text": query_prompt
        }
        design_unaware_nl4dv_response = self.query_language_model([main_query_prompt_message])

        if self.design_config is not None and len(self.design_config) > 0:
            # Now the design prompts
            design_related_prompts = []

            # Append the Design Prompt with the vl spec
            main_design_prompt_message = {
                "type" : "text",
                "text": self.lm_design_genie_instance.prompt
            }
            design_related_prompts.append(main_design_prompt_message)

            # Append Individual Design Requests
            for idx, design_instruction in enumerate(self.design_config):
                design_related_prompts.append(design_instruction.copy())

            # Append the design unaware visualization specification (to process)
            design_unaware_nl4dv_response_as_input_prompt_message = {
                "type" : "text",
                "text": str(design_unaware_nl4dv_response)
            }
            design_related_prompts.append(design_unaware_nl4dv_response_as_input_prompt_message)

            # Second, process the Design-related Prompt
            design_aware_nl4dv_response = self.query_language_model(design_related_prompts)
            message = design_aware_nl4dv_response
        else:
            message = design_unaware_nl4dv_response

        # Ensure IDs are strings
        if query_id is not None:
            query_id = str(query_id)
        if dialog_id is not None:
            dialog_id = str(dialog_id)

        # Add dialog and get return values
        if dialog:
            return_convo, return_context = self.conversation_genie_instance.add_dialog(
                message, dialog, dialog_id, query_id
            )
        else:
            return_convo, return_context = self.conversation_genie_instance.add_dialog(
                message, dialog_id, query_id
            )

        message['dialogId'] = str(return_convo)
        message['queryId'] = str(return_context)
        return message

    def query_language_model(self, prompts, model="gpt-4o-mini"):
        try:
            response = litellm.completion(
                model=model,
                messages=[{
                    "role": "user",
                    "content": prompts
                }],
                temperature=0
            )
            # Extract message content
            raw_message = response.choices[0].message.content
            return self.parse_and_clean_llm_response(raw_message)
            
        except Exception as e:
            error_msg = f"LLM Error: {str(e)}"
            print(error_msg)
            return {'error': error_msg}

    def parse_and_clean_llm_response(self, message: str):
        """
        Cleans and parses an LLM response string to extract valid JSON.

        Args:
            message: The raw text response from the LLM.

        Returns:
            The parsed JSON object, or a dictionary with error details if parsing fails.
        """
        try:
            # Normalize whitespace and fix Python literals for JSON compatibility
            cleaned = re.sub(r'\s+', ' ', message).strip()
            cleaned = (cleaned.replace("None", "\"None\"")
                            .replace("\"\"None\"\"", "\"None\"")
                            .replace("True", "true")
                            .replace("False", "false"))
            # Extract the JSON substring
            json_text = cleaned[cleaned.find("{"):cleaned.rfind("}") + 1]
            return json.loads(json_text)
        except Exception as e:
            error_msg = f"JSON parsing error: {e}"
            print(f"{error_msg}\nRaw response: {message}")
            return {'error': 'Invalid JSON', 'details': str(e)}


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
                        self.update_genie_instance.auto_handle_attribute_ambiguity()
            if bool(self.past_ambiguities['value']):
                for attr_query in self.past_ambiguities['value']:
                    if not self.past_ambiguities['value'][attr_query]['selected'] == "NL4DV_Resolved":
                        raise RuntimeError("need to resolve ambiguity for value")

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
                output = self.update_genie_instance.update_vis(str(return_conversation), str(return_context))

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
        return self.update_genie_instance.update_vis(dialog_id, query_id)

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

                self.dependency_parser_instance = StanfordDependencyParser(path_to_models_jar=config["model"], encoding='utf8')
            elif config["name"] == "corenlp-server":
                # Requires the CoreNLPServer running in the background at the below URL (generally https://localhost:9000)
                # Start server by running the following command in the JARs directory.
                # `java -mx4g -cp "*" edu.stanford.nlp.pipeline.StanfordCoreNLPServer -annotators "tokenize,ssplit,pos,lemma,parse,sentiment" -port 9000 -timeout 30000`
                self.dependency_parser_instance = CoreNLPDependencyParser(url=config["url"])
