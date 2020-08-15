import numpy as np
import ast
from util import *

class DecisionTree(object):
    def __init__(self, max_depth):
        # Initializing the tree as an empty dictionary or list, as preferred
        self.tree = {}
        self.max_depth = max_depth

    def learn(self, X, y, par_node={}, depth=0):
        # TODO: Train the decision tree (self.tree) using the the sample X and labels y
        # You will have to make use of the functions in utils.py to train the tree

        # Use the function best_split in util.py to get the best split and
        # data corresponding to left and right child nodes

        # One possible way of implementing the tree:
        #    Each node in self.tree could be in the form of a dictionary:
        #       https://docs.python.org/2/library/stdtypes.html#mapping-types-dict
        #    For example, a non-leaf node with two children can have a 'left' key and  a
        #    'right' key. You can add more keys which might help in classification
        #    (eg. split attribute and split value)
        ### Implement your code here
        #############################################
        if par_node is None or len(y) == 0:
            return None
        else:
            bsplit = best_split(X, y)
            counts = np.bincount(y)
            most_common_y = np.argmax(counts)

            par_node = dict(split_attr = bsplit['split_attr'],split_val = bsplit['split_val'],node_val = most_common_y)

            par_node['left'] = self.learn(bsplit['X_left'], bsplit['y_left'], {}, depth + 1)
            par_node['right'] = self.learn(bsplit['X_right'], bsplit['y_right'], {}, depth + 1)

            if par_node['left'] == None or par_node['right'] == None:
                par_node['is_leaf'] = 'yes'
            else:
                par_node['is_leaf'] = 'no'
            self.tree = par_node
            return (par_node)

    def classify(self, record):
        # TODO: classify the record using self.tree and return the predicted label
        ### Implement your code here
        #############################################
        cur_layer = self.tree
        while cur_layer.get('split_val'):
            if cur_layer['is_leaf'] == 'yes':
                return cur_layer['node_val']
            elif cur_layer['is_leaf'] == 'no':
                if record[cur_layer['split_attr']] <= cur_layer['split_val']:
                    cur_layer = cur_layer['left']
                else:
                    cur_layer = cur_layer['right']
        else:
            return cur_layer['node_val']


