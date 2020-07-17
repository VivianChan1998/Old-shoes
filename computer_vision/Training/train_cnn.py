#coding=utf-8

import os
from PIL import Image
import numpy as np
# import tensorflow as tf
import tensorflow.compat.v1 as tf
tf.disable_v2_behavior()
import config_own

# data dir
# data_dir = "data"
data_dir = config_own.AFTER_RESIZE_DIR

# train or evaluate
train = True

# model dir
# model_path = "model/image_model"
model_path = config_own.CKPT_DIR

# read imgs int the dir 
def read_data(data_dir):
    datas = []
    labels = []
    fpaths = []
    for fname in os.listdir(data_dir):
        fpath = os.path.join(data_dir, fname)
        fpaths.append(fpath)
        image = Image.open(fpath)
        data = np.array(image) / 255.0
        label = int(fname.split("_")[0])
        datas.append(data)
        labels.append(label)

    datas = np.array(datas)
    labels = np.array(labels)

    print("shape of datas: {}\tshape of labels: {}".format(datas.shape, labels.shape))
    return fpaths, datas, labels


fpaths, datas, labels = read_data(data_dir)

# calculate how many imgs are there
num_classes = len(set(labels))

# define placeholder
datas_placeholder = tf.placeholder(tf.float32, [None, 128, 128, 3])#################################
labels_placeholder = tf.placeholder(tf.int32, [None])

# container of Dropout, 0.25 when training and 0 when evaluate
dropout_placeholdr = tf.placeholder(tf.float32)

# Convolution, 20 cores, size = 5, by ReLu
conv0 = tf.layers.conv2d(datas_placeholder, 20, 5, activation=tf.nn.relu)

# define Max-pooling, pooling window = 2*2, 2*2
pool0 = tf.layers.max_pooling2d(conv0, [2, 2], [2, 2])

# Convolution, 40 cores, size = 4, by ReLu
conv1 = tf.layers.conv2d(pool0, 40, 4, activation=tf.nn.relu)
# define Max-pooling, pooling window = 2*2, 2*2
pool1 = tf.layers.max_pooling2d(conv1, [2, 2], [2, 2])

# 3-dimension => 1-dimension
flatten = tf.layers.flatten(pool1)

# Full connected layer, transfer to eigenvector of size 100
fc = tf.layers.dense(flatten, 400, activation=tf.nn.relu)

# add Dropout in order not to overfit
dropout_fc = tf.layers.dropout(fc, dropout_placeholdr)

# deactivated export layer
logits = tf.layers.dense(dropout_fc, num_classes)

predicted_labels = tf.arg_max(logits, 1)


# define loss
losses = tf.nn.softmax_cross_entropy_with_logits(
    labels=tf.one_hot(labels_placeholder, num_classes),
    logits=logits
)

# average loss
mean_loss = tf.reduce_mean(losses)

# define optimizer, designate the loss function
optimizer = tf.train.AdamOptimizer(learning_rate=1e-2).minimize(losses)


# use to store and load the model
saver = tf.train.Saver()

with tf.Session() as sess:

    if train:
        print("Train mode")

        # if train mode = true, then init the parameter
        sess.run(tf.global_variables_initializer())
        # define import and label to fill the container, dropout = 0.25 when training
        train_feed_dict = {
            datas_placeholder: datas,
            labels_placeholder: labels,
            dropout_placeholdr: 0.25
        }
        for step in range(2000):
            _, mean_loss_val = sess.run([optimizer, mean_loss], feed_dict=train_feed_dict)

            if step % 10 == 0:
                print("step = {}\tmean loss = {}".format(step, mean_loss_val))
        saver.save(sess, model_path)
        print("Done training，store the model to {}".format(model_path))
    else:
        print("Test mode")

        # load the parameter if it is evaluation
        saver.restore(sess, model_path)
        print("from {} import model".format(model_path))

        # label and name
        label_name_dict = {
            0: "old",
            1: "nearly old",
            2: "almost new"
        }
        # define the import and Label to fulfill the container, dropout = 0 when evaluate
        test_feed_dict = {
            datas_placeholder: datas,
            labels_placeholder: labels,
            dropout_placeholdr: 0
        }
        predicted_labels_val = sess.run(predicted_labels, feed_dict=test_feed_dict)
        # real label and model's prediction
        for fpath, real_label, predicted_label in zip(fpaths, labels, predicted_labels_val):
            # transfer the label id into label name
            real_label_name = label_name_dict[real_label]
            predicted_label_name = label_name_dict[predicted_label]
            print("{}\t{} => {}".format(fpath, real_label_name, predicted_label_name))
