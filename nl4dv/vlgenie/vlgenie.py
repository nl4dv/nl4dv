from nl4dv.utils import constants, helpers


class VLGenie():

    def __init__(self):

        self.vl_spec = dict()
        self.vl_spec['$schema'] = 'https://vega.github.io/schema/vega-lite/v4.json'
        self.vl_spec['mark'] = dict()
        self.vl_spec['encoding'] = dict()
        self.vl_spec['transform'] = list()
        self.bin = False

        # Score object
        self.score_obj = {
            "by_attributes": 0,
            "by_task": 0,
            "by_vis": 0
        }

    def set_vis_type(self, vis):

        if vis == 'histogram':
            self.vl_spec['mark']['type'] = 'bar'
            self.bin = True

        elif vis == 'barchart':
            self.vl_spec['mark']['type'] = 'bar'

        elif vis == 'linechart':
            self.vl_spec['mark']['type'] = 'line'

        elif vis == 'areachart':
            self.vl_spec['mark']['type'] = 'area'

        elif vis == 'scatterplot':
            self.vl_spec['mark']['type'] = 'point'

        elif vis == 'boxplot':
            self.vl_spec['mark']['type'] = 'boxplot'

        elif vis == 'stripplot':
            self.vl_spec['mark']['type'] = 'tick'

        elif vis == 'piechart':
            self.vl_spec['mark']['type'] = 'arc'

        elif vis == 'donutchart':
            self.vl_spec['mark']['type'] = 'arc'
            # ToDo:- Smartly set the below value depending on the chart
            # The below value is in Pixels and independent of the generated chart dimensions which can be problematic when there are single v/s multiple donut charts.
            # Thus, setting the innerRadius value to 50 for now. Developers will have to override it downstream.
            self.vl_spec['mark']['innerRadius'] = 50

        elif vis == 'datatable':
            # Remove unneeded encodings
            del self.vl_spec['mark']
            del self.vl_spec['encoding']

            # Derive a new "row_number" variable with a sequence of numbers (used as index / counter later on)
            self.vl_spec["transform"] = [{
                "window": [{"op": "row_number", "as": "row_number"}]
            }]

            # Horizontally concatenate each attribute's column (VIS with mark type = text)
            self.vl_spec["hconcat"] = []

    def create_and_add_column_to_datatable(self, attr):

        # VL specification for a column of text. Use the row_number as the y_axis encoding to render vertically. Sly!
        column = {
            "width": 150,
            "title": attr,
            "mark": "text",
            "transform": [],
            "encoding": {
                "text": {"field": attr, "type": "nominal"},
                "y": {"field": "row_number", "type": "ordinal", "axis": None}
            }
        }
        self.vl_spec["hconcat"].append(column)

    def set_tasks_to_datatable(self, dim, task):

        for column in self.vl_spec["hconcat"]:
            if task["task"] == 'filter':
                if task["operator"] == 'IN':
                    for attr in task['attributes']:
                        column['transform'].append({'filter': {"field": attr, "oneOf": task["values"]}})
                elif task["operator"] == 'RANGE':
                    for attr in task['attributes']:
                        column['transform'].append({"filter": {"field": attr, "range": task["values"]}})
                elif task["operator"] == 'NOT RANGE':
                    for attr in task['attributes']:
                        # self.vl_spec['transform'].append({"filter": {"field": attr, "gte": task["values"][1], "lte": task["values"][0]}})
                        column['transform'].append({"filter": {"not": {"field": attr, "range": task["values"]}}})
                else:
                    for attr in task['attributes']:
                        symbol = constants.operator_symbol_mapping[task["operator"]]
                        if helpers.isfloat(task["values"][0]) or helpers.isint(task["values"][0]):
                            column['transform'].append({'filter':'lower(datum["{}"]) {} {}'.format(attr, symbol, task["values"][0])})
                        elif helpers.isdate(task["values"][0]):
                            column['transform'].append({'filter':'lower(datum["{}"]) {} "{}"'.format(attr, symbol, task["values"][0])})


    def unset_encoding(self, dim):
        if dim in self.vl_spec['encoding']:
            del self.vl_spec['encoding'][dim]

    def get_encoding(self, dim):
        return self.vl_spec['encoding'][dim]

    def set_encoding_aggregate(self, dim, aggregate):
        if aggregate is not None:
            self.vl_spec['encoding'][dim]['aggregate'] = aggregate
        else:
            if 'aggregate' in self.vl_spec['encoding'][dim]:
                del self.vl_spec['encoding'][dim]['aggregate']

    def set_encoding(self, dim, attr, attr_type, aggregate):

        self.vl_spec['encoding'][dim] = dict()
        self.vl_spec['encoding'][dim]['field'] = attr
        self.vl_spec['encoding'][dim]['type'] = constants.vl_attribute_types[attr_type]
        if aggregate is not None:
            self.vl_spec['encoding'][dim]['aggregate'] = aggregate

        if dim == 'x':
            if self.bin:
                self.vl_spec['encoding'][dim]['bin'] = True

    def set_task(self, dim, task):
        if task["task"] == 'find_extremum' or task["task"] == "sort":
            if dim is None:
                dim = 'y'
            if task["operator"] == 'MIN':
                if dim == 'x':
                    if 'y' in self.vl_spec['encoding']:
                        self.vl_spec['encoding']['y']['sort'] = 'x'
                elif dim == 'y':
                    if 'x' in self.vl_spec['encoding']:
                        self.vl_spec['encoding']['x']['sort'] = 'y'
            elif task["operator"] == 'MAX':
                if dim == 'x':
                    if 'y' in self.vl_spec['encoding']:
                        self.vl_spec['encoding']['y']['sort'] = '-x'
                elif dim == 'y':
                    if 'x' in self.vl_spec['encoding']:
                        self.vl_spec['encoding']['x']['sort'] = '-y'

        elif task["task"] == 'filter':
            if task["operator"] == 'IN':
                for attr in task['attributes']:
                    self.vl_spec['transform'].append({'filter': {"field": attr, "oneOf": task["values"]}})
            elif task["operator"] == 'RANGE':
                for attr in task['attributes']:
                    self.vl_spec['transform'].append({"filter": {"field": attr, "range": task["values"]}})
            elif task["operator"] == 'NOT RANGE':
                for attr in task['attributes']:
                    # self.vl_spec['transform'].append({"filter": {"field": attr, "gte": task["values"][1], "lte": task["values"][0]}})
                    self.vl_spec['transform'].append({"filter": {"not": {"field": attr, "range": task["values"]}}})
            else:
                for attr in task['attributes']:
                    symbol = constants.operator_symbol_mapping[task["operator"]]
                    if helpers.isfloat(task["values"][0]) or helpers.isint(task["values"][0]):
                        self.vl_spec['transform'].append({'filter':'lower(datum["{}"]) {} {}'.format(attr, symbol, task["values"][0])})
                    elif helpers.isdate(task["values"][0]):
                        self.vl_spec['transform'].append({'filter':'lower(datum["{}"]) {} "{}"'.format(attr, symbol, task["values"][0])})

    def set_data(self, dataUrl, dataType="csv"):
        # type: (list, str) -> None
        """
        Set domain data for the visualization

        """
        self.vl_spec['data'] = {'url': dataUrl, 'format': {'type': dataType}}

    def add_tick_format(self):
        for dim in self.vl_spec['encoding']:
            if dim in ['x','y'] and self.vl_spec['encoding'][dim]['type'] == 'quantitative':
                if 'axis' not in self.vl_spec['encoding'][dim]:
                    self.vl_spec['encoding'][dim]['axis'] = dict()
                self.vl_spec['encoding'][dim]['axis']["format"] = "s"

    def add_tooltip(self):
        self.vl_spec['mark']['tooltip'] = True

    def add_label_attribute_as_tooltip(self, label_attribute):
        # Check if any of the AXES (encodings) have existing aggregations. If not, then add tooltip which is the label
        has_aggregate = False
        for encoding in self.vl_spec['encoding']:
            if 'aggregate' in self.vl_spec['encoding'][encoding] and self.vl_spec['encoding'][encoding]['aggregate'] is not None:
                has_aggregate = True
                break

        if not has_aggregate:
            self.vl_spec['encoding']['tooltip'] = dict()
            self.vl_spec['encoding']['tooltip']["field"] = label_attribute
