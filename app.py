import json
import os

from flask import Flask
from flask import request, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS
from kafka import KafkaConsumer
from kafka import KafkaProducer

import googleapiclient.discovery
import requests

import pika
import pymongo


app = Flask(__name__)
CORS(app)

api = Api(app)


def flight_info(country: str, currency: str, locale: str, originPlace: str, destinationPlace: str, outboundDate: str):    
    body = {
        "country": country, 
        "currency": currency, 
        "locale": locale,
        "originPlace": originPlace,
        "destinationPlace": destinationPlace,
        "locationSchema": "iata",
        "outboundDate": outboundDate,
        "adults": 1
    }
    
    session = requests.post(
        "https://www.skyscanner.net/g/chiron/api/v1/flights/search/pricing/v1.0",
        json.dumps(body),
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
            "api-key": "jacobs-2019",
            "X-Forwarded-For": "212.201.44.243",
            "Accept": "application/json"
        }
    )

    SessionKey = session.json()["session_id"]

    response = requests.get(
        (
            f"https://www.skyscanner.net/g/chiron/api/v1/flights/search/pricing/v1.0?"
            f"session_id={SessionKey}"
        ),
        headers={
            "Accept": "application/json",
            "api-key": "jacobs-2019"
        }
    )
    return response.json()


def find_place_by_id(place_id, places):
    for place in places:
        if place_id == place["Id"]:
            return place["Code"]

    return ""


def find_carrier_by_id(carrier_id, carriers):
    for carrier in carriers:
        if carrier_id == carrier["Id"]:
            return carrier["Name"]

    return ""


@app.route("/next", methods=["POST"])
def next():
    data = request.get_json()

    result = flight_info("DE", "EUR", "en-US", data["from"] + "-sky", data["to"] + "-sky", data["date"])
    processed_data = {}
    len_data = 0

    
    legs = result["Legs"]
    places = result["Places"]
    carriers = result["Carriers"]
    iteneraries = result["Itineraries"]

    for i in range(len(legs)):
        if legs[i]["Stops"]:
            continue

        discussion_id = ""

        iata_from = find_place_by_id(legs[i]["OriginStation"], places)
        iata_to = find_place_by_id(legs[i]["DestinationStation"], places)

        discussion_id += iata_from
        discussion_id += "-" + iata_to

        departure_time = legs[i]["Departure"]
        arrival_time = legs[i]["Arrival"]
        duration = legs[i]["Duration"]
        discussion_id += "-" + departure_time
        discussion_id += "-" + arrival_time

        carrier_ids = legs[i]["Carriers"]
        carrier_name = find_carrier_by_id(carrier_ids[0], carriers)
        discussion_id += "-" + carrier_name
        discussion_id = discussion_id.replace(":", '-')
        discussion_id = discussion_id.replace(" ", '-')

        for itenerary in iteneraries:
            if itenerary["OutboundLegId"] == legs[i]["Id"]:
                price = itenerary["PricingOptions"][0]["Price"]
                break

        processed_data[len_data] = {
            "IataFrom": iata_from,
            "IataTo": iata_to,
            "CarrierName": carrier_name,
            "Price": price,
            "DepartureTime": departure_time,
            "ArrivalTime": arrival_time,
            "Duration": duration,
            "DiscussionId": discussion_id
        }

        len_data += 1

    return json.dumps(processed_data)


def sign_in(mongoEntries, email, password):
    query = {"email": email}

    count = mongoEntries.count_documents(query)

    if count > 0:
        entry = mongoEntries.find_one(query)
        if password == entry["password"]:
            return "successful"
        else:
            return "Incorrect password"
    else:
        return "Incorrect email"


def sign_up(mongoEntries, email, password):
    query = {"email": email}

    count = mongoEntries.count_documents(query)

    if count > 0:
        return "Already signed up. Please sign in"

    new_entry = {"email": email, "password": password}
    mongoEntries.insert_one(new_entry)

    return "successful"


@app.route('/login', methods=["POST"])
def login():
    mongoclient = pymongo.MongoClient("mongodb://0.0.0.0:27017/")
    mongoDB = mongoclient["mongodatabase"]
    mongoEntries = mongoDB["users"]

    data = request.get_json()
    email = data["email"]
    password = data["password"]
    flag = data["flag"] #sign-in or sign-up

    if flag == "sign-in":
        status = sign_in(mongoEntries, email, password)
    elif flag == "sign-up":
        status = sign_up(mongoEntries, email, password)
    
    return jsonify(status)


def bitstring_to_bytes(s):
    return int(s, 2).to_bytes(len(s) // 8, byteorder='big')


@app.route('/chat', methods=["POST"])
def chat():
    data = request.get_json()

    discussion_id = data["DiscussionId"]
    pre_user_id = data["UserId"]

    user_id = str.encode(pre_user_id)

    if "Message" in data:
        pre_message = data["Message"]
        message = str.encode(pre_message)

        producer = KafkaProducer()
        producer.send(discussion_id, message, user_id)

    consumer = KafkaConsumer(discussion_id)

    messages = []

    for msg in consumer:
        messages.append(
            {
                "user": msg.key,
                "message": msg.value
            }
        )
    return json.dumps(messages)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
