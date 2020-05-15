from nl4dv.utils import constants


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

        self.data_type_mapping = {
            'Q': 'quantitative',
            'N': 'nominal',
            'T': 'temporal',
            'O': 'ordinal',
        }

    def set_recommended_vis_type(self, vis):

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
            self.vl_spec['mark']['innerRadius'] = 50

    def unset_encoding(self, dimension):
        # type: (str, str, str) -> None
        """
        Set encoding for a given dimension

        """
        if dimension in self.vl_spec['encoding']:
            del self.vl_spec['encoding'][dimension]

    def get_encoding(self, dimension):
        # type: (str) -> dict()
        """
        Get encoding for a given dimension

        """
        return self.vl_spec['encoding'][dimension]

    def set_encoding_aggregate(self, dimension, aggregate):
        self.vl_spec['encoding'][dimension]['aggregate'] = aggregate

    def set_encoding(self, dimension, attr, attr_type, aggregate=None):
        # type: (str, str, str) -> None
        """
        Set encoding for a given dimension

        """
        vl_attr_type = self.data_type_mapping[attr_type]
        self.vl_spec['encoding'][dimension] = {
            'field': attr,
            'type': vl_attr_type,
        }

        self.vl_spec['encoding'][dimension]['aggregate'] = aggregate

        if dimension == 'x':
            if self.bin:
                self.vl_spec['encoding'][dimension]['bin'] = True

    def set_task(self, dimension, task):

        if task["task"] == 'find_extremum':
            if dimension is None:
                dimension = 'y'
            if task["operator"] == 'MIN':
                if dimension == 'x':
                    self.vl_spec['encoding']['y']['sort'] = 'x'
                elif dimension == 'y':
                    self.vl_spec['encoding']['x']['sort'] = 'y'
            elif task["operator"] == 'MAX':
                if dimension == 'x':
                    self.vl_spec['encoding']['y']['sort'] = '-x'
                elif dimension == 'y':
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
                    self.vl_spec['transform'].append({'filter':'lower(datum["{}"]) {} {}'.format(attr, symbol, task["values"][0])})

        elif task["task"] == 'outlier':
            # ToDo:- Can explore vega-lite to apply a filter like show the data points beyond the inter-quartile range?
            window_transform = {
                "transform": [{
                    "window": [{
                      "op": "sum",
                      "field": task[1],
                      "as": "TotalSum"
                    }],
                    "frame": [None, None]
                },
                {
                    "calculate": "datum." + task[1] + "/datum.TotalSum * 100",
                    "as": "PercentOfTotal"
                }]}

            self.vl_spec['transform'].append(window_transform)
            self.vl_spec['encoding'][dimension]['field'] = 'PercentOfTotal'
            self.vl_spec['transform'].append({'filter':'datum["{}"] {} {}'.format("PercentOfTotal", ">", "5")})

            if 'aggregate' in self.vl_spec['encoding'][dimension]:
                del self.vl_spec['encoding'][dimension]['aggregate']

    def set_data(self, dataUrl):
        # type: (list) -> None
        """
        Set domain data for the visualization

        """
        self.vl_spec['data'] = {'url': dataUrl, 'format': {'type': 'csv'}}

    def add_tick_format(self):
        for dimension in self.vl_spec['encoding']:
            if dimension in ['x','y'] and self.vl_spec['encoding'][dimension]['type'] == 'quantitative':
                if 'axis' not in self.vl_spec['encoding'][dimension]:
                    self.vl_spec['encoding'][dimension]['axis'] = {}
                self.vl_spec['encoding'][dimension]['axis']["format"] = "s"

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
            self.vl_spec['encoding']['tooltip'] = {
                "field": label_attribute
            }
