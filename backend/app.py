import os
import json
import psycopg2

from flask import Flask
from dotenv import load_dotenv
from contextlib import closing


load_dotenv()

POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
POSTGRES_PORT = os.getenv("POSTGRES_PORT")
POSTGRES_DB = os.getenv("POSTGRES_DB")

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

        return json.dumps(
            {
                "first_name": first_name,
                "last_name": last_name,
            }
        )
