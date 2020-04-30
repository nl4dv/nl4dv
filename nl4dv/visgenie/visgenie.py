import itertools
from nl4dv.vegawrapper import *
from nl4dv.utils import constants, helpers
import copy

class VisGenie:
    def __init__(self, nl4dv_instance):
        self.nl4dv_instance = nl4dv_instance

    def extract_vis_type(self, query, tokens):
        # type: (str, list) -> (str,str)
        """
        Get explicit Vis type from query

        """
        # If an Explicit Visualization type is requested, set the relevant flag.
        # for token in tokens:
        #     # If token is eg. 'line' / 'bar' which are not also attributes in dataset, then set it as an explicit vis type.
        #     if token not in self.nl4dv_instance.data_processor_instance.data_attribute_map:
        #         for vis_type, vis_keywords in self.nl4dv_instance.vis_keyword_map.items():
        #             if token in vis_keywords:
        #                 return vis_type, token

        # Let max length of n-gram be 2.
        for i in range(2, 0, -1):
            for ngram in helpers.get_ngrams(query, i):
                ngram_str = (' '.join(map(str, ngram))).rstrip()
                for vis_type, vis_keywords in self.nl4dv_instance.vis_keyword_map.items():
                    if ngram_str in vis_keywords:
                        return vis_type, ngram_str

        return None, None

    def has_find_extremum_task(self):
        for k in self.nl4dv_instance.extracted_tasks:
            if k == "find_extremum":
                return True
        return False

    def get_explicit_non_filter_tasks(self, combo):
        explicit_non_filter_tasks = set()
        for k in self.nl4dv_instance.extracted_tasks:
            if k != "filter":
                for v in self.nl4dv_instance.extracted_tasks[k]:
                    if v["inferenceType"] == constants.task_reference_types["EXPLICIT"] and v['attributes'] in combo:
                        explicit_non_filter_tasks.add(k)

        return explicit_non_filter_tasks

    def has_no_explicit_tasks(self, combo):
        has_no_explicit_task = True
        for k in self.nl4dv_instance.extracted_tasks:
            for v in self.nl4dv_instance.extracted_tasks[k]:
                if v["inferenceType"] == constants.task_reference_types["EXPLICIT"] and combo[0] not in v['attributes']:
                    has_no_explicit_task = False

        return has_no_explicit_task

    def get_vis_list(self, attribute_list):
        # type: (list) -> list
        """
        Return a list of possible Vis Objects sorted by confidence

        """
        vis_objects = list()

        # IF there are ONLY FILTER TASKs detected AND NOT other ENCODEable attribute exist, then ADD the LABEL attribute.
        if len(attribute_list) == 0 and len(self.nl4dv_instance.extracted_tasks) != 0:
            if 'filter' in self.nl4dv_instance.extracted_tasks:
                # Check if there is a task BUT no ENCODABLE attribute is detected. In this case, add the label attribute.
                self.nl4dv_instance.extracted_attributes[self.nl4dv_instance.label_attribute] = {
                    'name': self.nl4dv_instance.label_attribute,
                    "queryPhrase": None,
                    'inferenceType': constants.attribute_reference_types['IMPLICIT'],
                    'matchScore': 0,
                    'metric': ['label_attribute'],
                    'isLabel': True, # OBVIOUSLY
                    'isAmbiguous': False,
                    'ambiguity': [],
                    'encode': True, # Set to TRUE
                    'meta': {
                        'score': None,
                        'threshold': None,
                        'alias': None,
                        'ambiguity': {}
                    }
                }
                self.nl4dv_instance.attribute_keyword_mapping[self.nl4dv_instance.label_attribute] = {"LABEL": 1}
                self.nl4dv_instance.keyword_attribute_mapping["LABEL"] = {self.nl4dv_instance.label_attribute: 1}

                if self.nl4dv_instance.label_attribute not in attribute_list:
                    attribute_list.append(self.nl4dv_instance.label_attribute)

        # Create combinations of all attributes
        for i in range(1, len(attribute_list) + 1):
            combinations = itertools.combinations(attribute_list, i)
            for combination in combinations:
                combo = list(combination)

                if helpers.filter_combo_based_on_unique_keywords(combo, [], self.nl4dv_instance.extracted_attributes, self.nl4dv_instance.attribute_keyword_mapping, self.nl4dv_instance.keyword_attribute_mapping, allow_subset=False):
                    continue

                # Uncomment if you wish to show LABEL ATTRIBUTE in some cases.
                # HERE, if there is ONLY 1 non-label attribute, AND if there are NO EXPLICIT non-FILTER tasks, then add the label attribute.
                if len(combo) == 1 and combo[0] != self.nl4dv_instance.label_attribute:

                    if self.has_find_extremum_task():
                        # If it is in the extracted attributes, ENCODE it to TRUE. If it is NOT, CREATE IT. Finally, add to COMBO
                        if self.nl4dv_instance.label_attribute in self.nl4dv_instance.extracted_attributes:
                            self.nl4dv_instance.extracted_attributes[self.nl4dv_instance.label_attribute]["encode"] = True
                        else:
                            self.nl4dv_instance.extracted_attributes[self.nl4dv_instance.label_attribute] = {
                                'name': self.nl4dv_instance.label_attribute,
                                "queryPhrase": None,
                                'inferenceType': constants.attribute_reference_types['IMPLICIT'],
                                'matchScore': 0,
                                'metric': ['label_attribute'],
                                'isLabel': True, # OBVIOUSLY
                                'encode': True, # Set to TRUE
                                'isAmbiguous': False,
                                'ambiguity': [],
                                'meta': {
                                    'score': None,
                                    'threshold': None,
                                    'alias': None,
                                    'ambiguity': {}
                                }
                            }
                        if self.nl4dv_instance.label_attribute not in combo:
                            combo.append(self.nl4dv_instance.label_attribute)

                    elif self.has_no_explicit_tasks(combo):
                        # If it is in the extracted attributes, encode it to TRUE and add to COMBO
                        if self.nl4dv_instance.label_attribute in self.nl4dv_instance.extracted_attributes:
                            self.nl4dv_instance.extracted_attributes[self.nl4dv_instance.label_attribute]["encode"] = True
                            combo.append(self.nl4dv_instance.label_attribute)

                sorted_attr_datatype_combo = helpers.get_attr_datatype_shorthand(combo, self.nl4dv_instance.data_processor_instance.data_attribute_map)
                attr_datatype_combo_str = ''
                sorted_combo = []
                for s in sorted_attr_datatype_combo:
                    sorted_combo.append(s[0])
                    attr_datatype_combo_str += s[1]

                # NL4DV does not support ALL attribute type combinations, e.g. T vs T vs T. We don't have Vega-Lite encodings for these.
                if attr_datatype_combo_str in constants.vis_combos:
                    is_combination_supported = constants.vis_combos[attr_datatype_combo_str]['support']

                    if is_combination_supported:
                        # For each combination, there are multiple design solutions, e.g. histogram or strip plot for a "quantitative (Q)" attribute
                        no_of_designs = len(constants.vis_combos[attr_datatype_combo_str]['designs'])
                        for d_counter in range(no_of_designs):
                            design = copy.deepcopy(constants.vis_combos[attr_datatype_combo_str]['designs'][d_counter])

                            vl_spec, score_obj = self.getVisObject(design, sorted_combo, attr_datatype_combo_str)

                            # Only show DESIGNS with EXPLICIT tasks. If NO Explicit TASK present, then proceed.
                            explicit_non_filter_tasks = self.get_explicit_non_filter_tasks(combo)
                            if len(explicit_non_filter_tasks) != 0 and design["task"] not in explicit_non_filter_tasks:
                                continue

                            confidence_obj = dict()
                            for attr in sorted_combo:
                                confidence_obj[attr] = 0 if "confidence" not in self.nl4dv_instance.extracted_attributes[attr]["meta"] else self.nl4dv_instance.extracted_attributes[attr]["meta"]["confidence"]/100

                            if vl_spec is not None:
                                vis_object = {
                                    'score': sum(score_obj.values()) + sum(confidence_obj.values()),
                                    'scoreObj': score_obj,
                                    'confidenceObj': confidence_obj,
                                    'attributes': sorted_combo,
                                    'queryPhrase': self.nl4dv_instance.extracted_vis_token,
                                    'visType': self.nl4dv_instance.extracted_vis_type,
                                    'tasks': list(self.nl4dv_instance.extracted_tasks.keys()),
                                    'inferenceType': constants.attribute_reference_types['IMPLICIT'] if self.nl4dv_instance.extracted_vis_type is None else constants.attribute_reference_types['EXPLICIT'],
                                    'vlSpec': vl_spec.vegaObject
                                }
                                if vis_object not in vis_objects and vis_object['score'] > 0:
                                    # score_obj['by_vis_design'] = no_of_designs - d_counter
                                    # score_obj['score'] = sum(score_obj.values())
                                    vis_objects.append(vis_object)

                    else:
                        vis_object = self.create_datatable_vis(sorted_combo)
                        if vis_object not in vis_objects and vis_object['score'] > 0:
                            vis_objects.append(vis_object)

        return list(sorted(vis_objects, key=lambda o: o['score'], reverse=True))

    def getVisObject(self, design, combos, attr_datatype_combo_str):

        # Start CREATING a new Vega Spec
        vega_wrapper_instance = VegaWrapper()

        # Score object
        score_obj = {
            'by_attributes': 0,
            'by_task': 0,
            'by_vis': 0,
            # 'by_vis_design': 0
        }

        # # FILTER the base DESIGNS based on TASKS and EXPLICIT VIS
        # # ENSURE if COMBOS has the attributes to which the TASK is applied. If NOT, don't do anything.
        # for task in self.nl4dv_instance.extracted_tasks:
        #     for task_instance in self.nl4dv_instance.extracted_tasks[task]:
        #
        #         if task == 'find_extremum':
        #             pass
        #
        #         elif task == 'correlation':
        #             pass
        #
        #         elif task == 'derived_value':
        #             pass
        #
        #         elif task == 'distribution':
        #             pass
        #
        #         elif task == 'trend':
        #             pass

        # MAP the attributes to the DESIGN spec.
        for index, attr in enumerate(combos):
            encoding = design['priority'][index]  # x, y, color, size, tooltip, ...
            agg = design[encoding]['agg']
            datatype = self.nl4dv_instance.data_processor_instance.data_attribute_map[attr]['dataType']

            # Update the design with the attribute. It could be referenced later.
            design[encoding]['attr'] = attr
            design[encoding]['is_defined'] = True

            vega_wrapper_instance.set_recommended_vis_type(design['vis_type'], is_explicit=False)

            # Set the encoding
            vega_wrapper_instance.set_encoding(encoding, attr, datatype, agg)

            # Set Score
            score_obj['by_attributes'] += self.nl4dv_instance.extracted_attributes[attr]['matchScore']

        # If an attribute is dual-encoded e.g. x axis, and count of y axis
        for encoding in design['mandatory']:
            if not design[encoding]['is_defined']:
                attr_reference = design[encoding]['attr_ref']
                attr = design[attr_reference]['attr']
                datatype = self.nl4dv_instance.data_processor_instance.data_attribute_map[attr]['dataType']
                agg = design[encoding]['agg']
                vega_wrapper_instance.set_encoding(encoding, attr, datatype, agg)


        # Based on the set x_attr, y_attr, and color_attr attributes, Set the TASKS
        for task in self.nl4dv_instance.extracted_tasks:
            for task_instance in self.nl4dv_instance.extracted_tasks[task]:
                if task == 'filter':
                    # If there is NO Datatype Ambiguity, then apply the Filter Task. Else Let it be the way it is.
                    if not (task_instance["isValueAmbiguous"] and task_instance["meta"]["value_ambiguity_type"] == "datatype"):
                        vega_wrapper_instance.set_task(None, task_instance)
                        score_obj['by_task'] += task_instance['matchScore']

                # If a NON-FILTER task has an attribute that is NOT in the combos (means it was ambiguous), then No Need to Apply this FILTER.
                # E.g. We don't want IMDB Rating > 5 to be applied to a VIS design with Rotten Tomatoes Rating
                for attr in task_instance['attributes']:
                    if attr not in combos:
                        continue

                if task == 'find_extremum':
                    score_obj['by_task'] += task_instance['matchScore']

                    # ToDo:- Ensure the Extremum variable is on Y
                    design['vis_type'] = "barchart"
                    vega_wrapper_instance.set_task('y', task_instance)

                elif task == 'correlation':
                    score_obj['by_task'] += task_instance['matchScore']

                    if attr_datatype_combo_str in ["QN","QO"]:
                        if task_instance["inferenceType"] == constants.task_reference_types['EXPLICIT']:
                            design['y']['agg'] = None  # Remove Y Aggregate Encoding
                            score_obj['by_task'] -= task_instance['matchScore'] # Deduct Points

                    if task_instance["inferenceType"] == constants.task_reference_types['EXPLICIT']:
                        design["vis_type"] = "scatterplot"

                elif task == 'derived_value':
                    score_obj['by_task'] += task_instance['matchScore']

                    # # Otherwise, X and Y will have same attribute with Y having the derived value. Unreadable VIS
                    if attr_datatype_combo_str in ['Q']:
                        # If vis design is histogram, return.
                        if design['vis_type'] == 'histogram':
                            return None, None

                    # if task_instance['inferenceType'] == constants.task_reference_types['EXPLICIT']:
                    for dimension in design['mandatory']:
                        if design[dimension]['attr'] in task_instance['attributes']:
                            vega_wrapper_instance.set_task(dimension, task_instance)

                elif task == 'distribution':
                    score_obj['by_task'] += task_instance['matchScore']

                    # IF NOT already distribution, then make it distribution by removing Aggregations and
                    if design['task'] != 'distribution':
                        for dimension in design['mandatory']:
                            design[dimension]['agg'] = None

                        # For certain combinations involving QQ (correlation), update the Design ENCODINGS to ensure one of N or O is on the AXES.
                        if attr_datatype_combo_str in ["Q","N","O","T"]:
                            # Just removing any aggregates should take care of this.
                            pass

                        elif attr_datatype_combo_str in ["QN", "QO"]:
                            # Just removing any aggregates should take care of this.
                            pass

                        elif attr_datatype_combo_str in ["NT","OT"]:
                            design['vis_type'] = 'scatterplot'
                            design['mark'] = 'point'

                            del design['color']
                            del design['y']['attr_ref']
                            design['mandatory'] = ['x','y','size']
                            design['priority'] = ['x','y']
                            design['size'] = {'attr': None, 'is_defined': False, 'attr_ref': 'x', 'agg': 'count'}

                        elif attr_datatype_combo_str in ["QT"]:
                            design['vis_type'] = 'stripplot'
                            design['mark'] = 'tick'

                        elif attr_datatype_combo_str in ["QQN", "QQO"]:
                            design['vis_type'] = 'stripplot'
                            design['mark'] = 'tick'
                            if design['priority'] == ['x', 'y', 'color']:
                                design['priority'] = ['y','color','x']

                            elif design['priority'] == ['x', 'y', 'column']:
                                design['priority'] = ['y', 'column', 'x']

                        elif attr_datatype_combo_str in ["QQQ"]:
                            pass

                        elif attr_datatype_combo_str in ["QNO", "QNN", "QOO"]:
                            design['vis_type'] = 'stripplot'
                            design['mark'] = 'tick'

                            if design['priority'] == ['size', 'x', 'y']:
                                design['priority'] = ['y','size','x']
                                score_obj['by_task'] -= task_instance['matchScore']
                                # return None, None # Don't return this

                            elif design['priority'] == ['y', 'x', 'color']:
                                design['priority'] = ['x', 'color', 'y']

                            elif design['priority'] == ['y', 'column', 'x']:
                                design['priority'] = ['y', 'column', 'x']
                                # return None, None # Don't return this

                        elif attr_datatype_combo_str in ["QQT"]:
                            design['vis_type'] = 'stripplot'
                            design['mark'] = 'tick'

                        elif attr_datatype_combo_str in ["QNT","QOT"]:
                            design['vis_type'] = 'stripplot'
                            design['mark'] = 'tick'

                        elif attr_datatype_combo_str in ["NNT","NOT","OOT"]:
                            design['vis_type'] = 'scatterplot'
                            design['mark'] = 'point'

                            del design['color']
                            vega_wrapper_instance.unset_encoding('color')
                            del design['y']['attr_ref']
                            design['mandatory'] = ['x','y','column','size']
                            design['priority'] = ['x','y','column']
                            design['size'] = {'attr': None, 'is_defined': False, 'attr_ref': 'x', 'agg': 'count'}

                elif task == 'trend':
                    score_obj['by_task'] += task_instance['matchScore']

                    if task_instance["inferenceType"] == constants.task_reference_types['EXPLICIT']:
                        # Ensure Line Chart
                        design['vis_type'] = "linechart"

        # MAP the attributes to the DESIGN spec.
        for index, attr in enumerate(combos):
            encoding = design['priority'][index]  # x, y, color, size, tooltip, ...
            agg = design[encoding]['agg']
            datatype = self.nl4dv_instance.data_processor_instance.data_attribute_map[attr]['dataType']

            # Update the design with the attribute. It could be referenced later.
            design[encoding]['attr'] = attr
            design[encoding]['is_defined'] = True

            vega_wrapper_instance.set_recommended_vis_type(design['vis_type'], is_explicit=False)

            # Set the encoding
            vega_wrapper_instance.set_encoding(encoding, attr, datatype, agg)

            # Set Score
            score_obj['by_attributes'] += self.nl4dv_instance.extracted_attributes[attr]['matchScore']

        # If an attribute is dual-encoded e.g. x axis, and count of y axis
        for encoding in design['mandatory']:
            if not design[encoding]['is_defined']:
                attr_reference = design[encoding]['attr_ref']
                attr = design[attr_reference]['attr']
                datatype = self.nl4dv_instance.data_processor_instance.data_attribute_map[attr]['dataType']
                agg = design[encoding]['agg']
                vega_wrapper_instance.set_encoding(encoding, attr, datatype, agg)


        # Based on the set x_attr, y_attr, and color_attr attributes, Set the TASKS
        for task in self.nl4dv_instance.extracted_tasks:
            for task_instance in self.nl4dv_instance.extracted_tasks[task]:
                if task == 'find_extremum':

                    # ToDo:- Ensure the Extremum variable is on Y
                    design['vis_type'] = "barchart"
                    vega_wrapper_instance.set_task('y', task_instance)

                elif task == 'derived_value':

                    # # Otherwise, X and Y will have same attribute with Y having the derived value. Unreadable VIS
                    if attr_datatype_combo_str in ['Q']:
                        # If vis design is histogram, return.
                        if design['vis_type'] == 'histogram':
                            return None, None

                    # if task_instance['inferenceType'] == constants.task_reference_types['EXPLICIT']:
                    for dimension in design['mandatory']:
                        if design[dimension]['attr'] in task_instance['attributes']:
                            vega_wrapper_instance.set_task(dimension, task_instance)

        # If explicit VIS is specified, then override it
        if self.nl4dv_instance.extracted_vis_type:

            # PIE CHART + DONUT CHART
            # Can happen between 2 attributes {QN, QO} combinations
            if self.nl4dv_instance.extracted_vis_type in ['piechart','donutchart']:
                if attr_datatype_combo_str in ['QN', 'QO']:
                    y_encoding = vega_wrapper_instance.get_encoding('y')
                    vega_wrapper_instance.unset_encoding('x')
                    vega_wrapper_instance.unset_encoding('y')
                    vega_wrapper_instance.unset_encoding('size')
                    vega_wrapper_instance.set_encoding('theta', combos[0], self.nl4dv_instance.data_processor_instance.data_attribute_map[combos[0]]['dataType'], aggregate=y_encoding['aggregate'])
                    vega_wrapper_instance.set_encoding('color', combos[1], self.nl4dv_instance.data_processor_instance.data_attribute_map[combos[1]]['dataType'])
                    vega_wrapper_instance.set_recommended_vis_type(self.nl4dv_instance.extracted_vis_type, is_explicit=True)
                else:
                    self.error = ("VIS", "Pie Chart not compatible / not supported for your query. Falling back to default behavior.")
                    return None, None

            # HISTOGRAM
            elif self.nl4dv_instance.extracted_vis_type == 'histogram':
                if attr_datatype_combo_str in ['Q'] and design['vis_type'] != 'histogram':
                    return None, None
                if 'y' not in design:
                    return None, None
                vega_wrapper_instance.set_recommended_vis_type(self.nl4dv_instance.extracted_vis_type, is_explicit=True)

            # STRIP PLOT
            elif self.nl4dv_instance.extracted_vis_type == 'stripplot':
                if attr_datatype_combo_str in ['Q'] and design['vis_type'] != 'stripplot':
                    return None, None
                vega_wrapper_instance.set_recommended_vis_type(self.nl4dv_instance.extracted_vis_type, is_explicit=True)

                # # IF NOT already distribution, then make it distribution by removing Aggregations and
                # if design['task'] != 'distribution':
                #     for dimension in design['mandatory']:
                #         design[dimension]['agg'] = None
                #
                #     # For certain combinations involving QQ (correlation), update the Design ENCODINGS to ensure one of N or O is on the AXES.
                #     if attr_datatype_combo_str in ["Q","N","O","T"]:
                #         # Just removing any aggregates should take care of this.
                #         pass
                #
                #     elif attr_datatype_combo_str in ["QN", "QO"]:
                #         # Just removing any aggregates should take care of this.
                #         pass
                #
                #     elif attr_datatype_combo_str in ["NT","OT"]:
                #         design['vis_type'] = 'scatterplot'
                #         design['mark'] = 'point'
                #
                #         del design['color']
                #         del design['y']['attr_ref']
                #         design['mandatory'] = ['x','y','size']
                #         design['priority'] = ['x','y']
                #         design['size'] = {'attr': None, 'is_defined': False, 'attr_ref': 'x', 'agg': 'count'}
                #
                #     elif attr_datatype_combo_str in ["QT"]:
                #         design['vis_type'] = 'stripplot'
                #         design['mark'] = 'tick'
                #
                #     elif attr_datatype_combo_str in ["QQN", "QQO"]:
                #         design['vis_type'] = 'stripplot'
                #         design['mark'] = 'tick'
                #         if design['priority'] == ['x', 'y', 'color']:
                #             design['priority'] = ['y','color','x']
                #
                #         elif design['priority'] == ['x', 'y', 'column']:
                #             design['priority'] = ['y', 'column', 'x']
                #
                #     elif attr_datatype_combo_str in ["QQQ"]:
                #         pass
                #
                #     elif attr_datatype_combo_str in ["QNO", "QNN", "QOO"]:
                #         design['vis_type'] = 'stripplot'
                #         design['mark'] = 'tick'
                #
                #         if design['priority'] == ['size', 'x', 'y']:
                #             design['priority'] = ['y','size','x']
                #             # return None, None # Don't return this
                #
                #         elif design['priority'] == ['y', 'x', 'color']:
                #             design['priority'] = ['x', 'color', 'y']
                #
                #         elif design['priority'] == ['y', 'column', 'x']:
                #             design['priority'] = ['y', 'column', 'x']
                #             # return None, None # Don't return this
                #
                #     elif attr_datatype_combo_str in ["QQT"]:
                #         design['vis_type'] = 'stripplot'
                #         design['mark'] = 'tick'
                #
                #     elif attr_datatype_combo_str in ["QNT","QOT"]:
                #         design['vis_type'] = 'stripplot'
                #         design['mark'] = 'tick'
                #
                #     elif attr_datatype_combo_str in ["NNT","NOT","OOT"]:
                #         design['vis_type'] = 'scatterplot'
                #         design['mark'] = 'point'
                #
                #         del design['color']
                #         vega_wrapper_instance.unset_encoding('color')
                #         del design['y']['attr_ref']
                #         design['mandatory'] = ['x','y','column','size']
                #         design['priority'] = ['x','y','column']
                #         design['size'] = {'attr': None, 'is_defined': False, 'attr_ref': 'x', 'agg': 'count'}

            # BAR CHART
            elif self.nl4dv_instance.extracted_vis_type == 'barchart':
                if attr_datatype_combo_str in ['NN','NO','OO']:
                    if design['vis_type'] == 'scatterplot':
                        return None, None
                if 'y' not in design:
                   return None, None
                vega_wrapper_instance.set_recommended_vis_type(self.nl4dv_instance.extracted_vis_type, is_explicit=True)

            # LINE CHART
            elif self.nl4dv_instance.extracted_vis_type == 'linechart':
                if 'y' not in design and 'x' not in design:
                    return None, None

                if design["vis_type"] == "barchart":
                    return None, None

                vega_wrapper_instance.set_recommended_vis_type(self.nl4dv_instance.extracted_vis_type, is_explicit=True)

            # AREA CHART
            elif self.nl4dv_instance.extracted_vis_type == 'areachart':
                if 'y' not in design and 'x' not in design:
                    return None, None

                if design["vis_type"] == "barchart":
                    return None, None

                vega_wrapper_instance.set_recommended_vis_type(self.nl4dv_instance.extracted_vis_type, is_explicit=True)

            # SCATTERPLOT
            elif self.nl4dv_instance.extracted_vis_type == 'scatterplot':
                if design['vis_type'] in ['histogram']:
                    return None, None

                vega_wrapper_instance.set_recommended_vis_type(self.nl4dv_instance.extracted_vis_type, is_explicit=True)

            # BOX PLOT
            # Does not have y-encoding. Modify accordingly.
            elif self.nl4dv_instance.extracted_vis_type == 'boxplot':
                vega_wrapper_instance.unset_encoding('y')
                vega_wrapper_instance.set_recommended_vis_type(self.nl4dv_instance.extracted_vis_type, is_explicit=True)
                if 'bin' in vega_wrapper_instance.vegaObject['encoding']['x']:
                    del vega_wrapper_instance.vegaObject['encoding']['x']['bin']

            # If you reach here, means the VIS was not discarded!
            # just here because the user/developer explicitly requested this
            score_obj['by_vis'] += self.nl4dv_instance.match_scores['explicit_vis_match']

        # Encode the label attribute as a TOOLTIP to show the dataset label on hover.
        vega_wrapper_instance.add_label_attribute_as_tooltip(self.nl4dv_instance.label_attribute)

        # AESTHETICS
        # ------------------
        # Format ticks (e.g. 10M, 1k, ... ) for Quantitative axes
        vega_wrapper_instance.add_tick_format()
        # ------------------

        #  Finally, let's set the data and Rock'n Roll!
        # ------------------
        vega_wrapper_instance.set_data(self.nl4dv_instance.data_url)
        # ------------------

        return vega_wrapper_instance, score_obj

    def create_datatable_vis(self, sorted_combo):
        # Return a Data Table
        # Start CREATING a new Vega Spec
        vega_wrapper_instance = VegaWrapper()

        #  Set the data
        vega_wrapper_instance.set_data(self.nl4dv_instance.data_url)

        vega_wrapper_instance.vegaObject["transform"] = [{
                    "window": [{"op": "row_number", "as": "row_number"}]
                  }]

        vega_wrapper_instance.vegaObject["hconcat"] = []
        del vega_wrapper_instance.vegaObject["mark"]
        del vega_wrapper_instance.vegaObject["encoding"]

        # Score object
        score_obj = {
            'by_attributes': 0,
            'by_task': 0,
            'by_vis': 0
        }

        for attr in sorted_combo:
            score_obj['by_attributes'] += self.nl4dv_instance.extracted_attributes[attr]['matchScore']
            vega_wrapper_instance.vegaObject["hconcat"].append({
                "width": 150,
                "title": attr,
                "mark": "text",
                "encoding": {
                    "text": {"field": attr, "type": "nominal"},
                    "y": {"field": "row_number", "type": "ordinal", "axis": None}
                }
            })

        vis_object = {
            'score': sum(score_obj.values()),
            'scoreObj': score_obj,
            'attributes': sorted_combo,
            'visType': 'datatable',
            'queryPhrase': None,
            'tasks': list(self.nl4dv_instance.extracted_tasks.keys()),
            'inferenceType': constants.attribute_reference_types['IMPLICIT'] if self.nl4dv_instance.extracted_vis_type is None else constants.attribute_reference_types['EXPLICIT'],
            'vlSpec': vega_wrapper_instance.vegaObject
        }

        return vis_object

