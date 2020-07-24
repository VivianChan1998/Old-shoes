# The steps implemented in the object detection sample code: 
# 1. for an image of width and height being (w, h) pixels, resize image to (w', h'), where w/h = w'/h' and w' x h' = 262144
# 2. resize network input size to (w', h')
# 3. pass the image to network and do inference
# (4. if inference speed is too slow for you, try to make w' x h' smaller, which is defined with DEFAULT_INPUT_SIZE (in object_detection.py or ObjectDetection.cs))
"""Sample prediction script for TensorFlow 2.x."""
import sys
import tensorflow as tf
import numpy as np
from PIL import Image
import json
from object_detection import ObjectDetection
import config

MODEL_FILENAME = config.MODEL_PATH
LABELS_FILENAME = config.LABELS_PATH


class TFObjectDetection(ObjectDetection):
    """Object Detection class for TensorFlow"""

    def __init__(self, graph_def, labels):
        print("###################### get into __init__ ##########################")
        super(TFObjectDetection, self).__init__(labels)
        self.graph = tf.compat.v1.Graph()
        with self.graph.as_default():
            input_data = tf.compat.v1.placeholder(tf.float32, [1, None, None, 3], name='Placeholder')
            tf.import_graph_def(graph_def, input_map={"Placeholder:0": input_data}, name="")

    def predict(self, preprocessed_image):
        print("#####################get into predict #######################")
        inputs = np.array(preprocessed_image, dtype=np.float)[:, :, (2, 1, 0)]  # RGB -> BGR

        with tf.compat.v1.Session(graph=self.graph) as sess:
            output_tensor = sess.graph.get_tensor_by_name('model_outputs:0')
            outputs = sess.run(output_tensor, {'Placeholder:0': inputs[np.newaxis, ...]})
            return outputs[0]


def main(image_filename):
    # Load a TensorFlow model
    graph_def = tf.compat.v1.GraphDef()
    with tf.io.gfile.GFile(MODEL_FILENAME, 'rb') as f:
        graph_def.ParseFromString(f.read())

    # Load labels
    with open(LABELS_FILENAME, 'r') as f:
        labels = [l.strip() for l in f.readlines()]

    od_model = TFObjectDetection(graph_def, labels)

    image = Image.open(image_filename)
    print("############################ open file ##########################")
    predictions = od_model.predict_image(image)
    print(predictions)
    # return predictions

def write_JSON(predictions):
    JSON_dir = config.JSON_DIR
    with open( JSON_dir + 'prediction.json', 'w', encoding='utf-8') as f:
        json.dump(predictions, f, ensure_ascii=False, indent=4)


if __name__ == '__main__':
    if len(sys.argv) <= 1:
        print('USAGE: {} image_filename'.format(sys.argv[0]))
    else:
        # predictions = main(sys.argv[1])
        main(sys.argv[1])
        # write_JSON(predictions)