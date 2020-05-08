import re
from nltk.corpus import wordnet as wn
from itertools import product
import math
from collections import Counter, MutableMapping
from fuzzywuzzy import fuzz
import Levenshtein
from dateutil.parser import parse
from datetime import date, datetime
import copy

WORD = re.compile(r'\w+')

# Includes Repetition
def get_ngrams(input, n):
    input = input.split(' ')
    output = []
    for i in range(len(input)-n+1):
        output.append(input[i:i+n])
    return output

# Removes Duplicate N-Grams
def get_ngrams_without_duplicate(input, n):
    input = input.split(' ')
    output = {}
    for i in range(len(input)-n+1):
        g = ' '.join(input[i:i+n])
        output.setdefault(g, 0)
        output[g] += + 1
        return output

# ToDo:- Explore alternatives to WordNet similarity
def synonymity_score(word_x, word_y):
    # type: (str, str) -> int
    """
    Helper method to find similarity between two words

    """
    sem_1 = wn.synsets(word_x)
    sem_2 = wn.synsets(word_y)
    max_score = 0
    for i, j in list(product(*[sem_1, sem_2])):
        score = i.wup_similarity(j)
        max_score = score if (score is not None and max_score < score) else max_score

    return max_score * 100


def set_default(obj):
    """
    Return a serialized version of set  which is a list.

    """
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()

    if isinstance(obj, set):
        return list(obj)

    raise TypeError ("Type %s not serializable" % type(obj))

def cond_print(string_to_print, debug=True):
    if debug:
        print(string_to_print)


def normalize(vis_list, attr, tasks):
    max_score_by_attr = len(attr)
    max_score_by_tasks = len(tasks)
    max_score_by_vis = 1
    for vis in vis_list:
        vis["normalized_score"] = vis["score"] / (max_score_by_attr + max_score_by_tasks + max_score_by_vis)
    return vis_list


def vectorize(text):
    words = WORD.findall(text)
    return Counter(words)


def cosine_similarity(vec1, vec2):
    intersection = set(vec1.keys()) & set(vec2.keys())
    numerator = sum([vec1[x] * vec2[x] for x in intersection])

    sum1 = sum([vec1[x]**2 for x in vec1.keys()])
    sum2 = sum([vec2[x]**2 for x in vec2.keys()])
    denominator = math.sqrt(sum1) * math.sqrt(sum2)

    if not denominator:
        return 0.0
    else:
        score = float(numerator) * 100 / denominator
        return score


def filter_combo_based_on_unique_keywords(combo, queryPhrase, attributes, a_k_mapping, k_a_mapping, allow_subset=False):
    unique_keywords = set()
    # The combination has already incorporated the to be "encode"d attributes.
    for c in combo:
        unique_keywords.add(','.join(a_k_mapping[c].keys()))

    unique_attrs = set()
    for k in k_a_mapping:
        is_encode = True
        for a in k_a_mapping[k]:
            if a in attributes and not attributes[a]["encode"]:
                is_encode = False
                break

        if is_encode:
            if ','.join(k_a_mapping[k].keys()) not in unique_attrs:
                unique_attrs.add(','.join(k_a_mapping[k].keys()))

    if allow_subset:
        return len(combo) != len(unique_keywords) or len(combo) != len(queryPhrase)

    # Ensure each attribute comes from a different keyword for the visualization AND all such attributes detected form the visualization.
    return len(combo) != len(unique_attrs) or (len(unique_keywords) != len(combo))

def compute_similarity(str1, str2, type):
    if type == 'cosine_similarity':
        return cosine_similarity(vectorize(str1), vectorize(str2.lower()))

    elif type == 'token_similarity':
        return fuzzy_token_similarity(str1, str2.lower())

    elif type == 'partial_ratio':
        return fuzzy_partial_ratio(str1, str2.lower())

    elif type == 'ratio_similarity':
        return fuzzy_ratio_similarity(str1, str2.lower())

    elif type == 'levenshtein_distance':
        return levenshtein_distance(str1, str2.lower())


def fuzzy_token_similarity(str1, str2):
    return fuzz.token_set_ratio(str1, str2)


def fuzzy_ratio_similarity(str1, str2):
    return fuzz.ratio(str1, str2)


def fuzzy_partial_ratio(str1, str2):
    return fuzz.partial_ratio(str1, str2)


def levenshtein_distance(str1, str2):
    dist = Levenshtein.distance(str1, str2)
    longer_str = str1 if len(str1) > len(str2) else str2
    score = float(dist) * 100 / len(longer_str)
    return score


def isfloat(datum):
    try:
        if datum == '' or str(datum).isspace():
            return False
        float(datum)
    except AttributeError:
        return False
    except ValueError:
        return False
    except OverflowError:
        return False
    return True


def isint(datum):
    try:
        if datum == '' or str(datum).isspace():
            return False
        a = float(datum)
        b = int(a)
    except AttributeError:
        return False
    except ValueError:
        return False
    except OverflowError:
        return False
    return a == b


def isdate(datum):
    try:
        if datum == '' or str(datum).isspace():
            return False
        parse(datum, fuzzy=False)
    except AttributeError:
        return False
    except ValueError:
        return False
    except OverflowError:
        return False
    return True


# Trim the output LIST based on the debug parameter
def delete_keys_from_list(array, keys):
    keys_set = set(keys)
    modified_array = copy.deepcopy(array)
    for index, value in enumerate(array):
        if isinstance(value, MutableMapping):
            modified_array[index] = delete_keys_from_dict(value, keys_set)
        else:
            modified_array[index] = value
    return modified_array


# Trim the output DICTIONARY based on the debug parameter
def delete_keys_from_dict(dictionary, keys):
    keys_set = set(keys)
    modified_dict = {}
    for key, value in dictionary.items():
        if key not in keys_set:
            if isinstance(value, MutableMapping):
                modified_dict[key] = delete_keys_from_dict(value, keys_set)
            elif isinstance(value, list):
                modified_dict[key] = delete_keys_from_list(value, keys_set)
            else:
                modified_dict[key] = value  # or copy.deepcopy(value) if a copy is desired for non-dicts.
    return modified_dict


# Get a sorted list of (attributes and their datatype) tuples to determine IMPLICIT TASKS as well as default VIS encodings
def get_attr_datatype_shorthand(attributes, data_attribute_map):
    attr_datatype_combo = []
    for attr in attributes:
        attr_datatype_combo.append((attr, data_attribute_map[attr]['dataType']))

    # Since the `vis_combo` mapping keys are in a specific order [Q,N,O,T], we will order the list of attributes in this order
    default_sort_order = ['Q', 'N', 'O', 'T']
    sorted_attr_datatype_combo = [(attr,attr_type) for x in default_sort_order for (attr,attr_type) in attr_datatype_combo if attr_type == x]
    return sorted_attr_datatype_combo
