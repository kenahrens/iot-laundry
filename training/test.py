import os
import cv2
import numpy as np
import pytesseract

from PIL import Image

def parseFile(fname):
  # print('parsing file:', fname)

  # Read JPG
  cvImg = cv2.imread(fname)

  # Turn the image grayscale
  # cvGray = cv2.cvtColor(cvImg, cv2.COLOR_BGR2GRAY)

  # Figure out if we have a picture with the light on or off
  mean = cv2.mean(cvImg)

  if (mean[0] < 50.0) & (mean[1] < 50.0) & (mean[2] < 50.0):
    # print(fname, ' is dark: ', mean)

    # Mask out the yellow / green area
    lowerGreen = np.array([0,100,80])
    upperGreen = np.array([255,255,255])
    maskGreen = 255 - cv2.inRange(cvImg, lowerGreen, upperGreen)

  elif (mean[0] > 50.0) & (mean[1] > 50.0) & (mean[2] > 50.0):
    # print(fname, ' is light: ', mean)

    # Mask out the yellow / green area
    lowerGreen = np.array([0,80,20])
    upperGreen = np.array([40,200,60])
    maskGreen = 255 - cv2.inRange(cvImg, lowerGreen, upperGreen)

    # Subract from 255 to make the background white
    # cvInvert = 255 - cv2.bitwise_and(cvBlacked, cvBlacked, mask = maskGreen)

  else:
    print(fname, ' can\'t determine light or dark ', mean)

  
  # ret, thresh = cv2.threshold(maskGreen, 127, 255, cv2.THRESH_BINARY)
  # print(ret)
  # contours,hierarchy = cv2.findContours(thresh,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
  # cnt = contours[0]
  # print(cnt)
  # x,y,w,h = cv2.boundingRect(cnt)
  # crop = maskGreen[y:y+h,x:x+w]
  # cv2.imwrite('fixed.jpg',crop)

  # Convert to Image format
  img = Image.fromarray(maskGreen)

  # Turn the image into a string
  ocr = pytesseract.image_to_string(img, 'eng', False, '-psm 8 nobatch digits')
  ocr = ocr.replace(" ", "")

  # Grab the expected value from the filename
  iDash = fname.index('-') + 1
  iPeriod = fname.index('.')
  expected = fname[iDash:iPeriod]

  # newName = './clean/' + fname[0:iPeriod] + '-clean.jpg'
  # cv2.imwrite(newName, maskGreen)

  if (expected == "none"):
    expected = ""

  if (expected != ocr):
    print(fname, ' expected: ', expected, ' ocr:', ocr)
    # newName = './clean/' + fname[0:iPeriod] + '-clean.jpg'
    # cv2.imwrite(newName, maskGreen)
  else:
    print(fname, ' processed properly')

  # Print out the string
  # print(fname, ' read as: ', ocr)

# Read through all the files in the directory
for dirname, dirnames, filenames in os.walk('.'):
  for filename in filenames:
    if (filename.endswith('.jpg')):
      parseFile(filename)
      # break
