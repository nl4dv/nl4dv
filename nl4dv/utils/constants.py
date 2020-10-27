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
    'attribute': {
        'attribute_exact_match': 1,
        'attribute_similarity_match': 0.9,
        'attribute_alias_exact_match': 0.8,
        'attribute_alias_similarity_match': 0.75,
        'attribute_synonym_match': 0.5,
        'attribute_domain_value_match': 0.5,
    },
    'task': {
        'explicit': 1,
        'implicit': 0.5,
    },
    'vis': {
        'explicit': 1
    }
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
                            'encode',
                            'isLabel',
                            'metric',
                            'isAttrAmbiguous',
                            'isValueAmbiguous',
                            'confidenceObj']

attribute_types = {
    'QUANTITATIVE': 'Q',
    'NOMINAL': 'N',
    'TEMPORAL': 'T',
    'ORDINAL': 'O',
}

# NL4DV datatypes to VL datatypes mapping
vl_attribute_types = {
    'Q': 'quantitative',
    'N': 'nominal',
    'T': 'temporal',
    'O': 'ordinal',
}
