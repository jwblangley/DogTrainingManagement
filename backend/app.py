import os
import io

from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from dotenv import load_dotenv

from psql_adapter.backup import create_backup as psql_create_backup
from psql_adapter.backup import restore_backup as psql_restore_backup

from psql_adapter.clients import list_clients as psql_list_clients
from psql_adapter.clients import add_new_client as psql_add_new_client
from psql_adapter.clients import modify_client as psql_modify_client
from psql_adapter.clients import activate_clients as psql_activate_clients
from psql_adapter.clients import delete_clients as psql_delete_clients

from psql_adapter.dogs import list_dogs as psql_list_dogs
from psql_adapter.dogs import add_new_dog as psql_add_new_dog
from psql_adapter.dogs import modify_dog as psql_modify_dog
from psql_adapter.dogs import activate_dogs as psql_activate_dogs
from psql_adapter.dogs import delete_dogs as psql_delete_dogs

from psql_adapter.instructors import list_instructors as psql_list_instructors
from psql_adapter.instructors import add_new_instructor as psql_add_new_instructor
from psql_adapter.instructors import modify_instructor as psql_modify_instructor
from psql_adapter.instructors import activate_instructors as psql_activate_instructors
from psql_adapter.instructors import delete_instructors as psql_delete_instructors

from psql_adapter.sessions import list_sessions as psql_list_sessions
from psql_adapter.sessions import list_session_details as psql_list_session_details
from psql_adapter.sessions import save_session as psql_save_session


load_dotenv()

SSL_CERT_PATH = os.getenv("SSL_CERT_PATH")
SSL_KEY_PATH = os.getenv("SSL_KEY_PATH")

app = Flask(__name__)
CORS(app)


"""
Backup
"""

@app.route("/create-backup")
def create_backup():
    return Response(psql_create_backup(), mimetype="application/gzip")

@app.route("/restore-backup", methods=["POST"])
def restore_backup():
    if  "backup" not in request.files:
        return "Bad data format", 400
    backup_file = request.files["backup"]
    bytes = io.BytesIO()
    backup_file.save(bytes)

    if not psql_restore_backup(bytes.getvalue()):
        return "Internal Server Error", 500

    return "Success"

"""
Clients
"""

@app.route("/list-clients")
def list_clients():
    clients = psql_list_clients()
    return jsonify(clients)

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

@app.route("/activate-clients", methods=["POST"])
def activate_clients():
    form_json = request.get_json()

    psql_activate_clients(
        form_json.get("clients_to_activate", []),
        form_json.get("activate", True),
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

@app.route("/list-dogs")
def list_dogs():
    dogs = psql_list_dogs()
    return jsonify(dogs)


@app.route("/add-new-dog", methods=["POST"])
def add_new_dog():
    form_json = request.get_json()

    psql_add_new_dog(
        form_json.get("pet_name", None),
        form_json.get("owner_id", None),
        form_json.get("dob", None),
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
        form_json.get("dob", None),
        form_json.get("breed", None),
        form_json.get("sex", None),
        form_json.get("notes", None),
    )
    return "Success"

@app.route("/activate-dogs", methods=["POST"])
def activate_dogs():
    form_json = request.get_json()

    psql_activate_dogs(
        form_json.get("dogs_to_activate", []),
        form_json.get("activate", True),
    )
    return "Success"

@app.route("/delete-dogs", methods=["POST"])
def delete_dogs():
    request_json = request.get_json()

    psql_delete_dogs(
        request_json.get("dogs_to_delete", []),
    )
    return "Success"



"""
Instructors
"""

@app.route("/list-instructors")
def list_instructors():
    instructors = psql_list_instructors()
    return jsonify(instructors)


@app.route("/add-new-instructor", methods=["POST"])
def add_new_instructor():
    form_json = request.get_json()

    psql_add_new_instructor(
        form_json.get("first_name", None),
        form_json.get("last_name", None),
        form_json.get("email", None),
        form_json.get("phone", None),
    )
    return "Success"

@app.route("/modify-instructor", methods=["POST"])
def modify_instructor():
    form_json = request.get_json()

    psql_modify_instructor(
        form_json.get("id", None),
        form_json.get("first_name", None),
        form_json.get("last_name", None),
        form_json.get("email", None),
        form_json.get("phone", None),
    )
    return "Success"

@app.route("/activate-instructors", methods=["POST"])
def activate_instructors():
    form_json = request.get_json()

    psql_activate_instructors(
        form_json.get("instructors_to_activate", []),
        form_json.get("activate", True),
    )
    return "Success"

@app.route("/delete-instructors", methods=["POST"])
def delete_instructors():
    request_json = request.get_json()

    psql_delete_instructors(
        request_json.get("instructors_to_delete", []),
    )
    return "Success"


"""
Sessions
"""

@app.route("/list-sessions")
def list_sessions():
    return jsonify(psql_list_sessions())

@app.route("/list-session-details")
def list_session_details():
    session_id = request.args.get("id", None)
    if session_id is None:
        return "Bad request", 400
    return jsonify(psql_list_session_details(session_id))

@app.route("/save-session", methods=["POST"])
def save_session():
    request_json = request.get_json()

    psql_save_session(
        request_json.get("session", []),
    )
    return "Success"

if __name__ == "__main__":
    ssl_context = (
        (SSL_CERT_PATH, SSL_KEY_PATH)
        if SSL_CERT_PATH is not None and SSL_KEY_PATH is not None
        else None
    )
    app.run(debug=True, ssl_context=ssl_context)
