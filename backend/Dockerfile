FROM ubuntu:24.04

WORKDIR /dog_training_management_backend

RUN --mount=target=/var/lib/apt/lists,type=cache,sharing=locked \
    --mount=target=/var/cache/apt,type=cache,sharing=locked \
    apt-get update && \
    apt-get install -y software-properties-common && \
    add-apt-repository ppa:deadsnakes/ppa && \
    apt-get update && \
    apt-get install -y \
        gcc \
        python3.13 \
        python3.13-dev \
        python3.13-venv \
        libpq-dev \
        libssl-dev \
        postgresql-client \
        texlive-latex-base

COPY ./requirements.txt ./requirements.txt

RUN --mount=type=cache,target=/root/.cache/pip \
    python3.13 -m ensurepip --upgrade && \
    # ignore-installed due to a clash with blinker
    python3.13 -m pip install -r requirements.txt --ignore-installed

COPY ./app.py ./app.py
COPY ./psql_adapter/ ./psql_adapter/
COPY ./pdflatex-pipe ./pdflatex-pipe

EXPOSE 8000

CMD ["bash", "-c", "gunicorn --workers 4 --bind 0.0.0.0:8000 --certfile=$SSL_CERT_PATH --keyfile=$SSL_KEY_PATH app:app"]
