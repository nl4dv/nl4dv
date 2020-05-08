from flask import Blueprint, render_template, abort, send_from_directory
from jinja2 import TemplateNotFound
import os

design_debugger_bp = Blueprint('design_debugger', __name__, template_folder='templates', static_folder='static')

@design_debugger_bp.route('/assets/<path:filename>')
def serveAssets(filename):
    return send_from_directory(os.path.join("assets"), filename, conditional=True)

@design_debugger_bp.route('/')
def show():
    try:
        return render_template('design_debugger.html')
    except TemplateNotFound:
        abort(404)
