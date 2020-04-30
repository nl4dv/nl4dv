from nl4dv import *
from nl4dv.utils import constants
import pytest
import os


# Written using Stanford Dependency Parser considering the JARs are at the below paths.
nl4dv_instance = NL4DV(dependency_parser="stanford",
                           path_to_models_jar=os.path.join("examples","assets","jars","stanford-english-corenlp-2018-10-05-models.jar"),
                           path_to_parser_jar=os.path.join("examples","assets","jars","stanford-parser.jar"))

@pytest.fixture(scope='class')
def data_summary(request):
    dataset = request.param
    return nl4dv_instance.set_data(data_url=os.path.join("examples","assets","data",dataset + ".csv"),
                            alias_url=os.path.join("examples","assets","aliases",dataset + ".json"))


@pytest.mark.parametrize("data_summary", ["euro"], indirect=True, scope="class")
class TestSoccerDataSummaryClass:

    def test_row_count(self, data_summary):
        assert data_summary["rowCount"] == 552

    def test_column_count(self, data_summary):
        assert data_summary["columnCount"] == 8

    def test_column_types(self, data_summary):
        columns = {
            "Foot": constants.attribute_types["NOMINAL"],
            "Name": constants.attribute_types["NOMINAL"],
            "Position": constants.attribute_types["NOMINAL"],
            "Club": constants.attribute_types["NOMINAL"],
            "Country": constants.attribute_types["NOMINAL"],
            "Age": constants.attribute_types["QUANTITATIVE"],
            "Salary": constants.attribute_types["QUANTITATIVE"],
            "Goals": constants.attribute_types["QUANTITATIVE"]
        }
        errors = []
        for attr in data_summary["summary"]:
            if data_summary["summary"][attr]["dataType"] != columns[attr]:
                errors.append(1)

        assert len(errors) == 0
