from flask import Blueprint, render_template, abort, send_from_directory
from jinja2 import TemplateNotFound
import os

chatbot_bp = Blueprint('chatbot', __name__, template_folder='templates', static_folder='static')


@chatbot_bp.route('/assets/<path:filename>')
def serveAssets(filename):
    return send_from_directory(os.path.join("assets"), filename, conditional=True)


@chatbot_bp.route('/')
def show():
    try:
        return render_template('chatbot.html')
    except TemplateNotFound:
        abort(404)