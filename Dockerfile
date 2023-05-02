FROM python:3.8-slim-buster

RUN apt-get update && \
    apt-get install -y build-essential libpq-dev curl && \
    curl -sL https://deb.nodesource.com/setup_16.x | bash && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /

COPY requirements.txt .

COPY .env .

RUN python -m venv venv

RUN . venv/bin/activate && \
    pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    deactivate

COPY . .

WORKDIR /static/js

RUN npm install -g webpack

RUN npm install -g webpack-cli

RUN npm run build

WORKDIR /

EXPOSE 8000

CMD ["/bin/bash", "-c", ". venv/bin/activate && gunicorn main:app -b 0.0.0.0:8000"]