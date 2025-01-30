import os

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

from psql_adapter.clients import list_clients as psql_list_clients
from psql_adapter.clients import list_clients_details as psql_list_clients_details
from psql_adapter.clients import add_new_client as psql_add_new_client
from psql_adapter.clients import modify_client as psql_modify_client
from psql_adapter.clients import delete_clients as psql_delete_clients

from psql_adapter.dogs import list_dogs_details as psql_list_dogs_details
from psql_adapter.dogs import add_new_dog as psql_add_new_dog
from psql_adapter.dogs import modify_dog as psql_modify_dog
from psql_adapter.dogs import delete_dogs as psql_delete_dogs


load_dotenv()

SSL_CERT_PATH = os.getenv("SSL_CERT_PATH")
SSL_KEY_PATH = os.getenv("SSL_KEY_PATH")

app = Flask(__name__)
CORS(app)

"""
Clients
"""

@app.route("/list-clients")
def list_clients():
    clients_details = psql_list_clients()
    return jsonify(clients_details)


@app.route("/list-clients-details")
def list_clients_details():
    clients_details = psql_list_clients_details()
    return jsonify(clients_details)


@app.route("/add-new-client", methods=["POST"])
def add_new_client():
    form_json = request.get_json()

    psql_add_new_client(
        form_json.get("first_name", None),
        form_json.get("last_name", None),
        form_json.get("email", None),
        form_json.get("phone", None),
    )
    return "Success"

@app.route("/modify-client", methods=["POST"])
def modify_client():
    form_json = request.get_json()

    psql_modify_client(
        form_json.get("id", None),
        form_json.get("first_name", None),
        form_json.get("last_name", None),
        form_json.get("email", None),
        form_json.get("phone", None),
    )
    return "Success"

@app.route("/delete-clients", methods=["POST"])
def delete_clients():
    request_json = request.get_json()

    psql_delete_clients(
        request_json.get("clients_to_delete", []),
    )
    return "Success"

"""
Dogs
"""

@app.route("/list-dogs-details")
def list_dogs_details():
    dogs_details = psql_list_dogs_details()
    return jsonify(dogs_details)


@app.route("/add-new-dog", methods=["POST"])
def add_new_dog():
    form_json = request.get_json()

    psql_add_new_dog(
        form_json.get("pet_name", None),
        form_json.get("owner_id", None),
        form_json.get("breed", None),
        form_json.get("sex", None),
        form_json.get("notes", None),
    )
    return "Success"

@app.route("/modify-dog", methods=["POST"])
def modify_dog():
    form_json = request.get_json()

    psql_modify_dog(
        form_json.get("id", None),
        form_json.get("pet_name", None),
        form_json.get("owner_id", None),
        form_json.get("breed", None),
        form_json.get("sex", None),
        form_json.get("notes", None),
    )
    return "Success"

@app.route("/delete-dogs", methods=["POST"])
def delete_dogs():
    request_json = request.get_json()

    psql_delete_dogs(
        request_json.get("dogs_to_delete", []),
    )
    return "Success"


if __name__ == "__main__":
    ssl_context = (
        (SSL_CERT_PATH, SSL_KEY_PATH)
        if SSL_CERT_PATH is not None and SSL_KEY_PATH is not None
        else None
    )
    app.run(debug=True, ssl_context=ssl_context)
