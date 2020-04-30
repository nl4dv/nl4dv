from flask import Blueprint, render_template, abort, send_from_directory
from jinja2 import TemplateNotFound
import os

mmplot_bp = Blueprint('mmplot', __name__, template_folder='templates', static_folder='static')


@mmplot_bp.route('/assets/<path:filename>')
def serveAssets(filename):
    return send_from_directory(os.path.join("assets"), filename, conditional=True)


@mmplot_bp.route('/')
def show():
    try:
        return render_template('mmplot.html')
    except TemplateNotFound:
        abort(404)