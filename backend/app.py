from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

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