# iot-laundry
Internet of Things tools for dealing with the washer and dryer.

# Ingest Workflow
Currently working:
* Setup a Raspberri Pi with the camera module.
* Mount the rpi so it can see the dryer.
* Use Python `PiCamera` module to take picture of the dryer display.
* Send the picture to an ingest service.
* The ingest sends to a Python prediction service using tensor flow.
* Store the prediction in InfluxDB.

To do:
* Send notification (IFTTT or somesuch) when there are 2 minutes left

# Web Interface
Currently working:
* Small React site with basic stats like if it's running or not.

To do:
* Build out stats into it's own service.