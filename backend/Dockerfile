FROM debian:bookworm

WORKDIR /dog_training_management_backend

RUN --mount=target=/var/lib/apt/lists,type=cache,sharing=locked \
    --mount=target=/var/cache/apt,type=cache,sharing=locked \
    apt-get update && \
    apt-get install -y postgresql-common && \
    yes | /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh && \
    apt-get update && \
    apt-get install -y \
        gcc \
        python3 \
        python3-dev \
        python3-flask \
        python3-flask-cors \
        python3-gunicorn \
        python3-psycopg2 \
        libpq-dev \
        libssl-dev \
        postgresql-client-16 \
        texlive-latex-extra

COPY ./app.py ./app.py
COPY ./psql_adapter/ ./psql_adapter/
COPY ./pdflatex-pipe ./pdflatex-pipe

EXPOSE 8000

CMD ["bash", "-c", "python3 -m gunicorn --workers 4 --bind 0.0.0.0:8000 --certfile=$SSL_CERT_PATH --keyfile=$SSL_KEY_PATH app:app"]
