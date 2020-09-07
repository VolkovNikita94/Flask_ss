#!/bin/sh
# this script is used to boot a Docker container
source venv/bin/activate
# upgrade database
while true; do
    flask db upgrade
    if [[ "$?" == "0" ]]; then
        break
    fi
    echo Upgrade command failed, retrying in 5 secs...
    sleep 5
done
# create user folders
python Folders_create.py
# launch web server
exec gunicorn -b :5000 --access-logfile - --error-logfile - flask_skipod:appFlask
