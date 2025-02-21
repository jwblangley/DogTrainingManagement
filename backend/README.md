# Dog Training Manager Backend

## Prerequisites

`postgresql-client` must be installed. This can be installed on debian-based systems with:

```bash
sudo apt install postgresql-client texlive-latex-recommended
```

## Setup

```bash
python -m venv venv
source venv/bin/activate
python -m pip install -r requirements-dev.txt
```

Additionally create a `.env` configuration file (use [`.env.sample`](./.env.sample))
and modify the configuration parameters.
To use HTTPS (recommended) set the `SSL_CERT_PATH` and `SSL_KEY_PATH` variables.

## Development

```bash
python app.py
```

## Production Build

```bash
gunicorn -w 4 app:app -b 0.0.0.0:8000 --certfile=public-certificate.crt --keyfile=privatekey.key
```
