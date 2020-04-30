# Map of "visualizations" that can be explicitly requested and their corresponding keywords to look for in the query.
# allow ' ' (space) in keywords? eg. bar chart / scatter plot ,etc ?
vis_keyword_map = {
    'barchart': {'bar chart', 'barchart'},
    'scatterplot': {'scatter plot', 'scatterplot', 'scatter'},
    'boxplot': {'box plot', 'boxplot'},
    'linechart': {'time series', 'timeseries', 'linechart', 'line chart'},
    'areachart': {'area chart', 'areachart'},
    'stripplot': {'tick plot', 'tickplot', 'strip plot', 'stripplot'},
    'piechart': {'pie chart', 'piechart'},
    'donutchart': {'donut chart', 'donutchart'},
    'histogram': {'histogram'}
}

vis_to_task_mapping = {
    'barchart': ['distribution','derived_value'],
    'scatterplot': ['correlation'],
    'boxplot': ['distribution'],
    'linechart': ['trend'],
    'areachart': ['trend'],
    'stripplot': ['distribution'],
    'piechart': ['distribution','derived_value'],
    'donutchart': ['distribution','derived_value'],
    'histogram': ['distribution']
}

# Map of "tasks" that can be performed and their corresponding keywords to look for in the query.
task_keyword_map = {

    # -----------------------------------------
    # Find Extremum
    # -----------------------------------------
    "rank": [("find_extremum", "MIN")],
    "sort": [("find_extremum", "MIN")],
    "max": [("find_extremum", "MAX")],
    "maximum": [("find_extremum", "MAX")],
    "highest": [("find_extremum", "MAX")],
    "greatest": [("find_extremum", "MAX")],
    "largest": [("find_extremum", "MAX")],
    "biggest": [("find_extremum", "MAX")],
    "most": [("find_extremum", "MAX")],
    "min": [("find_extremum", "MIN")],
    "minimum": [("find_extremum", "MIN")],
    "smallest": [("find_extremum", "MIN")],
    "lowest": [("find_extremum", "MIN")],
    "least": [("find_extremum", "MIN")],  # Todo: dep parser can't detect
    "heaviest": [("find_extremum", "MAX")],
    "lightest": [("find_extremum", "MIN")],
    "best": [("find_extremum", "MAX")],
    "worst": [("find_extremum", "MIN")],
    # ADd SORT
    # -----------------------------------------

    # -----------------------------------------
    # Filter
    # -----------------------------------------
    "after": [("filter", "GT")],  # Todo: dep parser can't detect
    "before": [("filter", "LT")],  # Todo: dep parser can't detect
    "more": [("filter", "GT")],
    "high": [("filter", "GT")],
    "over": [("filter", "GT")],
    "higher": [("filter", "GT")],
    "greater": [("filter", "GT")],
    "larger": [("filter", "GT")],
    "bigger": [("filter", "GT")],
    "under": [("filter", "LT")],
    "less": [("filter", "LT")],
    "lower": [("filter", "LT")],
    "lesser": [("filter", "LT")],
    "smaller": [("filter", "LT")],
    "between": [("filter", "RANGE")],
    # -----------------------------------------

    # -----------------------------------------
    # Compute Derived Value
    # -----------------------------------------
    "median": [("derived_value", "MEDIAN")],
    "average": [("derived_value", "AVG")],
    "mean": [("derived_value", "AVG")],
    "sum": [("derived_value", "SUM")],
    "total": [("derived_value", "SUM")],
    # -----------------------------------------

    # -----------------------------------------
    # Characterize Distribution
    # -----------------------------------------
    "distribution": [("distribution", None)],
    "range": [("distribution", None)],
    "extent": [("distribution", None)],
    # -----------------------------------------

    # -----------------------------------------
    # Outliers / Anomalies
    # -----------------------------------------
    "outlier": [("outlier",)],
    "exception": [("outlier",)],
    # -----------------------------------------

    # -----------------------------------------
    # Correlation
    # -----------------------------------------
    "correlation": [("correlation", None)],
    "correlate": [("correlation", None)],
    "relation": [("correlation", None)],
    "relationship": [("correlation", None)],
    "relate": [("correlation", None)],
    # -----------------------------------------
    # Negation
    # -----------------------------------------
    "not": [("negation", None)],

    # -----------------------------------------
    # Equality
    # -----------------------------------------
    "equal": [("filter", "EQ")],

    # -----------------------------------------
    # Trend
    # -----------------------------------------
    "trend": [("trend", None)]

    # ToDo:- Detect Negations using dependency parsing and/or algorithms !

}

# scores given to attribute/ task/ vis matches of different types
match_scores = {
    'attribute_similarity_match': 1,
    'attribute_alias_similarity_match': 0.75,
    'attribute_synonym_match': 0.5,
    'attribute_domain_value_match': 0.5,
    'explicit_task_match': 1,
    'implicit_task_match': 0.5,
    'explicit_vis_match': 1
}

# JSON has an abbreviated version (GT) but Vega-Lite requires symbols (>)
operator_symbol_mapping = {
    "NOT RANGE": "not between",
    "GT": ">",
    "LT": "<",
    "EQ": "==",
    "SUM": "sum",
    "MEDIAN": "median",
    "AVG": "mean",
    "IN": "in",
    "RANGE": "between",
    "MAX": "max",
    "MIN": "min"
}

# keep them high, so single letter typos in shorter words are not caught. eg. with > width
match_thresholds = {
    'synonymity': 95,
    'string_similarity': 85
}

# These keys are deleted from final output since they are NOT important/critical. They are retained when the `debug` flag is true.
keys_to_delete_in_output = ['matchScore',
                            'meta',
                            'debug',
                            'score',
                            'status',
                            'scoreObj',
                            'normalized_score',
                            'encode',
                            'isLabel',
                            'metric',
                            'isAttrAmbiguous',
                            'isValueAmbiguous',
                            'confidenceObj',
                            'visType']

attribute_types = {
    'QUANTITATIVE': 'Q',
    'NOMINAL': 'N',
    'TEMPORAL': 'T',
    'ORDINAL': 'O',
}

attribute_reference_types = {
    'EXPLICIT': 'EXPLICIT',
    'IMPLICIT': 'IMPLICIT'
}

task_reference_types = {
    'EXPLICIT': 'EXPLICIT',
    'IMPLICIT': 'IMPLICIT'
}


vis_combos = {
    'Q': {
        'combination': 'Q',
        'support': True,
        'tasks': ['distribution'],
        'designs': [{
            'task': 'distribution',
            'vis_type': 'histogram',
            'mark': 'bar',
            'mandatory': ['x', 'y'],
            'priority': ['x'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'attr_ref': 'x', 'agg': 'count'}
        }, {
            'task': 'distribution',
            'vis_type': 'stripplot',
            'mark': 'tick',
            'mandatory': ['x'],
            'priority': ['x'],
            'x': {'is_defined': False, 'agg': None}
        }],
        'alternate':{}
    },  # Done
    'N': {
        'combination': 'N',
        'support': True,
        'tasks': ['distribution'],
        'designs': [{
            'task': 'distribution',
            'vis_type': 'barchart',
            'mark': 'bar',
            'mandatory': ['x', 'y'],
            'priority': ['x'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'attr_ref': 'x', 'agg': 'count'}
        }],
        'alternate':{}
    },  # Done
    'O': {
        'combination': 'O',
        'support': True,
        'tasks': ['distribution'],
        'designs': [{
            'task': 'distribution',
            'vis_type': 'barchart',
            'mark': 'bar',
            'mandatory': ['x', 'y'],
            'priority': ['x'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'attr_ref': 'x', 'agg': 'count'}
        }],
        'alternate':{}
    },  # Done
    'T': {
        'combination': 'T',
        'support': True,
        'tasks': ['trend'],
        'designs': [{
            'task': 'trend',
            'vis_type': 'linechart',
            'mark': 'line',
            'mandatory': ['x', 'y'],
            'priority': ['x'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'attr_ref': 'x', 'agg': 'count'}
        }],
        'alternate':{}
    },  # Done
    'QQ': {
        'combination': 'QQ',
        'support': True,
        'tasks': ['correlation'],
        'designs': [{
            'task': 'correlation',
            'vis_type': 'scatterplot',
            'mark': 'point',
            'mandatory': ['x', 'y'],
            'priority': ['x', 'y'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': None}
        }],
        'alternate':{}
    },  # Done
    'QN': {
        'combination': 'QN',
        'support': True,
        'tasks': ['derived_value'],
        'designs': [{
            'task': 'derived_value',
            'vis_type': 'barchart',
            'mark': 'bar',
            'mandatory': ['x', 'y'],
            'priority': ['y', 'x'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': 'mean'}
        }],
        'alternate':{}
    },  # Done
    'QO': {
        'combination': 'QO',
        'support': True,
        'tasks': ['derived_value'],
        'designs': [{
            'task': 'derived_value',
            'vis_type': 'barchart',
            'mark': 'bar',
            'mandatory': ['x', 'y'],
            'priority': ['y', 'x'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': 'mean'}
        }],
        'alternate':{}
    },  # Done
    'QT': {
        'combination': 'QT',
        'support': True,
        'tasks': ['trend'],
        'designs': [{
            'task': 'trend',
            'vis_type': 'linechart',
            'mark': 'line',
            'mandatory': ['x', 'y'],
            'priority': ['y', 'x'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': 'mean'}
        }],
        'alternate':{}
    },  # Done
    'NN': {
        'combination': 'NN',
        'support': True,
        'tasks': ['distribution'],
        'designs': [{
            'task': 'distribution',
            'vis_type': 'scatterplot',
            'mark': 'point',
            'mandatory': ['x', 'y', 'size'],
            'priority': ['x', 'y'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': None},
            'size': {'attr': None, 'is_defined': False, 'attr_ref': 'x', 'agg': 'count'}
        }, {
            'task': 'distribution',
            'vis_type': 'barchart',
            'mark': 'bar',
            'mandatory': ['x', 'y', 'color'],
            'priority': ['x', 'color'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'attr_ref': 'x', 'agg': 'count'},
            'color': {'attr': None, 'is_defined': False, 'agg': None}
        }],
        'alternate':{}
    },  # Done
    'NO': {
        'combination': 'NO',
        'support': True,
        'tasks': ['distribution'],
        'designs': [{
            'task': 'distribution',
            'vis_type': 'scatterplot',
            'mark': 'point',
            'mandatory': ['x', 'y', 'size'],
            'priority': ['x', 'y'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': None},
            'size': {'attr': None, 'is_defined': False, 'attr_ref': 'x', 'agg': 'count'}
        }, {
            'task': 'distribution',
            'vis_type': 'barchart',
            'mark': 'bar',
            'mandatory': ['x', 'y', 'color'],
            'priority': ['x', 'color'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'attr_ref': 'x', 'agg': 'count'},
            'color': {'attr': None, 'is_defined': False, 'agg': None}
        }],
        'alternate':{}
    },  # Done
    'NT': {
        'combination': 'NT',
        'support': True,
        'tasks': ['trend'],
        'designs': [{
            'task': 'trend',
            'vis_type': 'linechart',
            'mark': 'line',
            'mandatory': ['x', 'y', 'color'],
            'priority': ['color', 'x'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'attr_ref': 'x', 'agg': 'count'},
            'color': {'attr': None, 'is_defined': False, 'agg': None}
        }],
        'alternate':{}
    },  # Done
    'OO': {
        'combination': 'OO',
        'support': True,
        'tasks': ['distribution'],
        'designs': [{
            'task': 'distribution',
            'vis_type': 'scatterplot',
            'mark': 'point',
            'mandatory': ['x', 'y', 'size'],
            'priority': ['x', 'y'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': None},
            'size': {'attr': None, 'is_defined': False, 'attr_ref': 'x', 'agg': 'count'}
        }, {
            'task': 'distribution',
            'vis_type': 'barchart',
            'mark': 'bar',
            'mandatory': ['x', 'y', 'color'],
            'priority': ['x', 'color'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'attr_ref': 'x', 'agg': 'count'},
            'color': {'attr': None, 'is_defined': False, 'agg': None}
        }],
        'alternate':{}
    },  # Done
    'OT': {
        'combination': 'OT',
        'support': True,
        'tasks': ['trend'],
        'designs': [{
            'task': 'trend',
            'vis_type': 'linechart',
            'mark': 'line',
            'mandatory': ['x', 'y', 'color'],
            'priority': ['color', 'x'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'attr_ref': 'x', 'agg': 'count'},
            'color': {'attr': None, 'is_defined': False, 'agg': None}
        }],
        'alternate':{}
    },  # Done
    'TT': {
        'combination': 'TT',
        'support': False,
        'tasks': [],
        'designs': [],
        'alternate':{}
    },  # Done
    'QQQ': {
        'combination': 'QQQ',
        'support': True,
        'tasks': ['correlation'],
        'designs': [{
            'task': 'correlation',
            'vis_type': 'scatterplot',
            'mark': 'point',
            'mandatory': ['x', 'y', 'color'],
            'priority': ['x', 'y', 'color'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': None},
            'color': {'attr': None, 'is_defined': False, 'agg': None}
        },{
            'task': 'correlation',
            'vis_type': 'scatterplot',
            'mark': 'point',
            'mandatory': ['x', 'y', 'size'],
            'priority': ['x', 'y', 'size'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': None},
            'size': {'attr': None, 'is_defined': False, 'agg': None}
        }],
        'alternate':{}
    },  # Done
    'QQN': {
        'combination': 'QQN',
        'support': True,
        'tasks': ['correlation'],
        'designs': [{
            'task': 'correlation',
            'vis_type': 'scatterplot',
            'mark': 'point',
            'mandatory': ['x', 'y', 'color'],
            'priority': ['x', 'y', 'color'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': None},
            'color': {'attr': None, 'is_defined': False, 'agg': None}
        }, {
            'task': 'correlation',
            'vis_type': 'scatterplot',
            'mark': 'point',
            'mandatory': ['x', 'y', 'column', 'color'],
            'priority': ['x', 'y', 'column'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': None},
            'column': {'attr': None, 'is_defined': False, 'agg': None},
            'color': {'attr': None, 'is_defined': False, 'attr_ref': 'column', 'agg': None}
        }],
        'alternate':{}
    },  # Done
    'QQO': {
        'combination': 'QQO',
        'support': True,
        'tasks': ['correlation'],
        'designs': [{
            'task': 'correlation',
            'vis_type': 'scatterplot',
            'mark': 'point',
            'mandatory': ['x', 'y', 'column', 'color'],
            'priority': ['x', 'y', 'column'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': None},
            'column': {'attr': None, 'is_defined': False, 'agg': None},
            'color': {'attr': None, 'is_defined': False, 'attr_ref': 'column', 'agg': None}
        }, {
            'task': 'correlation',
            'vis_type': 'scatterplot',
            'mark': 'point',
            'mandatory': ['x', 'y', 'color'],
            'priority': ['x', 'y', 'color'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': None},
            'color': {'attr': None, 'is_defined': False, 'agg': None}
        }],
        'alternate':{}
    },  # Done
    'QQT': {
        'combination': 'QQT',
        'support': True,
        'tasks': ['correlation'],
        'designs': [{
            'task': 'correlation',
            'vis_type': 'scatterplot',
            'mark': 'point',
            'mandatory': ['x', 'y', 'color'],
            'priority': ['x', 'y', 'color'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': None},
            'color': {'attr': None, 'is_defined': False, 'agg': None}
        }],
        'alternate':{}
    },  # Done
    'QNN': {
        'combination': 'QNN',
        'support': True,
        'tasks': ['derived_value'],
        'designs': [{
            'task': 'derived_value',
            'vis_type': 'barchart',
            'mark': 'bar',
            'mandatory': ['x', 'y', 'color'],
            'priority': ['y', 'x', 'color'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': 'sum'},
            'color': {'attr': None, 'is_defined': False, 'agg': None}
        }, {
            'task': 'derived_value',
            'vis_type': 'barchart',
            'mark': 'bar',
            'mandatory': ['x', 'y', 'column', 'color'],
            'priority': ['y', 'column', 'x'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': 'mean'},
            'column': {'attr': None, 'is_defined': False, 'agg': None},
            'color': {'attr': None, 'is_defined': False, 'attr_ref': 'column', 'agg': None}
        },{
            'task': 'derived_value',
            'vis_type': 'scatterplot',
            'mark': 'point',
            'mandatory': ['x', 'y', 'size'],
            'priority': ['size', 'x', 'y'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': None},
            'size': {'attr': None, 'is_defined': False, 'agg': 'mean'}
        }],
        'alternate':{}
    },  # Done
    'QNO': {
        'combination': 'QNO',
        'support': True,
        'tasks': ['derived_value'],
        'designs': [{
            'task': 'derived_value',
            'vis_type': 'barchart',
            'mark': 'bar',
            'mandatory': ['x', 'y', 'color'],
            'priority': ['y', 'x', 'color'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': 'sum'},
            'color': {'attr': None, 'is_defined': False, 'agg': None}
        }, {
            'task': 'derived_value',
            'vis_type': 'barchart',
            'mark': 'bar',
            'mandatory': ['x', 'y', 'column', 'color'],
            'priority': ['y', 'column', 'x'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': 'mean'},
            'column': {'attr': None, 'is_defined': False, 'agg': None},
            'color': {'attr': None, 'is_defined': False, 'attr_ref': 'column', 'agg': None}
        }, {
            'task': 'derived_value',
            'vis_type': 'scatterplot',
            'mark': 'point',
            'mandatory': ['x', 'y', 'size'],
            'priority': ['size', 'x', 'y'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': None},
            'size': {'attr': None, 'is_defined': False, 'agg': 'mean'}
        }],
        'alternate':{}
    },  # Done
    'QNT': {
        'combination': 'QNT',
        'support': True,
        'tasks': ['derived_value'],
        'designs': [{
            'task': 'derived_value',
            'vis_type': 'linechart',
            'mark': 'line',
            'mandatory': ['x', 'y', 'color'],
            'priority': ['y', 'color', 'x'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': 'mean'},
            'color': {'attr': None, 'is_defined': False, 'agg': None}
        }, {
            'task': 'derived_value',
            'vis_type': 'linechart',
            'mark': 'line',
            'mandatory': ['x', 'y', 'column', 'color'],
            'priority': ['y', 'column', 'x'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': 'mean'},
            'column': {'attr': None, 'is_defined': False, 'agg': None},
            'color': {'attr': None, 'is_defined': False, 'attr_ref': 'column', 'agg': None}
        }, {
            'task': 'derived_value',
            'vis_type': 'barchart',
            'mark': 'bar',
            'mandatory': ['x', 'y', 'column', 'color'],
            'priority': ['y', 'x', 'column'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': 'mean'},
            'column': {'attr': None, 'is_defined': False, 'agg': None},
            'color': {'attr': None, 'is_defined': False, 'attr_ref': 'x', 'agg': None}
        }],
        'alternate':{}
    },  # Done
    'QOO': {
        'combination': 'QOO',
        'support': True,
        'tasks': ['derived_value'],
        'designs': [{
            'task': 'derived_value',
            'vis_type': 'barchart',
            'mark': 'bar',
            'mandatory': ['x', 'y', 'color'],
            'priority': ['y', 'x', 'color'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': 'sum'},
            'color': {'attr': None, 'is_defined': False, 'agg': None}
        }, {
            'task': 'derived_value',
            'vis_type': 'barchart',
            'mark': 'bar',
            'mandatory': ['x', 'y', 'column', 'color'],
            'priority': ['y', 'column', 'x'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': 'mean'},
            'column': {'attr': None, 'is_defined': False, 'agg': None},
            'color': {'attr': None, 'is_defined': False, 'attr_ref': 'column', 'agg': None}
        }, {
            'task': 'derived_value',
            'vis_type': 'scatterplot',
            'mark': 'point',
            'mandatory': ['x', 'y', 'size'],
            'priority': ['size', 'x', 'y'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': None},
            'size': {'attr': None, 'is_defined': False, 'agg': 'mean'}
        }],
        'alternate':{}
    },  # Done
    'QOT': {
        'combination': 'QOT',
        'support': True,
        'tasks': ['trend'],
        'designs': [{
            'task': 'derived_value',
            'vis_type': 'linechart',
            'mark': 'line',
            'mandatory': ['x', 'y', 'column', 'color'],
            'priority': ['y', 'column', 'x'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': 'mean'},
            'column': {'attr': None, 'is_defined': False, 'agg': None},
            'color': {'attr': None, 'is_defined': False, 'attr_ref': 'column', 'agg': None}
        }, {
            'task': 'derived_value',
            'vis_type': 'linechart',
            'mark': 'line',
            'mandatory': ['x', 'y', 'color'],
            'priority': ['y', 'color', 'x'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': 'mean'},
            'color': {'attr': None, 'is_defined': False, 'agg': None}
        }, {
            'task': 'derived_value',
            'vis_type': 'barchart',
            'mark': 'bar',
            'mandatory': ['x', 'y', 'column', 'color'],
            'priority': ['y', 'x', 'column'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'agg': 'mean'},
            'column': {'attr': None, 'is_defined': False, 'agg': None},
            'color': {'attr': None, 'is_defined': False, 'attr_ref': 'x', 'agg': None}
        }],
        'alternate':{}
    },  # Done
    'QTT': {
        'combination': 'QTT',
        'support': False,
        'designs': [],
        'tasks': [],
        'alternate':{}
    },  # Done
    'NNN': {
        'combination': 'NNN',
        'support': False,
        'designs': [],
        'tasks': [],
        'alternate':{}
    },  # Done
    'NNO': {
        'combination': 'NNO',
        'support': False,
        'designs': [],
        'tasks': [],
        'alternate':{}
    },  # Done
    'NNT': {
        'combination': 'NNT',
        'support': True,
        'tasks': ['trend'],
        'designs': [{
            'task': 'trend',
            'vis_type': 'linechart',
            'mark': 'line',
            'mandatory': ['x', 'y', 'column', 'color'],
            'priority': ['column', 'color', 'x'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'attr_ref': 'x', 'agg': 'count'},
            'column': {'attr': None, 'is_defined': False, 'agg': None},
            'color': {'attr': None, 'is_defined': False, 'agg': None}
        },{
            'task': 'trend',
            'vis_type': 'linechart',
            'mark': 'line',
            'mandatory': ['x', 'y', 'column', 'color'],
            'priority': ['color','column','x'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'attr_ref': 'x', 'agg': 'count'},
            'column': {'attr': None, 'is_defined': False, 'agg': None},
            'color': {'attr': None, 'is_defined': False, 'agg': None}
        }],
        'alternate':{}
    },  # Done
    'NOO': {
        'combination': 'NOO',
        'support': False,
        'designs': [],
        'tasks': [],
        'alternate':{}
    },  # Done
    'NOT': {
        'combination': 'NOT',
        'support': True,
        'tasks': ['trend'],
        'designs': [{
            'task': 'trend',
            'vis_type': 'linechart',
            'mark': 'line',
            'mandatory': ['x', 'y', 'column', 'color'],
            'priority': ['column', 'color', 'x'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'attr_ref': 'x', 'agg': 'count'},
            'column': {'attr': None, 'is_defined': False, 'agg': None},
            'color': {'attr': None, 'is_defined': False, 'agg': None}
        },{
            'task': 'trend',
            'vis_type': 'linechart',
            'mark': 'line',
            'mandatory': ['x', 'y', 'column', 'color'],
            'priority': ['color','column','x'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'attr_ref': 'x', 'agg': 'count'},
            'column': {'attr': None, 'is_defined': False, 'agg': None},
            'color': {'attr': None, 'is_defined': False, 'agg': None}
        }],
        'alternate':{}
    },  # Done
    'NTT': {
        'combination': 'NTT',
        'support': False,
        'designs': [],
        'tasks': [],
        'alternate':{}
    },  # Done
    'OOO': {
        'combination': 'OOO',
        'support': False,
        'designs': [],
        'tasks': [],
        'alternate':{}
    },  # Done
    'OOT': {
        'combination': 'OOT',
        'support': True,
        'tasks': ['trend'],
        'designs': [{
            'task': 'trend',
            'vis_type': 'linechart',
            'mark': 'line',
            'mandatory': ['x', 'y', 'column', 'color'],
            'priority': ['column', 'color', 'x'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'attr_ref': 'x', 'agg': 'count'},
            'column': {'attr': None, 'is_defined': False, 'agg': None},
            'color': {'attr': None, 'is_defined': False, 'agg': None}
        },{
            'task': 'trend',
            'vis_type': 'linechart',
            'mark': 'line',
            'mandatory': ['x', 'y', 'column', 'color'],
            'priority': ['color','column','x'],
            'x': {'attr': None, 'is_defined': False, 'agg': None},
            'y': {'attr': None, 'is_defined': False, 'attr_ref': 'x', 'agg': 'count'},
            'column': {'attr': None, 'is_defined': False, 'agg': None},
            'color': {'attr': None, 'is_defined': False, 'agg': None}
        }],
        'alternate':{}
    },  # Done
    'OTT': {
        'combination': 'OTT',
        'support': False,
        'designs': [],
        'tasks': [],
        'alternate':{}
    },  # Done
    'TTT': {
        'combination': 'TTT',
        'support': False,
        'designs': [],
        'tasks': [],
        'alternate':{}
    }  # Done
}
