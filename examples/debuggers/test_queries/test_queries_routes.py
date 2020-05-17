from flask import Blueprint, render_template, abort, send_from_directory
from jinja2 import TemplateNotFound
import os

examples_bp = Blueprint('examples', __name__, template_folder='templates', static_folder='static')

@examples_bp.route('/assets/<path:filename>')
def serveAssets(filename):
    return send_from_directory(os.path.join("assets"), filename, conditional=True)

@examples_bp.route('/')
def show():
    try:
        return render_template('examples.html')
    except TemplateNotFound:
        abort(404)
