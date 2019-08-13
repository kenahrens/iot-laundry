from laundry import Laundry

laundryModel = Laundry()

# Make the generators for each directory
train_generator = Laundry.make_generator('./laundry/train')
validation_generator = Laundry.make_generator('./laundry/validation')

# Train the model
history = laundryModel.train_model(train_generator, validation_generator)

# Get the accuracy for validation
STEP_SIZE_VALIDATION = validation_generator.n//validation_generator.batch_size + 1
loss, acc = model.evaluate_generator(generator=validation_generator, steps=STEP_SIZE_VALIDATION)
print("Model accuracy for validation: {:5.2f}%".format(100*acc))

# Run a prediction
test_generator = Laundry.make_generator('./laundry/test')
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