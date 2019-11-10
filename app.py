import json
import os

from flask import Flask
from flask import request, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS

import googleapiclient.discovery
import requests

import pika


app = Flask(__name__)
CORS(app)

api = Api(app)


def flight_info(country, currency, locale, originPlace, destinationPlace, outboundPartialDate):
    response = requests.get(
        (
            f"https://www.skyscanner.net/g/chiron/api/v1/flights/browse/browseroutes/v1.0/{country}/{currency}/{locale}/"
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


def find_place_by_id(place_id, places):
    for place in places:
        if place_id == place["PlaceId"]:
            return place["IataCode"]

    return ""


def find_carrier_by_id(carrier_id, carriers):
    for carrier in carriers:
        if carrier_id == carrier["CarrierId"]:
            return carrier["Name"]

    return ""


@app.route("/next", methods=["POST"])
def next():
    data = request.get_json()

    result = flight_info("DE", "EUR", "en-US", data["from"] + "-sky", data["to"] + "-sky", data["date"])

    processed_data = {}
    len_data = 0

    quotes = result["Quotes"]
    places = result["Places"]
    carriers = result["Carriers"]

    for i in range(len(quotes)):
        if not quotes[i]["Direct"]:
            continue

        discussion_id = ""

        outbound_leg = quotes[i]["OutboundLeg"]

        iata_from = find_place_by_id(outbound_leg["OriginId"], places)
        iata_to = find_place_by_id(outbound_leg["DestinationId"], places)

        discussion_id += iata_from
        discussion_id += "-" + iata_to

        carrier_ids = outbound_leg["CarrierIds"]

        carrier_names = []

        for carrier_id in carrier_ids:
            carrier_name = find_carrier_by_id(carrier_id, carriers)

            discussion_id += "-" + carrier_name
            carrier_names.append(carrier_name)

        assert len(carrier_names) == 1

        quote_date_time = quotes[i]["QuoteDateTime"]
        discussion_id += "-" + quote_date_time

        price = quotes[i]["MinPrice"]

        processed_data[len_data] = {
            "IataFrom": iata_from,
            "IataTo": iata_to,
            "CarrierName": carrier_names[0],
            "Price": price,
            "DiscussionId": discussion_id,
            "FlightDateTime": quote_date_time
        }

        len_data += 1

    return json.dumps(processed_data)


@app.route('/chat', methods=["POST", "GET"])
def chat():
    data = request.get_json()

    #send to rabbitmq queues

    return jsonify("hi")

# def process_queues():

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
