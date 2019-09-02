#!/usr/bin/python

######################################################################
# This module takes pictures in memory and then POSTs to the back end
# 
# Some of this code is inspired by the picamera docs:
# http://picamera.readthedocs.io/en/release-1.13/recipes1.html
######################################################################

import requests
import time

from io import BytesIO
from picamera import PiCamera

# Create an in-memory stream
print('Raspberry Pi laundry camera started')
stream = BytesIO()

# Setup the camera
# Rotate 90 degrees
# ROI is 0.6, 0.22, 0.2, 0.2
camera = PiCamera()
camera.resolution = (1280, 1024)
camera.rotation = 90
camera.zoom = (0.4, 0.05, 0.4, 0.5)

# Camera warm-up time?
camera.start_preview()
time.sleep(2)
print('Camera is warmed up.')

for x in range(0, 3):
  camera.capture(stream, 'jpeg')
 
  # Send the image to the back end
  statusCode = 0
  try:
    res = requests.post(url='http://envy5:8888/img',
    	data=stream.getvalue(),
  	  headers={'Content-Type': 'image/jpeg'})
    statusCode = res.status_code
  finally:
    print('Response: ', statusCode)

  # Reset the stream
  stream.seek(0)
  stream.truncate()

  # Sleep for 15 seconds
  time.sleep(15)
