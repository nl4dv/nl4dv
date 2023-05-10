import re
from nltk.corpus import wordnet as wn
from itertools import product
import math
from collections import Counter
from collections.abc import MutableMapping
from fuzzywuzzy import fuzz
import Levenshtein
from datetime import date, datetime
import copy
from nl4dv.utils import constants
import json


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
        if datum is None or datum == '' or str(datum).isspace():
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
        if datum is None or datum == '' or str(datum).isspace():
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
        if datum is None or datum == '' or str(datum).isspace():
            return False, None
        for idx, regex_list in enumerate(constants.date_regexes):
            regex = re.compile(regex_list[1])
            match = regex.match(str(datum))
            if match is not None:
                dateobj = dict()
                dateobj["regex_id"] = idx
                dateobj["regex_matches"] = list(match.groups())
                return True, dateobj
    except Exception as e:
        pass
    return False, None

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


# Use to determine if two lists have any common elements, if any.
def common_member(a, b):
    a_set = set(a)
    b_set = set(b)
    if (a_set & b_set):
        return True
    else:
        return False


def format_str_to_date(str, format):
    try:
        return datetime.strptime(str, format)
    except Exception as e:
        return None


class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, set):
            return list(obj)
        if isinstance(obj, (date, datetime)):
            return obj.strftime("%Y/%m/%d")
        return json.JSONEncoder.default(self, obj)
