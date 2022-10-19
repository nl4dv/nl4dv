# The package name is same as module name so!
from nl4dv import NL4DV
import os
import json

# -------------------- File INPUT ---------------------------
data_url = os.path.join(".", "examples", "assets", "data", "housing.csv")
alias_url = os.path.join(".", "examples", "assets", "aliases", "housing.json")
print("\nData: \n" + data_url)
print("\nAlias: \n" + alias_url)

# -------------------- QUERY INPUT ---------------------------
# query = "Show average gross for different genres over the years"
# query = "Create a histogram showing distribution of IMDB ratings"
# query = "Show average gross across genres for science fiction and fantasy movies"
# query = "Visualize budget and rating"
query = "Show average prices for different home types over the years."
print("\nQuery Input: \n" + query)

# -------------------- Dependency Parser (CHOOSE ONE out of the below 3 configurations) ---------------------------
dependency_parser_config = {'name': 'corenlp','model': os.path.join("examples","assets","jars","stanford-english-corenlp-2018-10-05-models.jar"),'parser': os.path.join("examples","assets","jars","stanford-parser.jar")}
# dependency_parser_config = {"name": "spacy", "model": "en_core_web_sm", "parser": None}
# dependency_parser_config = {"name": "corenlp-server", "url": "http://localhost:9000"} # requires the server to be running.

# Initialize NL4DV and set the above configurations
nl4dv_instance = NL4DV(verbose=False)
nl4dv_instance.set_data(data_url=data_url)
nl4dv_instance.set_alias_map(alias_url=alias_url)
nl4dv_instance.set_dependency_parser(config=dependency_parser_config)

# -------------------- Ask Query ---------------------------
nl4dv_response = nl4dv_instance.analyze_query(query)

# # -------------------- NL4DV Response ---------------------------
# print("\nData Attribute Map:")
# print(nl4dv_instance.data_genie_instance.data_attribute_map)
# print("-----------------------------------------")

print("\nAttributes List:")
print(nl4dv_response['attributeMap'].keys())

print("\nAttributeMap:")
print(nl4dv_response['attributeMap'])
print("-----------------------------------------")

print("\nTasks:")
print("\nList of Tasks:")
print(nl4dv_response['taskMap'].keys())

print("\nTaskMap:")
print(nl4dv_response['taskMap'])
print("-----------------------------------------")

print("\nList of Vis marks:")
print([vis_obj["vlSpec"]["mark"]["type"] for vis_obj in nl4dv_response['visList']])

print("\nVisList:")
print(nl4dv_response['visList'])
print("-----------------------------------------")

# -------------------- Ask Query that is automatically determined to be follow-up---------------------------
query = "As a bar chart."
print("\nQuery Input: \n" + query)
nl4dv_response = nl4dv_instance.analyze_query(query, dialog="auto")

# # -------------------- NL4DV Response ---------------------------
# print("\nData Attribute Map:")
# print(nl4dv_instance.data_genie_instance.data_attribute_map)
# print("-----------------------------------------")

print("\nAttributes List:")
print(nl4dv_response['attributeMap'].keys())

print("\nAttributeMap:")
print(nl4dv_response['attributeMap'])
print("-----------------------------------------")

print("\nTasks:")
print("\nList of Tasks:")
print(nl4dv_response['taskMap'].keys())

print("\nTaskMap:")
print(nl4dv_response['taskMap'])
print("-----------------------------------------")

print("\nList of Vis marks:")
print([vis_obj["vlSpec"]["mark"]["type"] for vis_obj in nl4dv_response['visList']])

print("\nVisList:")
print(nl4dv_response['visList'])
print("-----------------------------------------")

# -------------------- Ask a new standalone query---------------------------
query = "Correlate price and lot area"
print("\nQuery Input: \n" + query)
nl4dv_response = nl4dv_instance.analyze_query(query, dialog=False)

# # -------------------- NL4DV Response ---------------------------
# print("\nData Attribute Map:")
# print(nl4dv_instance.data_genie_instance.data_attribute_map)
# print("-----------------------------------------")

print("\nAttributes List:")
print(nl4dv_response['attributeMap'].keys())

print("\nAttributeMap:")
print(nl4dv_response['attributeMap'])
print("-----------------------------------------")

print("\nTasks:")
print("\nList of Tasks:")
print(nl4dv_response['taskMap'].keys())

print("\nTaskMap:")
print(nl4dv_response['taskMap'])
print("-----------------------------------------")

print("\nList of Vis marks:")
print([vis_obj["vlSpec"]["mark"]["type"] for vis_obj in nl4dv_response['visList']])

print("\nVisList:")
print(nl4dv_response['visList'])
print("-----------------------------------------")

# -------------------- Follow up on an older query ---------------------------
query = "Just show condos and duplexes"
print("\nQuery Input: \n" + query)
nl4dv_response = nl4dv_instance.analyze_query(query, dialog=True, dialog_id = "0", query_id = "1")

# # -------------------- NL4DV Response ---------------------------
# print("\nData Attribute Map:")
# print(nl4dv_instance.data_genie_instance.data_attribute_map)
# print("-----------------------------------------")

print("\nAttributes List:")
print(nl4dv_response['attributeMap'].keys())

print("\nAttributeMap:")
print(nl4dv_response['attributeMap'])
print("-----------------------------------------")

print("\nTasks:")
print("\nList of Tasks:")
print(nl4dv_response['taskMap'].keys())

print("\nTaskMap:")
print(nl4dv_response['taskMap'])
print("-----------------------------------------")

print("\nList of Vis marks:")
print([vis_obj["vlSpec"]["mark"]["type"] for vis_obj in nl4dv_response['visList']])

print("\nVisList:")
print(nl4dv_response['visList'])
print("-----------------------------------------")






# print("\nFull Output:")
# print(json.dumps(nl4dv_response["visList"], indent=4))
# print("-----------------------------------------")
