from flask import Blueprint, render_template, abort, send_from_directory
from jinja2 import TemplateNotFound
import os

vleditor_bp = Blueprint('vleditor', __name__, template_folder='templates', static_folder='static')

@vleditor_bp.route('/assets/<path:filename>')
def serveAssets(filename):
    return send_from_directory(os.path.join("assets"), filename, conditional=True)

@vleditor_bp.route('/')
def show():
    try:
        return render_template('vleditor.html')
    except TemplateNotFound:
        abort(404)
