# The package name is same as module name so!
from nl4dv import NL4DV
import os
import json
import pandas as pd

# -------------------- File INPUT ---------------------------
# Dependency parser configuration
dependency_parser_config = {'name': 'corenlp','model': os.path.join("examples","assets","jars","stanford-english-corenlp-2018-10-05-models.jar"),'parser': os.path.join("examples","assets","jars","stanford-parser.jar")}

# initialize the nl4dv_response and current_dataset to None
nl4dv_instance = None
current_dataset = None

# The files to batch-query NL4DV
query_files = ["fullyspecified-attributes-tasks-vis.tsv", "underspecified-attributes-tasks.tsv", "underspecified-attributes-vis.tsv", "underspecified-attributes.tsv", "other-examples.tsv"]

# Execute NL4DV on each query in each file
for query_file in query_files:

    # Read file
    df_queries = pd.read_csv(os.path.join(".", "examples", "assets", "queries", query_file), sep="\t")

    # Create new columns to store NL4DV's output
    # df_queries.drop(["Output"], axis=1, inplace=True)
    df_queries["Output"] = pd.Series(None, dtype=object)

    # Execute NL4DV on each query in each file
    for index, row in df_queries.iterrows():
        data_url = "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/" + row["Datafile"]  # Data file
        alias_url = "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/" + row["Aliasfile"]  # Alias file
        label_attribute = row["LabelAttribute"]  # Label Attributes
        query = row["Query"]   # Query

        # If it's the same dataset as in the previous iteration, no need to re-initialize NL4DV, saving time and resources in creating the dataset metadata.
        if current_dataset != data_url:
            current_dataset = data_url
            nl4dv_instance = NL4DV(verbose=False,
                                   debug=True,
                                   data_url=data_url,
                                   alias_url=alias_url,
                                   label_attribute=label_attribute,
                                   dependency_parser_config=dependency_parser_config
                                   )

        # Analyze the query using NL4DV
        nl4dv_response = nl4dv_instance.analyze_query(query)

        # Store the outputs in their respective columns.
        df_queries.at[index, 'Output'] = json.dumps(nl4dv_response)

    # Persist to file for future reference
    df_queries.to_csv(os.path.join(".", "examples", "assets", "queries", query_file), sep="\t", index=False, header=True)
