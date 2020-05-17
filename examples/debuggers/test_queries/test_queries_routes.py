from flask import Blueprint, render_template, abort, send_from_directory
from jinja2 import TemplateNotFound
import os

test_queries_bp = Blueprint('test_queries', __name__, template_folder='templates', static_folder='static')


@test_queries_bp.route('/assets/<path:filename>')
def serveAssets(filename):
    return send_from_directory(os.path.join("assets"), filename, conditional=True)


@test_queries_bp.route('/')
def show():
    try:
        return render_template('test_queries.html')
    except TemplateNotFound:
        abort(404)
