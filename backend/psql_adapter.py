import os

import psycopg2

from contextlib import closing


POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
POSTGRES_PORT = os.getenv("POSTGRES_PORT")
POSTGRES_DB = os.getenv("POSTGRES_DB")


def list_clients_details():
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
        cursor.execute("SELECT id, first_name, last_name, email, phone FROM clients")

        return [
            {
                "id": client_id,
                "first_name": first_name,
                "last_name": last_name,
                "email": email,
                "phone": phone,
            }
            for (client_id, first_name, last_name, email, phone) in cursor.fetchall()
        ]


def add_new_client(first_name, last_name, email, phone):
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
        cursor.execute(
            "INSERT INTO clients (first_name, last_name, email, phone) VALUES (%s, %s, %s, %s)",
            (first_name, last_name, email, phone),
        )
        conn.commit()

def modify_client(client_id, first_name, last_name, email, phone):
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
        cursor.execute(
            "UPDATE clients SET first_name=%s, last_name=%s, email=%s, phone=%s WHERE id=%s",
            (first_name, last_name, email, phone, client_id),
        )
        conn.commit()

def delete_clients(clients_to_delete):
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
        for client_id in clients_to_delete:
            cursor.execute(
                "DELETE FROM clients WHERE id=%s",
                (client_id,),
            )

        conn.commit()
