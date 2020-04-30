from nl4dv import *
from nl4dv.utils import constants
import pytest
import pandas as pd
import os

nl4dv_instance = NL4DV(dependency_parser="stanford",
                           path_to_models_jar=os.path.join("examples","assets","jars","stanford-english-corenlp-2018-10-05-models.jar"),
                           path_to_parser_jar=os.path.join("examples","assets","jars","stanford-parser.jar"))


filename = os.path.join('nl4dv','tests','queries.xlsx')
@pytest.fixture(scope='class')
def read_queries(request):
    dataset = request.param
    queries = pd.read_excel(filename, sheet_name=dataset, index_col=1)
    nl4dv_instance.set_data(data_url=os.path.join("examples","assets","data",dataset + ".csv"),
                            alias_url=os.path.join("examples","assets","aliases",dataset + ".json"))
    return queries


@pytest.mark.parametrize("read_queries", ["euro"], indirect=True, scope="class")
class TestSoccerQueriesClass:
    def test_row_count(self, read_queries):
        errors = []
        for query_index, row in read_queries.iterrows():
            output = json.loads(json.dumps(nl4dv_instance.analyze_query(str(query_index)), default=helpers.set_default))
            if set(output["attributeMap"].keys()) != set(row["attributes"].split(",")):
                errors.append(1)
        assert len(errors) == 0


@pytest.mark.parametrize("read_queries", ["cereals"], indirect=True, scope="class")
class TestCerealsQueriesClass:
    def test_row_count(self, read_queries):
        errors = []
        for query_index, row in read_queries.iterrows():
            output = json.loads(json.dumps(nl4dv_instance.analyze_query(str(query_index)), default=helpers.set_default))
            if set(output["attributeMap"].keys()) != set(row["attributes"].split(",")):
                errors.append(1)
        assert len(errors) == 0


@pytest.mark.parametrize("read_queries", ["cars"], indirect=True, scope="class")
class TestCarsQueriesClass:
    def test_row_count(self, read_queries):
        errors = []
        for query_index, row in read_queries.iterrows():
            output = json.loads(json.dumps(nl4dv_instance.analyze_query(str(query_index)), default=helpers.set_default))
            if set(output["attributeMap"].keys()) != set(row["attributes"].split(",")):
                errors.append(1)
        assert len(errors) == 0
