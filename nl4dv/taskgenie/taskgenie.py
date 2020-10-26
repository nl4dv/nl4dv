import itertools
from nl4dv.utils import constants, helpers


class TaskGenie:
    def __init__(self, nl4dv_instance):
        self.nl4dv_instance = nl4dv_instance

    def new_task(self, task_name,
                 task_type='implicit',
                 attributes=list(),
                 query_phrase=list(),
                 operator=None,
                 values=None,
                 is_attr_ambiguous=False,
                 is_value_ambiguous=False,
                 value_ambiguity_type=None):

        task = dict()
        task['task'] = task_name
        task['queryPhrase'] = query_phrase
        task['operator'] = operator
        task['values'] = values
        task['matchScore'] = self.nl4dv_instance.match_scores['task'][task_type]
        task['attributes'] = attributes
        task['inferenceType'] = task_type
        task['isAttrAmbiguous'] = is_attr_ambiguous
        task['isValueAmbiguous'] = is_value_ambiguous
        task['meta'] = dict()
        task['meta']['value_ambiguity_type'] = value_ambiguity_type

        return task

    def get_explicit_tasks(self):
        explicit_tasks = set()
        for k in self.nl4dv_instance.extracted_tasks:
            for v in self.nl4dv_instance.extracted_tasks[k]:
                if v["inferenceType"] == 'explicit':
                    explicit_tasks.add(k)

        return explicit_tasks

    def get_implicit_tasks(self):
        implicit_tasks = set()
        for k in self.nl4dv_instance.extracted_tasks:
            for v in self.nl4dv_instance.extracted_tasks[k]:
                if v["inferenceType"] == 'implicit':
                    implicit_tasks.add(k)

        return implicit_tasks

    @staticmethod
    def filter_empty_tasks(task_map):
        tasks_to_delete = set()
        for task_name in task_map:
            if len(task_map[task_name]) == 0:
                tasks_to_delete.add(task_name)

        for task_name in tasks_to_delete:
            del task_map[task_name]
        return task_map

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

    def is_datatype_ambiguous(self, attributes, task, values):
        is_datatype_ambiguous = False
        if task == "filter" and len(values) > 0 and helpers.isfloat(values[0]):
            for a in attributes:
                if self.nl4dv_instance.data_genie_instance.data_attribute_map[a]["dataType"] != constants.attribute_types["QUANTITATIVE"]:
                    is_datatype_ambiguous = True
                    break
        elif task in ["derived_value", "find_extremum"]:
            for a in attributes:
                if self.nl4dv_instance.data_genie_instance.data_attribute_map[a]["dataType"] != constants.attribute_types["QUANTITATIVE"]:
                    is_datatype_ambiguous = True
                    break
        elif task in ["trend"]:
            for a in attributes:
                if self.nl4dv_instance.data_genie_instance.data_attribute_map[a]["dataType"] != constants.attribute_types["TEMPORAL"]:
                    is_datatype_ambiguous = True
                    break

        return is_datatype_ambiguous

    def generate_tasks(self,
                       task_name,
                       attributes,
                       query_phrase,
                       operator_phrase,
                       operator,
                       values,
                       inference_type,
                       allow_subset=False):

        task_list = list()
        is_attribute_ambiguous = any(self.nl4dv_instance.extracted_attributes[k]["isAmbiguous"] for k in attributes)
        if is_attribute_ambiguous:
            for idx in range(1, len(attributes) + 1):
                attr_combos = itertools.combinations(attributes, idx)
                for attr_combo in attr_combos:
                    attr_combo = list(attr_combo)

                    if self.nl4dv_instance.attribute_genie_instance.validate_attr_combo(attr_combo=attr_combo,
                                                                                        query_phrase=query_phrase,
                                                                                        allow_subset=allow_subset):
                        continue

                    # Get Attribute datatypes
                    sorted_attr_combo, sorted_attr_type_str = self.nl4dv_instance.attribute_genie_instance.get_attr_datatype_shorthand(attr_combo)

                    # Check if the Value (datatype) is Ambiguous
                    is_value_ambiguous = self.is_datatype_ambiguous(task=task_name, attributes=sorted_attr_combo, values=values)
                    value_ambiguity_type = 'datatype' if is_value_ambiguous else None

                    task_obj = self.new_task(task_name=task_name,
                                             task_type=inference_type,
                                             attributes=sorted_attr_combo,
                                             query_phrase=operator_phrase,
                                             values=values,
                                             operator=operator,
                                             is_attr_ambiguous=is_attribute_ambiguous,
                                             is_value_ambiguous=is_value_ambiguous,
                                             value_ambiguity_type=value_ambiguity_type)

                    if task_obj not in task_list:
                        task_list.append(task_obj)

        else:

            # Check if the Value (datatype) is Ambiguous
            is_value_ambiguous = self.is_datatype_ambiguous(task=task_name, attributes=attributes, values=values)
            value_ambiguity_type = 'datatype' if is_value_ambiguous else None

            task_obj = self.new_task(task_name=task_name,
                                     task_type=inference_type,
                                     attributes=attributes,
                                     query_phrase=operator_phrase,
                                     values=values,
                                     operator=operator,
                                     is_attr_ambiguous=is_attribute_ambiguous,
                                     is_value_ambiguous=is_value_ambiguous,
                                     value_ambiguity_type=value_ambiguity_type)

            if task_obj not in task_list:
                task_list.append(task_obj)

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
                    if self.nl4dv_instance.extracted_attributes[a1]["metric"] == ["attribute_domain_value_match"] or \
                            self.nl4dv_instance.extracted_attributes[a2]["metric"] == ["attribute_domain_value_match"]:
                        continue

                    task = self.nl4dv_instance.task_keyword_map[operator_phrase][0][0]
                    if task not in task_map:
                        task_map[task] = list()

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

                            _tasks = self.generate_tasks(task_name=task,
                                                         attributes=relevant_attributes,
                                                         operator_phrase=operator_phrase,
                                                         query_phrase=[k1,k2],
                                                         operator=operator,
                                                         values=[],
                                                         inference_type='explicit',
                                                         allow_subset=True)  # IMP, this will be true

                            for _task in _tasks:
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
                    if task not in task_map:
                        task_map[task] = list()

                    # These tasks requires at most 1 Attribute to make sense
                    if task in ["derived_value", "find_extremum", "trend"]:
                        operator = self.nl4dv_instance.task_keyword_map[operator_phrase][0][1]
                        attributes = list(self.nl4dv_instance.keyword_attribute_mapping[keyword].keys())
                        _tasks = self.generate_tasks(task_name=task,
                                                     attributes=attributes,
                                                     operator_phrase=operator_phrase,
                                                     query_phrase=[keyword],
                                                     operator=operator,
                                                     values=[],
                                                     inference_type='explicit',
                                                     allow_subset=False)

                        for _task in _tasks:
                            if _task not in task_map[task]:
                                task_map[task].append(_task)

                    keyword, operator_phrase = None, None

            # Case 2: Takes care of numeric FILTERS e.g '...less than 50'
            keyword, amount, operator_phrase, has_negation, negation_phrase = None, None, None, False, None
            for dep_index, dep in enumerate(dependencies[0]):

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
                        if task not in task_map:
                            task_map[task] = list()

                        _tasks = self.generate_tasks(task_name=task,
                                                     attributes=list(self.nl4dv_instance.keyword_attribute_mapping[keyword].keys()),
                                                     operator_phrase=operator_phrase,
                                                     query_phrase=[keyword],
                                                     operator=operator,
                                                     values=[float(amount)],
                                                     inference_type='explicit',
                                                     allow_subset=False)

                        for _task in _tasks:
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
                            # NOT RANGE
                            operator = "NOT" + " " + operator
                            operator_phrase = negation_phrase + " " + operator_phrase

                        task = 'filter'
                        if task not in task_map:
                            task_map[task] = list()

                        _tasks = self.generate_tasks(task_name=task,
                                                     attributes=list(self.nl4dv_instance.keyword_attribute_mapping[keyword].keys()),
                                                     operator_phrase=operator_phrase,
                                                     query_phrase=[keyword],
                                                     operator=operator,
                                                     values=[float(from_amount), float(to_amount)],
                                                     inference_type='explicit',
                                                     allow_subset=False)

                        for _task in _tasks:
                            if _task not in task_map[task]:
                                task_map[task].append(_task)

                        keyword, amount, operator_phrase, has_negation, negation_phrase = None, None, None, False, None

            # Case 4: DISTRIBUTION single task keyword
            for operator_phrase in self.nl4dv_instance.task_keyword_map:
                if self.nl4dv_instance.task_keyword_map[operator_phrase][0][0] == "distribution":
                    if operator_phrase in self.nl4dv_instance.query_processed:
                        # It exists, create distribution task
                        task = 'distribution'
                        if task not in task_map:
                            task_map[task] = list()

                        _tasks = self.generate_tasks(task_name=task,
                                                     attributes=encodeable_attributes,
                                                     operator_phrase=operator_phrase,
                                                     query_phrase=[list(self.nl4dv_instance.attribute_keyword_mapping[a].keys())[0] for a in encodeable_attributes],
                                                     operator=None,
                                                     values=[],
                                                     inference_type='explicit',
                                                     allow_subset=False)

                        for _task in _tasks:
                            if _task not in task_map[task]:
                                task_map[task].append(_task)

        return task_map

    def extract_explicit_tasks_from_domain_value(self, task_map):

        # Case 3: Takes care of IMPLICIT categorical filters (from the domain)
        for attr, attr_obj in self.nl4dv_instance.extracted_attributes.items():
            if 'attribute_domain_value_match' in attr_obj['metric']:
                task = 'filter'
                attributes = [attr]
                is_value_ambiguous = False
                value_ambiguity_type = None
                values = list()

                if task not in task_map:
                    task_map[task] = list()

                for k in attr_obj["meta"]["ambiguity"]:
                    values.extend(attr_obj["meta"]["ambiguity"][k])
                    if len(attr_obj["meta"]["ambiguity"][k]) > 1:
                        is_value_ambiguous = True
                        value_ambiguity_type = 'domain_value'

                task_obj = self.new_task(task_name=task,
                                         task_type='explicit',
                                         attributes=attributes,
                                         query_phrase=attr_obj["queryPhrase"],
                                         values=values,
                                         operator="IN",
                                         is_attr_ambiguous=attr_obj["isAmbiguous"],
                                         is_value_ambiguous=is_value_ambiguous,
                                         value_ambiguity_type=value_ambiguity_type)

                if task_obj not in task_map[task]:
                    task_map[task].append(task_obj)

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
                    if self.nl4dv_instance.attribute_genie_instance.validate_attr_combo(attr_combo=combo, query_phrase=[], allow_subset=False):
                        continue

                    # Get attribute datatypes
                    sorted_attr_combo, sorted_attr_datatype_combo_str = self.nl4dv_instance.attribute_genie_instance.get_attr_datatype_shorthand(combo)
                    if self.has_non_filter_explicit_task_for_attr_list(task_map, sorted_attr_combo):
                        continue

                    # Keeping it outside of the if elif
                    if 'T' in sorted_attr_datatype_combo_str and not sorted_attr_datatype_combo_str in ["QQT"]:
                        # Add TREND task
                        task = 'trend'
                        attributes = sorted_attr_combo

                        if task not in task_map:
                            task_map[task] = list()

                        task_obj = self.new_task(task_name=task,
                                                 task_type='implicit',
                                                 attributes=attributes,
                                                 is_attr_ambiguous=any(self.nl4dv_instance.extracted_attributes[x]["isAmbiguous"] for x in attributes))
                        if task_obj not in task_map[task]:
                            task_map[task].append(task_obj)

                    if sorted_attr_datatype_combo_str in ["QQ","QQN","QQO","QQQ","QQT"]:
                        # Add CORRELATION task
                        task = 'correlation'
                        attributes = sorted_attr_combo[0:2]

                        if task not in task_map:
                            task_map[task] = list()

                        task_obj = self.new_task(task_name=task,
                                                 task_type='implicit',
                                                 attributes=attributes,
                                                 is_attr_ambiguous=any(self.nl4dv_instance.extracted_attributes[x]["isAmbiguous"] for x in attributes))

                        if task_obj not in task_map[task]:
                            task_map[task].append(task_obj)

                    if sorted_attr_datatype_combo_str in ["QN","QO","QNN","QNO","QOO"]:
                        # Add Derived Value task
                        task = 'derived_value'
                        attributes = [sorted_attr_combo[0]]

                        if task not in task_map:
                            task_map[task] = list()

                        task_obj = self.new_task(task_name=task,
                                                 task_type='implicit',
                                                 attributes=attributes,
                                                 operator='AVG',
                                                 is_attr_ambiguous=any(self.nl4dv_instance.extracted_attributes[x]["isAmbiguous"] for x in attributes))

                        if task_obj not in task_map[task]:
                            task_map[task].append(task_obj)

                    if sorted_attr_datatype_combo_str in ["Q","N","O","NN","NO","OO"]:
                        # Add Distribution task
                        task = 'distribution'
                        attributes = sorted_attr_combo

                        if task not in task_map:
                            task_map[task] = list()

                        task_obj = self.new_task(task_name=task,
                                                 task_type='implicit',
                                                 attributes=attributes,
                                                 is_attr_ambiguous=any(self.nl4dv_instance.extracted_attributes[x]["isAmbiguous"] for x in attributes))

                        if task_obj not in task_map[task]:
                            task_map[task].append(task_obj)

        return task_map
