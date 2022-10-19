import itertools
from nl4dv.vlgenie import VLGenie
from nl4dv.visgenie.vis_recos import vis_design_combos
from nl4dv.utils import constants
import copy


class VisGenie:

    def __init__(self, nl4dv_instance):
        self.nl4dv_instance = nl4dv_instance

    def extract_vis_type(self, query_ngrams, dependencies = None):
        final_vis_type, final_vis_token = None, None
        for ngram in query_ngrams:
            if query_ngrams[ngram]["lower"] in self.nl4dv_instance.followup_keyword_map:
                if self.nl4dv_instance.followup_keyword_map[query_ngrams[ngram]["lower"]][0][1] == "replace":
                    k1, k2, operator_phrase = None, None, None
                    for dep_index, dep in enumerate(dependencies[0]):
                        if dep[1] in ['dobj', 'xcomp']:
                            if dep[0][0] in self.nl4dv_instance.vis_keyword_map and dep[2][0] in self.nl4dv_instance.followup_keyword_map:
                                operator_phrase = dep[2][0]
                                k1 = dep[0][0]
                            if dep[2][0] in self.nl4dv_instance.vis_keyword_map and dep[0][0] in self.nl4dv_instance.followup_keyword_map:
                                operator_phrase = dep[0][0]
                                k1 = dep[2][0]
                        if dep[1] in ['nmod', 'case']:
                            if dep[0][0] in self.nl4dv_instance.vis_keyword_map and dep[2][0] in self.nl4dv_instance.special_keyword_map_for_tasks and k1 == dep[0][0]:
                                # operator_phrase = dep[2][0]
                                k2 = dep[2][0]
                            if dep[0][0] in self.nl4dv_instance.vis_keyword_map and dep[2][1] in ["IN"]:
                                k2 = dep[0][0]
                    for vis_type, vis_keywords in self.nl4dv_instance.vis_keyword_map.items():
                        if k2 in vis_keywords:
                            final_vis_type = vis_type
                            final_vis_token = query_ngrams[ngram]["lower"]
                    return final_vis_type, final_vis_token
                elif self.nl4dv_instance.followup_keyword_map[query_ngrams[ngram]["lower"]][0][1] == "remove":
                    return "REMOVE", "REMOVE"
            if query_ngrams[ngram]["lower"] in self.nl4dv_instance.special_keyword_map_for_followup:
                if self.nl4dv_instance.special_keyword_map_for_followup[query_ngrams[ngram]["lower"]] == "replace":
                    k1, k2 = None, None
                    for dep_index, dep in enumerate(dependencies[0]):
                        if dep[1] in ['compound']:
                            if dep[0][0] in self.nl4dv_instance.vis_keyword_map and dep[2][0] in self.nl4dv_instance.special_keyword_map_for_followup:
                                k1 = dep[0][0]
                            if dep[2][0] in self.nl4dv_instance.vis_keyword_map and dep[0][0] in self.nl4dv_instance.special_keyword_map_for_followup:
                                k1 = dep[2][0]
                    for dep_index, dep in enumerate(dependencies[0]):
                        if dep[1] in ['amod', 'acl', 'dobj']:
                            if dep[0][0] in self.nl4dv_instance.vis_keyword_map:
                                # operator_phrase = dep[2][0]
                                k2 = dep[0][0]
                            if dep[2][0] in self.nl4dv_instance.vis_keyword_map:
                                # operator_phrase = dep[0][0]
                                k2 = dep[2][0]
                    for vis_type, vis_keywords in self.nl4dv_instance.vis_keyword_map.items():
                        if k2 in vis_keywords:
                            final_vis_type = vis_type
                            final_vis_token = query_ngrams[ngram]["lower"]
                    return final_vis_type, final_vis_token
                elif self.nl4dv_instance.implicit_followup_keyword_map[query_ngrams[ngram]["lower"]] == "remove":
                    return None, None

            for vis_type, vis_keywords in self.nl4dv_instance.vis_keyword_map.items():
                if query_ngrams[ngram]["lower"] in vis_keywords:
                    final_vis_type = vis_type
                    final_vis_token = query_ngrams[ngram]["lower"]

        return final_vis_type, final_vis_token

    def design_has_valid_task(self, designs):
        has_valid_task = False
        # ENSURE if COMBOS has the attributes to which the TASK is applied. If NOT, don"t do anything.
        for task in self.nl4dv_instance.extracted_tasks:
            if task in designs["tasks"]:
                has_valid_task = True

        return has_valid_task

    def get_vis_list(self, attribute_list):
        vis_objects = list()
        if self.nl4dv_instance.dialog == True:
            vis_iteration = len(attribute_list)
        else:
            vis_iteration = 1

        # Create combinations of all attributes. Ideally, taking ALL combinations should suffice BUT we also have AMBIGUOUS attributes.
        # Hence, we generate all combinations and then FILTER based on their ambiguity, etc.
        for i in range(vis_iteration, len(attribute_list) + 1):
            combinations = itertools.combinations(attribute_list, i)
            for combo in combinations:
                if self.nl4dv_instance.attribute_genie_instance.validate_attr_combo(attr_combo=combo, query_phrase=[], allow_subset=False, dialog=self.nl4dv_instance.dialog):
                    continue

                # Create a SORTED list of attributes and their datatypes to match the keys of the VisReco dictionary. e.g. `QQ`, `QNO`, ...
                attr_list, attr_type_str = self.nl4dv_instance.attribute_genie_instance.get_attr_datatype_shorthand(combo)

                # The Attribute-Datatype combination (e.g. TT, QQQQ) is NOT yet supported. Continue.
                if attr_type_str not in vis_design_combos or not vis_design_combos[attr_type_str]["support"]:
                    vis_object = self.create_datatable_vis(attr_list)
                    if vis_object not in vis_objects and vis_object["score"] > 0:
                        vis_objects.append(vis_object)
                        continue

                # Is at least one task supported for the Designs. Used to disambiguate/choose between tasks for e.g. `distribution` and `derived value`.
                design_has_valid_task = any([t in vis_design_combos[attr_type_str]["tasks"] for t in self.nl4dv_instance.extracted_tasks])

                # Is at least one vis supported for the Designs. Used to disambiguate/choose between mark types for e.g. `bar` and `tick`.
                design_has_valid_vis = self.nl4dv_instance.extracted_vis_type is not None and self.nl4dv_instance.extracted_vis_type in vis_design_combos[attr_type_str]["visualizations"]

                # For each combination, there are multiple design solutions, e.g. histogram or strip plot for a "quantitative (Q)" attribute
                for d_counter in range(len(vis_design_combos[attr_type_str]["designs"])):

                    # Create reference to a design that matches the attribute combination.
                    design = copy.deepcopy(vis_design_combos[attr_type_str]["designs"][d_counter])

                    # Filter the DESIGN based on TASKs
                    if design_has_valid_task and design["task"] not in self.nl4dv_instance.extracted_tasks:
                        continue

                    # Filter the DESIGN based on explicit VISUALIZATIONS
                    if design_has_valid_vis and self.nl4dv_instance.extracted_vis_type != design["vis_type"]:
                        continue

                    # Generate Vega-Lite specification along with it"s relevance score for the attribute and task combination.
                    vl_genie_instance = self.get_vis(design, attr_type_str, attr_list)

                    # This is the Score object that helps prioritize between AMBIGUOUS attributes
                    confidence_obj = dict()
                    for attr in attr_list:
                        confidence_obj[attr] = 0 if "confidence" not in self.nl4dv_instance.extracted_attributes[attr]["meta"] else self.nl4dv_instance.extracted_attributes[attr]["meta"]["confidence"]/100

                    if vl_genie_instance is not None:
                        vis_object = {
                            "score": sum(vl_genie_instance.score_obj.values()) + sum(confidence_obj.values()),
                            "scoreObj": vl_genie_instance.score_obj,
                            "confidenceObj": confidence_obj,
                            "attributes": attr_list,
                            "queryPhrase": self.nl4dv_instance.extracted_vis_token,
                            "visType": self.nl4dv_instance.extracted_vis_type,
                            "tasks": list(self.nl4dv_instance.extracted_tasks.keys()),
                            "inferenceType": 'implicit' if self.nl4dv_instance.extracted_vis_type is None else 'explicit',
                            "vlSpec": vl_genie_instance.vl_spec
                        }
                        if vis_object not in vis_objects and vis_object["score"] > 0:
                            vis_objects.append(vis_object)

        return list(sorted(vis_objects, key=lambda o: o["score"], reverse=True))

    def get_vis(self, design, attr_type_combo, attr_list):

        # CREATE a new Vega-Lite Spec
        vl_genie_instance = VLGenie()

        # MAP the attributes to the DESIGN spec.
        for index, attr in enumerate(attr_list):
            dim = design["priority"][index]  # Dimension: x, y, color, size, tooltip, ...
            agg = design[dim]["agg"]  # Aggregate: sum, mean, ...
            datatype = self.nl4dv_instance.data_genie_instance.data_attribute_map[attr]["dataType"]

            # Update the design with the attribute. It could be referenced later.
            design[dim]["attr"] = attr
            design[dim]["is_defined"] = True

            # Set the default VIS mark type. Note: Can be overridden later.
            vl_genie_instance.set_vis_type(design["vis_type"])

            # Set the encoding Note: Can be overridden later.
            vl_genie_instance.set_encoding(dim, attr, datatype, agg)

            # Set Score
            vl_genie_instance.score_obj["by_attributes"] += self.nl4dv_instance.extracted_attributes[attr]["matchScore"]

        # If an attribute is dual-encoded e.g. x axis as well as count of y axis, the attribute is supposed to be encoded to both channels.
        for encoding in design["mandatory"]:
            if not design[encoding]["is_defined"]:
                attr_reference = design[encoding]["attr_ref"]
                attr = design[attr_reference]["attr"]
                datatype = self.nl4dv_instance.data_genie_instance.data_attribute_map[attr]["dataType"]
                agg = design[encoding]["agg"]
                vl_genie_instance.set_encoding(encoding, attr, datatype, agg)

        # ENSURE if COMBOS has the attributes to which the TASK is applied. If NOT, don"t do anything.
        for task in self.nl4dv_instance.extracted_tasks:
            for task_instance in self.nl4dv_instance.extracted_tasks[task]:

                if task == "filter":
                    # If there is NO Datatype Ambiguity, then apply the Filter Task. Else let it be the way it is.
                    # Datatype ambiguity example: "Content Rating > 5" is NOT possible because Content Rating is a Nominal attribute.
                    if not (task_instance["isValueAmbiguous"] and task_instance["meta"]["value_ambiguity_type"] == "datatype"):
                        vl_genie_instance.set_task(None, task_instance)
                        vl_genie_instance.score_obj["by_task"] += task_instance["matchScore"]

                else:
                    # If a NON-FILTER task has an attribute that is NOT in the combos (means it was ambiguous), then No Need to Apply this FILTER.
                    # E.g. We don't want IMDB Rating > 5 to be applied to a VIS design with Rotten Tomatoes Rating
                    if any([attr not in attr_list for attr in task_instance["attributes"]]):
                        continue

                    if task == "derived_value":
                        # If there is NO Datatype Ambiguity, then apply the Derived Value Task. Else let it be the way it is.
                        # Datatype ambiguity example: "SUM(Genre)" is NOT possible because Genre is a Nominal attribute.
                        if not (task_instance["isValueAmbiguous"] and task_instance["meta"]["value_ambiguity_type"] == "datatype"):
                            if design["vis_type"] in ["histogram", "boxplot"]:
                                return None

                            # Iterate over all encodings and if the corresponding attribute matches that in the task, then UPDATE the "aggregate".
                            # Although, if the task is IMPLICITly derived_value (which means agg = AVG), then let the agg in the `design` take preference because the `design` also has SUM for a stacked-bar chart output visualizations -- those musn't be overridden to AVG as it would be wrong.
                            for dimension in design["mandatory"]:
                                attr = design[dimension]["attr"]
                                if attr in task_instance["attributes"] and task_instance["inferenceType"] == "explicit":
                                    vl_genie_instance.score_obj["by_task"] += task_instance["matchScore"]

                                    datatype = self.nl4dv_instance.data_genie_instance.data_attribute_map[attr]["dataType"]
                                    new_agg = constants.operator_symbol_mapping[task_instance["operator"]]
                                    vl_genie_instance.set_encoding(dimension, attr, datatype, new_agg)

                    elif task == "distribution":
                        # Increment score by_task
                        vl_genie_instance.score_obj["by_task"] += task_instance["matchScore"]

                    elif task == "correlation":
                        # For correlations, there should be NO aggregation between the attributes
                        for dimension in design['mandatory']:
                            if design[dimension]["attr"] in task_instance["attributes"]:
                                # If there exists some aggregate already, then this is a CONFLICT and we should DEDUCT points
                                if design[dimension]['agg'] is not None:
                                    vl_genie_instance.score_obj["by_task"] -= 1

                                design[dimension]['agg'] = None
                                vl_genie_instance.set_encoding_aggregate(dimension, None)

                        # Correlation < scatterplot (mark type = point)
                        vl_genie_instance.set_vis_type("scatterplot")

                        # Increment score by_task
                        vl_genie_instance.score_obj["by_task"] += task_instance["matchScore"]

                    elif task == "find_extremum" or task == "sort":
                        # If there is NO Datatype Ambiguity, then apply the Derived Value Task. Else let it be the way it is.
                        # Datatype ambiguity example: "SUM(Genre)" is NOT possible because Genre is a Nominal attribute.
                        if not (task_instance["isValueAmbiguous"] and task_instance["meta"]["value_ambiguity_type"] == "datatype"):

                            # Iterate over all encodings and if the corresponding attribute matches that in the task, then UPDATE the "aggregate".
                            for dimension in design["mandatory"]:
                                attr = design[dimension]["attr"]
                                if attr in task_instance["attributes"]:
                                    vl_genie_instance.score_obj["by_task"] += task_instance["matchScore"]
                                    vl_genie_instance.set_task(dimension, task_instance)

                    elif task == "trend":
                        pass

        # If explicit VIS is specified, then override it
        # TODO:- There a few vis (mark) types that are NOT sensible, e.g. asking a scatterplot for a piechart design or a linechart for a boxplot base design. Filter these designs out!
        if self.nl4dv_instance.extracted_vis_type:

            # A design with PIECHART / DONUTCHART as a base should NOT be attempted to be transformed for a different mark type. Note: It has thetas, colors as opposed to x, y.
            if self.nl4dv_instance.extracted_vis_type not in ["piechart", "donutchart"] and design["vis_type"] in ["piechart", "donutchart"]:
                return None

            # PIE CHART + DONUT CHART
            # Can happen between 2 attributes {QN, QO} combinations
            if self.nl4dv_instance.extracted_vis_type in ["piechart", "donutchart"]:
                if attr_type_combo not in ["QN", "QO"]:
                    print("Pie Chart not compatible / not supported for your query.")
                    return None

            # HISTOGRAM
            elif self.nl4dv_instance.extracted_vis_type == "histogram":
                if attr_type_combo not in ["Q", "N", "O", "T"]:
                    print("Histogram not compatible / not supported for your query.")
                    return None

            # STRIP PLOT
            elif self.nl4dv_instance.extracted_vis_type == "stripplot":
                # Stripplot is indicative of a DISTRIBUTION Task. All aggregations should be removed.
                for dimension in design['mandatory']:
                    # If there exists some aggregate already, then this is a CONFLICT and we should DEDUCT points
                    if design[dimension]['agg'] is not None:
                        vl_genie_instance.score_obj["by_vis"] -= 1

                    design[dimension]['agg'] = None
                    vl_genie_instance.set_encoding_aggregate(dimension, None)

            # BAR CHART
            elif self.nl4dv_instance.extracted_vis_type == "barchart":
                pass

            # LINE CHART
            elif self.nl4dv_instance.extracted_vis_type == "linechart":
                pass

            # AREA CHART
            elif self.nl4dv_instance.extracted_vis_type == "areachart":
                if design["vis_type"] == "barchart":
                    return None

            # SCATTERPLOT
            elif self.nl4dv_instance.extracted_vis_type == "scatterplot":
                # For scatterplots, treat it as a Correlation task. There should be NO aggregation between the attributes,
                # and mark type should be "point"
                for dimension in design['mandatory']:
                    # If there exists some aggregate already, then this is a CONFLICT and we should DEDUCT points
                    if design[dimension]['agg'] is not None:
                        vl_genie_instance.score_obj["by_task"] -= 1

                    design[dimension]['agg'] = None
                    vl_genie_instance.set_encoding_aggregate(dimension, None)

                    # Correlation < scatterplot (mark type = point)
                    vl_genie_instance.set_vis_type("scatterplot")

            # BOX PLOT
            elif self.nl4dv_instance.extracted_vis_type == "boxplot":
                if "Q" not in attr_type_combo:
                    print("Box Plot requires at least one continuous axis. Not compatible / supported for your query.")
                    return None

            # Set the VIS mark type in the vl_genie_instance
            vl_genie_instance.set_vis_type(self.nl4dv_instance.extracted_vis_type)

            # just here because the user/developer explicitly requested this
            vl_genie_instance.score_obj["by_vis"] += self.nl4dv_instance.match_scores['vis']['explicit']

        else:
            # A few designs can be tagged as "not_suggested_by_default",
            # e.g. 1: in absence of a task, there's no need to show both DERIVED_VALUE (barchart + mean) and DISTRIBUTION (stripplot) implicit tasked visualizations
            # e.g. 2: for a specific task, if there are 2 equivalent visual recommendations, e.g. line chart and area chart, nl4dv could suggest just one to keep it simple.
            if design["not_suggested_by_default"]:
                return None

        # Encode the label attribute as a TOOLTIP to show the dataset label on hover.
        # Note: This will ONLY be added when there is NO aggregation, i.e., all data points are visible.
        if self.nl4dv_instance.label_attribute is not None:
            vl_genie_instance.add_label_attribute_as_tooltip(self.nl4dv_instance.label_attribute)

        # AESTHETICS
        # ------------------
        # Format ticks (e.g. 10M, 1k, ... ) for Quantitative axes
        vl_genie_instance.add_tick_format()
        # ------------------

        # Enable Tooltips
        # ------------------
        vl_genie_instance.add_tooltip()
        # ------------------

        #  Finally, let"s set the data and Rock"n Roll!
        # ------------------
        vl_genie_instance.set_data(self.nl4dv_instance.data_url, self.nl4dv_instance.data_url_type)
        # ------------------

        return vl_genie_instance

    # Return a Data Table in Vega-Lite
    def create_datatable_vis(self, sorted_combo):

        # Create a new base Vega-Lite Spec
        vl_genie_instance = VLGenie()

        # Set the explicit_vis_type to a datatable and then make relevant transforms there.
        vl_genie_instance.set_vis_type("datatable")

        for attr in sorted_combo:
            # Create a column with mark type = text
            vl_genie_instance.create_and_add_column_to_datatable(attr)

            # Append the scores
            vl_genie_instance.score_obj["by_attributes"] += self.nl4dv_instance.extracted_attributes[attr]["matchScore"]

            # Try and apply a FILTER task even to the DataTable fallback visualization.
            for task in self.nl4dv_instance.extracted_tasks:
                for task_instance in self.nl4dv_instance.extracted_tasks[task]:
                    if task == "filter":
                        # If there is NO Datatype Ambiguity, then apply the Filter Task. Else let it be the way it is.
                        # Datatype ambiguity example: "Content Rating > 5" is NOT possible because Content Rating is a Nominal attribute.
                        if not (task_instance["isValueAmbiguous"] and task_instance["meta"]["value_ambiguity_type"] == "datatype"):
                            vl_genie_instance.set_tasks_to_datatable(None, task_instance)
                            vl_genie_instance.score_obj["by_task"] += task_instance["matchScore"]

        # Since we are counting the `by_task` score multiple times (equal to the number of columns), we need to normalize it to a VIS level.
        vl_genie_instance.score_obj["by_task"] /= len(sorted_combo)

        #  Set the data
        vl_genie_instance.set_data(self.nl4dv_instance.data_url, self.nl4dv_instance.data_url_type)

        # Create the Visualization object to return
        vis_object = {
            "score": sum(vl_genie_instance.score_obj.values()),
            "scoreObj": vl_genie_instance.score_obj,
            "attributes": sorted_combo,
            "visType": "datatable",
            "queryPhrase": None,
            "tasks": list(self.nl4dv_instance.extracted_tasks.keys()),
            "inferenceType": 'implicit' if self.nl4dv_instance.extracted_vis_type is None else 'explicit',
            "vlSpec": vl_genie_instance.vl_spec
        }

        return vis_object

