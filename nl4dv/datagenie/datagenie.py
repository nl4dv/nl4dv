import csv
from collections import Counter
import json
import sys
from dateparser import parse
from nl4dv.utils import constants, error_codes, helpers
import os

class DataGenie:
    """
    Pre-process data attributes into different categories
    """

    def __init__(self, nl4dv_instance):

        # nl4dv instance
        self.nl4dv_instance = nl4dv_instance
        
        # set label attribute
        self.set_label_attribute(label_attribute=self.nl4dv_instance.label_attribute)

        # set ignore list
        self.set_ignore_words(ignore_words=self.nl4dv_instance.ignore_words)

        # set custom stopwords list
        self.set_reserve_words(reserve_words=self.nl4dv_instance.reserve_words)

        # set data and extract attributes
        self.set_data(data_url=self.nl4dv_instance.data_url)

        # set alias map
        self.set_alias_map(alias_url=self.nl4dv_instance.alias_url, alias_map=self.nl4dv_instance.alias_map)

    # Update the attribute datatypes that were not correctly detected by NL4DV
    def set_attribute_datatype(self, attr_type_obj):
        # Set new datatype
        for attribute, data_type in attr_type_obj.items():
            self.data_attribute_map[attribute]['dataType'] = data_type

            if data_type in constants.attribute_types.values():
                self.populate_dataset_meta_for_attr(attribute, data_type)
            else:
                helpers.cond_print("Invalid Target DataType. Choose from " + str(constants.attribute_types.values()), debug=True)
                sys.exit(error_codes.BAD_INPUT_ATTRIBUTE_DATA_TYPE)

    # Set Label attribute for the dataset, i.e. one that defines what the dataset is about.
    # e.g. "Correlate horsepower and MPG for sports car models" should NOT apply an explicit attribute for models since there are two explicit attributes already present.
    def set_label_attribute(self, label_attribute):
        self.nl4dv_instance.label_attribute = label_attribute
        return True

    # WORDS that should be IGNORED in the query, i.e. NOT lead to the detection of attributes and tasks
    # `Movie` in movies dataset
    # `Car` in cars dataset
    def set_ignore_words(self, ignore_words):
        self.nl4dv_instance.ignore_words = ignore_words
        return True

    # Custom STOPWORDS that should NOT removed from the query, as they might be present in the domain.
    # e.g. `A` in grades dataset
    def set_reserve_words(self, reserve_words):
        self.nl4dv_instance.reserve_words = reserve_words
        return True

    # Sets the Dataset
    def set_data(self, data_url=None):
        # type: (str) -> bool
        """
        User can choose to manually initialize data

        """
        self.nl4dv_instance.data_url = data_url

        # initialize values
        self.data_attribute_map = dict()
        self.data = list()
        self.rows = 0

        if self.nl4dv_instance.data_url is not None and os.path.isfile(self.nl4dv_instance.data_url):

            # local variables
            reader = None
            json_data = None
            attributes = list()

            if self.nl4dv_instance.data_url.lower().endswith('.csv'):
                reader = csv.reader(open(self.nl4dv_instance.data_url, 'r', encoding='utf-8'),delimiter=',')
                attributes = next(reader)  # assumes headers are in the first line
            elif self.nl4dv_instance.data_url.lower().endswith('.tsv'):
                reader = csv.reader(open(self.nl4dv_instance.data_url, 'r', encoding='utf-8'),delimiter='\t')
                attributes = next(reader)  # assumes headers are in the first line
            elif self.nl4dv_instance.data_url.lower().endswith('.json'):
                json_data = json.load(open(self.nl4dv_instance.data_url, 'r', encoding='utf-8'))
                attributes = json_data[0].keys()

            # initialize properties in Attribute Map
            for attr in attributes:
                # Don't consider attribute names that are empty or just whitespaces
                if attr and attr.strip():
                    self.data_attribute_map[attr] = {
                        'domain': set(),
                        'isLabelAttribute': attr == self.nl4dv_instance.label_attribute,
                        'summary': dict(),
                        'dataTypeList': list(), # temporary to determine datatype
                        'dataType': '',
                        'aliases': list(),
                    }

            # initialize properties in Attribute Map
            # implies file is either .csv or .tsv
            if reader is not None:
                for line in reader:
                    data_obj = dict()
                    for i in range(len(line)):
                        # Don't consider attribute names that are empty or just whitespaces
                        if attributes[i] and attributes[i].strip():
                            data_obj[attributes[i]] = line[i]
                    self.data.append(data_obj)
                    self.rows += 1
            else:
                # JSON file
                for data_obj in json_data:
                    self.data.append(data_obj)
                    self.rows += 1

            # infer attribute datatypes and compute summary (range, domain)
            for datum in self.data:
                for attr in self.data_attribute_map.keys():
                    attr_val = datum[attr]

                    # Check for Numeric (float, int)
                    if helpers.isfloat(attr_val) or helpers.isint(attr_val):
                        attr_datatype = constants.attribute_types['QUANTITATIVE']
                        self.populate_dataset_meta(attr, attr_val, attr_datatype)

                    # Check for Datetime
                    # ToDo:- Works fine for datetime strings. Not for others like Epochs and Int-only Years (e.g. 2018) which get captured above.
                    # ToDo:- It is VERY risky to switch this elif block with the if block above
                    elif helpers.isdate(attr_val)[0]:
                        attr_datatype = constants.attribute_types['TEMPORAL']
                        self.populate_dataset_meta(attr, attr_val, attr_datatype)

                    # Otherwise set as Nominal
                    else:
                        attr_datatype = constants.attribute_types['NOMINAL']
                        self.populate_dataset_meta(attr, attr_val, attr_datatype)

                    # Irrespective of above assignment, make a list of attribute types for each data row
                    # to take best decision on heterogeneous data with multiple datatypes
                    self.data_attribute_map[attr]['dataTypeList'].append(attr_datatype)

            # Determine the Datatype based on majority of values.
            # Also Override a few datatypes set above based on rules such as NOMINAL to ORDINAL if all values are unique such as Sr. 1, Sr. 2, ...
            for attr in self.data_attribute_map:
                # most common attribute type
                attr_datatype = Counter(self.data_attribute_map[attr]['dataTypeList']).most_common(1)[0][0]

                # if it's quantitative but with less than or equal to 12 unique values, then it's ordinal.
                # eg. 1, 2, 3, ..., 12 (months of a year)
                # eg. -3, -2, -1, 0, 1, 2, 3 (likert ratings)
                if attr_datatype == constants.attribute_types['QUANTITATIVE'] and len(
                        self.data_attribute_map[attr]['domain']) <= 12:
                    attr_datatype = constants.attribute_types['ORDINAL']
                    self.populate_dataset_meta_for_attr(attr, attr_datatype)

                # If an attribute has (almnost) no repeating value, then mark it as the label attribute.
                # eg. primary/unique key of the table? Car1 , Car2, Car3, ...
                # Almost == 90% heuristic-based
                if attr_datatype == constants.attribute_types['NOMINAL'] and len(self.data_attribute_map[attr]['domain']) > 0.9 * self.rows:
                    self.nl4dv_instance.label_attribute = attr
                    self.data_attribute_map[attr]['isLabelAttribute'] = True

                # Set the final data type
                self.data_attribute_map[attr]['dataType'] = attr_datatype

                # Presentation
                self.prepare_output(attr, attr_datatype)


            return True

        return False

    # Sets the Alias Map
    def set_alias_map(self, alias_map=None, alias_url=None):
        # type: (dict, str) -> bool
        """
        User can choose to manually initialize data

        """
        self.nl4dv_instance.alias_url= alias_url
        self.nl4dv_instance.alias_map = alias_map

        if self.nl4dv_instance.alias_url is not None and os.path.isfile(self.nl4dv_instance.alias_url):
            self.nl4dv_instance.alias_map = json.load(open(self.nl4dv_instance.alias_url, 'r', encoding='utf-8'))

        if self.nl4dv_instance.alias_map is not None:
            for attr in self.nl4dv_instance.alias_map:
                if attr in self.data_attribute_map:
                    self.data_attribute_map[attr]['aliases'].extend(self.nl4dv_instance.alias_map[attr])

        return True

    # Set Domain, Ranges for Attributes of different datatypes
    def populate_dataset_meta(self, attr, attr_val, attr_datatype):
        if attr_datatype == constants.attribute_types['QUANTITATIVE']:
            try:
                attr_val = float(attr_val)
            except Exception as e:
                attr_val = float('NaN')
            self.data_attribute_map[attr]['domain'].add(attr_val)

            # Compute Max and Min of the attribute values
            if 'min' not in self.data_attribute_map[attr]['summary']:
                self.data_attribute_map[attr]['summary']['min'] = float("inf")
            if 'max' not in self.data_attribute_map[attr]['summary']:
                self.data_attribute_map[attr]['summary']['max'] = float("-inf")

            if attr_val > self.data_attribute_map[attr]['summary']['max']:
                self.data_attribute_map[attr]['summary']['max'] = attr_val
            if attr_val < self.data_attribute_map[attr]['summary']['min']:
                self.data_attribute_map[attr]['summary']['min'] = attr_val

        elif attr_datatype == constants.attribute_types['TEMPORAL']:
            parsed_status, parsed_attr_val = helpers.isdate(attr_val)
            if parsed_status:
                self.data_attribute_map[attr]['domain'].add(parsed_attr_val)
            else:
                parsed_attr_val = float('NaN')

            # Compute Max and Min of the attribute datetime
            if 'start' not in self.data_attribute_map[attr]['summary']:
                self.data_attribute_map[attr]['summary']['start'] = parsed_attr_val

            if 'end' not in self.data_attribute_map[attr]['summary']:
                self.data_attribute_map[attr]['summary']['end'] = parsed_attr_val

            # print(parsed_status, attr_val, parsed_attr_val, self.data_attribute_map[attr]['summary']['end'])
            if parsed_attr_val > self.data_attribute_map[attr]['summary']['end']:
                self.data_attribute_map[attr]['summary']['end'] = parsed_attr_val

            if parsed_attr_val < self.data_attribute_map[attr]['summary']['start']:
                self.data_attribute_map[attr]['summary']['start'] = parsed_attr_val

        else:
            attr_val = str(attr_val)
            self.data_attribute_map[attr]['domain'].add(attr_val)
            # Compute # occurrences of attribute values
            if 'group_counts' not in self.data_attribute_map[attr]['summary']:
                self.data_attribute_map[attr]['summary']['group_counts'] = dict()
            if attr_val not in self.data_attribute_map[attr]['summary']['group_counts']:
                self.data_attribute_map[attr]['summary']['group_counts'][attr_val] = 0
            self.data_attribute_map[attr]['summary']['group_counts'][attr_val] += 1

    # Set Domain, Ranges for single attribute
    def populate_dataset_meta_for_attr(self, attr, attr_datatype):
        # Re-initialize the dataTypeList to re-set the domain based on the new Prototype
        self.data_attribute_map[attr]['dataTypeList'] = list()

        # For each value in the dataset, add to the attribute map (domain, range)
        self.data_attribute_map[attr]['domain'] = set()
        for datum in self.data:
            attr_val = datum[attr]
            self.populate_dataset_meta(attr, attr_val, attr_datatype)

        # Presentation
        self.prepare_output(attr, attr_datatype)

    def prepare_output(self, attr, attr_datatype):
        # Remove NANs which are supposedly NOT unique
        self.data_attribute_map[attr]['domain'] = set(filter(lambda x: x == x, self.data_attribute_map[attr]['domain']))

        # Convert the set into a sorted list
        try:
            # works for all numbers, all strings
            if attr_datatype in [constants.attribute_types['QUANTITATIVE'], constants.attribute_types['ORDINAL']]:
                self.data_attribute_map[attr]['domain'] = sorted([float(a) for a in self.data_attribute_map[attr]['domain']])
            else:
                self.data_attribute_map[attr]['domain'] = sorted([a for a in self.data_attribute_map[attr]['domain']])
        except Exception as e:
            # works for hybrid numbers + strings combinations
            self.data_attribute_map[attr]['domain'] = sorted([str(a) for a in self.data_attribute_map[attr]['domain']])

        # Delete the keys that are now redundant
        self.delete_unwanted_keys(attr, attr_datatype)

    # Generic method to delete keys based on datatype
    def delete_unwanted_keys(self, attr, attr_datatype):
        # Delete the list of datatypes, not needed anymore
        if 'dataTypeList' in self.data_attribute_map[attr]:
            del self.data_attribute_map[attr]['dataTypeList']

        if attr_datatype == constants.attribute_types['NOMINAL'] or attr_datatype == constants.attribute_types['ORDINAL']:
            self.del_temporal_keys(attr)
            self.del_quantitative_keys(attr)

        elif attr_datatype == constants.attribute_types['QUANTITATIVE']:
            self.del_temporal_keys(attr)
            self.del_nominal_keys(attr)

        elif attr_datatype == constants.attribute_types['TEMPORAL']:
            self.del_quantitative_keys(attr)
            self.del_nominal_keys(attr)

    # Delete Keys from attribute that is determined to be Temporal
    def del_temporal_keys(self, attr):
        if 'start' in self.data_attribute_map[attr]['summary']:
            del self.data_attribute_map[attr]['summary']['start']
        if 'end' in self.data_attribute_map[attr]['summary']:
            del self.data_attribute_map[attr]['summary']['end']

    # Delete Keys from attribute that is determined to be Quantitative
    def del_quantitative_keys(self, attr):
        # Keys from Quantitative
        if 'min' in self.data_attribute_map[attr]['summary']:
            del self.data_attribute_map[attr]['summary']['min']
        if 'max' in self.data_attribute_map[attr]['summary']:
            del self.data_attribute_map[attr]['summary']['max']

    # Delete Keys from attribute that is determined to be Nominal
    def del_nominal_keys(self, attr):
        # Keys from Nominal
        if 'group_counts' in self.data_attribute_map[attr]['summary']:
            del self.data_attribute_map[attr]['summary']['group_counts']
