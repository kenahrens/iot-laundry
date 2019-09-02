#!/usr/bin/python

from flask import Flask
from io import BytesIO
from picamera import PiCamera

import datetime
import requests
import time

# Create an in-memory stream
print('Raspberry Pi laundry camera started')
stream = BytesIO()

# Setup the camera
# Rotate 90 degrees
# ROI is 0.6, 0.22, 0.2, 0.2
print('Setting up the camera')
camera = PiCamera()
camera.resolution = (1280, 1024)
camera.rotation = 90
camera.zoom = (0.4, 0.05, 0.4, 0.5)

# Camera warm-up time?
print('Warming up the camera')
camera.start_preview()
time.sleep(2)
print('Camera is warmed up.')

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return "The time is " + str(datetime.datetime.now())

@app.route('/img', methods=['GET'])
def img():
    camera.capture(stream, 'jpeg')
    # Send the image to the back end
    statusCode = 0
    try:
        res = requests.post(url='http://envy5:8888/img',
            data=stream.getvalue(),
            headers={'Content-Type': 'image/jpeg'})
        statusCode = res.status_code
    finally:
        print('Status Code: ', statusCode)
    # Reset the stream
    stream.seek(0)
    stream.truncate()
    return "Image Sent"

# Can't run with debug because with reloader it tries to connect to camera twice
if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0')
