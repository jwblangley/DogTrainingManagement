import os
import psycopg2

from flask import Flask, jsonify
from dotenv import load_dotenv
from contextlib import closing


load_dotenv()

POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
POSTGRES_PORT = os.getenv("POSTGRES_PORT")
POSTGRES_DB = os.getenv("POSTGRES_DB")

SSL_CERT_PATH = os.getenv("SSL_CERT_PATH")
SSL_KEY_PATH = os.getenv("SSL_KEY_PATH")

app = Flask(__name__)


@app.route("/list-people")
def list_people():
    with closing(
        psycopg2.connect(
            database=POSTGRES_DB,
            host=POSTGRES_HOST,
            user=POSTGRES_USER,
            password=POSTGRES_PASSWORD,
            port=POSTGRES_PORT,
        )
    ) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT first_name, last_name FROM people LIMIT 1")
        first_name, last_name = cursor.fetchone()

        return jsonify(
            {
                "first_name": first_name,
                "last_name": last_name,
            }
        )


if __name__ == "__main__":
    ssl_context = (
        (SSL_CERT_PATH, SSL_KEY_PATH)
        if SSL_CERT_PATH is not None and SSL_KEY_PATH is not None
        else None
    )
    app.run(debug=True, ssl_context=ssl_context)
