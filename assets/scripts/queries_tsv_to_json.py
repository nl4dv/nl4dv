import pandas as pd
import json
import ast
import os
import jsbeautifier
from pprint import pprint
import ast


def CustomParser(data):
    return ast.literal_eval(str(data))


query_files_dir = os.path.join("..", "..", "..", "..", "nl4dv", "examples", "assets", "queries")
query_filenames = ["fullyspecified-attributes-tasks-vis-gpt-outputs.tsv", "underspecified-attributes-tasks-gpt-outputs.tsv", "underspecified-attributes-vis-gpt-outputs.tsv", "underspecified-attributes-gpt-outputs.tsv", "other-examples-gpt-outputs.tsv", "conversational-examples-gpt-outputs.tsv"]
output_dict = dict()
global_query_counter = 159

if __name__ == "__main__":

    # Iterate over each query file
    for query_file in query_filenames:

        # Read the datafile and iterate over it
        print(os.path.join(query_files_dir, query_file))
        df = pd.read_csv(os.path.join(query_files_dir, query_file), sep="\t", header=0)
        for index, row in df.iterrows():

            # Create and populate a query item dict/object
            query_item = dict()
            query_item["queryId"] = global_query_counter
            query_item["query"] = row["Query"]
            query_item["output"] = CustomParser(row["Output"])

            if query_file in ["fullyspecified-attributes-tasks-vis-gpt-outputs.tsv", "underspecified-attributes-tasks-gpt-outputs.tsv", "underspecified-attributes-vis-gpt-outputs.tsv", "underspecified-attributes-gpt-outputs.tsv"]:

                # Create a new key for the type of query (query file)
                query_file_key = query_file.split(".tsv")[0]
                if query_file_key not in output_dict:
                    output_dict[query_file_key] = list()

                # Append the query item to the list
                output_dict[query_file_key].append(query_item)

            
            elif query_file in ["other-examples-gpt-outputs.tsv", "conversational-examples-gpt-outputs.tsv"]:
                # Create a new key for the type of query (query file)
               
                query_file_key = query_file.split(".tsv")[0]
                if query_file_key not in output_dict:
                    output_dict[query_file_key] = dict()
                
                davo = row["Datafile"].split("/")[-1]
                dataset_key = davo.split(".csv")[0]
                # Create a new key for the dataset
                if dataset_key not in output_dict[query_file_key]:
                    output_dict[query_file_key][dataset_key] = list()

                # Create and populate a query item dict/object
                query_item = dict()
                query_item["queryId"] = global_query_counter
                query_item["query"] = row["Query"]

                # print(len(row["Output"]))
                query_item["output"] = CustomParser(row["Output"])


                # Append the query item to the list
                output_dict[query_file_key][dataset_key].append(query_item)

            # Append the query counter
            global_query_counter += 1
out_file = open("myfile.json", "w")

json.dump(output_dict, out_file, indent=4)