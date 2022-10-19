from nl4dv.utils import constants, helpers
import re
import nltk
from nltk import word_tokenize
from si_prefix import si_parse
import random

class ConversationGenie:
    def __init__(self, nl4dv_instance):
        self.nl4dv_instance = nl4dv_instance
        self.key_num = 0
        self.most_recent_dialog_id = list()
        self.most_recent_query_id = list()
        self.all_dialogs = dict()
        self.branches = dict()

    def add_dialog(self, nl4dv_output, dialog = None, dialog_id = None, query_id = None):
        if dialog is None:
            if dialog_id is not None:
                raise RuntimeError("Dialog is false but conversation id given")
            if query_id is not None:
                raise RuntimeError("Dialog is false but context id given")
            key_str = str(self.key_num)
            self.all_dialogs[key_str] = list()
            self.all_dialogs[key_str].append(nl4dv_output)
            davo = str(self.key_num)
            self.key_num += 1
            self.branches[str(davo)] = 0
            self.most_recent_dialog_id.append(davo)
            self.most_recent_query_id.append(str(0))
            return (davo, str(0))
        else:
            if dialog_id is not None:
                if query_id is not None:
                    if not isinstance(query_id, str):
                        raise RuntimeError("Context id must be of type string")
                    query_id = int(query_id)
                    if query_id == (len(self.all_dialogs[dialog_id]) - 1):
                        self.all_dialogs[dialog_id].append(nl4dv_output)
                        return (dialog_id, str(len(self.all_dialogs[dialog_id]) - 1))
                    else:
                        key_str = str(dialog_id) + "." + str(query_id) + "." + str(self.branches[dialog_id])
                        self.all_dialogs[key_str] = list()
                        self.all_dialogs[key_str].append(self.all_dialogs[dialog_id][query_id])
                        self.all_dialogs[key_str].append(nl4dv_output)
                        davo = key_str
                        self.branches[dialog_id] += 1
                        self.branches[key_str] = 0
                        self.most_recent_dialog_id.append(davo)
                        self.most_recent_query_id.append(str(1))
                        return (davo, "1")
                else:
                    self.all_dialogs[dialog_id].append(nl4dv_output)
                    self.most_recent_dialog_id.append(dialog_id)
                    self.most_recent_query_id.append(str(len(self.all_dialogs[dialog_id]) - 1))
                    return (dialog_id, str(len(self.all_dialogs[dialog_id]) - 1))
            else:
                if query_id is None:
                    key_str = str(self.key_num - 1)

                    self.all_dialogs[key_str].append(nl4dv_output)

                    davo = key_str

                    self.most_recent_dialog_id.append(davo)
                    self.most_recent_query_id.append(str(len(self.all_dialogs[key_str]) - 1))
                    return (davo, str(len(self.all_dialogs[key_str]) - 1))
                else:
                    raise RuntimeError("Dialog is true and context id given but not conversation id")

    def delete_dialogs(self, dialog_id=None, query_id = None):
        # if context id is not None then delete context id and everything after
        if dialog_id is None and query_id is None:
            self.all_dialogs = dict()
            self.branches = dict()
            self.key_num = 0
            return
        elif query_id is None:
            del self.all_dialogs[dialog_id]
            for i in list(self.all_dialogs.keys()):
                if i[:len(dialog_id)] == dialog_id:
                    del self.all_dialogs[dialog_id]
            return
        elif query_id is not None and dialog_id is None:
            raise RuntimeError("Query id given but not Dialog id")
        else:
            if not isinstance(query_id, str):
                raise RuntimeError("Context id must be of type string")
            query_id = int(query_id)
            if dialog_id in self.all_dialogs.keys():
                self.all_dialogs[dialog_id] = self.all_dialogs[dialog_id][:query_id]
            followup_str = str(dialog_id) + "." + str(query_id)
            for i in list(self.all_dialogs.keys()):
                if followup_str == i[:len(followup_str)]:
                    del self.all_dialogs[i]
        return

    def undo(self):
        if not bool(self.all_dialogs):
            return
        recent_dialog_id = self.most_recent_dialog_id[-1]

        recent_query_id = self.most_recent_query_id[-1]

        context_obj = self.all_dialogs[recent_dialog_id][int(recent_query_id)]
        del self.all_dialogs[recent_dialog_id][int(recent_query_id)]
        return context_obj

    def rename_dialog(self, dialog_id, new_name):
        davo = self.all_dialogs[dialog_id]
        self.all_dialogs[new_name] = davo
        del self.all_dialogs[dialog_id]

    def update_query(self, dialog_id, query_id, output):
        if not isinstance(query_id, str):
                raise RuntimeError("Context id must be of type string")
        query_id = int(query_id)
        self.all_dialogs[dialog_id][query_id] = output

    def list_dialogs(self):
        return list(self.all_dialogs.keys())

    def list_all_queries_for_dialog(self, dialog_id):
        return self.all_dialogs[dialog_id]

    def list_all_queries(self):
        return self.all_dialogs

    def get_dialogs(self, dialog_id=None, query_id=None):
        if dialog_id is None and query_id is None:
            return self.all_dialogs
        elif dialog_id is not None and query_id is None:
            return self.all_dialogs[dialog_id]
        elif query_id is not None and dialog_id is None:
            raise RuntimeError("Query id given but not Dialog id")
        else:
            if not isinstance(query_id, str):
                raise RuntimeError("Context id must be of type string")
            query_id = int(query_id)
            return self.all_dialogs[dialog_id][query_id]

    def followup_conversation_attribute(self, extracted_attributes, past_extracted_attributes, attribute_keyword_mapping, past_attribute_keyword_mapping, task_map):
        copy_past = past_extracted_attributes.copy()
        copy_past2 = past_attribute_keyword_mapping.copy()
        for i in extracted_attributes.keys():
            if extracted_attributes[i]['meta']['followup_type'] == 'add':
                copy_past[i] = extracted_attributes[i]
                copy_past2[i] = attribute_keyword_mapping[i]
            elif extracted_attributes[i]['meta']['followup_type'] == 'remove':
                if i in copy_past.keys():
                    del copy_past[i]
                    del copy_past2[i]
                else:
                    helpers.cond_print("Key not found in past query")
                    if 'attribute_domain_value_match' in extracted_attributes[i]['metric']:
                        copy_past[i] = extracted_attributes[i]
                        copy_past2[i] = attribute_keyword_mapping[i]
            elif extracted_attributes[i]['meta']['followup_type'] == 'replace_to_add':
                attr = None
                for j in copy_past.keys():
                    if j in extracted_attributes.keys():
                        if extracted_attributes[j]['meta']['followup_type'] == 'replace_to_remove':
                            attr = j
                if attr in copy_past.keys():
                    del copy_past[attr]
                    del copy_past2[attr]
                else:
                    helpers.cond_print("Key not found in past query")
                copy_past[i] = extracted_attributes[i]
                copy_past2[i] = attribute_keyword_mapping[i]
            elif extracted_attributes[i]['meta']['followup_type'] == 'replace_to_remove':
                helpers.cond_print("Not going to do operation with to_remove")
                continue
            elif extracted_attributes[i]['meta']['followup_type'] == 'nothing':
                continue
            elif extracted_attributes[i]['meta']['followup_type'] == 'remove_only':
                if 'filter' not in task_map.keys():
                    copy_past_copy = dict()
                    copy_past2_copy = dict()
                    for j in copy_past.keys():
                        if j == i:
                            copy_past_copy[j] = extracted_attributes[i]
                            copy_past2_copy[j] = extracted_attributes[i]
                    copy_past = copy_past_copy
                    copy_past2 = copy_past2_copy
        return copy_past, copy_past2


    def get_followuptype_attribute_from_dependencies(self, dependencies):
        encodeable_attributes = self.nl4dv_instance.attribute_genie_instance.get_encodeable_attributes()
        # Initialize the output
        task_map = dict()
        operator = None
        _attributes = dict()
        keyword, operator_phrase = None, None
        if dependencies is not None:
            for dep_index, dep in enumerate(dependencies[0]):
                # OPTIONAL:
                if dep[1] in ['dobj', 'xcomp', 'amod']:
                    if dep[0][0] in self.nl4dv_instance.special_keyword_map_for_tasks and dep[2][0] in self.nl4dv_instance.followup_keyword_map:
                        operator_phrase = dep[2][0]
                        keyword = dep[0][0]

                    if dep[2][0] in self.nl4dv_instance.special_keyword_map_for_tasks and dep[0][0] in self.nl4dv_instance.followup_keyword_map:
                        operator_phrase = dep[0][0]
                        keyword = dep[2][0]
                if keyword is not None and operator_phrase is not None:
                    followup_type = self.nl4dv_instance.followup_keyword_map[operator_phrase][0][0]
                    # These tasks requires at most 1 Attribute to make sense
                    if followup_type in ["addition", "removal"]:
                        operator = self.nl4dv_instance.followup_keyword_map[operator_phrase][0][1]
                        _keyword = self.nl4dv_instance.special_keyword_map_for_tasks[keyword]
                        _attributes_list = list(self.nl4dv_instance.keyword_attribute_mapping[_keyword].keys())
                        for attribute_key in _attributes_list:
                            if followup_type in ['removal']:
                                _attributes[attribute_key] = 'remove'
                            elif followup_type in ['addition']:
                                _attributes[attribute_key] = 'add'
                    keyword, operator_phrase = None, None
            k1, k2, operator_phrase = None, None, None
            for dep_index, dep in enumerate(dependencies[0]):
                if dep[1] in ['dobj', 'xcomp']:
                    if dep[0][0] in self.nl4dv_instance.special_keyword_map_for_tasks and dep[2][0] in self.nl4dv_instance.followup_keyword_map:
                        operator_phrase = dep[2][0]
                        k1 = dep[0][0]
                    if dep[2][0] in self.nl4dv_instance.special_keyword_map_for_tasks and dep[0][0] in self.nl4dv_instance.followup_keyword_map:
                        operator_phrase = dep[0][0]
                        k1 = dep[2][0]

                if dep[1] in ['nmod', 'case']:
                    if dep[0][0] in self.nl4dv_instance.special_keyword_map_for_tasks and dep[2][0] in self.nl4dv_instance.special_keyword_map_for_tasks and k1 == dep[0][0]:
                        k2 = dep[2][0]
                    if dep[0][0] in self.nl4dv_instance.special_keyword_map_for_tasks and dep[2][1] in ["IN"]:
                        k2 = dep[0][0]

                if k1 is not None and operator_phrase is not None and k2 is not None:
                    _k1 = self.nl4dv_instance.special_keyword_map_for_tasks[k1]
                    _k2 = self.nl4dv_instance.special_keyword_map_for_tasks[k2]
                    followup_type = self.nl4dv_instance.followup_keyword_map[operator_phrase][0][0]
                    # These tasks requires at most 1 Attribute to make sense
                    if followup_type in ["replacement"]:
                        relevant_attributes = []
                        operator = self.nl4dv_instance.followup_keyword_map[operator_phrase][0][1]
                        for k in [_k1, _k2]:
                            if k in self.nl4dv_instance.keyword_attribute_mapping:
                                relevant_attributes.extend(list(self.nl4dv_instance.keyword_attribute_mapping[k].keys()))
                                #DEBUG ELIF: WILL IT EVER BE CALLED?
                            elif self.nl4dv_instance.porter_stemmer_instance.stem(k) in self.nl4dv_instance.keyword_attribute_mapping:
                                relevant_attributes.extend(list(self.nl4dv_instance.keyword_attribute_mapping[self.nl4dv_instance.porter_stemmer_instance.stem(k)].keys()))
                        _attributes[list(self.nl4dv_instance.keyword_attribute_mapping[_k1].keys())[0]] = "replace_to_remove"
                        _attributes[list(self.nl4dv_instance.keyword_attribute_mapping[_k2].keys())[0]] = "replace_to_add"
                    k1, k2, operator_phrase = None, None, None
            if operator is None:
                operator, _attributes = self.get_implicit_followuptype_attribute_from_dependencies(dependencies)
        return [operator, _attributes]


    def get_followuptype_task_from_dependencies(self, dependencies, query_ngrams):
        encodeable_attributes = self.nl4dv_instance.attribute_genie_instance.get_encodeable_attributes()
        # Initialize the output
        task_map = dict()
        # Infer Tasks from the EXPLICIT
        keyword, operator_phrase = None, None
        for dep_index, dep in enumerate(dependencies[0]):
            # OPTIONAL:
            if dep[1] in ['amod', 'nsubj', 'nmod', 'dobj', 'compound', 'dep']:
                if dep[0][0] in self.nl4dv_instance.special_keyword_map_for_tasks and dep[2][0] in self.nl4dv_instance.task_keyword_map:
                    operator_phrase = dep[2][0]
                    keyword = dep[0][0]

                if dep[2][0] in self.nl4dv_instance.special_keyword_map_for_tasks and dep[0][0] in self.nl4dv_instance.task_keyword_map:
                    operator_phrase = dep[0][0]
                    keyword = dep[2][0]

            if operator_phrase is not None and keyword is not None:
                task = self.nl4dv_instance.task_keyword_map[operator_phrase][0][0]
                if task not in task_map:
                    task_map[task] = list()
                # These tasks requires at most 1 Attribute to make sense
                if task in ["derived_value", "find_extremum", "sort"]:
                    operator = self.nl4dv_instance.task_keyword_map[operator_phrase][0][1]
                    final_followup_type, final_followup_token = None, None

                    if task == "sort":
                        for ngram in query_ngrams:
                            if ngram in self.nl4dv_instance.task_keyword_map:
                                if self.nl4dv_instance.task_keyword_map[ngram][0][0] == "sort":
                                    operator = self.nl4dv_instance.task_keyword_map[ngram][0][1]

                    for ngram in query_ngrams:
                        if ngram in self.nl4dv_instance.followup_keyword_map:
                            final_followup_type = self.nl4dv_instance.followup_keyword_map[ngram][0][1]

                    if final_followup_type is None:
                        if task not in self.nl4dv_instance.past_extracted_tasks:
                            final_followup_type = 'add'
                        else:
                            final_followup_type = 'nothing'

                    _keyword = self.nl4dv_instance.special_keyword_map_for_tasks[keyword]
                    _attributes = list(self.nl4dv_instance.keyword_attribute_mapping[_keyword].keys())
                    _tasks = self.nl4dv_instance.task_genie_instance.generate_tasks(task_name=task,
                                                 attributes=_attributes,
                                                 operator_phrase=operator_phrase,
                                                 query_phrase=[_keyword],
                                                 operator=operator,
                                                 values=[],
                                                 inference_type='explicit',
                                                 followup_type=final_followup_type,
                                                 allow_subset=False
                                                 )
                    for _task in _tasks:
                        if _task not in task_map[task]:
                            task_map[task].append(_task)
                keyword, operator_phrase = None, None

        keyword, amount, operator_phrase, has_negation, negation_phrase = None, None, None, False, None
        for dep_index, dep in enumerate(dependencies[0]):

            if dep[0][0] in self.nl4dv_instance.special_keyword_map_for_tasks and dep[2][1] == 'CD':
                keyword = dep[0][0]
                amount = dep[2][0]

            if dep[2][0] in self.nl4dv_instance.special_keyword_map_for_tasks and dep[0][1] == 'CD':
                keyword = dep[2][0]
                amount = dep[0][0]

            if dep[0][0] in self.nl4dv_instance.special_keyword_map_for_tasks and dep[2][0] in self.nl4dv_instance.task_keyword_map and dep[1] == "neg":
                has_negation = True
                negation_phrase = dep[2][0]

            if dep[2][0] in self.nl4dv_instance.special_keyword_map_for_tasks and dep[0][0] in self.nl4dv_instance.task_keyword_map and dep[1] == "neg":
                has_negation = True
                negation_phrase = dep[0][0]

            if dep[0][0] in self.nl4dv_instance.special_keyword_map_for_tasks and dep[2][0] in self.nl4dv_instance.task_keyword_map:
                operator_phrase = dep[2][0]
                keyword = dep[0][0]

            if dep[2][0] in self.nl4dv_instance.special_keyword_map_for_tasks and dep[0][0] in self.nl4dv_instance.task_keyword_map:
                operator_phrase = dep[0][0]
                keyword = dep[2][0]

            if dep[0][1] == 'CD' and dep[2][0] in self.nl4dv_instance.task_keyword_map:
                operator_phrase = dep[2][0]
                amount = dep[0][0]

            if dep[2][1] == 'CD' and dep[0][0] in self.nl4dv_instance.task_keyword_map:
                operator_phrase = dep[0][0]
                amount = dep[2][0]

            if dep[0][1] == "CD" and dep[2][0] in self.nl4dv_instance.task_keyword_map and dep[1] == "neg":
                has_negation = True
                negation_phrase = dep[2][0]

            if dep[2][1] == "CD" and dep[0][0] in self.nl4dv_instance.task_keyword_map and dep[1] == "neg":
                has_negation = True
                negation_phrase = dep[0][0]

            if keyword is not None and amount is not None and operator_phrase is not None:
                if self.nl4dv_instance.task_keyword_map[operator_phrase][0][0] == "filter" and operator_phrase != "between":
                    operator = self.nl4dv_instance.task_keyword_map[operator_phrase][0][1]
                    if has_negation:
                        if operator == "GT":
                            operator = "LT"
                        elif operator == "LT":
                            operator = "GT"
                        operator_phrase = negation_phrase + " " + operator_phrase

                    task = 'filter'
                    if task not in task_map:
                        task_map[task] = list()

                    _keyword = self.nl4dv_instance.special_keyword_map_for_tasks[keyword]
                    _attributes = list(self.nl4dv_instance.keyword_attribute_mapping[_keyword].keys())
                    _value = self.nl4dv_instance.task_genie_instance.get_attributes_values(_attributes[0], amount)
                    _tasks = self.nl4dv_instance.task_genie_instance.generate_tasks(task_name=task,
                                                 attributes=_attributes,
                                                 operator_phrase=operator_phrase,
                                                 query_phrase=[_keyword],
                                                 operator=operator,
                                                 values=[_value],
                                                 inference_type='explicit',
                                                 followup_type = 'nothing',
                                                 allow_subset=False)

                    for _task in _tasks:
                        if _task not in task_map[task]:
                            task_map[task].append(_task)

                    keyword, amount, operator_phrase, has_negation, negation_phrase = None, None, None, False, None

        # Case 3: Numeric + Temporal FILTERS e.g '...between 5 and 10', '...between 2017/12/1 and 2018/1/1'
        keyword, from_amount, to_amount, operator_phrase, has_negation, negation_phrase = None, None, None, None, False, None
        for dep_index, dep in enumerate(dependencies[0]):
            if dep[0][1] == 'CD' and dep[1] == 'conj' and dep[2][1] == 'CD':
                from_amount = dep[0][0]
                to_amount = dep[2][0]

            if dep[0][1] == 'CD' and dep[2][0] in self.nl4dv_instance.special_keyword_map_for_tasks:
                keyword = dep[2][0]

            if dep[2][1] == 'CD' and dep[0][0] in self.nl4dv_instance.special_keyword_map_for_tasks:
                keyword = dep[0][0]


            if dep[0][1] == "CD" and dep[2][0] in self.nl4dv_instance.task_keyword_map and dep[1] == "neg":
                has_negation = True
                negation_phrase = dep[2][0]

            if dep[2][1] == "CD" and dep[0][0] in self.nl4dv_instance.task_keyword_map and dep[1] == "neg":
                has_negation = True
                negation_phrase = dep[0][0]

            if dep[0][1] == 'CD' and dep[2][0] in self.nl4dv_instance.task_keyword_map:
                operator_phrase = dep[2][0]

            if dep[2][1] == 'CD' and dep[0][0] in self.nl4dv_instance.task_keyword_map:
                operator_phrase = dep[0][0]

            if keyword is not None and from_amount is not None and to_amount is not None and operator_phrase is not None:
                if self.nl4dv_instance.task_keyword_map[operator_phrase][0][0] == "filter" and operator_phrase == "between":
                    operator = self.nl4dv_instance.task_keyword_map[operator_phrase][0][1]
                    if has_negation:
                        # NOT RANGE
                        operator = "NOT" + " " + operator
                        operator_phrase = negation_phrase + " " + operator_phrase

                    task = 'filter'
                    if task not in task_map:
                        task_map[task] = list()

                    _keyword = self.nl4dv_instance.special_keyword_map_for_tasks[keyword]
                    _attributes = list(self.nl4dv_instance.keyword_attribute_mapping[_keyword].keys())
                    _from_value = self.nl4dv_instance.task_genie_instance.get_attributes_values(_attributes[0], from_amount)
                    _to_value = self.nl4dv_instance.task_genie_instance.get_attributes_values(_attributes[0], to_amount)
                    _tasks = self.nl4dv_instance.task_genie_instance.generate_tasks(task_name=task,
                                                 attributes=_attributes,
                                                 operator_phrase=operator_phrase,
                                                 query_phrase=[_keyword],
                                                 operator=operator,
                                                 values=[_from_value, _to_value],
                                                 inference_type='explicit',
                                                 followup_type = 'nothing',
                                                 allow_subset=False)

                    for _task in _tasks:
                        if _task not in task_map[task]:
                            task_map[task].append(_task)

                    keyword, amount, operator_phrase, has_negation, negation_phrase = None, None, None, False, None
        if not task_map:
            final_followup_type = None
            _attributes = None
            operator_phrase = None
            operator = None
            ambiguity = []
            for ngram in query_ngrams:
                if ngram in self.nl4dv_instance.task_keyword_map:
                    if self.nl4dv_instance.task_keyword_map[ngram][0][0] in ["sort", "derived_value", "find_extremum"]:
                        ngram_flag = True
                        for key in self.nl4dv_instance.extracted_attributes.keys():
                            if ngram in key.lower():
                                ngram_flag = False
                        if ngram_flag:
                            operator = self.nl4dv_instance.task_keyword_map[ngram][0][1]
                            operator_phrase = ngram
                    if ngram in self.nl4dv_instance.followup_keyword_map:
                        final_followup_type = self.nl4dv_instance.followup_keyword_map[ngram][0][1]

                    if operator is not None and operator_phrase is not None:
                        task = self.nl4dv_instance.task_keyword_map[operator_phrase][0][0]
                        if task not in task_map:
                            task_map[task] = list()
                        if final_followup_type is None:
                            if task not in self.nl4dv_instance.past_extracted_tasks:
                                final_followup_type = 'add'
                            else:
                                final_followup_type = 'nothing'
                        q_attr = list()
                        for attr in self.nl4dv_instance.extracted_attributes.keys():
                            if self.nl4dv_instance.extracted_attributes[attr]['meta']['dataType'] == 'Q':
                                q_attr.append(attr)
                        if len(q_attr) == 1:
                            _attributes = q_attr
                        if _attributes is not None:
                            _tasks = self.nl4dv_instance.task_genie_instance.generate_tasks(task_name=task,
                                                                 attributes=_attributes,
                                                                 operator_phrase=operator_phrase,
                                                                 query_phrase=[],
                                                                 operator=operator,
                                                                 values=[],
                                                                 inference_type='explicit',
                                                                 followup_type=final_followup_type,
                                                                 allow_subset=False
                                                                 )
                        for _task in _tasks:
                                if _task not in task_map[task]:
                                    task_map[task].append(_task)
        return task_map

    def implicit_replacement(self, followup_dict, past_attributes):
        operator, attributes = followup_dict[0], followup_dict[1]
        key_to_remove = None
        if len(past_attributes.keys()) == 1:
            key_to_remove = list(past_attributes.keys())[0]
            attributes[key_to_remove] = "replace_to_remove"
        else:
            key_to_remove = random.choice(list(past_attributes))
            attributes[key_to_remove] = "replace_to_remove"
        return key_to_remove, [operator, attributes]


    def followup_conversation_task(self, task_map, past_task_map):
        copy_past = past_task_map.copy()
        new_copy_past = dict()
        for i in task_map.keys():
            if i in copy_past:
                past_task_list = copy_past[i]
                new_task_list = task_map[i]
                result = []
                if i == "sort":
                    for task in new_task_list:
                        if task["followup_type"] != "remove":
                            result = new_task_list
                elif i == "derived_value":
                    derived_value_list = list()
                    for task in new_task_list:
                        for past_task in past_task_list:
                            if past_task["operator"] != task["operator"] and set(task["attributes"]) == set(past_task["attributes"]) and task["followup_type"] != 'remove':
                                derived_value_list.append(dict(task))
                    copy_past[i] = derived_value_list
                elif i == "find_extremum":
                    find_extremum_list = list()
                    for task in new_task_list:
                        for past_task in past_task_list:
                            if past_task["operator"] != task["operator"] and set(task["attributes"]) == set(past_task["attributes"]) and task["followup_type"] != 'remove':
                                find_extremum_list.append(dict(task))
                    copy_past[i] = find_extremum_list
                else:
                    past_task_list.extend(new_task_list)
                    for task in past_task_list:
                        if task not in result:
                            result.append(task)
                    copy_past[i] = result
            else:
                copy_past[i] = task_map[i]
        for i in copy_past.keys():
            flag = True
            for task in copy_past[i]:
                if task['inferenceType'] == 'implicit':
                    flag = False

            if flag:
                new_copy_past[i] = copy_past[i]

        return new_copy_past

    def get_implicit_followuptype_attribute_from_dependencies(self, dependencies):
        encodeable_attributes = self.nl4dv_instance.attribute_genie_instance.get_encodeable_attributes()

        # Initialize the output
        task_map = dict()
        operator = None
        _attributes = dict()
        implicit_keyword = None

        if dependencies is not None:
            for dep_index, dep in enumerate(dependencies[0]):
                if dep[0][0] in self.nl4dv_instance.special_keyword_map_for_followup.keys():
                    if operator is None or operator == "add":
                        operator = self.nl4dv_instance.special_keyword_map_for_followup[dep[0][0]]
                        implicit_keyword = dep[0][0]
                elif dep[2][0] in self.nl4dv_instance.special_keyword_map_for_followup.keys():
                    if operator is None or operator == "add":
                        operator = self.nl4dv_instance.special_keyword_map_for_followup[dep[2][0]]
                        implicit_keyword = dep[2][0]

            if operator == "remove":
                keyword = None
                for dep_index, dep in enumerate(dependencies[0]):
                    if dep[1] in ['advmod', 'xcomp', 'nmod', 'dobj']:
                        if dep[2][0] in self.nl4dv_instance.special_keyword_map_for_tasks:
                            keyword = dep[2][0]
                        elif dep[0][0] in self.nl4dv_instance.special_keyword_map_for_tasks:
                            keyword = dep[0][0]
                    if keyword is not None:
                        # These tasks requires at most 1 Attribute to make sense
                        _keyword = self.nl4dv_instance.special_keyword_map_for_tasks[keyword]
                        _attributes = list(self.nl4dv_instance.keyword_attribute_mapping[_keyword].keys())
                        davo = dict()
                        for attribute_key in _attributes:
                            if _keyword in attribute_key.lower() and operator in ['remove', 'remove_only'] and implicit_keyword == 'only':
                                davo[attribute_key] = 'remove_only'
                            else:
                                davo[attribute_key] = 'remove'
                        _attributes = davo
                keyword = None
            elif operator == "replace":
                k1, k2 = None, None
                for dep_index, dep in enumerate(dependencies[0]):
                    if dep[1] in ['compound', 'dobj']:
                        if dep[0][0] in self.nl4dv_instance.special_keyword_map_for_tasks and dep[2][0] in self.nl4dv_instance.special_keyword_map_for_followup:
                            k1 = dep[0][0]
                        if dep[2][0] in self.nl4dv_instance.special_keyword_map_for_tasks and dep[0][0] in self.nl4dv_instance.special_keyword_map_for_followup:
                            k1 = dep[2][0]
                for dep_index, dep in enumerate(dependencies[0]):
                    if dep[1] in ['amod', 'acl', 'nsubj']:
                        if dep[0][0] in self.nl4dv_instance.special_keyword_map_for_tasks:
                            k2 = dep[0][0]
                        if dep[2][0] in self.nl4dv_instance.special_keyword_map_for_tasks:
                            k2 = dep[2][0]
                for dep_index, dep in enumerate(dependencies[0]):
                    if dep[1] in ['amod', 'compound']:
                        if dep[0][0] in self.nl4dv_instance.special_keyword_map_for_tasks and dep[2][0] in self.nl4dv_instance.special_keyword_map_for_tasks:
                            k1 = dep[0][0]
                            k2 = dep[2][0]

                if k1 is not None and k2 is not None:
                    _k1 = self.nl4dv_instance.special_keyword_map_for_tasks[k1]
                    _k2 = self.nl4dv_instance.special_keyword_map_for_tasks[k2]

                    relevant_attributes = []
                    for k in [_k1, _k2]:
                        if k in self.nl4dv_instance.keyword_attribute_mapping:
                            relevant_attributes.extend(list(self.nl4dv_instance.keyword_attribute_mapping[k].keys()))
                        elif self.nl4dv_instance.porter_stemmer_instance.stem(k) in self.nl4dv_instance.keyword_attribute_mapping:
                            relevant_attributes.extend(list(self.nl4dv_instance.keyword_attribute_mapping[self.nl4dv_instance.porter_stemmer_instance.stem(k)].keys()))
                    davo = dict()
                    for attribute_key in relevant_attributes:
                        if _k1 in attribute_key.lower():
                            davo[attribute_key] = 'replace_to_remove'
                        elif _k2 in attribute_key.lower():
                            davo[attribute_key] = 'replace_to_add'
                    _attributes = davo

                    k1, k2 = None, None
                elif k2 is not None:
                    _k2 = self.nl4dv_instance.special_keyword_map_for_tasks[k2]
                    _attributes = list(self.nl4dv_instance.keyword_attribute_mapping[_k2].keys())
                    davo = dict()
                    for attribute_key in _attributes:
                        if attribute_key.lower() == _k2 and operator in ['replace']:
                            davo[attribute_key] = 'replace_to_add'
                    _attributes = davo
                    k2 = None
            elif operator == "add":
                keyword = None
                for dep_index, dep in enumerate(dependencies[0]):
                    if dep[1] in ['dobj', 'xcomp', 'amod', 'advmod']:
                            if dep[2][0] in self.nl4dv_instance.special_keyword_map_for_tasks:
                                keyword = dep[2][0]
                            elif dep[0][0] in self.nl4dv_instance.special_keyword_map_for_tasks:
                                keyword = dep[0][0]
                if keyword is not None:
                    # These tasks requires at most 1 Attribute to make sense
                    _keyword = self.nl4dv_instance.special_keyword_map_for_tasks[keyword]
                    _attributes = list(self.nl4dv_instance.keyword_attribute_mapping[_keyword].keys())
                    davo = dict()
                    for attribute_key in _attributes:
                        if _keyword in attribute_key.lower() and operator in ['add']:
                            davo[attribute_key] = 'add'
                    _attributes = davo
                keyword = None
        return [operator, _attributes]

    def followup_filter_task(self, task_map, past_task_map, query_ngrams):
        keyword = list()
        for ngram in query_ngrams:
            for filter_keyword in self.nl4dv_instance.filter_followup_keyword_map.keys():
                if query_ngrams[ngram]["lower"] == filter_keyword:
                    keyword.append(self.nl4dv_instance.filter_followup_keyword_map[filter_keyword][0])
        garbage = list()
        if 'filter' in task_map.keys():
            task_filter_copy = list()
            task_filter = task_map['filter']
            if 'filter' not in past_task_map.keys():
                if 'remove_addition' in keyword:
                    val_list = list()
                    for filter_curr in task_filter:
                        if filter_curr['operator'] == 'LT':
                            filter_curr['operator'] = 'GT'
                        elif filter_curr['operator'] == 'GT':
                            filter_curr['operator'] = 'LT'
                        elif filter_curr['operator'] == 'RANGE':
                            filter_curr['operator'] = 'NOT RANGE'

                        else:
                            filter_curr_val = filter_curr['values']
                            val_list += filter_curr_val
                            domain_values = list(self.nl4dv_instance.data_genie_instance.data_attribute_map[filter_curr['attributes'][0]]['domain'])
                            inclusion_list = list()
                            for val in domain_values:
                                if val not in val_list:
                                    inclusion_list.append(val)
                            filter_curr['values'] = inclusion_list
                if "add_ambiguous" in keyword:
                    task_map['filter'][0]['ambiguity'] = ['add_or_remove']
                past_task_map.update(task_map)
                return past_task_map
            else:
                past_task_filter = past_task_map['filter']
                task_filter_copy = list()
                if 'remove_addition' in keyword:
                    val_list = list()

                    for filter_curr in task_filter:
                        if filter_curr['operator'] == 'LT':
                            filter_curr['operator'] = 'GT'
                        elif filter_curr['operator'] == 'GT':
                            filter_curr['operator'] = 'LT'
                        elif filter_curr['operator'] == 'RANGE':
                            filter_curr['operator'] = 'NOT RANGE'
                        else:
                            filter_curr_val = filter_curr['values']
                            val_list += filter_curr_val
                            domain_values = list(self.nl4dv_instance.data_genie_instance.data_attribute_map[filter_curr['attributes'][0]]['domain'])
                            inclusion_list = list()
                            for val in domain_values:
                                if val not in val_list:
                                    inclusion_list.append(val)
                            filter_curr["values"] = inclusion_list
                if 'remove' in keyword:
                    del past_task_map['filter']
                    return past_task_map
                for filter_curr in task_filter:
                    attributes = filter_curr['attributes'][0]
                    index = None
                    for past_filter_ind in range(0, len(past_task_filter)):
                        if attributes == past_task_filter[past_filter_ind]['attributes'][0]:
                            index = past_filter_ind
                    if index is not None and "add" not in keyword and "remove_addition" not in keyword:
                        if filter_curr['values'] != past_task_filter[index]['values']:
                            replacement_vals = list()
                            for val in filter_curr['values']:
                                if val not in past_task_filter[index]['values']:
                                    replacement_vals.append(val)
                            filter_curr["values"] = replacement_vals
                            garbage.append(past_task_filter[index])
                            past_task_filter[index] = filter_curr
                            past_task_map['filter'] = past_task_filter
                    elif index is not None and "add" in keyword:
                        if "add_ambiguous" in keyword:
                            past_task_filter[index]['ambiguity'] = ['add_or_remove']
                        past_task_filter[index]['queryPhrase'] += filter_curr['queryPhrase']
                        past_task_filter[index]['values'] += filter_curr['values']
                        past_task_map['filter'] = past_task_filter
                    elif index is not None and "remove_addition" in keyword:
                        past_task_filter[index]['queryPhrase'] += filter_curr['queryPhrase']
                        intersection_list = list(set(past_task_filter[index]['values']).intersection(filter_curr['values']))
                        past_task_filter[index]['values'] = intersection_list
                    elif index is None:
                        past_task_filter.append(filter_curr)
                        past_task_map['filter'] = past_task_filter
                return past_task_map
        else:
            if 'remove' in keyword:
                del past_task_map['filter']
            return past_task_map

    def remove_old_tasks(self, task_map):
        for task_key in task_map:
            new_task_list = []
            for task in task_map[task_key]:
                preservation = True
                for attr in task['attributes']:
                    if attr not in self.nl4dv_instance.extracted_attributes:
                        preservation = False
                if preservation:
                    new_task_list.append(task)
            task_map[task_key] = new_task_list
        return task_map

    def merge_update(self, past_extracted_attributes, extracted_attributes, past_attribute_keyword_mapping, attribute_keyword_mapping):
        for i in past_extracted_attributes.keys():
            if i not in extracted_attributes.keys():
                extracted_attributes[i] = past_extracted_attributes[i]
            else:
                continue
        for i in past_attribute_keyword_mapping.keys():
            if i not in attribute_keyword_mapping.keys():
                attribute_keyword_mapping[i] = past_attribute_keyword_mapping[i]
            else:
                continue
        return extracted_attributes, attribute_keyword_mapping











    #create global list of objects and dictionary of lists, so dictionary of lists has elements, and the elements are the indices in the global list

    #tree vs adjacency list for NL4DV (what operations do we want to support, add, remove, get, modify)

    #pick one task (add attribute, and implicit task)









