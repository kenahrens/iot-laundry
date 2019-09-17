from laundry import LaundryModel, LaundryUtil
import matplotlib.pyplot as plt

laundryModel = LaundryModel()

# Make the generators for each directory
train_generator = LaundryUtil.make_generator('./laundry/train')
validation_generator = LaundryUtil.make_generator('./laundry/validation')

# Train the model
history = laundryModel.train_model(train_generator, validation_generator)
LaundryUtil.plot_history(history)
