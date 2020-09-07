FROM python:3.6-alpine

RUN apk add --no-cache bash
RUN apk add --upgrade qt5-qtbase
RUN adduser -D flask_skipod

WORKDIR /home/flask_skipod

COPY requirements.txt requirements.txt
RUN python -m venv venv
RUN venv/bin/pip install --upgrade pip
RUN venv/bin/pip install -r requirements.txt
RUN venv/bin/pip install gunicorn

COPY app app
COPY architect architect
COPY migrations migrations
COPY logs logs
COPY userdata userdata
COPY app.db app.db
COPY flask_skipod.py config.py Folders_create.py boot.sh ./

RUN chmod -R 777 app
RUN chmod -R 777 architect
RUN chmod -R 777 logs
RUN chmod -R 777 migrations
RUN chmod -R 777 userdata
RUN chmod -R 777 app.db
RUN chmod 777 flask_skipod.py
RUN chmod 777 Folders_create.py
RUN chmod 777 config.py
RUN chmod 777 boot.sh

ENV FLASK_APP flask_skipod.py
RUN chown -R flask_skipod:flask_skipod ./
USER flask_skipod

EXPOSE 5000
ENTRYPOINT ["./boot.sh"]