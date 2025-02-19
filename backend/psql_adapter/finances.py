import psycopg2

from contextlib import closing

from psql_adapter.config import POSTGRES_USER
from psql_adapter.config import POSTGRES_PASSWORD
from psql_adapter.config import POSTGRES_HOST
from psql_adapter.config import POSTGRES_PORT
from psql_adapter.config import POSTGRES_DB


def list_income_expenses():
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
            "SELECT id, value, date, description, client_id, instructor_id, session_credits "
            "FROM income_expenses"
        )

        return [
            {
                "id": finance_id,
                "value": value,
                "date": date.isoformat(),
                "description": description,
                "client_id": client_id,
                "instructor_id": instructor_id,
                "session_credits": session_credits,
            }
            for (finance_id, value, date, description, client_id, instructor_id, session_credits) in cursor.fetchall()
        ]
