from flask import Blueprint, render_template, abort, send_from_directory
from jinja2 import TemplateNotFound
import os

nl4dv_llm_bp = Blueprint('nl4dv_llm', __name__, template_folder='templates', static_folder='static')


@nl4dv_llm_bp.route('/assets/<path:filename>')
def serveAssets(filename):
    return send_from_directory(os.path.join("assets"), filename, conditional=True)


@nl4dv_llm_bp.route('/')
def show():
    try:
        return render_template('nl4dv_llm.html')
    except TemplateNotFound:
        abort(404)
