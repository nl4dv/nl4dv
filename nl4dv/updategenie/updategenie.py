from nl4dv.utils import constants, helpers
import re
import nltk
from nltk import word_tokenize
from si_prefix import si_parse
from nl4dv.querygenie import QueryGenie
from nl4dv.attributegenie import AttributeGenie
from nl4dv.taskgenie import TaskGenie
from nl4dv.visgenie import VisGenie

class UpdateGenie:
    def __init__(self, nl4dv_instance):
        self.nl4dv_instance = nl4dv_instance
        self.dialog = False


    def update_vis(self, dialog_id, query_id):
        self.nl4dv_instance.ambiguity_copy = self.nl4dv_instance.ambiguities.copy()
        self.task_map = dict()
        for task_type in self.nl4dv_instance.extracted_tasks:
            self.task_map[task_type] = list()
            for task in self.nl4dv_instance.extracted_tasks[task_type]:
                if task['inferenceType'] == 'explicit':
                    self.task_map[task_type].append(task)

        if bool(self.nl4dv_instance.ambiguities['value']):
            for key in self.nl4dv_instance.ambiguities['value']:
                if self.nl4dv_instance.ambiguities['value'][key]['selected'] is not None:
                    if 'selected_attr' in self.nl4dv_instance.ambiguities['value'][key].keys():
                        self.nl4dv_instance.ambiguities['value'][key]['selected'] = self.nl4dv_instance.ambiguities['value'][key]['selected_attr']
                    self.update_value_ambiguity()
                    self.nl4dv_instance.ambiguities['value'][key]['selected_attr'] = self.nl4dv_instance.ambiguities['value'][key]['selected']
                    self.nl4dv_instance.ambiguities['value'][key]['selected'] = 'NL4DV_Resolved'


        if bool(self.nl4dv_instance.ambiguities['attribute']):
            for key in self.nl4dv_instance.ambiguities['attribute']:
                if self.nl4dv_instance.ambiguities['attribute'][key]['selected'] is not None:
                    if 'selected_attr' in self.nl4dv_instance.ambiguities['attribute'][key].keys():
                        self.nl4dv_instance.ambiguities['attribute'][key]['selected'] = self.nl4dv_instance.ambiguities['attribute'][key]['selected_attr']
                    self.update_attribute_ambiguity()
                    self.nl4dv_instance.ambiguities['attribute'][key]['selected_attr'] = self.nl4dv_instance.ambiguities['attribute'][key]['selected']
                    self.nl4dv_instance.ambiguities['attribute'][key]['selected'] = 'NL4DV_Resolved'

        # At this stage, which attributes are encodeable?
        encodeable_attributes = self.nl4dv_instance.attribute_genie_instance.get_encodeable_attributes()
        task_map = self.nl4dv_instance.task_genie_instance.extract_implicit_tasks_from_attributes(self.task_map, encodeable_attributes, self.nl4dv_instance.dialog)
        self.nl4dv_instance.extracted_tasks = self.nl4dv_instance.task_genie_instance.filter_empty_tasks(task_map)

        final_encodeable_attributes = self.nl4dv_instance.attribute_genie_instance.update_encodeable_attributes_based_on_tasks()



        self.nl4dv_instance.vis_list = self.nl4dv_instance.vis_genie_instance.get_vis_list(attribute_list=final_encodeable_attributes)

        output = {
            'status': 'SUCCESS' if len(self.nl4dv_instance.vis_list) > 0 else 'FAILURE',
            'debug': {'execution_durations': self.nl4dv_instance.execution_durations},
            'query_raw': self.nl4dv_instance.query_raw,
            'query': self.nl4dv_instance.query_processed,
            'dataset': self.nl4dv_instance.data_url if self.nl4dv_instance.data_url else self.nl4dv_instance.data_value,
            'alias': self.nl4dv_instance.alias_url if self.nl4dv_instance.alias_url else self.nl4dv_instance.alias_value,
            'visList': self.nl4dv_instance.vis_list,
            'attributeMap': self.nl4dv_instance.extracted_attributes,
            'taskMap': self.nl4dv_instance.extracted_tasks,
            'followUpQuery': self.nl4dv_instance.dialog,
            'contextObj': None,
            'attributeMapping': self.nl4dv_instance.attribute_keyword_mapping,
            'followUpConfidence' : None,
            'ambiguity' : self.nl4dv_instance.ambiguities,
            'ambiguityCopy' : self.nl4dv_instance.ambiguity_copy
        }
        self.nl4dv_instance.conversation_genie_instance.update_query(dialog_id, query_id, output)
        output['dialogId'] = dialog_id
        output['queryId'] = query_id

        return output




    def update_attribute_ambiguity(self):
        ambiguous_phrases = list(self.nl4dv_instance.ambiguities['attribute'].keys())
        for phrase in ambiguous_phrases:
            chosen_attr = self.nl4dv_instance.ambiguities['attribute'][phrase]['selected']
            new_extracted_attr = dict()
            for attr in self.nl4dv_instance.extracted_attributes:
                if self.nl4dv_instance.extracted_attributes[attr]['queryPhrase'][0] == phrase:
                    if chosen_attr == attr:
                        new_extracted_attr[chosen_attr] = self.nl4dv_instance.extracted_attributes[attr]
                else:
                    new_extracted_attr[attr] = self.nl4dv_instance.extracted_attributes[attr]
            self.nl4dv_instance.extracted_attributes = new_extracted_attr
            phrase_dict = self.nl4dv_instance.keyword_attribute_mapping[phrase]
            for attr in list(phrase_dict.keys()):
                if attr != chosen_attr:
                    del phrase_dict[attr]
            self.nl4dv_instance.keyword_attribute_mapping[phrase] = phrase_dict

            for attr in list(self.nl4dv_instance.attribute_keyword_mapping.keys()):
                if attr != chosen_attr:
                    query_phrase = list(self.nl4dv_instance.attribute_keyword_mapping[attr].keys())[0]
                    if query_phrase == phrase:
                        del self.nl4dv_instance.attribute_keyword_mapping[attr]


    def update_value_ambiguity(self):
        ambiguous_phrases = list(self.nl4dv_instance.ambiguities['value'].keys())
        chosen_values = list()
        for phrase in ambiguous_phrases:
            chosen_val = self.nl4dv_instance.ambiguities['value'][phrase]['selected']
            task_filter = self.task_map['filter']
            for index in range(0, len(task_filter)):
                if phrase in task_filter[index]['queryPhrase']:
                    chosen_values.append(chosen_val)
                    task_filter[index]['values'] = chosen_values
                else:
                    chosen_values = list()



    def auto_handle_attribute_ambiguity(self):
        self.nl4dv_instance.past_ambiguities_copy = self.nl4dv_instance.past_ambiguities.copy()
        attribute_ambiguity = self.nl4dv_instance.past_ambiguities['attribute']
        for query_phrase in attribute_ambiguity:
            if not attribute_ambiguity[query_phrase]['selected']:
                attr_list = attribute_ambiguity[query_phrase]['options']
                attr_keep = attr_list[0]
                attr_confidence = self.nl4dv_instance.past_extracted_attributes[attr_keep]['meta']['confidence']
                for attr in attr_list:
                    confidence = self.nl4dv_instance.past_extracted_attributes[attr]['meta']['confidence']
                    if confidence > attr_confidence:
                        attr_confidence = confidence
                        attr_keep = attr
                self.nl4dv_instance.past_ambiguities['attribute'][query_phrase]['selected'] = attr_keep

        ambiguous_phrases = list(self.nl4dv_instance.past_ambiguities['attribute'].keys())
        for phrase in ambiguous_phrases:
            if self.nl4dv_instance.past_ambiguities['attribute'][phrase]['selected']:
                chosen_attr = self.nl4dv_instance.past_ambiguities['attribute'][phrase]['selected']
                new_extracted_attr = dict()
                for attr in self.nl4dv_instance.past_extracted_attributes:
                    if self.nl4dv_instance.past_extracted_attributes[attr]['queryPhrase'][0] == phrase:
                        if chosen_attr == attr:
                            new_extracted_attr[chosen_attr] = self.nl4dv_instance.past_extracted_attributes[attr]
                    else:
                        new_extracted_attr[attr] = self.nl4dv_instance.past_extracted_attributes[attr]
                self.nl4dv_instance.past_extracted_attributes = new_extracted_attr

                for attr in list(self.nl4dv_instance.past_attribute_keyword_mapping.keys()):
                    if attr != chosen_attr:
                        query_phrase = list(self.nl4dv_instance.past_attribute_keyword_mapping[attr].keys())[0]
                        if query_phrase == phrase:
                            del self.nl4dv_instance.past_attribute_keyword_mapping[attr]
                self.nl4dv_instance.past_ambiguities['attribute'][phrase]['selected'] = 'NL4DV_Resolved'







