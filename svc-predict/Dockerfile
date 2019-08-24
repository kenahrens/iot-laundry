FROM python:3

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
ENV NEW_RELIC_CONFIG_FILE=newrelic.ini

COPY . .

CMD [ "newrelic-admin", "run-program", "python", "./server.py" ]
