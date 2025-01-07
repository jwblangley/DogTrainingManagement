# Dog Training Manager Backend

## Setup

```bash
python -m venv venv
source venv/bin/activate
python -m pip install -r requirements-dev.txt
```

## Development

```bash
flask run --debug
```

## Production Build

```bash
gunicorn -w 4 app:app -b 0.0.0.0:8000
```
