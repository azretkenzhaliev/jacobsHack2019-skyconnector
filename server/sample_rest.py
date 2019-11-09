import json
import os

from flask import Flask
from flask import request
from flask_restful import Resource, Api
from flask_cors import CORS

import googleapiclient.discovery
import requests


app = Flask(__name__)
CORS(app)

api = Api(app)


def flight_info(country, currency, locale, originPlace, destinationPlace, outboundPartialDate):
    response = requests.get(
        (
            f"https://www.skyscanner.net/g/chiron/api/v1/flights/browse/browsequotes/v1.0/{country}/{currency}/{locale}/"
            f"{originPlace}/"
            f"{destinationPlace}/"
            f"{outboundPartialDate}"
        ),
        headers={
            "Accept": "application/json",
            "api-key": "jacobs-2019"
        }
    )

    return response.json()


@app.route("/next", methods=["POST"])
def next():
    data = request.get_json()

    result = flight_info("DE", "EUR", "en-US", data["from"]+"-sky", data["to"]+"sky", data["date"])
    print(result)
    
    return result


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
