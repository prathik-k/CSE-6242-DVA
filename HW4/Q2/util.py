import numpy as np


# This method computes entropy for information gain
def entropy(class_y):
    # Input:
    #   class_y         : list of class labels (0's and 1's)

    # TODO: Compute the entropy for a list of classes
    #
    # Example:
    #    entropy([0,0,0,1,1,1,1,1,1]) = 0.92
    if np.count_nonzero(class_y) == 0 or np.count_nonzero(class_y) == len(class_y):
        return 0
    else:
        num_ones = np.count_nonzero(class_y)
        num_zeros = len(class_y)-num_ones
        prob_ones = num_ones/(num_ones+num_zeros)
        prob_zeros = num_zeros/(num_ones+num_zeros)
        entropy = -prob_ones*np.log2(prob_ones)-prob_zeros*np.log2(prob_zeros)
        return entropy


def partition_classes(X, y, split_attribute, split_val):
    # Inputs:
    #   X               : data containing all attributes
    #   y               : labels
    #   split_attribute : column index of the attribute to split on
    #   split_val       : either a numerical or categorical value to divide the split_attribute

    # TODO: Partition the data(X) and labels(y) based on the split value - BINARY SPLIT.
    #
    # You will have to first check if the split attribute is numerical or categorical
    # If the split attribute is numeric, split_val should be a numerical value
    # For example, your split_val could be the mean of the values of split_attribute
    # If the split attribute is categorical, split_val should be one of the categories.
    #
    # You can perform the partition in the following way
    # Numeric Split Attribute:
    #   Split the data X into two lists(X_left and X_right) where the first list has all
    #   the rows where the split attribute is less than or equal to the split value, and the
    #   second list has all the rows where the split attribute is greater than the split
    #   value. Also create two lists(y_left and y_right) with the corresponding y labels.
    #
    # Categorical Split Attribute:
    #   Split the data X into two lists(X_left and X_right) where the first list has all
    #   the rows where the split attribute is equal to the split value, and the second list
    #   has all the rows where the split attribute is not equal to the split value.
    #   Also create two lists(y_left and y_right) with the corresponding y labels.

    '''
    Example:

    X = [[3, 'aa', 10],                 y = [1,
         [1, 'bb', 22],                      1,
         [2, 'cc', 28],                      0,
         [5, 'bb', 32],                      0,
         [4, 'cc', 32]]                      1]

    Here, columns 0 and 2 represent numeric attributes, while column 1 is a categorical attribute.

    Consider the case where we call the function with split_attribute = 0 and split_val = 3 (mean of column 0)
    Then we divide X into two lists - X_left, where column 0 is <= 3  and X_right, where column 0 is > 3.

    X_left = [[3, 'aa', 10],                 y_left = [1,
              [1, 'bb', 22],                           1,
              [2, 'cc', 28]]                           0]

    X_right = [[5, 'bb', 32],                y_right = [0,
               [4, 'cc', 32]]                           1]

    Consider another case where we call the function with split_attribute = 1 and split_val = 'bb'
    Then we divide X into two lists, one where column 1 is 'bb', and the other where it is not 'bb'.

    X_left = [[1, 'bb', 22],                 y_left = [1,
              [5, 'bb', 32]]                           0]

    X_right = [[3, 'aa', 10],                y_right = [1,
               [2, 'cc', 28],                           0,
               [4, 'cc', 32]]                           1]

    '''
    X_left = []
    X_right = []

    y_left = []
    y_right = []

    if type(split_val) == str:
        for i in range(len(X)):
            if X[i][split_attribute] == split_val:
                X_left.append(X[i])
                y_left.append(y[i])

            else:
                X_right.append(X[i])
                y_right.append(y[i])
    elif isinstance(split_val,np.float64) or isinstance(split_val,np.int64) or isinstance(split_val,np.int32):
        for i in range(len(X)):
            if X[i][split_attribute] <= split_val:
                X_left.append(X[i])
                y_left.append(y[i])
            else:
                X_right.append(X[i])
                y_right.append(y[i])

    return dict(X_left = X_left, X_right = X_right, y_left = y_left, y_right = y_right)


def information_gain(previous_y, current_y):
    # Inputs:
    #   previous_y: the distribution of original labels (0's and 1's)
    #   current_y:  the distribution of labels after splitting based on a particular
    #               split attribute and split value

    # TODO: Compute and return the information gain from partitioning the previous_y labels
    # into the current_y labels.
    # You will need to use the entropy function above to compute information gain
    # Reference: http://www.cs.cmu.edu/afs/cs.cmu.edu/academic/class/15381-s06/www/DTs.pdf

    """
    Example:

    previous_y = [0,0,0,1,1,1]
    current_y = [[0,0], [1,1,1,0]]

    info_gain = 0.45915
    """
    prev_entropy = entropy(previous_y)
    curr_entropy = 0

    for elem in current_y:
        curr_entropy += entropy(elem)*len(elem)/len(previous_y)

    info_gain = prev_entropy - curr_entropy
    return info_gain


def best_split(X, y):
    # Inputs:
    #   X       : Data containing all attributes
    #   y       : labels
    # TODO: For each node find the best split criteria and return the
    # split attribute, spliting value along with
    # X_left, X_right, y_left, y_right (using partition_classes)
    '''

    NOTE: Just like taught in class, don't use all the features for a node.
    Repeat the steps:

    1. Select m attributes out of d available attributes
    2. Pick the best variable/split-point among the m attributes
    3. return the split attributes, split point, left and right children nodes data

    '''
    Xnp = np.asarray(X)
    best_info_gain = 0
    best_index = 0
    best_value = 0
    best_X_left = []
    best_X_right = []
    best_y_left = []
    best_y_right = []

    m_list = np.random.choice(len(X[0]), len(X[0]), replace=False)

    for m in m_list:
        split_val = np.mean(Xnp[:, m])
        partitioned_data = partition_classes(X, y, m, split_val)
        X_left = partitioned_data['X_left']
        X_right = partitioned_data['X_right']
        y_left = partitioned_data['y_left']
        y_right = partitioned_data['y_right']
        info_gain = information_gain(y, [y_left, y_right])
        if info_gain > best_info_gain:
            best_index, best_value, best_info_gain, best_X_left, best_X_right, best_y_left, best_y_right = m, split_val, info_gain, X_left, X_right, y_left, y_right
    best_split = {'X_left': best_X_left, 'X_right': best_X_right, 'y_left': best_y_left, 'y_right': best_y_right,'split_attr': best_index, 'split_val': best_value, 'info_gain': best_info_gain}
    return best_split