from nl4dv import NL4DV
from nl4dv.utils import helpers
import json
import pytest
import pandas as pd
import os


class TestQueriesClass:

    _files = [
              'fullyspecified-attributes-tasks-vis.tsv',
              'underspecified-attributes-tasks.tsv',
              'underspecified-attributes-vis.tsv',
              'underspecified-attributes.tsv',
              'other-examples.tsv',
              'debugger_batch_queries.tsv',
              'vis_matrix_queries.tsv'
              ]

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
    def init_nl4dv(dataset, alias_file):
        # Base NL4DV instance
        nl4dv_instance = NL4DV(verbose=False)
        nl4dv_instance.set_data(data_url=os.path.join("examples","assets","data",dataset))
        nl4dv_instance.set_alias_map(alias_url=os.path.join("examples","assets","aliases", alias_file))
        return nl4dv_instance

    @pytest.fixture(scope='class')
    def read_queries(self, request):
        query_file = os.path.join('examples', 'assets', 'queries', request.param)
        df = pd.read_csv(query_file, sep='\t')
        return df.where(pd.notnull(df), None)

    @pytest.mark.parametrize("set_dependency_parser", list(dependency_parser_config.keys()), indirect=True, scope="class")
    @pytest.mark.parametrize("read_queries", _files, indirect=True, scope="class")
    def test_queries(self, read_queries, set_dependency_parser):
        nl4dv_instance, dataset, errors = None, None, list()
        for index, row in read_queries.iterrows():
            if dataset != row['Datafile']:
                dataset = row['Datafile']
                alias_file = row['Aliasfile']
                nl4dv_instance = TestQueriesClass.init_nl4dv(dataset, alias_file)

            nl4dv_instance.set_dependency_parser(config=TestQueriesClass.dependency_parser_config[set_dependency_parser])

            if nl4dv_instance is not None:
                output = json.loads(json.dumps(nl4dv_instance.analyze_query(row['Query']), default=helpers.set_default))

                if row["Attributes"] and set(output["attributeMap"].keys()) != set(row["Attributes"].split(",")):
                    print(row['Query'],row['Attributes'],output["attributeMap"].keys())
                    errors.append(1)

                if row["Tasks"] and set(output["taskMap"].keys()) != set(row["Tasks"].split(",")):
                    print(row['Query'],row['Tasks'])
                    errors.append(1)

        assert len(errors) == 0
