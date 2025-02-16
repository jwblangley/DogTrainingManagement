import psycopg2

from contextlib import closing

from psql_adapter.config import POSTGRES_USER
from psql_adapter.config import POSTGRES_PASSWORD
from psql_adapter.config import POSTGRES_HOST
from psql_adapter.config import POSTGRES_PORT
from psql_adapter.config import POSTGRES_DB


def list_sessions():
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
            "SELECT sessions.id, sessions.date_time, sessions.title, "
            "COUNT(DISTINCT session_instructors.instructor_id), COUNT(DISTINCT session_dogs.dog_id), COUNT(DISTINCT dogs.owner_id) FROM sessions "
            "INNER JOIN session_instructors ON sessions.id = session_instructors.session_id "
            "INNER JOIN session_dogs ON sessions.id = session_dogs.session_id "
            "INNER JOIN dogs ON session_dogs.dog_id = dogs.id "
            "GROUP BY sessions.id"

        )

        return [
            {
                "id": session_id,
                "date_time": date_time.replace(microsecond=0).isoformat(),
                "title": title,
                "num_instructors": num_instructors,
                "num_dogs": num_dogs,
                "num_clients": num_clients,
            }
            for (session_id, date_time, title, num_instructors, num_dogs, num_clients) in cursor.fetchall()
        ]

def list_session_details(session_id):
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
            "SELECT sessions.id, sessions.date_time, sessions.title, sessions.notes, session_instructors.instructor_id, session_dogs.dog_id FROM sessions "
            "INNER JOIN session_instructors ON sessions.id = session_instructors.session_id "
            "INNER JOIN session_dogs ON sessions.id = session_dogs.session_id "
            "WHERE sessions.id = %s", (session_id, )
        )

        rows = cursor.fetchall()

        assert len(session_ids := set(row[0] for row in rows)) == 1
        session_id = list(session_ids)[0]

        assert len(date_times := set(row[1] for row in rows)) == 1
        date_time = list(date_times)[0]

        assert len(titles := set(row[2] for row in rows)) == 1
        title = list(titles)[0]

        assert len(notess := set(row[3] for row in rows)) == 1
        notes = list(notess)[0]

        instructor_ids = set(row[4] for row in rows)
        dog_ids = set(row[5] for row in rows)

        result = {
            "id": session_id,
            "date_time": date_time.replace(microsecond=0).isoformat(),
            "title": title,
            "notes": notes,
            "instructor_ids": list(instructor_ids),
            "dog_ids": list(dog_ids),
        }

        return result


def save_session(session):
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
            "UPDATE sessions SET date_time=%s, title=%s, notes=%s "
            "WHERE id=%s", (session["date_time"], session["title"], session["notes"], session["id"])
        )

        conn.commit()
