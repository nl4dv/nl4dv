from nl4dv import NL4DV
import os
import json
from flask import Flask, jsonify, request, Blueprint, render_template, abort, send_from_directory
from jinja2 import TemplateNotFound

# Import our Example Applications
from applications.datatone import datatone_routes
from applications.vleditor import vleditor_routes
from applications.mmplot import mmplot_routes

# Import our Debugging Applications
from debuggers.debugger_single import debugger_single_routes
from debuggers.debugger_batch import debugger_batch_routes
from debuggers.vis_matrix import vis_matrix_routes
from debuggers.test_queries import test_queries_routes

# Initialize the app
app = Flask(__name__)

# Initialize nl4dv variable
nl4dv_instance = None

@app.route('/init', methods=['POST'])
def init():
    global nl4dv_instance
    if nl4dv_instance is not None:
        return jsonify({"message":"NL4DV already initialized"})

    dependency_parser = request.form['dependency_parser']
    if dependency_parser == "corenlp":
        dependency_parser_config = {'name': 'corenlp','model': os.path.join("assets","jars","stanford-english-corenlp-2018-10-05-models.jar"),'parser': os.path.join("assets","jars","stanford-parser.jar")}
        nl4dv_instance = NL4DV(dependency_parser_config=dependency_parser_config, verbose=True)

    elif dependency_parser == "spacy":
        dependency_parser_config = {'name': 'spacy','model': 'en_core_web_sm','parser': None}
        nl4dv_instance = NL4DV(dependency_parser_config=dependency_parser_config, verbose=True)

    elif dependency_parser == "corenlp-server":
        dependency_parser_config = {'name': 'corenlp-server','url': 'http://localhost:9000'}
        nl4dv_instance = NL4DV(dependency_parser_config=dependency_parser_config, verbose=True)

    else:
        raise ValueError('Error with Dependency Parser')

    return jsonify({"message":"NL4DV Initialized"})


@app.route('/setDependencyParser', methods=['POST'])
def setDependencyParser():
    global nl4dv_instance
    if nl4dv_instance is None:
        return jsonify({"message":"NL4DV NOT initialized"})

    dependency_parser = request.form['dependency_parser']
    if dependency_parser == "corenlp":
        dependency_parser_config = {'name': 'corenlp','model': os.path.join("assets","jars","stanford-english-corenlp-2018-10-05-models.jar"),'parser': os.path.join("assets","jars","stanford-parser.jar")}
        nl4dv_instance.set_dependency_parser(config=dependency_parser_config)

    elif dependency_parser == "spacy":
        dependency_parser_config = {'name': 'spacy','model': 'en_core_web_sm','parser': None}
        nl4dv_instance.set_dependency_parser(config=dependency_parser_config)

    elif dependency_parser == "corenlp-server":
        dependency_parser_config = {'name': 'corenlp-server','url': 'http://localhost:9000'}
        nl4dv_instance.set_dependency_parser(config=dependency_parser_config)
    else:
        raise ValueError('Data not provided')


@app.route('/setData', methods=['POST'])
def setData():
    global nl4dv_instance
    if nl4dv_instance is None:
        return jsonify({"message":"NL4DV NOT initialized"})

    dataset = request.form['dataset']
    if dataset is not None:
        datafile_obj = dataset.rsplit(".")
        nl4dv_instance.set_data(data_url=os.path.join("assets", "data", datafile_obj[0] + ".csv"))
        nl4dv_instance.set_alias_map(alias_url=os.path.join("assets", "aliases", datafile_obj[0] + ".json"))
        return get_dataset_meta()
    else:
        raise ValueError('Data not provided')

@app.route('/setIgnoreList', methods=['POST'])
def setIgnoreList():
    global nl4dv_instance
    if nl4dv_instance is None:
        return jsonify({"message":"NL4DV NOT initialized"})

    ignore_words = request.form['ignore_words']
    nl4dv_instance.set_ignore_words(ignore_words=json.loads(ignore_words))
    return jsonify({'message': 'Ignore List Set successfully'})


@app.route('/setThresholds', methods=['POST'])
def setThresholds():
    global nl4dv_instance
    if nl4dv_instance is None:
        return jsonify({"message":"NL4DV NOT initialized"})

    thresholds_str = request.form['thresholds']
    try:
        thresholds = json.loads(thresholds_str)
        response = nl4dv_instance.set_thresholds(thresholds)
        return jsonify({'message': 'Thresholds Set successfully'})
    except:
        raise ValueError('Thresholds not a JSON string')


@app.route('/setImportanceScores', methods=['POST'])
def setImportanceScores():
    global nl4dv_instance
    if nl4dv_instance is None:
        return jsonify({"message":"NL4DV NOT initialized"})

    scores_str = request.form['importance_scores']
    try:
        scores = json.loads(scores_str)
        response = nl4dv_instance.set_importance_scores(scores)
        return jsonify({'message': 'Scores Set successfully'})

    except Exception:
        raise ValueError('Importance Scores not a JSON string')


@app.route('/analyze_query', methods=['POST'])
def analyze_query():
    global nl4dv_instance
    if nl4dv_instance is None:
        return jsonify({"message":"NL4DV NOT initialized"})

    query = request.form['query']
    return json.dumps(nl4dv_instance.analyze_query(query, debug=True))


@app.route('/setAttributeDataType', methods=['POST'])
def setAttributeDataType():
    global nl4dv_instance
    if nl4dv_instance is None:
        return jsonify({"message":"NL4DV NOT initialized"})

    attr_type_obj = request.form['attr_type_obj']
    nl4dv_instance.set_attribute_datatype(json.loads(attr_type_obj))
    return get_dataset_meta()


@app.route('/',methods=['GET'])
def application_homepage():
    try:
        return render_template('index.html')
    except TemplateNotFound:
        abort(404)


def get_dataset_meta():
    global nl4dv_instance
    dataset_meta = nl4dv_instance.get_metadata()
    output = {
        "summary": dataset_meta,
        "rowCount": nl4dv_instance.data_genie_instance.rows,
        "columnCount": len(dataset_meta.keys())
    }
    return jsonify(output)

if __name__ == "__main__":
    app.register_blueprint(datatone_routes.datatone_bp, url_prefix='/datatone')
    app.register_blueprint(vleditor_routes.vleditor_bp, url_prefix='/vleditor')
    app.register_blueprint(mmplot_routes.mmplot_bp, url_prefix='/mmplot')

    app.register_blueprint(debugger_single_routes.debugger_single_bp, url_prefix='/debugger_single')
    app.register_blueprint(debugger_batch_routes.debugger_batch_bp, url_prefix='/debugger_batch')
    app.register_blueprint(vis_matrix_routes.vis_matrix_bp, url_prefix='/vis_matrix')
    app.register_blueprint(test_queries_routes.test_queries_bp, url_prefix='/test_queries')

    app.run(host='0.0.0.0', debug=True, threaded=True, port=7001)
