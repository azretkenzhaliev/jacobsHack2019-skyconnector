import json
import os

from flask import Flask
from flask import request
from flask_restful import Resource, Api
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options

import googleapiclient.discovery
import requests


app = Flask(__name__)
CORS(app)

api = Api(app)


@app.route("/next", methods=["POST"])
def next():
    data = request.get_json()
    return json.dumps(data)


if __name__ == '__main__':
    app.run(host="localhost", port=5000, debug=True)
