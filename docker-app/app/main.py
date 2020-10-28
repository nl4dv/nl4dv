from typing import Optional

from fastapi import FastAPI
from nl4dv import NL4DV
import os

# Initialize an instance of NL4DV
# ToDo: verify the path to the source data file. modify accordingly.
nl4dv_instance = NL4DV(data_url = os.path.join(".", "resources", "data", "movies-w-year.csv"))

# using Stanford Core NLP
# ToDo: verify the paths to the jars. modify accordingly.
# dependency_parser_config = {"name": "corenlp", "model": os.path.join(".", "examples","assets","jars","stanford-english-corenlp-2018-10-05-models.jar"),"parser": os.path.join(".", "examples","assets","jars","stanford-parser.jar")}

# using Stanford CoreNLPServer
# ToDo: verify the URL to the CoreNLPServer. modify accordingly.
# dependency_parser_config = {"name": "corenlp-server", "url": "http://localhost:9000"}

# using Spacy
# ToDo: ensure that the below spacy model is installed. if using another model, modify accordingly.
dependency_parser_config = {"name": "spacy", "model": "en_core_web_sm", "parser": None}

# Set the Dependency Parser
nl4dv_instance.set_dependency_parser(config=dependency_parser_config)

app = FastAPI()


@app.get("/")
def query_nl4dev(q: str = "create a barchart showing average gross across genres"):
        
    # Define a query
    query = q 

    # Execute the query
    output = nl4dv_instance.analyze_query(query)

    # Print the output
    print(output)
    return output


