import os

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

from psql_adapter import list_clients_details as psql_list_clients_details
from psql_adapter import add_new_client as psql_add_new_client


load_dotenv()

SSL_CERT_PATH = os.getenv("SSL_CERT_PATH")
SSL_KEY_PATH = os.getenv("SSL_KEY_PATH")

app = Flask(__name__)
CORS(app)


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


if __name__ == "__main__":
    ssl_context = (
        (SSL_CERT_PATH, SSL_KEY_PATH)
        if SSL_CERT_PATH is not None and SSL_KEY_PATH is not None
        else None
    )
    app.run(debug=True, ssl_context=ssl_context)
