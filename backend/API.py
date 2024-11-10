# @Author: Bertan Berker
# @Language: Python
# This file is the main API file for the backend. It is responsible for handling all the requests and responses from the node.js backend
# with the AI agents


from flask import Flask, request, jsonify
from agents import suggest_dare, evaluate_dare, is_provable, check_completion
import os

app = Flask(__name__)

@app.route('/suggest_dare', methods=['GET'])
def api_suggest_dare():
    result = suggest_dare()
    return jsonify(result)

@app.route('/evaluate_dare', methods=['POST'])
def api_evaluate_dare():
    dare_suggestion = request.json.get('dare_suggestion')
    result = evaluate_dare(dare_suggestion)
    print("RESULT IS")
    print(result)
    return jsonify(result)

@app.route('/is_provable', methods=['POST'])
def api_is_provable():
    dare_suggestion = request.json.get('dare_suggestion')
    result = is_provable(dare_suggestion)
    print("RESULT IS")
    print(result)
    return jsonify(result)

@app.route('/check_completion', methods=['POST'])
def api_check_completion():
    image_url = request.json.get('image_url')
    dare_suggested = request.json.get('dare_suggested')
    result = check_completion(image_url, dare_suggested)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5000)