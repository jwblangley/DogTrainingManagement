import psycopg2

from contextlib import closing

from psql_adapter.config import POSTGRES_USER
from psql_adapter.config import POSTGRES_PASSWORD
from psql_adapter.config import POSTGRES_HOST
from psql_adapter.config import POSTGRES_PORT
from psql_adapter.config import POSTGRES_DB


def list_instructors():
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
        cursor.execute("SELECT id, active, first_name, last_name, email, phone FROM instructors")

        return [
            {
                "id": instructor_id,
                "active": active,
                "first_name": first_name,
                "last_name": last_name,
                "email": email,
                "phone": phone,
            }
            for (instructor_id, active, first_name, last_name, email, phone) in cursor.fetchall()
        ]


def add_new_instructor(first_name, last_name, email, phone):
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
            "INSERT INTO instructors (first_name, last_name, email, phone) VALUES (%s, %s, %s, %s)",
            (first_name, last_name, email, phone),
        )
        conn.commit()

def modify_instructor(instructor_id, first_name, last_name, email, phone):
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
            "UPDATE instructors SET first_name=%s, last_name=%s, email=%s, phone=%s WHERE id=%s",
            (first_name, last_name, email, phone, instructor_id),
        )
        conn.commit()

def activate_instructors(instructors_to_activate, activate):
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
        for instructor_id in instructors_to_activate:
            cursor.execute(
                "UPDATE instructors SET active=%s WHERE id=%s",
                ("TRUE" if activate else "FALSE", instructor_id),
            )

        conn.commit()

def delete_instructors(instructors_to_delete):
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
        for instructor_id in instructors_to_delete:
            cursor.execute(
                "DELETE FROM instructors WHERE id=%s",
                (instructor_id,),
            )

        conn.commit()
