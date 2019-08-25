# Inspired by:
# https://classroom.udacity.com/courses/ud187
# https://www.tensorflow.org/beta/tutorials/*
# https://keras.io/preprocessing/image/
# https://keras.io/visualization/

from __future__ import absolute_import, division, print_function, unicode_literals

import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
import os

from tensorflow.keras.preprocessing.image import ImageDataGenerator

import logging
logger = tf.get_logger()
logger.setLevel(logging.ERROR)

SHAPE_X = 256
SHAPE_Y = 320
SHAPE_Z = 3

checkpoint_path = "checkpoints/cp.ckpt"
checkpoint_dir = os.path.dirname(checkpoint_path)

# Create a callback that saves the model's weights
cp_callback = tf.keras.callbacks.ModelCheckpoint(filepath=checkpoint_path,
                                                 save_weights_only=True,
                                                 verbose=1)

class LaundryModel:
    def __init__(self):
        # Create the CNN
        self.model = tf.keras.Sequential([
            tf.keras.layers.Conv2D(64, (3,3), padding='same', activation=tf.nn.relu, input_shape=(SHAPE_X, SHAPE_Y, SHAPE_Z)),
            tf.keras.layers.MaxPooling2D((2, 2), strides=2),
            tf.keras.layers.Conv2D(128, (3,3), padding='same', activation=tf.nn.relu),
            tf.keras.layers.MaxPooling2D((2, 2), strides=2),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Flatten(),
            tf.keras.layers.Dense(64, activation='relu'),
            tf.keras.layers.Dense(40, activation='softmax')
        ])
        # Compile the model
        self.model.compile(optimizer='adam',
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy'])

    def train_model(self, train_generator, validation_generator):
        history = self.model.fit_generator(
            train_generator,
            steps_per_epoch=120,
            epochs=10,
            validation_data=validation_generator,
            validation_steps=50,
            callbacks=[cp_callback])
        return history
    
    def load_checkpoint(self, prefix):
        print('Getting latest checkpoint from', prefix + weights_final)
        self.model.load_weights(prefix + weights_final)

    def predict(self, jpeg):
        img = LaundryUtil.preprocess(jpeg)
        img = np.expand_dims(img, axis=0)
        return self.model.predict(img)

class LaundryUtil:
    # These functions are outside of the LaundryModel object
    def plot_history(history):
        # Plot training & validation accuracy values
        plt.plot(history.history['accuracy'])
        plt.plot(history.history['val_accuracy'])
        plt.title('Model accuracy')
        plt.ylabel('Accuracy')
        plt.xlabel('Epoch')
        plt.legend(['Train', 'Test'], loc='upper left')
        plt.show()

    def make_generator(dirname):
        datagen = ImageDataGenerator(rescale=1./255)
        generator = datagen.flow_from_directory(
            dirname,
            target_size=(SHAPE_X, SHAPE_Y),
            batch_size=32,
            class_mode='binary')
        return generator

    def preprocess(jpeg):
        img = tf.image.decode_jpeg(jpeg, channels=3)
        img = tf.image.resize(img, [SHAPE_X, SHAPE_Y])
        img /= 255.0  # normalize to [0,1] range  
        return img

    def load_and_preprocess_img(path):
        jpeg = tf.io.read_file(path)
        img = LaundryUtil.preprocess(img)
        return img
