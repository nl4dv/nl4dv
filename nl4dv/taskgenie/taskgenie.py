import itertools
from nl4dv.utils import constants, helpers


class TaskGenie:
    def __init__(self, nl4dv_instance):
        self.nl4dv_instance = nl4dv_instance

    @staticmethod
    def has_non_filter_explicit_task(task_map):
        for task in task_map:
            if task != "filter" and len(task_map[task]) != 0:
                return True
        return False

    @staticmethod
    def has_non_filter_explicit_task_for_attr_list(task_map, attr_list):
        for task in task_map:
            if task != "filter":
                for task_instance in task_map[task]:
                    if set(task_instance["attributes"]) == set(attr_list):
                        return True

        return False

    # ToDo:- Ensure EMPTY LIST is not returned. Return NULL/ None so that the KEY itself is not added to the Task Map
    def generate_tasks(self, task, attributes, keywords, operator_phrase, operator, values, inference_type, allow_subset=False):
        task_list = list()

        is_attribute_ambiguous = any(self.nl4dv_instance.extracted_attributes[k]["isAmbiguous"] for k in attributes)
        if is_attribute_ambiguous:
            for i in range(1, len(attributes) + 1):
                combinations = itertools.combinations(attributes, i)
                for combination in combinations:
                    combo = list(combination)
                    if helpers.filter_combo_based_on_unique_keywords(combo, keywords, self.nl4dv_instance.extracted_attributes, self.nl4dv_instance.attribute_keyword_mapping, self.nl4dv_instance.keyword_attribute_mapping, allow_subset=allow_subset):
                        continue

                    # Get Attribute datatypes
                    sorted_attr_combo, sorted_attr_type_str = self.nl4dv_instance.attribute_genie_instance.get_attr_datatype_shorthand(combo, self.nl4dv_instance.data_genie_instance.data_attribute_map)

                    is_datatype_ambiguous = False
                    if task in ["filter","derived_value","find_extremum"]:
                        if len(values) > 0 and helpers.isfloat(values[0]):
                            for a in sorted_attr_combo:
                                if self.nl4dv_instance.data_genie_instance.data_attribute_map[a]["dataType"] != constants.attribute_types["QUANTITATIVE"]:
                                    is_datatype_ambiguous = True
                                    break
                    elif task in ["trend"]:
                        for a in sorted_attr_combo:
                            if self.nl4dv_instance.data_genie_instance.data_attribute_map[a]["dataType"] != constants.attribute_types["TEMPORAL"]:
                                is_datatype_ambiguous = True
                                break

                    _task = dict()
                    _task['task'] = task
                    _task['queryPhrase'] = operator_phrase
                    _task['operator'] = operator
                    _task['matchScore'] = constants.match_scores['explicit_task_match'] if inference_type == constants.task_reference_types['EXPLICIT'] else constants.match_scores['implicit_task_match']
                    _task['attributes'] = sorted_attr_combo
                    _task['inferenceType'] = inference_type
                    _task['values'] = values
                    _task['isAttrAmbiguous'] = is_attribute_ambiguous
                    _task['isValueAmbiguous'] = is_datatype_ambiguous
                    _task['meta'] = {'value_ambiguity_type': None}

                    if is_datatype_ambiguous:
                        _task['meta']['value_ambiguity_type'] = 'datatype'
                    task_list.append(_task)

        else:

            is_datatype_ambiguous = False
            if task in ["filter","derived_value","find_extremum"]:
                if len(values) > 0 and helpers.isfloat(values[0]):
                    for a in attributes:
                        if self.nl4dv_instance.data_genie_instance.data_attribute_map[a]["dataType"] != constants.attribute_types["QUANTITATIVE"]:
                            is_datatype_ambiguous = True
                            break

            elif task in ["trend"]:
                for a in attributes:
                    if self.nl4dv_instance.data_genie_instance.data_attribute_map[a]["dataType"] != constants.attribute_types["TEMPORAL"]:
                        is_datatype_ambiguous = True
                        break

            _task = dict()
            _task['task'] = task
            _task['queryPhrase'] = operator_phrase
            _task['operator'] = operator
            _task['values'] = values
            _task['matchScore'] = constants.match_scores['explicit_task_match'] if inference_type == constants.task_reference_types['EXPLICIT'] else constants.match_scores['implicit_task_match']
            _task['attributes'] = attributes
            _task['inferenceType'] = inference_type
            _task['isAttrAmbiguous'] = is_attribute_ambiguous
            _task['isValueAmbiguous'] = is_datatype_ambiguous
            _task['meta'] = {'value_ambiguity_type': None}
            if is_datatype_ambiguous:
                _task['meta']['value_ambiguity_type'] = 'datatype'

            task_list.append(_task)
            # print(_task)
        return task_list

    def extract_explicit_tasks_from_dependencies(self, dependencies):

        # Get encodeable attributes
        encodeable_attributes = self.nl4dv_instance.attribute_genie_instance.get_encodeable_attributes()

        # Initialize the output
        task_map = dict()

        # Infer Tasks from the EXPLICIT TASK UTTERANCES
        if dependencies is not None:

            # Case 0: CORRELATION, and DISTRIBUTION
            k1, k2, operator_phrase = None, None, None
            for dep_index, dep in enumerate(dependencies[0]):

                # (('budget', 'NN'), 'nmod', ('relationship', 'NN'))
                if dep[0][0] in self.nl4dv_instance.keyword_attribute_mapping and dep[2][0] in self.nl4dv_instance.task_keyword_map and dep[1] not in ["case"]:
                    operator_phrase = dep[2][0]
                    if k1:
                        k2 = dep[0][0]
                    else:
                        k1 = dep[0][0]

                # (('relationship', 'NN'), 'nmod', ('budget', 'NN'))
                if dep[2][0] in self.nl4dv_instance.keyword_attribute_mapping and dep[0][0] in self.nl4dv_instance.task_keyword_map and dep[1] not in ["case"]:
                    operator_phrase = dep[0][0]
                    if k1:
                        k2 = dep[2][0]
                    else:
                        k1 = dep[2][0]

                if dep[2][0] in self.nl4dv_instance.keyword_attribute_mapping and dep[0][0] in self.nl4dv_instance.keyword_attribute_mapping and dep[1] == 'conj':
                    k1 = dep[2][0]
                    k2 = dep[0][0]

                # correlate budget and gross for fiction movies
                if dep[2][0] in self.nl4dv_instance.keyword_attribute_mapping and dep[0][0] in self.nl4dv_instance.task_keyword_map and dep[1] == 'conj':
                    k2 = dep[2][0]

                if dep[0][0] in self.nl4dv_instance.keyword_attribute_mapping and dep[2][0] in self.nl4dv_instance.task_keyword_map and dep[1] == 'conj':
                    k2 = dep[0][0]

                if k1 is not None and k2 is not None and k1 != k2 and operator_phrase is not None:

                    # If keywords point to DOMAIN VALUE matches, then do NOT tag them as a correlation task
                    a1 = list(self.nl4dv_instance.keyword_attribute_mapping[k1].keys())[0]
                    a2 = list(self.nl4dv_instance.keyword_attribute_mapping[k2].keys())[0]
                    if self.nl4dv_instance.extracted_attributes[a1]["metric"] == ["attribute_domain_value_match"] \
                        or self.nl4dv_instance.extracted_attributes[a2]["metric"] == ["attribute_domain_value_match"]:
                        continue

                    task = self.nl4dv_instance.task_keyword_map[operator_phrase][0][0]

                    # These tasks requires at most 1 Attribute to make sense
                    if task in ["correlation"]:

                        if self.nl4dv_instance.task_keyword_map[operator_phrase][0][0] == task:
                            operator = self.nl4dv_instance.task_keyword_map[operator_phrase][0][1]

                            relevant_attributes = []
                            for k in [k1, k2]:
                                if k in self.nl4dv_instance.keyword_attribute_mapping:
                                    relevant_attributes.extend(list(self.nl4dv_instance.keyword_attribute_mapping[k].keys()))
                                elif self.nl4dv_instance.porter_stemmer_instance.stem(k) in self.nl4dv_instance.keyword_attribute_mapping:
                                    relevant_attributes.extend(list(self.nl4dv_instance.keyword_attribute_mapping[self.nl4dv_instance.porter_stemmer_instance.stem(k)].keys()))

                            _tasks = self.generate_tasks(task=task,
                                                         attributes=relevant_attributes,
                                                         keywords=[k1,k2],
                                                         operator_phrase=operator_phrase,
                                                         operator=operator,
                                                         values=[],
                                                         inference_type=constants.task_reference_types['EXPLICIT'],
                                                         allow_subset=True) # ToDo: IMP

                            for _task in _tasks:
                                if task not in task_map:
                                    task_map[task] = list()
                                if _task not in task_map[task]:
                                    task_map[task].append(_task)

                            k1, k2, operator_phrase = None, None, None

            # Case 1: DERIVED_VALUE, FIND_EXTREMUM and TREND. 1 Task Keyword to 1 Attribute Keyword Mapping
            keyword, operator_phrase = None, None
            for dep_index, dep in enumerate(dependencies[0]):

                # OPTIONAL:
                if dep[1] in ['amod', 'nsubj', 'nmod', 'dobj', 'compound', 'dep']:
                    if dep[0][0] in self.nl4dv_instance.keyword_attribute_mapping and dep[2][0] in self.nl4dv_instance.task_keyword_map:
                        operator_phrase = dep[2][0]
                        keyword = dep[0][0]

                    if dep[2][0] in self.nl4dv_instance.keyword_attribute_mapping and dep[0][0] in self.nl4dv_instance.task_keyword_map:
                        operator_phrase = dep[0][0]
                        keyword = dep[2][0]

                if keyword is not None and operator_phrase is not None:
                    task = self.nl4dv_instance.task_keyword_map[operator_phrase][0][0]

                    # These tasks requires at most 1 Attribute to make sense
                    if task in ["derived_value", "find_extremum", "trend"]:
                        operator = self.nl4dv_instance.task_keyword_map[operator_phrase][0][1]
                        _tasks = self.generate_tasks(task=task,
                                                     attributes=list(self.nl4dv_instance.keyword_attribute_mapping[keyword].keys()),
                                                     operator_phrase=operator_phrase,
                                                     keywords=[keyword],
                                                     operator=operator,
                                                     values=[],
                                                     inference_type=constants.task_reference_types['EXPLICIT'])

                        for _task in _tasks:
                            if task not in task_map:
                                task_map[task] = list()
                            if _task not in task_map[task]:
                                task_map[task].append(_task)

                    keyword, operator_phrase = None, None

            # Case 2: Takes care of numeric FILTERS e.g '...less than 50'
            keyword, amount, operator_phrase, has_negation, negation_phrase = None, None, None, False, None
            for dep_index, dep in enumerate(dependencies[0]):

                # print(dep)

                if dep[0][0] in self.nl4dv_instance.keyword_attribute_mapping and dep[2][1] == 'CD':
                    keyword = dep[0][0]
                    amount = dep[2][0]

                if dep[2][0] in self.nl4dv_instance.keyword_attribute_mapping and dep[0][1] == 'CD':
                    keyword = dep[2][0]
                    amount = dep[0][0]

                if dep[0][0] in self.nl4dv_instance.keyword_attribute_mapping and dep[2][0] in self.nl4dv_instance.task_keyword_map and dep[1] == "neg":
                    has_negation = True
                    negation_phrase = dep[2][0]

                if dep[2][0] in self.nl4dv_instance.keyword_attribute_mapping and dep[0][0] in self.nl4dv_instance.task_keyword_map and dep[1] == "neg":
                    has_negation = True
                    negation_phrase = dep[0][0]

                if dep[0][0] in self.nl4dv_instance.keyword_attribute_mapping and dep[2][0] in self.nl4dv_instance.task_keyword_map:
                    operator_phrase = dep[2][0]
                    keyword = dep[0][0]

                if dep[2][0] in self.nl4dv_instance.keyword_attribute_mapping and dep[0][0] in self.nl4dv_instance.task_keyword_map:
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
                    # print(keyword, amount, operator_phrase)
                    if self.nl4dv_instance.task_keyword_map[operator_phrase][0][0] == "filter" and operator_phrase != "between":
                        operator = self.nl4dv_instance.task_keyword_map[operator_phrase][0][1]
                        if has_negation:
                            if operator == "GT":
                                operator = "LT"
                            elif operator == "LT":
                                operator = "GT"
                            operator_phrase = negation_phrase + " " + operator_phrase

                        task = 'filter'
                        _tasks = self.generate_tasks(task=task,
                                                     attributes=list(self.nl4dv_instance.keyword_attribute_mapping[keyword].keys()),
                                                     operator_phrase=operator_phrase,
                                                     keywords=[keyword],
                                                     operator=operator,
                                                     values=[float(amount)],
                                                     inference_type=constants.task_reference_types['EXPLICIT'])

                        for _task in _tasks:
                            if task not in task_map:
                                task_map[task] = list()
                            if _task not in task_map[task]:
                                task_map[task].append(_task)

                        keyword, amount, operator_phrase, has_negation, negation_phrase = None, None, None, False, None

            # Case 3: Takes care of numeric FILTERS e.g '...between 5 and 10'
            keyword, from_amount, to_amount, operator_phrase, has_negation, negation_phrase = None, None, None, None, False, None
            for dep_index, dep in enumerate(dependencies[0]):

                if dep[0][1] == 'CD' and dep[1] == 'conj' and dep[2][1] == 'CD':
                    from_amount = dep[0][0]
                    to_amount = dep[2][0]

                if dep[0][1] == 'CD' and dep[2][0] in self.nl4dv_instance.keyword_attribute_mapping:
                    keyword = dep[2][0]

                if dep[2][1] == 'CD' and dep[0][0] in self.nl4dv_instance.keyword_attribute_mapping:
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
                            if operator == "GT":
                                operator = "LT"
                            elif operator == "LT":
                                operator = "GT"
                            operator_phrase = negation_phrase + " " + operator_phrase

                        task = 'filter'
                        _tasks = self.generate_tasks(task=task,
                                                     attributes=list(self.nl4dv_instance.keyword_attribute_mapping[keyword].keys()),
                                                     operator_phrase=operator_phrase,
                                                     keywords=[keyword],
                                                     operator=operator,
                                                     values=[float(from_amount), float(to_amount)],
                                                     inference_type=constants.task_reference_types['EXPLICIT'])

                        for _task in _tasks:
                            if task not in task_map:
                                task_map[task] = list()
                            if _task not in task_map[task]:
                                task_map[task].append(_task)

                        keyword, amount, operator_phrase, has_negation, negation_phrase = None, None, None, False, None

            # Case 4: DISTRIBUTION single task keyword
            for operator_phrase in self.nl4dv_instance.task_keyword_map:
                if self.nl4dv_instance.task_keyword_map[operator_phrase][0][0] == "distribution":
                    if operator_phrase in self.nl4dv_instance.query_processed:
                        # It exists, create distribution task
                        task = 'distribution'
                        _tasks = self.generate_tasks(task=task,
                                                     attributes=encodeable_attributes,
                                                     keywords=[list(self.nl4dv_instance.attribute_keyword_mapping[a].keys())[0] for a in encodeable_attributes],
                                                     operator_phrase=operator_phrase,
                                                     operator=None,
                                                     values=[],
                                                     inference_type=constants.task_reference_types['EXPLICIT'])

                        for _task in _tasks:
                            if task not in task_map:
                                task_map[task] = list()
                            if _task not in task_map[task]:
                                task_map[task].append(_task)

        return task_map

    def extract_explicit_tasks_from_domain_value(self, task_map):

        # Case 3: Takes care of IMPLICIT categorical filters (from the domain)
        for attr, attrObj in self.nl4dv_instance.extracted_attributes.items():
            if 'attribute_domain_value_match' in attrObj['metric']:
                task = 'filter'
                if task not in task_map:
                    task_map[task] = list()

                _task = dict()
                _task['task'] = task
                _task['queryPhrase'] = attrObj["queryPhrase"]
                _task['operator'] = "IN"
                _task['values'] = []
                _task['matchScore'] = constants.match_scores['explicit_task_match']
                _task['attributes'] = [attr]
                _task['inferenceType'] = constants.task_reference_types['EXPLICIT']
                _task['isAttrAmbiguous'] = attrObj["isAmbiguous"]
                _task['meta'] = {'value_ambiguity_type': None}

                ambiguity = False
                for k in attrObj["meta"]["ambiguity"]:
                    _task['values'].extend(attrObj["meta"]["ambiguity"][k])
                    if len(attrObj["meta"]["ambiguity"][k]) > 1:
                        ambiguity = True
                        _task['meta']['value_ambiguity_type'] = 'domain_value'
                _task['isValueAmbiguous'] = ambiguity
                task_map[task].append(_task)

        return task_map

    def extract_implicit_tasks_from_attributes(self, task_map, attribute_list):
        # IMPLICITLY infer tasks based on Attributes (Counts and Datatypes)
        # IF UNABLE to detect from Visualizations and/or Explicit utterances in the query
        # E.g. trend (from temporal)
        # E.g. correlation (from two quantitative), distribution (from one quantitative, one nominal/ordinal)

        if not self.has_non_filter_explicit_task(task_map):
            for i in range(1, len(attribute_list) + 1):
                combinations = itertools.combinations(attribute_list, i)
                for combination in combinations:
                    combo = list(combination)
                    if helpers.filter_combo_based_on_unique_keywords(combo, [], self.nl4dv_instance.extracted_attributes, self.nl4dv_instance.attribute_keyword_mapping, self.nl4dv_instance.keyword_attribute_mapping):
                        continue

                    # Get Attribute datatypes
                    sorted_attr_combo, sorted_attr_datatype_combo_str = self.nl4dv_instance.attribute_genie_instance.get_attr_datatype_shorthand(combo)

                    if self.has_non_filter_explicit_task_for_attr_list(task_map, sorted_attr_combo):
                        continue

                    # Keeping it outside of the if elif
                    if 'T' in sorted_attr_datatype_combo_str and not sorted_attr_datatype_combo_str in ["QQT"]:
                        # Add TREND task
                        task = 'trend'
                        _task = dict()
                        _task['task'] = task
                        _task['queryPhrase'] = []
                        _task['operator'] = None
                        _task['values'] = None
                        _task['matchScore'] = constants.match_scores['implicit_task_match']
                        _task['attributes'] = sorted_attr_combo
                        _task['inferenceType'] = constants.task_reference_types['IMPLICIT']
                        _task['isAttrAmbiguous'] = any(self.nl4dv_instance.extracted_attributes[x]["isAmbiguous"] for x in sorted_attr_combo)
                        _task['isValueAmbiguous'] = False
                        _task['meta'] = {'value_ambiguity_type': None}

                        if task not in task_map:
                            task_map[task] = list()
                        if _task not in task_map[task]:
                            task_map[task].append(_task)

                    if sorted_attr_datatype_combo_str in ["QQ","QQN","QQO","QQQ","QQT"]:
                        # Add CORRELATION task
                        task = 'correlation'
                        _task = dict()
                        _task['task'] = task
                        _task['queryPhrase'] = []
                        _task['operator'] = None
                        _task['values'] = None
                        _task['matchScore'] = constants.match_scores['implicit_task_match']
                        _task['attributes'] = sorted_attr_combo[0:2]  # Take the first 2
                        _task['inferenceType'] = constants.task_reference_types['IMPLICIT']
                        _task['isAttrAmbiguous'] = any(self.nl4dv_instance.extracted_attributes[x]["isAmbiguous"] for x in sorted_attr_combo[0:2])
                        _task['isValueAmbiguous'] = False
                        _task['meta'] = {'value_ambiguity_type': None}

                        if task not in task_map:
                            task_map[task] = list()
                        if _task not in task_map[task]:
                            task_map[task].append(_task)

                    if sorted_attr_datatype_combo_str in ["QN","QO","QNN","QNO","QOO"]:
                        # Add Derived Value task
                        task = 'derived_value'
                        _task = dict()
                        _task['task'] = task
                        _task['queryPhrase'] = []
                        _task['operator'] = "AVG"
                        _task['values'] = None
                        _task['matchScore'] = constants.match_scores['implicit_task_match']
                        _task['attributes'] = [sorted_attr_combo[0]] # Will be Q
                        _task['inferenceType'] = constants.task_reference_types['IMPLICIT']
                        _task['isAttrAmbiguous'] = self.nl4dv_instance.extracted_attributes[sorted_attr_combo[0]]["isAmbiguous"]
                        _task['isValueAmbiguous'] = False
                        _task['meta'] = {'value_ambiguity_type': None}

                        if task not in task_map:
                            task_map[task] = list()
                        if _task not in task_map[task]:
                            task_map[task].append(_task)

                    # NNN","NNO","OOO","NOO"
                    if sorted_attr_datatype_combo_str in ["Q","N","O","NN","NO","OO"]:
                        # Add Distribution task
                        task = 'distribution'
                        _task = dict()
                        _task['task'] = task
                        _task['queryPhrase'] = []
                        _task['operator'] = None
                        _task['values'] = None
                        _task['matchScore'] = constants.match_scores['implicit_task_match']
                        _task['attributes'] = sorted_attr_combo
                        _task['inferenceType'] = constants.task_reference_types['IMPLICIT']
                        _task['isAttrAmbiguous'] = any(self.nl4dv_instance.extracted_attributes[x]["isAmbiguous"] for x in sorted_attr_combo)
                        _task['isValueAmbiguous'] = False
                        _task['meta'] = {'value_ambiguity_type': None}

                        if task not in task_map:
                            task_map[task] = list()
                        if _task not in task_map[task]:
                            task_map[task].append(_task)

        return task_map
