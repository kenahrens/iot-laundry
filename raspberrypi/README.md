# Raspberry Pi Code
Components
* Flask API running on Raspberry Pi
* Shell script calls the API 4x with 15s delay in between
* Cron job runs shell script every minute

## Flask API
The very simple API is in the `server.py` file and creates a local API server. When you issue a GET command to `/img` then it will take a picture and POST to the ingest API.

## Shell Script
The trivial `loop.sh` will invoke the local Flask API and then sleep for 15 seconds. It repeats this 4 times.

## Cron Job
To get the script to run add a line to your crontab like so:
```
* * * * * /home/pi/dev/svc-camera/loop.sh
```
