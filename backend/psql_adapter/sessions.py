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
