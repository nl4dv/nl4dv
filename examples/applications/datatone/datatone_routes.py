from flask import jsonify, request
from nl4dv import NL4DV, utils
import os
import json
from flask import Blueprint, render_template, abort, send_from_directory
from jinja2 import TemplateNotFound

datatone_bp = Blueprint('datatone', __name__, template_folder='templates', static_folder='static')


@datatone_bp.route('/assets/<path:filename>')
def serveAssets(filename):
    return send_from_directory(os.path.join("assets"), filename, conditional=True)


@datatone_bp.route('/',methods=['GET'])
def datatone():
    try:
        return render_template('datatone.html')
    except TemplateNotFound:
        abort(404)
