from collections import Counter
import json
import sys
from nl4dv.utils import constants, error_codes, helpers
import os
import pandas as pd
import requests

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

        # Other initializations
        self.data_attribute_map = dict()
        self.data = list()
        self.rows = 0

        # Set the Data if passed data_url or data_value is not None
        if self.nl4dv_instance.data_url is not None:
            self.set_data(data_url = self.nl4dv_instance.data_url)
        elif self.nl4dv_instance.data_value is not None:
            self.set_data(data_value = self.nl4dv_instance.data_value)

        # Set the Aliases if passed alias_url or alias_value is not None
        if self.nl4dv_instance.alias_url is not None:
            self.set_alias_map(alias_url = self.nl4dv_instance.alias_url)
        elif self.nl4dv_instance.alias_value is not None:
            self.set_alias_map(alias_value = self.nl4dv_instance.alias_value)

    # Update the attribute datatypes that were not correctly detected by NL4DV
    def set_attribute_datatype(self, attr_type_obj):
        # Set new datatype
        for attribute, data_type in attr_type_obj.items():
            if data_type in constants.attribute_types.values():
                self.data_attribute_map[attribute]['dataType'] = data_type
                self.populate_dataset_meta_for_attr(attribute, data_type)
            else:
                helpers.cond_print("Invalid Target DataType. Choose from " + str(constants.attribute_types.values()), debug=True)
                sys.exit(error_codes.BAD_INPUT_ATTRIBUTE_DATA_TYPE)

    # Set Label attribute for the dataset, i.e. one that defines what the dataset is about.
    # e.g. "Correlate horsepower and MPG for sports car models" should NOT apply an explicit attribute for models since there are two explicit attributes already present.
    def set_label_attribute(self, label_attribute):
        self.nl4dv_instance.label_attribute = label_attribute

    # WORDS that should be IGNORED in the query, i.e. NOT lead to the detection of attributes and tasks
    # `Movie` in movies dataset
    # `Car` in cars dataset
    def set_ignore_words(self, ignore_words):
        self.nl4dv_instance.ignore_words = ignore_words

    # Custom STOPWORDS that should NOT removed from the query, as they might be present in the domain.
    # e.g. `A` in grades dataset
    def set_reserve_words(self, reserve_words):
        self.nl4dv_instance.reserve_words = reserve_words

    # Sets the Dataset
    def set_data(self, data_url=None, data_value=None):
        # type: (str, int) -> None
        """
        User can choose to manually initialize data

        """
        self.nl4dv_instance.data_url = data_url if data_url is not None else self.nl4dv_instance.data_url
        self.nl4dv_instance.data_value = data_value if data_value is not None else self.nl4dv_instance.data_value
        self.nl4dv_instance.data_url_type = None

        # initialize values
        self.data_attribute_map = dict()
        self.data = list()
        self.rows = 0

        if self.nl4dv_instance.data_url is not None:
            # Possible Local FILE or HTTP URL
            if self.nl4dv_instance.data_url.lower().endswith('.csv'):
                self.nl4dv_instance.data_url_type = "csv"
                self.data = pd.read_csv(self.nl4dv_instance.data_url, sep=',').to_dict('records')
            elif self.nl4dv_instance.data_url.lower().endswith('.tsv'):
                self.nl4dv_instance.data_url_type = "tsv"
                self.data = pd.read_csv(self.nl4dv_instance.data_url, sep='\t').to_dict('records')
            elif self.nl4dv_instance.data_url.lower().endswith('.json'):
                self.nl4dv_instance.data_url_type = "json"
                self.data = pd.read_json(self.nl4dv_instance.data_url).to_dict('records')

        elif self.nl4dv_instance.data_value is not None:
            if isinstance(data_value, pd.DataFrame):
                self.data = data_value.to_dict('records')
            elif isinstance(data_value, list):
                self.data = data_value
            elif isinstance(data_value, dict):
                self.data = pd.DataFrame(data_value).to_dict('records')

        # Set number of rows in the dataset
        self.rows = len(self.data)

        # initialize properties in Attribute Map
        if len(self.data) > 0:
            for attr in self.data[0].keys():
                # Don't consider attribute names that are empty or just whitespaces
                if attr and attr.strip():
                    self.data_attribute_map[attr] = {
                        'domain': set(),
                        'domainMeta': dict(),
                        'isLabelAttribute': attr == self.nl4dv_instance.label_attribute,
                        'summary': dict(),
                        'dataTypeList': list(), # temporary to determine datatype
                        'dataType': '',
                        'dataTypeMeta': dict(),  # Used for for e.g., temporal attributes when they conform to a certain format
                        'aliases': list(),
                    }

        # infer attribute datatypes and compute summary (range, domain)
        for datum in self.data:
            for attr in self.data_attribute_map.keys():
                # Check for Datetime
                is_date, unformatted_date_obj = helpers.isdate(datum[attr])
                if is_date:
                    attr_datatype_for_majority = constants.attribute_types['TEMPORAL'] + "-" + str(unformatted_date_obj["regex_id"])
                # Check for Numeric (float, int)
                elif helpers.isfloat(datum[attr]) or helpers.isint(datum[attr]):
                    attr_datatype_for_majority = constants.attribute_types['QUANTITATIVE']
                # Otherwise set as Nominal
                else:
                    attr_datatype_for_majority = constants.attribute_types['NOMINAL']

                # Append the list of attribute types for each data row to take best decision on heterogeneous data with multiple datatypes
                self.data_attribute_map[attr]['dataTypeList'].append(attr_datatype_for_majority)

        # Determine the Datatype based on majority of values.
        # Also Override a few datatypes set above based on rules such as NOMINAL to ORDINAL if all values are unique such as Sr. 1, Sr. 2, ...
        for attr in self.data_attribute_map:
            # By default, set the attribute datatype to the most common attribute
            attr_datatype = Counter(self.data_attribute_map[attr]['dataTypeList']).most_common(1)[0][0]

            # If attr_datatype is Temporal (e.g., T-1, T-2, T-n where 'n' corresponds to the n'th index of the date_regex array.
            # Then: PROCESS this and eventually strip the '-n' from the datatype
            if not (attr_datatype in [constants.attribute_types['QUANTITATIVE'], constants.attribute_types['NOMINAL']]):

                # If there is at least one instance of 'T-2' (DD*MM*YY(YY)), in the `dataTypeList`, set the regex_id to this, even if 'T-1' is the majority.
                if 'T-2' in self.data_attribute_map[attr]['dataTypeList']:
                    attr_datatype = 'T-2'

                # Strip the '-n' from the datatype
                attr_datatype_split = attr_datatype.split("-")
                attr_datatype = attr_datatype_split[0]

                # Set the final data type
                self.data_attribute_map[attr]['dataTypeMeta'] = {
                    "regex_id": attr_datatype_split[1]
                }

                # Add raw data to the domain's metadata. Only for Temporal Attributes.
                if not 'raw' in self.data_attribute_map[attr]['domainMeta']:
                    self.data_attribute_map[attr]['domainMeta']['raw'] = set()

            # Set the final data type
            self.data_attribute_map[attr]['dataType'] = attr_datatype

            # Update the dataset metadata for each attribute
            self.populate_dataset_meta_for_attr(attr, attr_datatype)

    # Sets the Alias Map
    def set_alias_map(self, alias_value=None, alias_url=None):
        # type: (dict, str) -> None
        """
        User can choose to manually initialize aliases

        """
        self.nl4dv_instance.alias_url= alias_url
        self.nl4dv_instance.alias_value = alias_value

        if self.nl4dv_instance.alias_url is not None:
            if os.path.isfile(self.nl4dv_instance.alias_url):
                self.nl4dv_instance.alias_value = json.load(open(self.nl4dv_instance.alias_url, 'r', encoding='utf-8'))
            else:
                self.nl4dv_instance.alias_value = json.loads(requests.get(self.nl4dv_instance.alias_url).text)

        if self.nl4dv_instance.alias_value is not None:
            for attr in self.nl4dv_instance.alias_value.keys():
                if attr in self.data_attribute_map:
                    self.data_attribute_map[attr]['aliases'].extend(self.nl4dv_instance.alias_value[attr])

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
            is_date, unformatted_date_obj = helpers.isdate(attr_val)
            parsed_attr_val = None
            if is_date:
                for format in constants.date_regexes[unformatted_date_obj['regex_id']][0]:
                    parsed_attr_val = helpers.format_str_to_date("/".join(unformatted_date_obj["regex_matches"]), format)
                    if parsed_attr_val is not None:
                        self.data_attribute_map[attr]['domain'].add(parsed_attr_val)
                        self.data_attribute_map[attr]['domainMeta']['raw'].add(attr_val)
                        break

            if parsed_attr_val is not None:
                # Compute Max and Min of the attribute datetime
                if 'start' not in self.data_attribute_map[attr]['summary']:
                    self.data_attribute_map[attr]['summary']['start'] = parsed_attr_val

                if 'end' not in self.data_attribute_map[attr]['summary']:
                    self.data_attribute_map[attr]['summary']['end'] = parsed_attr_val

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
            self.populate_dataset_meta(attr, datum[attr], attr_datatype)

        # If an attribute has (almost) no repeating value, then mark it as the label attribute.
        # eg. primary/unique key of the table? Car1 , Car2, Car3, ...
        # Almost == 90% (heuristic-based)
        if attr_datatype == constants.attribute_types['NOMINAL'] and len(self.data_attribute_map[attr]['domain']) > 0.9 * self.rows:
            self.nl4dv_instance.label_attribute = attr
            self.data_attribute_map[attr]['isLabelAttribute'] = True

        # Sort domain values, remove unwanted keys, etc.
        self.format_data_attribute_map(attr, attr_datatype)

    def format_data_attribute_map(self, attr, attr_datatype):
        # Remove NANs which are supposedly NOT unique
        self.data_attribute_map[attr]['domain'] = set(filter(lambda x: x == x, self.data_attribute_map[attr]['domain']))

        # Set > Sorted List > Set
        try:
            if attr_datatype == constants.attribute_types['QUANTITATIVE']:
                self.data_attribute_map[attr]['domain'] = set(sorted([float(a) for a in self.data_attribute_map[attr]['domain']]))
            elif attr_datatype == constants.attribute_types['TEMPORAL']:
                self.data_attribute_map[attr]['domain'] = set(sorted(self.data_attribute_map[attr]['domain']))
                self.data_attribute_map[attr]['domainMeta']['raw'] = set(sorted(self.data_attribute_map[attr]['domainMeta']['raw']))
            else:
                self.data_attribute_map[attr]['domain'] = set(sorted(self.data_attribute_map[attr]['domain']))
        except Exception as e:
            # works for hybrid numbers + strings combinations
            self.data_attribute_map[attr]['domain'] = set(sorted([str(a) for a in self.data_attribute_map[attr]['domain']]))

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
