from nl4dv.utils import constants, helpers
import re
import nltk
from nltk import word_tokenize
from si_prefix import si_parse
from nl4dv.querygenie import QueryGenie
from nl4dv.attributegenie import AttributeGenie
from nl4dv.taskgenie import TaskGenie
from nl4dv.visgenie import VisGenie

class AutoGenie:
    def __init__(self, nl4dv_instance):
        self.nl4dv_instance = nl4dv_instance
        self.dialog = False

    def analyze_followup_status(self, query, reserve_words, ignore_words):
        self.query_raw = query
        self.dialog = False

        self.query_processed = self.nl4dv_instance.query_genie_instance.process_query(self.query_raw)
        self.special_keyword_map_for_followup = dict()
        for k,v in self.nl4dv_instance.implicit_followup_keyword_map.items():
            if k in self.query_processed:
                self.query_processed = self.query_processed.replace(k, v[0][0])
                self.special_keyword_map_for_followup[v[0][0]] = [v[0][1], v[0][2]]
        reserve_words = self.nl4dv_instance.reserve_words
        ignore_words = self.nl4dv_instance.ignore_words


        self.query_tokens = self.nl4dv_instance.query_genie_instance.clean_query_and_get_query_tokens(self.query_processed, reserve_words, ignore_words, dialog=True)
        query_ngrams = self.nl4dv_instance.query_genie_instance.get_query_ngrams(' '.join(self.query_tokens))
        ngram_set = set()
        for ngram in query_ngrams:
            ngram_set.add(ngram)
            if query_ngrams[ngram]["lower"] in self.nl4dv_instance.followup_keyword_map:
                self.dialog = True
                return self.dialog, "high"
            elif query_ngrams[ngram]["lower"] in self.special_keyword_map_for_followup:
                ambiguity = self.special_keyword_map_for_followup[query_ngrams[ngram]["lower"]][1]
                if ambiguity == 'not ambiguous':
                    self.dialog = True
                    return self.dialog, "high"
                else:
                    for ngram_sub in query_ngrams:
                        if ngram_sub not in ngram_set:
                            if query_ngrams[ngram_sub]["lower"] in self.nl4dv_instance.followup_keyword_map:
                                self.dialog = True
                                return self.dialog, "high"
                            elif query_ngrams[ngram_sub]["lower"] in self.special_keyword_map_for_followup:
                                ambiguity = self.special_keyword_map_for_followup[query_ngrams[ngram_sub]["lower"]][1]
                                if ambiguity == 'not ambiguous':
                                    self.dialog = True
                                    return self.dialog, "high"
                    followup_type = self.special_keyword_map_for_followup[query_ngrams[ngram]["lower"]][0]
                    self.nl4dv_instance.extracted_attributes = self.nl4dv_instance.attribute_genie_instance.extract_attributes(query_ngrams)
                    self.nl4dv_instance.query_for_task_inference = self.nl4dv_instance.task_genie_instance.prepare_query_for_task_inference(self.query_processed)
                    self.nl4dv_instance.extracted_vis_type, self.nl4dv_instance.extracted_vis_token = self.nl4dv_instance.vis_genie_instance.extract_vis_type(query_ngrams)

                    self.nl4dv_instance.dependencies = self.nl4dv_instance.task_genie_instance.create_dependency_tree(self.nl4dv_instance.query_for_task_inference)
                    task_map = self.nl4dv_instance.task_genie_instance.extract_explicit_tasks_from_dependencies(self.nl4dv_instance.dependencies)
                    # Filters from Domain Values
                    task_map = self.nl4dv_instance.task_genie_instance.extract_explicit_tasks_from_domain_value(task_map)

                    # From the generated TaskMap, ensure that the task "keys" are NOT EMPTY LISTS
                    self.nl4dv_instance.extracted_tasks = self.nl4dv_instance.task_genie_instance.filter_empty_tasks(task_map)
                    if (bool(self.nl4dv_instance.extracted_tasks) + bool(self.nl4dv_instance.extracted_attributes) + bool(self.nl4dv_instance.extracted_vis_type)) == 1:
                        if self.nl4dv_instance.extracted_vis_type is not None:
                            recent_dialog_id = self.nl4dv_instance.conversation_genie_instance.most_recent_dialog_id[-1]

                            recent_query_id = self.nl4dv_instance.conversation_genie_instance.most_recent_query_id[-1]
                            context_obj = self.nl4dv_instance.conversation_genie_instance.all_dialogs[recent_dialog_id][int(recent_query_id)]
                            past_vis_type = context_obj['visList'][0]['visType']
                            if past_vis_type != self.nl4dv_instance.extracted_vis_type:
                                self.dialog = True
                                return self.dialog, "high"
                            else:
                                self.dialog = False
                                return self.dialog, "none"
                        elif self.nl4dv_instance.extracted_attributes is not None:
                            if len(self.nl4dv_instance.extracted_attributes.keys()) == 1:
                                self.dialog = True
                                return self.dialog, "low"
                            elif len(self.nl4dv_instance.extracted_attributes.keys()) == 2 and followup_type == "replace":
                                self.dialog = True
                                return self.dialog, "low"
                        elif self.nl4dv_instance.extracted_tasks is not None:
                            if len(self.nl4dv_instance.extracted_tasks.keys()) == 1:
                                self.dialog = True
                                return self.dialog, "low"


                        attr = list(self.nl4dv_instance.extracted_attributes.keys())
                        task_attr = list()
                        for task in self.nl4dv_instance.extracted_tasks.keys():
                            for task_curr in self.nl4dv_instance.extracted_tasks[task]:
                                attrs = task_curr['attributes']
                                task_attr.extend(attrs)

                        if set(attr) == set(task_attr):
                            self.dialog = True
                            return self.dialog, "low"
                    elif (bool(self.nl4dv_instance.extracted_tasks) + bool(self.nl4dv_instance.extracted_attributes) + bool(self.nl4dv_instance.extracted_vis_type)) == 0:
                        self.dialog = False
                        return self.dialog, "none"

        self.nl4dv_instance.extracted_attributes = self.nl4dv_instance.attribute_genie_instance.extract_attributes(query_ngrams)

        self.nl4dv_instance.query_for_task_inference = self.nl4dv_instance.task_genie_instance.prepare_query_for_task_inference(self.query_processed)
        self.nl4dv_instance.extracted_vis_type, self.nl4dv_instance.extracted_vis_token = self.nl4dv_instance.vis_genie_instance.extract_vis_type(query_ngrams)

        self.nl4dv_instance.dependencies = self.nl4dv_instance.task_genie_instance.create_dependency_tree(self.nl4dv_instance.query_for_task_inference)
        task_map = self.nl4dv_instance.task_genie_instance.extract_explicit_tasks_from_dependencies(self.nl4dv_instance.dependencies)
        # Filters from Domain Values
        task_map = self.nl4dv_instance.task_genie_instance.extract_explicit_tasks_from_domain_value(task_map)

        # From the generated TaskMap, ensure that the task "keys" are NOT EMPTY LISTS
        self.nl4dv_instance.extracted_tasks = self.nl4dv_instance.task_genie_instance.filter_empty_tasks(task_map)
        if (bool(self.nl4dv_instance.extracted_tasks) + bool(self.nl4dv_instance.extracted_attributes) + bool(self.nl4dv_instance.extracted_vis_type)) == 1:
            if self.nl4dv_instance.extracted_vis_type is not None:
                recent_dialog_id = self.nl4dv_instance.conversation_genie_instance.most_recent_dialog_id[-1]
                recent_query_id = self.nl4dv_instance.conversation_genie_instance.most_recent_query_id[-1]
                context_obj = self.nl4dv_instance.conversation_genie_instance.all_dialogs[recent_dialog_id][int(recent_query_id)]
                past_vis_type = context_obj['visList'][0]['visType']
                if past_vis_type != self.nl4dv_instance.extracted_vis_type:
                    self.dialog = True
                    return self.dialog, "high"
                else:
                    self.dialog = False
                    return self.dialog, "none"
            elif self.nl4dv_instance.extracted_tasks is not None:
                if len(self.nl4dv_instance.extracted_tasks.keys()) == 1:
                    if task_map_key in ['filter', 'derived_value', 'find_extremum', 'sort']:
                        self.dialog = True
                        return self.dialog, "low"
            elif self.nl4dv_instance.extracted_attributes is not None:

                if len(self.nl4dv_instance.extracted_attributes.keys()) == 1:
                    self.dialog = True
                    return self.dialog, "low"

        elif (bool(self.nl4dv_instance.extracted_tasks) + bool(self.nl4dv_instance.extracted_attributes) + bool(self.nl4dv_instance.extracted_vis_type)) == 0:
            self.dialog = False
            return self.dialog, "none"

        else:
            attr = list(self.nl4dv_instance.extracted_attributes.keys())

            task_attr = list()
            for task in self.nl4dv_instance.extracted_tasks.keys():
                if task in ['filter', 'derived_value', 'find_extremum', 'sort']:
                    for task_curr in self.nl4dv_instance.extracted_tasks[task]:
                        attrs = task_curr['attributes']
                        task_attr.extend(attrs)
            if set(attr) == set(task_attr):
                self.dialog = True
                return self.dialog, "low"


        return self.dialog, "none"


