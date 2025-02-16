import psycopg2

from contextlib import closing

from psql_adapter.config import POSTGRES_USER
from psql_adapter.config import POSTGRES_PASSWORD
from psql_adapter.config import POSTGRES_HOST
from psql_adapter.config import POSTGRES_PORT
from psql_adapter.config import POSTGRES_DB


def list_dogs():
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
            "SELECT dogs.id, dogs.pet_name, dogs.owner_id, dogs.dob, dogs.breed, dogs.sex, dogs.notes, dogs.active, clients.first_name, clients.last_name "
            "FROM dogs INNER JOIN clients "
            "ON dogs.owner_id = clients.id"
        )


        return [
            {
                "id": dog_id,
                "pet_name": pet_name,
                "owner_id": owner_id,
                "dob": None if dob is None else dob.strftime("%Y-%m-%d"),
                "breed": breed,
                "sex": sex,
                "notes": notes,
                "active": active,
                "owner_first_name": owner_first_name,
                "owner_last_name": owner_last_name,
            }
            for (dog_id, pet_name, owner_id, dob, breed, sex, notes, active, owner_first_name, owner_last_name) in cursor.fetchall()
        ]


def add_new_dog(pet_name, owner_id, dob, breed, sex, notes):
    with closing(
        psycopg2.connect(
            database=POSTGRES_DB,
            host=POSTGRES_HOST,
            user=POSTGRES_USER,
            password=POSTGRES_PASSWORD,
            port=POSTGRES_PORT,
        )
    ) as conn:
        print(dob)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO dogs (pet_name, owner_id, dob, breed, sex, notes) VALUES (%s, %s, %s, %s, %s, %s)",
            (pet_name, owner_id, dob, breed, sex, notes),
        )
        conn.commit()

def modify_dog(dog_id, pet_name, owner_id, dob, breed, sex, notes):
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
            "UPDATE dogs SET pet_name=%s, owner_id=%s, dob=%s, breed=%s, sex=%s, notes=%s WHERE id=%s",
            (pet_name, owner_id, dob, breed, sex, notes, dog_id),
        )
        conn.commit()

def activate_dogs(dogs_to_activate, activate):
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
        for dog_id in dogs_to_activate:
            cursor.execute(
                "UPDATE dogs SET active=%s WHERE id=%s",
                ("TRUE" if activate else "FALSE", dog_id),
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
