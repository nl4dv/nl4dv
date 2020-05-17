from nl4dv import *
from nl4dv.utils import constants
import pytest
import os


class TestDataGenieClass:

    dataset_attribute_type_mapping = {
        'euro': {
            "Foot": constants.attribute_types["NOMINAL"],
            "Name": constants.attribute_types["NOMINAL"],
            "Position": constants.attribute_types["NOMINAL"],
            "Club": constants.attribute_types["NOMINAL"],
            "Country": constants.attribute_types["NOMINAL"],
            "Age": constants.attribute_types["QUANTITATIVE"],
            "Salary": constants.attribute_types["QUANTITATIVE"],
            "Goals": constants.attribute_types["QUANTITATIVE"]
        },
        'colleges': {
            "ACT Median": constants.attribute_types["QUANTITATIVE"],
            "Admission Rate": constants.attribute_types["QUANTITATIVE"],
            "Average Cost": constants.attribute_types["QUANTITATIVE"],
            "Average Faculty Salary": constants.attribute_types["QUANTITATIVE"],
            "Control": constants.attribute_types["NOMINAL"],
            "Expenditure": constants.attribute_types["QUANTITATIVE"],
            "Locale": constants.attribute_types["NOMINAL"],
            "Median Debt": constants.attribute_types["QUANTITATIVE"],
            "Median Earnings": constants.attribute_types["QUANTITATIVE"],
            "Median Family Income": constants.attribute_types["QUANTITATIVE"],
            "Name": constants.attribute_types["NOMINAL"],
            "Population": constants.attribute_types["QUANTITATIVE"],
            "Region": constants.attribute_types["NOMINAL"],
            "SAT Average": constants.attribute_types["QUANTITATIVE"]
        },
        'movies-w-year': {
            "Content Rating": constants.attribute_types["NOMINAL"],
            "Creative Type": constants.attribute_types["NOMINAL"],
            "Genre": constants.attribute_types["NOMINAL"],
            "IMDB Rating": constants.attribute_types["QUANTITATIVE"],
            "Production Budget": constants.attribute_types["QUANTITATIVE"],
            "Release Year": constants.attribute_types["QUANTITATIVE"],
            "Rotten Tomatoes Rating": constants.attribute_types["QUANTITATIVE"],
            "Running Time": constants.attribute_types["QUANTITATIVE"],
            "Title": constants.attribute_types["NOMINAL"],
            "Worldwide Gross": constants.attribute_types["QUANTITATIVE"]
        },
        'housing': {
            "Basement Area": constants.attribute_types["QUANTITATIVE"],
            "Central Air": constants.attribute_types["NOMINAL"],
            "Fence Type": constants.attribute_types["NOMINAL"],
            "Fireplaces": constants.attribute_types["ORDINAL"],
            "Foundation Type": constants.attribute_types["NOMINAL"],
            "Garage Type": constants.attribute_types["NOMINAL"],
            "Heating Type": constants.attribute_types["NOMINAL"],
            "Home Type": constants.attribute_types["NOMINAL"],
            "Lot Area": constants.attribute_types["QUANTITATIVE"],
            "Lot Config": constants.attribute_types["NOMINAL"],
            "Price": constants.attribute_types["QUANTITATIVE"],
            "Roof Style": constants.attribute_types["NOMINAL"],
            "Rooms": constants.attribute_types["ORDINAL"],
            "Satisfaction": constants.attribute_types["ORDINAL"],
            "Year": constants.attribute_types["ORDINAL"]
        },
        'olympic-medals': {
            "Age": constants.attribute_types["QUANTITATIVE"],
            "Bronze Medal": constants.attribute_types["QUANTITATIVE"],
            "Country": constants.attribute_types["NOMINAL"],
            "Gold Medal": constants.attribute_types["QUANTITATIVE"],
            "Name": constants.attribute_types["NOMINAL"],
            "Sex": constants.attribute_types["NOMINAL"],
            "Silver Medal": constants.attribute_types["QUANTITATIVE"],
            "Sport": constants.attribute_types["NOMINAL"],
            "Total Medal": constants.attribute_types["QUANTITATIVE"],
            "Year": constants.attribute_types["QUANTITATIVE"]
        },
        'cars-w-year': {
            "Acceleration": constants.attribute_types["QUANTITATIVE"],
            "Cylinders": constants.attribute_types["ORDINAL"],
            "Displacement": constants.attribute_types["QUANTITATIVE"],
            "Horsepower": constants.attribute_types["QUANTITATIVE"],
            "MPG": constants.attribute_types["QUANTITATIVE"],
            "Model": constants.attribute_types["NOMINAL"],
            "Origin": constants.attribute_types["NOMINAL"],
            "Weight": constants.attribute_types["QUANTITATIVE"],
            "Year": constants.attribute_types["QUANTITATIVE"]
        }
    }

    # Dependency Parser OPTIONS
    dependency_parser_config = {
        "corenlp": {'name': 'corenlp', 'model': os.path.join("examples","assets","jars","stanford-english-corenlp-2018-10-05-models.jar"),'parser': os.path.join("examples","assets","jars","stanford-parser.jar")},
        "corenlp-server": {'name': 'corenlp-server', 'url': 'http://localhost:9000'},
        "spacy": {'name': 'spacy','model': 'en_core_web_sm'}
    }

    @staticmethod
    @pytest.fixture(scope='class')
    def set_dependency_parser(request):
        # Base NL4DV instance
        return request.param

    @staticmethod
    @pytest.fixture(scope='class')
    def init_nl4dv(request):

        # Access request param and assign to dataset
        dataset = request.param

        # Base NL4DV instance
        nl4dv_instance = NL4DV(verbose=False)
        nl4dv_instance.set_data(data_url=os.path.join("examples","assets","data",dataset + ".csv"))
        nl4dv_instance.set_alias_map(alias_url=os.path.join("examples","assets","aliases",dataset + ".json"))
        return dataset, nl4dv_instance

    @pytest.mark.parametrize("init_nl4dv", list(dataset_attribute_type_mapping.keys()), indirect=True, scope="class")
    @pytest.mark.parametrize("set_dependency_parser", list(dependency_parser_config.keys()), indirect=True, scope="class")
    def test_attribute_datatypes(self, init_nl4dv, set_dependency_parser):
        dataset = init_nl4dv[0]
        nl4dv_instance = init_nl4dv[1]
        nl4dv_instance.set_dependency_parser(config=TestDataGenieClass.dependency_parser_config[set_dependency_parser])
        data_summary = nl4dv_instance.get_metadata()
        errors = []
        for attr in data_summary:
            if data_summary[attr]["dataType"] != TestDataGenieClass.dataset_attribute_type_mapping[dataset][attr]:
                errors.append(1)

        assert len(errors) == 0
