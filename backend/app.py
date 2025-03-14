from flask import Flask, request, jsonify
from flask_cors import CORS
from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[0]))

from utils.logger import setup_logger
logger = setup_logger('Main Application')

from utils.db import init_db
from config import Config

config = Config()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = config.SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = config.SQLALCHEMY_TRACK_MODIFICATIONS
app.config['SECRET_KEY'] = config.SECRET_KEY
db = init_db(app)

CORS(app)

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Welcome to Healthcare AI Diagnostic System API'})

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify(
        {
            'status': 'healthy',
            'message': 'The Healthcare AI Diagnostic System API is up and running!'
        }
    )
    
if __name__ == '__main__':
    app.run(debug=True,port=8000,host='0.0.0.0')