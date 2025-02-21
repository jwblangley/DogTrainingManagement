import psycopg2

from contextlib import closing

from psql_adapter.config import POSTGRES_USER
from psql_adapter.config import POSTGRES_PASSWORD
from psql_adapter.config import POSTGRES_HOST
from psql_adapter.config import POSTGRES_PORT
from psql_adapter.config import POSTGRES_DB


def list_clients():
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
            "SELECT clients.id, active, first_name, last_name, email, phone, "
            "(SELECT SUM(session_credits) FROM income_expenses WHERE client_id = clients.id), "
            "("
                "SELECT COUNT(dogs.id) "
                "FROM session_dogs "
                "INNER JOIN dogs ON session_dogs.dog_id = dogs.id "
                "INNER JOIN sessions ON session_dogs.session_id = sessions.id "
                "WHERE dogs.owner_id = clients.id AND sessions.date_time < NOW()"
            "),"
            "("
                "SELECT COUNT(dogs.id) "
                "FROM session_dogs "
                "INNER JOIN dogs ON session_dogs.dog_id = dogs.id "
                "INNER JOIN sessions ON session_dogs.session_id = sessions.id "
                "WHERE dogs.owner_id = clients.id AND sessions.date_time >= NOW()"
            ") "
            "FROM clients"
        )

        def _zero_if_none(x):
            return 0 if x is None else x

        return [
            {
                "id": client_id,
                "active": active,
                "first_name": first_name,
                "last_name": last_name,
                "email": email,
                "phone": phone,
                "remaining_credits": _zero_if_none(total_credits) - _zero_if_none(used_credits),
                "remaining_credits_incl_pending": _zero_if_none(total_credits) - _zero_if_none(used_credits) - _zero_if_none(pending_use_credits),
            }
            for (client_id, active, first_name, last_name, email, phone, total_credits, used_credits, pending_use_credits) in cursor.fetchall()
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

def activate_clients(clients_to_activate, activate):
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
        for client_id in clients_to_activate:
            cursor.execute(
                "UPDATE clients SET active=%s WHERE id=%s",
                ("TRUE" if activate else "FALSE", client_id),
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
