import psycopg2
import subprocess
import os
import io

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

def add_new_income_expense(date, value, description, client_id, instructor_id, session_credits):
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
            "INSERT INTO income_expenses (date, value, description, client_id, instructor_id, session_credits) VALUES (%s, %s, %s, %s, %s, %s)",
            (date, value, description, client_id, instructor_id, session_credits),
        )
        conn.commit()

def modify_income_expense(finance_id, date, value, description, client_id, instructor_id, session_credits):
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
            "UPDATE income_expenses SET date=%s, value=%s, description=%s, client_id=%s, instructor_id=%s, session_credits=%s WHERE id=%s",
            (date, value, description, client_id, instructor_id, session_credits, finance_id),
        )
        conn.commit()

def delete_income_expenses(income_expenses_to_delete):
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
        for finance_id in income_expenses_to_delete:
            cursor.execute(
                "DELETE FROM income_expenses WHERE id=%s",
                (finance_id,),
            )

        conn.commit()


def finance_statement(start, end):
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
            "SELECT value, date, description, clients.first_name, clients.last_name, instructors.first_name, instructors.last_name "
            "FROM income_expenses "
            "LEFT JOIN clients ON clients.id = income_expenses.client_id "
            "LEFT JOIN instructors ON instructors.id = income_expenses.instructor_id "
            "WHERE date >= %s AND date <= %s", (start, end)
        )

        def _concatenate_name(first, last):
            first = "" if first is None else first
            last = "" if last is None else last
            return f"{first} {last}".strip()

        records = [
            {
                "value": str(value),
                "date": date.isoformat(),
                "description": description,
                "client_name": _concatenate_name(client_first_name, client_last_name),
                "instructor_name": _concatenate_name(instructor_first_name, instructor_last_name),
            }
            for (value, date, description, client_first_name, client_last_name, instructor_first_name, instructor_last_name) in cursor.fetchall()
        ]

        with open(os.getenv("BASE_STATEMENT_TEX"), "rt") as base_tex, io.StringIO() as tabular:
            tex_str = base_tex.read().replace("STATEMENTSTART", start).replace("STATEMENTEND", end)

            for record in records:
                date = record["date"]
                description = record["description"]
                third_party = ""
                value = record["value"]

                if len(record["client_name"]) > 0:
                    third_party = record["client_name"]
                if len(record["instructor_name"]) > 0:
                    third_party = record["instructor_name"]

                print(f"{date} & {description} & {third_party} & {value} \\\\", file=tabular)

            input_tex = tex_str.replace("% STATEMENT TABLE", tabular.getvalue())
            proc = subprocess.run(["./pdflatex-pipe"], input=input_tex.encode(), capture_output=True)
            return proc.stdout
