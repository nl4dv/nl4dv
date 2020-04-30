from nl4dv.utils import constants

class VegaWrapper():
    def __init__(self):
        self.vegaObject = dict()
        self.vegaObject['$schema'] = 'https://vega.github.io/schema/vega-lite/v4.json'
        self.vegaObject['mark'] = {'tooltip': True}
        self.vegaObject['encoding'] = dict()
        self.vegaObject['transform'] = list()

        self.xAttr = None
        self.yAttr = None
        self.xAttrType = None
        self.yAttrType = None
        self.bin = False
        self.isExplicit = False
        self.vis = None

        self.data_type_mapping = {
            'Q': 'quantitative',
            'N': 'nominal',
            'T': 'temporal',
            'O': 'ordinal',
        }

    def get_recommended_vis_type(self):
        # type: (None) -> (str, bool)
        """
        Get visualization to be rendered by vega

        """
        return self.vis, self.isExplicit

    def set_recommended_vis_type(self, vis, is_explicit):
        # type: (str, bool) -> None
        """
        Set visualization to be rendered by vega

        """
        self.isExplicit = is_explicit
        self.vis = vis
        if vis == 'histogram':
            self.vegaObject['mark']['type'] = 'bar'
            self.bin = True

        elif vis == 'barchart':
            self.vegaObject['mark']['type'] = 'bar'

        elif vis == 'linechart':
            self.vegaObject['mark']['type'] = 'line'

        elif vis == 'areachart':
            self.vegaObject['mark']['type'] = 'area'

        elif vis == 'scatterplot':
            self.vegaObject['mark']['type'] = 'point'

        elif vis == 'boxplot':
            self.vegaObject['mark']['type'] = 'boxplot'

        elif vis == 'stripplot':
            self.vegaObject['mark']['type'] = 'tick'

        elif vis == 'piechart':
            self.vegaObject['mark']['type'] = 'arc'

        elif vis == 'donutchart':
            self.vegaObject['mark']['type'] = 'arc'
            self.vegaObject['mark']['innerRadius'] = 50

    def unset_encoding(self, dimension):
        # type: (str, str, str) -> None
        """
        Set encoding for a given dimension

        """
        if dimension in self.vegaObject['encoding']:
            del self.vegaObject['encoding'][dimension]
            self.xAttr = None
            self.xAttrType = None
            self.bin = False
            self.yAttr = None
            self.yAttrType = None

    def get_encoding(self, dimension):
        # type: (str) -> dict()
        """
        Get encoding for a given dimension

        """
        return self.vegaObject['encoding'][dimension]

    def set_encoding_aggregate(self, dimension, aggregate):
        self.vegaObject['encoding'][dimension]['aggregate'] = aggregate

    def set_encoding(self, dimension, attr, attrType, aggregate=None):
        # type: (str, str, str) -> None
        """
        Set encoding for a given dimension

        """
        vegaAattrType = self.data_type_mapping[attrType]
        self.vegaObject['encoding'][dimension] = {
            'field': attr,
            'type': vegaAattrType,
        }

        if aggregate is not None:
            self.vegaObject['encoding'][dimension]['aggregate'] = aggregate

        if dimension == 'x':
            self.xAttr = attr
            self.xAttrType = vegaAattrType

            if self.bin:
                self.vegaObject['encoding'][dimension]['bin'] = True

        elif dimension == 'y':
            self.yAttr = attr
            self.yAttrType = vegaAattrType

    def set_task(self, dimension, task):
        # type: (str, dict) -> None
        """
        Set task

        """
        if task is None:
            return

        if task["task"] == 'derived_value':
            if dimension is None:
                if self.vis in ["piechart", "donutchart"]:
                    dimension = 'theta'
                else:
                    dimension = 'y'

            self.vegaObject['encoding'][dimension]['aggregate'] = constants.operator_symbol_mapping[task["operator"]]

        elif task["task"] == 'find_extremum':
            if dimension is None:
                dimension = 'y'
            if task["operator"] == 'MIN':
                if dimension == 'x':
                    self.vegaObject['encoding']['y']['sort'] = 'x'
                elif dimension == 'y':
                    self.vegaObject['encoding']['x']['sort'] = 'y'
            elif task["operator"] == 'MAX':
                if dimension == 'x':
                    self.vegaObject['encoding']['y']['sort'] = '-x'
                elif dimension == 'y':
                    self.vegaObject['encoding']['x']['sort'] = '-y'

        elif task["task"] == 'filter':
            if task["operator"] == 'IN':
                for at in task['attributes']:
                    self.vegaObject['transform'].append({'filter': {"field": at, "oneOf": task["values"]}})
            elif task["operator"] == 'RANGE':
                for at in task['attributes']:
                    self.vegaObject['transform'].append({"filter": {"field": at, "range": task["values"]}})
            elif task["operator"] == 'NOT RANGE':
                for at in task['attributes']:
                    # self.vegaObject['transform'].append({"filter": {"field": at, "gte": task["values"][1], "lte": task["values"][0]}})
                    self.vegaObject['transform'].append({"filter": {"not": {"field": at, "range": task["values"]}}})

            else:
                for at in task['attributes']:
                    symbol = constants.operator_symbol_mapping[task["operator"]]
                    self.vegaObject['transform'].append({'filter':'lower(datum["{}"]) {} {}'.format(at, symbol, task["values"][0])})

        elif task["task"] == 'distribution':
            # ToDo:- what to do really? The attribute match will take care of default viz any way
            pass

        elif task["task"] == 'correlation':
            pass
            # self.set_recommended_vis_type('scatterplot')
            # self.set_encoding('y', attrName, 'QUANTITATIVE', aggregate=None)

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

            self.vegaObject['transform'].append(window_transform)
            self.vegaObject['encoding'][dimension]['field'] = 'PercentOfTotal'
            self.vegaObject['transform'].append({'filter':'datum["{}"] {} {}'.format("PercentOfTotal", ">", "5")})

            if 'aggregate' in self.vegaObject['encoding'][dimension]:
                del self.vegaObject['encoding'][dimension]['aggregate']

    def set_data(self, dataUrl):
        # type: (list) -> None
        """
        Set domain data for the visualization

        """
        self.vegaObject['data'] = {'url': dataUrl, 'format': {'type': 'csv'}}


    def add_tick_format(self):
        for dimension in self.vegaObject['encoding']:
            if dimension in ['x','y'] and self.vegaObject['encoding'][dimension]['type'] == 'quantitative':
                if 'axis' not in self.vegaObject['encoding'][dimension]:
                    self.vegaObject['encoding'][dimension]['axis'] = {}
                self.vegaObject['encoding'][dimension]['axis']["format"] = "s"


    def add_label_attribute_as_tooltip(self, label_attribute):
        # Check if any of the AXES (encodings) have existing aggregations. If not, then add tooltip which is the label
        has_aggregate = False
        for encoding in self.vegaObject['encoding']:
            if 'aggregate' in self.vegaObject['encoding'][encoding] and self.vegaObject['encoding'][encoding]['aggregate'] is not None:
                has_aggregate = True

        if not has_aggregate:
            self.vegaObject['encoding']['tooltip'] = {
                "field": label_attribute
            }
