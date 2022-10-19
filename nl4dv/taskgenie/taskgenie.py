import itertools
from nl4dv.utils import constants, helpers


class TaskGenie:
    def __init__(self, nl4dv_instance):
        self.nl4dv_instance = nl4dv_instance

    # 1. returns a formatted version of the input query by removing white-spaces between keywords that led to attribute detection
    # 2. Creates a modified version of the self.keyword_attribute_map with the above keywords-sans-whitespace.
    def prepare_query_for_task_inference(self, query, dialog=False):
        self.nl4dv_instance.special_keyword_map_for_tasks = dict()
        for k,v in self.nl4dv_instance.keyword_attribute_mapping.items():
            k_replacement = k.replace(" ", "")
            query = query.replace(k, k_replacement)
            self.nl4dv_instance.special_keyword_map_for_tasks[k_replacement] = k
        self.nl4dv_instance.special_keyword_map_for_followup = dict()
        if dialog:
            for k,v in self.nl4dv_instance.implicit_followup_keyword_map.items():
                if k in query:
                    query = query.replace(k, v[0][0])
                    self.nl4dv_instance.special_keyword_map_for_followup[v[0][0]] = v[0][1]
        return query

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

    def new_task(self, task_name,
                 task_type='implicit',
                 attributes=list(),
                 query_phrase=list(),
                 operator=None,
                 values=None,
                 is_attr_ambiguous=False,
                 is_value_ambiguous=False,
                 followup_type=None,
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
        task['followup_type'] = followup_type
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
        elif task in ["derived_value", "find_extremum", "sort"]:
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
                       followup_type,
                       allow_subset=False):
        # print(followup_type)

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
                                             followup_type=followup_type,
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
                                     followup_type=followup_type,
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

            # Case 0: CORRELATION
            k1, k2, operator_phrase = None, None, None
            for dep_index, dep in enumerate(dependencies[0]):

                # (('budget', 'NN'), 'nmod', ('relationship', 'NN'))
                if dep[0][0] in self.nl4dv_instance.special_keyword_map_for_tasks and dep[2][0] in self.nl4dv_instance.task_keyword_map and dep[1] not in ["case"]:
                    operator_phrase = dep[2][0]
                    if k1:
                        k2 = dep[0][0]
                    else:
                        k1 = dep[0][0]

                # (('relationship', 'NN'), 'nmod', ('budget', 'NN'))
                if dep[2][0] in self.nl4dv_instance.special_keyword_map_for_tasks and dep[0][0] in self.nl4dv_instance.task_keyword_map and dep[1] not in ["case"]:
                    operator_phrase = dep[0][0]
                    if k1:
                        k2 = dep[2][0]
                    else:
                        k1 = dep[2][0]

                if dep[2][0] in self.nl4dv_instance.special_keyword_map_for_tasks and dep[0][0] in self.nl4dv_instance.special_keyword_map_for_tasks and dep[1] == 'conj':
                    k1 = dep[2][0]
                    k2 = dep[0][0]

                # correlate budget and gross for fiction movies
                if dep[2][0] in self.nl4dv_instance.special_keyword_map_for_tasks and dep[0][0] in self.nl4dv_instance.task_keyword_map and dep[1] == 'conj':
                    k2 = dep[2][0]

                if dep[0][0] in self.nl4dv_instance.special_keyword_map_for_tasks and dep[2][0] in self.nl4dv_instance.task_keyword_map and dep[1] == 'conj':
                    k2 = dep[0][0]

                if k1 is not None and k2 is not None and k1 != k2 and operator_phrase is not None:

                    # If keywords point to DOMAIN VALUE matches, then do NOT tag them as a correlation task
                    _k1 = self.nl4dv_instance.special_keyword_map_for_tasks[k1]
                    _k2 = self.nl4dv_instance.special_keyword_map_for_tasks[k2]

                    _a1 = list(self.nl4dv_instance.keyword_attribute_mapping[_k1].keys())[0]
                    _a2 = list(self.nl4dv_instance.keyword_attribute_mapping[_k2].keys())[0]
                    if self.nl4dv_instance.extracted_attributes[_a1]["metric"] == ["attribute_domain_value_match"] or \
                            self.nl4dv_instance.extracted_attributes[_a2]["metric"] == ["attribute_domain_value_match"]:
                        continue

                    task = self.nl4dv_instance.task_keyword_map[operator_phrase][0][0]
                    if task not in task_map:
                        task_map[task] = list()

                    # These tasks requires at most 1 Attribute to make sense
                    if task in ["correlation"]:

                        if self.nl4dv_instance.task_keyword_map[operator_phrase][0][0] == task:
                            operator = self.nl4dv_instance.task_keyword_map[operator_phrase][0][1]

                            relevant_attributes = []
                            for k in [_k1, _k2]:
                                if k in self.nl4dv_instance.keyword_attribute_mapping:
                                    relevant_attributes.extend(list(self.nl4dv_instance.keyword_attribute_mapping[k].keys()))
                                elif self.nl4dv_instance.porter_stemmer_instance.stem(k) in self.nl4dv_instance.keyword_attribute_mapping:
                                    relevant_attributes.extend(list(self.nl4dv_instance.keyword_attribute_mapping[self.nl4dv_instance.porter_stemmer_instance.stem(k)].keys()))

                            _tasks = self.generate_tasks(task_name=task,
                                                         attributes=relevant_attributes,
                                                         operator_phrase=operator_phrase,
                                                         query_phrase=[_k1,_k2],
                                                         operator=operator,
                                                         values=[],
                                                         inference_type='explicit',
                                                         followup_type = 'nothing',
                                                         allow_subset=True)  # IMP, this will be true

                            for _task in _tasks:
                                if _task not in task_map[task]:
                                    task_map[task].append(_task)

                            k1, k2, operator_phrase = None, None, None


            # Case 1: DERIVED_VALUE, FIND_EXTREMUM and TREND.
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

                if keyword is not None and operator_phrase is not None:
                    task = self.nl4dv_instance.task_keyword_map[operator_phrase][0][0]
                    if task not in task_map:
                        task_map[task] = list()

                    # These tasks requires at most 1 Attribute to make sense
                    if task in ["derived_value", "find_extremum", "trend"]:
                        operator = self.nl4dv_instance.task_keyword_map[operator_phrase][0][1]
                        _keyword = self.nl4dv_instance.special_keyword_map_for_tasks[keyword]
                        _attributes = list(self.nl4dv_instance.keyword_attribute_mapping[_keyword].keys())
                        _tasks = self.generate_tasks(task_name=task,
                                                     attributes=_attributes,
                                                     operator_phrase=operator_phrase,
                                                     query_phrase=[_keyword],
                                                     operator=operator,
                                                     values=[],
                                                     inference_type='explicit',
                                                     followup_type='nothing',
                                                     allow_subset=False)

                        for _task in _tasks:
                            if _task not in task_map[task]:
                                task_map[task].append(_task)

                    keyword, operator_phrase = None, None

            # Case 2: Numeric + Temporal FILTERS e.g '...less than 50', '...since 1946'
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
                        _value = self.get_attributes_values(_attributes[0], amount)
                        _tasks = self.generate_tasks(task_name=task,
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
                        _from_value = self.get_attributes_values(_attributes[0], from_amount)
                        _to_value = self.get_attributes_values(_attributes[0], to_amount)
                        _tasks = self.generate_tasks(task_name=task,
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

            # Case 4: DISTRIBUTION e.g., '...distribution of salaries'
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

                if keyword is not None and operator_phrase is not None:
                    task = self.nl4dv_instance.task_keyword_map[operator_phrase][0][0]
                    if task not in task_map:
                        task_map[task] = list()

                    # These tasks requires at most 1 Attribute to make sense
                    if task in ["distribution"]:
                        operator = self.nl4dv_instance.task_keyword_map[operator_phrase][0][1]
                        _keyword = self.nl4dv_instance.special_keyword_map_for_tasks[keyword]
                        _attributes = list(self.nl4dv_instance.keyword_attribute_mapping[_keyword].keys())
                        _tasks = self.generate_tasks(task_name=task,
                                                     attributes=_attributes,
                                                     operator_phrase=operator_phrase,
                                                     query_phrase=[_keyword],
                                                     operator=operator,
                                                     values=[],
                                                     inference_type='explicit',
                                                     followup_type='nothing',
                                                     allow_subset=False)

                        for _task in _tasks:
                            if _task not in task_map[task]:
                                task_map[task].append(_task)

                    keyword, operator_phrase = None, None

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
                        if hasattr(self.nl4dv_instance, 'ambiguities'):
                            keyword = k
                            self.nl4dv_instance.ambiguities['value'][keyword] = dict()
                            self.nl4dv_instance.ambiguities['value'][keyword]['options'] = attr_obj["meta"]["ambiguity"][k]
                            self.nl4dv_instance.ambiguities['value'][keyword]['selected'] = None


                task_obj = self.new_task(task_name=task,
                                         task_type='explicit',
                                         attributes=attributes,
                                         query_phrase=attr_obj["queryPhrase"],
                                         values=values,
                                         operator="IN",
                                         is_attr_ambiguous=attr_obj["isAmbiguous"],
                                         is_value_ambiguous=is_value_ambiguous,
                                         followup_type='nothing',
                                         value_ambiguity_type=value_ambiguity_type)

                if task_obj not in task_map[task]:
                    task_map[task].append(task_obj)

        return task_map

    def extract_implicit_tasks_from_attributes(self, task_map, attribute_list, dialog):
        # IMPLICITLY infer tasks based on Attributes (Counts and Datatypes)
        # IF UNABLE to detect from Visualizations and/or Explicit utterances in the query
        # E.g. trend (from temporal)
        # E.g. correlation (from two quantitative), distribution (from one quantitative, one nominal/ordinal)
        if not self.has_non_filter_explicit_task(task_map):

            if dialog is False or dialog is None:
                davo = 1
            else:
                davo = 0
                for key in self.nl4dv_instance.extracted_attributes:
                    if self.nl4dv_instance.extracted_attributes[key]['encode'] == True:
                        davo += 1
            for i in range(davo, len(attribute_list) + 1):
                combinations = itertools.combinations(attribute_list, i)

                for combination in combinations:
                    combo = list(combination)


                    # Ensure each attribute comes from a different keyword for the visualization AND all such attributes detected form the visualization.
                    if dialog is False or dialog is None:
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

    def get_attributes_values(self, attribute, amount):
        amount_formatted = amount
        if self.nl4dv_instance.data_genie_instance.data_attribute_map[attribute]["dataType"] == constants.attribute_types['TEMPORAL']:
            is_date, unformatted_date_obj = helpers.isdate(amount)
            if is_date:
                for format in constants.date_regexes[unformatted_date_obj['regex_id']][0]:
                    # Vega-Lite can understand "%Y/%m/%d" for temporal fields in the filter transforms.
                    date_obj = helpers.format_str_to_date("/".join(unformatted_date_obj["regex_matches"]), format)
                    if date_obj is not None:
                        amount_formatted = date_obj.strftime("%Y/%m/%d")
                        break
        elif self.nl4dv_instance.data_genie_instance.data_attribute_map[attribute]["dataType"] == constants.attribute_types['QUANTITATIVE']:
            amount_formatted = float(amount)

        return amount_formatted
