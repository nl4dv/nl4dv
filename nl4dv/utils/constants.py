# Map of "visualizations" that can be explicitly requested and their corresponding keywords to look for in the query.
# allow ' ' (space) in keywords? eg. bar chart / scatter plot ,etc ?
vis_keyword_map = {
    'barchart': {'bar chart', 'barchart', 'bar graph'},
    'scatterplot': {'scatter plot', 'scatterplot', 'scatter'},
    'boxplot': {'box plot', 'boxplot'},
    'linechart': {'time series', 'timeseries', 'linechart', 'line chart', 'line graph'},
    'areachart': {'area chart', 'areachart', 'area graph'},
    'stripplot': {'tick plot', 'tickplot', 'strip plot', 'stripplot'},
    'piechart': {'pie chart', 'piechart'},
    'donutchart': {'donut chart', 'donutchart'},
    'histogram': {'histogram'}
}

# Map of "tasks" that can be performed and their corresponding keywords to look for in the query.
task_keyword_map = {

    # -----------------------------------------
    # Find Extremum
    # -----------------------------------------
    "rank": [("find_extremum", "MIN")],

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
    "sort": [("sort", "MIN")],
    "descending": [("sort", "MAX")],
    "ascending": ["sort", "MIN"],
    # -----------------------------------------
    # Filter
    # -----------------------------------------
    "after": [("filter", "GT")],
    "before": [("filter", "LT")],
    "since": [("filter", "GT")],
    "until": [("filter", "LT")],
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
    "cumulative": [("derived_value", "SUM")],
    # -----------------------------------------

    # -----------------------------------------
    # Characterize Distribution
    # -----------------------------------------
    "distribute": [("distribution", None)],
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
    "relationship": [("correlation", None)],
    # -----------------------------------------
    # Negation
    # -----------------------------------------
    "not": [("negation", None)],

    # -----------------------------------------
    # Equality
    # -----------------------------------------
    "equals": [("filter", "EQ")],
    "equal": [("filter", "EQ")],

    # -----------------------------------------
    # Trend
    # -----------------------------------------
    "trend": [("trend", None)]
}

followup_reserve_words = [
    "all",
    "only",
    "as",
    "well",
    "too"
]

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

followup_keyword_map = {
    ## Direct action associated with these keywords


    "put": [("addition", "add")],
    "add": [("addition", "add")],
    # "group by": [("addition", "add")], #Limitation: Group by is not being used as a task, but being used as a keyword (e.g. groupby salary will give an incorrect visualization - it will not bin by salary, but it might add salary to the next encoding channel)
    "remove": [("removal", "remove")],
    "delete": [("removal", "remove")],
    "replace": [("replacement", "replace")],
    "sort": [("addition", "add")],
    "drop": [("removal", "remove")],
    "unassign": [("removal", "remove")],
    "discard": [("removal", "remove")],
    "undo": [("removal", "remove")]

}

implicit_followup_keyword_map = {
    ## Keywords that support actions


    # -----------------------------------------
    # Dicey: Can be used in a standalone query
    # Not dicey: Will only be used in a follow-up query
    # -----------------------------------------
    #Explore creating an ordered dictionary/prioirity list to conserve priority/importance of the occurrence of the below keywords
    "also": [("also", "add", "ambiguous")], #dicey
    "as well": [("aswell", "add", "ambiguous")], #dicey
    "only": [("only", "remove_only", "ambiguous")], #not dicey
    "instead of": [("insteadof", "replace", "not ambiguous")], #not dicey
    "rather than": [("ratherthan", "replace", "not ambiguous")], #not dicey
    "do n't": [("dont", "remove", "not ambiguous")], #query parser breaks "don't" into 2 tokens, not dicey
    "do not": [("dont", "remove", "not ambiguous")], #not dicey
    "how about": [("howabout", "replace", "ambiguous")], #dicey
    "group by": [("groupby", "add", "not ambiguous")], #dicey #group by should be explicit rather than implicit
    "instead": [("instead", "replace", "ambiguous")],  #dicey
    "what about": [("whatabout", "replace", "ambiguous")]




}

## Split implcit follow up keyword map into one dictionary for ambiguous or nonambiguous
## Keep only a two tuple for implicit follow up keyword

filter_followup_keyword_map = {
    "all" : ["remove", 1],
    "instead of" : ["replace", 0],
    "rather than" : ["replace", 0],
    "remove" : ["remove_addition", 0],
    "filter" : ["add_ambiguous", 0],
    "do n't": ["remove_addition", 0],
    "do not": ["remove_addition", 0],
    "without": ["without", 0],
    "too" : ["add", 0],
    "as well" : ["add", 0],
    "instead": ["replace", 0],
    "only": ["replace", 0]
}
# Regular Expressions with their corresponding FORMATs and Examples
date_regexes = [
    # Format:
        # MM*DD*YY(YY) where * ∈ {. - /}
    # Examples:
        # 12.24.2019
        # 12:24:2019
        # 12-24-2019
        # 12/24/2019
        # 1/24/2019
        # 07/24/2019
        # 1/24/20
    [['%m/%d/%Y', '%m/%d/%y'], "([1][0-2]|[0]?[1-9])[-.\/]([1|2][0-9]|[3][0|1]|[0]?[1-9])[-.\/]([1-9][0-9]{3}|[0-9]{2})"],
    # Format:
        # YY(YY)*MM*DD where * ∈ {. - /}
    # Examples:
        # 2019.12.24
        # 2019.12.24
        # 2019-12-24
        # 2019/12/24
        # 2019/1/24
        # 2019/07/24
        # 20/1/24
    [['%Y/%m/%d', '%y/%m/%d'], "([1-9][0-9]{3}|[0-9]{2})[-.\/]([1][0-2]|[0]?[1-9])[-.\/]([1|2][0-9]|[3][0|1]|[0]?[1-9])"],
    # Format:
        # DD*MM*YY(YY) where * ∈ {. - /}
    # Examples:
        # 24.12.2019
        # 24:12:2019
        # 24-12-2019
        # 24/12/2019
        # 24/1/2019
        # 24/07/2019
        # 24/1/20
    [['%d/%m/%Y', '%d/%m/%y'], "([1|2][0-9]|[3][0|1]|[0]?[1-9])[-.\/]([1][0-2]|[0]?[1-9])[-.\/]([1-9][0-9]{3}|[0-9]{2})"],
    # Formats:
        # DD*MMM(M)*YY(YY) where * ∈ {. - / <space>}
    # Examples:
        # 8-January-2019
        # 31 Dec 19
    [['%d/%b/%Y', '%d/%B/%Y', '%d/%b/%y', '%d/%B/%y'], "([1|2][0-9]|[3][0|1]|[0]?[1-9])[-.\/\s](January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[-.\/\s]([1-9][0-9]{3}|[0-9]{2})"],
    # Format:
        # DD*MMM(M) where * ∈ {. - / <space>}
    # Examples:
        # 31-January
        # 1 Jul
    [['%d/%b', '%d/%B'], "([1|2][0-9]|[3][0|1]|[0]?[1-9])[-.\/\s](January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"],
    # Formats:
        # MMM(M)*DD*YYY(Y) where * ∈ {. - / <space>}
    # Examples:
        # January-8-2019
        # Dec 31 19
    [['%b/%d/%Y', '%B/%d/%Y', '%b/%d/%y', '%B/%d/%y'], "(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[-.\/\s]([1|2][0-9]|[3][0|1]|[0]?[1-9])[-.\/\s]([1-9][0-9]{3}|[0-9]{2})"],
    # Format:
        # MMM(M)*DD where * ∈ {. - / <space>}
    # Examples:
        # January-31
        # Jul 1
    [['%b/%d', '%B/%d'], "(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[-.\/\s]([1|2][0-9]|[3][0|1]|[0]?[1-9])"],
    # Format:
        # YYYY
    # Examples:
        # 18XX, 19XX, 20XX
    [["%Y"], "(1[8-9][0-9][0-9]|20[0-2][0-9])"]
]
