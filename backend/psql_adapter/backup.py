import subprocess
import gzip

from psql_adapter.config import POSTGRES_USER
from psql_adapter.config import POSTGRES_PASSWORD
from psql_adapter.config import POSTGRES_HOST
from psql_adapter.config import POSTGRES_PORT
from psql_adapter.config import POSTGRES_DB

def create_backup():
    proc = subprocess.run(["pg_dump",
        "--dbname", POSTGRES_DB,
        "--host", POSTGRES_HOST,
        "--port", POSTGRES_PORT,
        "--username", POSTGRES_USER,
        "--format=c",
    ], env={"PGPASSWORD": POSTGRES_PASSWORD}, check=True, capture_output=True)

    return gzip.compress(proc.stdout)


def restore_backup(bytes):
    backup = gzip.decompress(bytes)
    proc = subprocess.run(["dropdb",
        "--if-exists",
        "--host", POSTGRES_HOST,
        "--port", POSTGRES_PORT,
        "--username", POSTGRES_USER,
        POSTGRES_DB
    ], env={"PGPASSWORD": POSTGRES_PASSWORD}, check=False)

    if proc.returncode != 0:
        return False

    proc = subprocess.run(["createdb",
        "--host", POSTGRES_HOST,
        "--port", POSTGRES_PORT,
        "--username", POSTGRES_USER,
        POSTGRES_DB
    ], env={"PGPASSWORD": POSTGRES_PASSWORD}, check=False)

    if proc.returncode != 0:
        return False

    proc = subprocess.run(["pg_restore",
        "--dbname", POSTGRES_DB,
        "--host", POSTGRES_HOST,
        "--port", POSTGRES_PORT,
        "--username", POSTGRES_USER,
    ], env={"PGPASSWORD": POSTGRES_PASSWORD}, input=backup, check=False)

    return proc.returncode == 0
