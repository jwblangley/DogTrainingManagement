import psycopg2

from contextlib import closing

from psql_adapter.config import POSTGRES_USER
from psql_adapter.config import POSTGRES_PASSWORD
from psql_adapter.config import POSTGRES_HOST
from psql_adapter.config import POSTGRES_PORT
from psql_adapter.config import POSTGRES_DB


def list_dogs_details():
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
        cursor.execute("SELECT id, pet_name, owner_id, breed, notes FROM dogs")

        return [
            {
                "id": dog_id,
                "pet_name": pet_name,
                "owner_id": owner_id,
                "breed": breed,
                "notes": notes,
            }
            for (dog_id, pet_name, owner_id, breed, notes) in cursor.fetchall()
        ]


def add_new_dog(pet_name, owner_id, breed, notes):
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
            "INSERT INTO dogs (pet_name, owner_id, breed, notes) VALUES (%s, %s, %s, %s)",
            (pet_name, owner_id, breed, notes),
        )
        conn.commit()

def modify_dog(dog_id, pet_name, owner_id, breed, notes):
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
            "UPDATE dogs SET pet_name=%s, owner_id=%s, breed=%s, notes=%s WHERE id=%s",
            (pet_name, owner_id, breed, notes, dog_id),
        )
        conn.commit()

def delete_dogs(dogs_to_delete):
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
        for dog_id in dogs_to_delete:
            cursor.execute(
                "DELETE FROM dogs WHERE id=%s",
                (dog_id,),
            )

        conn.commit()
