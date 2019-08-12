# Inspired by:
# https://classroom.udacity.com/courses/ud187
# https://www.tensorflow.org/beta/tutorials/*
# https://keras.io/preprocessing/image/
# https://keras.io/visualization/

from __future__ import absolute_import, division, print_function, unicode_literals

import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd

from tensorflow.keras.preprocessing.image import ImageDataGenerator

import logging
logger = tf.get_logger()
logger.setLevel(logging.ERROR)

print(tf.__version__)

SHAPE_X = 256
SHAPE_Y = 320
SHAPE_Z = 3

checkpoint_path = "checkpoints/cp.ckpt"
checkpoint_dir = os.path.dirname(checkpoint_path)

# Create a callback that saves the model's weights
cp_callback = tf.keras.callbacks.ModelCheckpoint(filepath=checkpoint_path,
                                                 save_weights_only=True,
                                                 verbose=1)

def create_model():
    # Create the CNN
    model = tf.keras.Sequential([
        tf.keras.layers.Conv2D(64, (3,3), padding='same', activation=tf.nn.relu, input_shape=(SHAPE_X, SHAPE_Y, SHAPE_Z)),
        tf.keras.layers.MaxPooling2D((2, 2), strides=2),
        tf.keras.layers.Conv2D(128, (3,3), padding='same', activation=tf.nn.relu),
        tf.keras.layers.MaxPooling2D((2, 2), strides=2),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.Dense(67, activation='softmax')
    ])
    # Compile the model
    model.compile(optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy'])
    return model

def train_model():
    history = model.fit_generator(
        train_generator,
        steps_per_epoch=120,
        epochs=10,
        validation_data=validation_generator,
        validation_steps=50,
        callbacks=[cp_callback])
    # Plot training & validation accuracy values
    plt.plot(history.history['accuracy'])
    plt.plot(history.history['val_accuracy'])
    plt.title('Model accuracy')
    plt.ylabel('Accuracy')
    plt.xlabel('Epoch')
    plt.legend(['Train', 'Test'], loc='upper left')
    plt.show()
    return history

def make_generator(dirname):
    datagen = ImageDataGenerator(
        rescale=1./255)
    generator = datagen.flow_from_directory(
        dirname,
        target_size=(SHAPE_X, SHAPE_Y),
        batch_size=32,
        class_mode='binary')
    return generator

def load_and_preprocess_image(path):
    image = tf.io.read_file(path)
    image = tf.image.decode_jpeg(image, channels=3)
    image = tf.image.resize(image, [SHAPE_X, SHAPE_Y])
    image /= 255.0  # normalize to [0,1] range  
    return image

# Make the generators for each directory
train_generator = make_generator('./laundry/train')
validation_generator = make_generator('./laundry/validation')
test_generator = make_generator('./laundry/test')

model = create_model()
history = train_model()

# latest = tf.train.latest_checkpoint('./checkpoints')
# model.load_weights(latest)

# Get the accuracy for validation
STEP_SIZE_VALIDATION = validation_generator.n//validation_generator.batch_size + 1
loss, acc = model.evaluate_generator(generator=validation_generator, steps=STEP_SIZE_VALIDATION)
print("Model accuracy for validation: {:5.2f}%".format(100*acc))

# Run a prediction
img_path = test_generator.filenames[0]
img_final = load_and_preprocess_image('./laundry/test/' + test_generator.filenames[0])
img_raw = tf.io.read_file('./laundry/test/' + img_path)
img_tensor = tf.image.decode_image(img_raw)
img_final = tf.image.resize(img_tensor, [320, 256])
img_final = img_final/255.0


x_batch, y_batch = next(test_generator)
plt.figure(figsize=(10,10))
for i in range(25):
    plt.subplot(5,5,i+1)
    plt.xticks([])
    plt.yticks([])
    plt.grid(False)
    plt.imshow(x_batch[i], cmap=plt.cm.binary)
    plt.xlabel(predictions[i] + ' ' + test_generator.filenames[i])

plt.show()
