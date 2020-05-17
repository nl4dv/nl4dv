from nl4dv import NL4DV
from nl4dv.utils import helpers
import json
import pytest
import pandas as pd
import os


class TestQueriesClass:

    _files = ['1-fullyspecified-attributes-tasks-vis.txt',
              '2-underspecified-attributes-tasks.txt',
              '3-underspecified-attributes-vis.txt',
              '4-underspecified-attributes.txt',
              'debugger_queries.txt',
              'vis_matrix_queries.tsv'
              ]

    @staticmethod
    def init_nl4dv(dataset, alias_file):
        # Base NL4DV instance
        dependency_parser_config = {'name': 'stanford','model': os.path.join("examples","assets","jars","stanford-english-corenlp-2018-10-05-models.jar"),'parser': os.path.join("examples","assets","jars","stanford-parser.jar")}
        nl4dv_instance = NL4DV(verbose=False)
        nl4dv_instance.set_dependency_parser(config=dependency_parser_config)
        nl4dv_instance.set_data(data_url=os.path.join("examples","assets","data",dataset))
        nl4dv_instance.set_alias_map(alias_url=os.path.join("examples","assets","aliases", alias_file))
        return nl4dv_instance

    @pytest.fixture(scope='class')
    def read_queries(self, request):
        query_file = os.path.join('examples', 'assets', 'queries', request.param)
        return pd.read_csv(query_file, sep='\t')

    @pytest.mark.parametrize("read_queries", _files, indirect=True, scope="class")
    def test_queries(self, read_queries):
        nl4dv_instance, dataset, errors = None, None, list()
        for index, row in read_queries.iterrows():
            if dataset != row['Datafile']:
                dataset = row['Datafile']
                alias_file = row['Aliasfile']
                nl4dv_instance = TestQueriesClass.init_nl4dv(dataset, alias_file)

            if nl4dv_instance is not None:
                output = json.loads(json.dumps(nl4dv_instance.analyze_query(row['Query']), default=helpers.set_default))
                if len(output["visList"]) == 0:
                    errors.append(1)
                # if set(output["attributeMap"].keys()) != set(row["attributes"].split(",")):
                #     errors.append(1)
        assert len(errors) == 0
