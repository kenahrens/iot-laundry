#!/usr/bin/python
from flask import Flask, jsonify, request, Response
from laundry.model import LaundryModel

import datetime
import numpy as np

app = Flask(__name__)

# Initialize laundry model from checkpoint
lModel = LaundryModel()
lModel.load_checkpoint('./predict/laundry/')

@app.route('/', methods=['GET'])
def index():
    return "The time is " + str(datetime.datetime.now())

@app.route('/predict', methods=['POST'])
def predict():
    app.logger.info('Got data of size: ' + str(len(request.data)))
    # Create the prediction, get the argument
    predict = lModel.predict(request.data)
    predictMax = np.argmax(predict)
    app.logger.info('Got predict: ' + str(predictMax))
    app.logger.info('Got confidence: ' + str(predict[0][predictMax]))
    # Create the response with the prediction and confidence
    response = {
        'predict': int(predictMax),
        'confidence': str(predict[0][predictMax])
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
