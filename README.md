# NL4DV

**NL4DV** stands for **N**atural **L**anguage toolkit **for** **D**ata **V**isualization. It takes a **natural language query** about a given **dataset** as input and outputs a **structured JSON object** containing:
* Data attributes, 
* Analytic tasks, and
* Visualizations (Vega-Lite specifications)

<p align="center">
    <img src="docs/teaser.png" alt="Overview of NL4DV" height="auto" width="100%"/>
</p>

## Table of Contents
* [Prerequisites](#prerequisites)
* [Quick Start](#quick-start)
* [Examples](#examples)
* [Test](#test)
* [Contribute](#contribute)
* [Contributors](#contributors)

## Prerequisites

* NL4DV is written in [Python 3](https://www.python.org/doc/versions/). Please ensure you have a Python 3 environment already installed.

* Install [nltk](https://www.nltk.org/) and the **popular** nltk artifacts. 
```sh
    pip install -U nltk
    python -m nltk.downloader popular
```

* NL4DV requires a Dependency Parser module to parse the query. You can choose to install one (or both) of:-

  * [Spacy](https://spacy.io/): install a sample **English model**.
  ```sh
      python -m spacy download en_core_web_sm
  ```

  * [Stanford CoreNLP](https://stanfordnlp.github.io/CoreNLP/):
    * [Download](https://nlp.stanford.edu/software/stanford-english-corenlp-2018-10-05-models.jar) the **English** model of Stanford CoreNLP version **3.9.2** and copy it to `examples/assets/jars/` or a known location

    * [Download](https://nlp.stanford.edu/software/stanford-parser-full-2018-10-17.zip) the Stanford Parser version **3.9.2** and after unzipping the folder, copy the `stanford-parser.jar` file to `examples/assets/jars/`  or a known location


## Quick Start

Install NL4DV from the pre-built distributable in the `dist` folder.

### Install

* Clone this repository (master branch) and enter (`cd`) into it.

```sh
pip install dist/nl4dv-0.0.9.tar.gz
```

### Run

```py
from nl4dv import NL4DV

# Initialize an instance of NL4DV
nl4dv_instance = NL4DV(data_url = "cars-w-year.csv")

# using Stanford Core NLP
# replace with appropriate paths
dependency_parser_config = {"name": "stanford", "model": "stanford-english-corenlp-2018-10-05-models.jar","parser": "stanford-parser.jar"}
  
# using Spacy
# replace with appropriate model
# dependency_parser_config = {"name": "spacy", "model": "en_core_web_sm", "parser": None}

# Set the Dependency Parser
nl4dv_instance.set_dependency_parser(config=dependency_parser_config)

# Define a query
query = "show me price of US cars with horsepower more than 200"

# Execute the query
output = nl4dv_instance.analyze_query(query)
```

### Output
```json
{
  "query": "show me price of US cars with horsepower more than 200",
  "dataset": "data/cars-w-year.csv",
  "visList": ["..."], // below
  "attributeMap": {"..."}, // below
  "taskMap": {"..."} // below
  "followUpQuery": false,
  "contextObj": null
}
```

<details><summary><b>attributeMap</b> (Attribute Map)</summary>

<br/>

```py
    print(response['attributeMap'])
```
```json
{
  "Horsepower": {
    "ambiguity": [],
    "isAmbiguous": false,
    "name": "Horsepower",
    "queryPhrase": [
      "horsepower"
    ],
    "inferenceType": "EXPLICIT"
  },
  "Origin": {
    "ambiguity": [],
    "isAmbiguous": false,
    "name": "Origin",
    "queryPhrase": [
      "us"
    ],
    "inferenceType": "IMPLICIT"
  }
}
```
</details>

<details><summary><b>taskMap</b> (Task Map)</summary>

<br/>

```py
    print(response['taskMap'])
```
```json
{
  "distribution": [
    {
      "attributes": [
        "Horsepower"
      ],
      "inferenceType": "IMPLICIT",
      "operator": null,
      "queryPhrase": [],
      "task": "distribution",
      "values": null
    }
  ],
  "filter": [
    {
      "attributes": [
        "Horsepower"
      ],
      "inferenceType": "EXPLICIT",
      "operator": "GT",
      "queryPhrase": "more",
      "task": "filter",
      "values": [
        200
      ]
    },
    {
      "attributes": [
        "Origin"
      ],
      "inferenceType": "EXPLICIT",
      "operator": "IN",
      "queryPhrase": [
        "us"
      ],
      "task": "filter",
      "values": [
        "US"
      ]
    }
  ]
}
```
</details>

<details><summary><b>visList</b> (Visualization Recommendations)</summary>

<br/>

```py
    print(response['visList'])
```
```json
[
  {
    "attributes": [
      "Horsepower"
    ],
    "queryPhrase": null,
    "tasks": [
      "filter",
      "distribution"
    ],
    "inferenceType": "IMPLICIT",
    "vlSpec": {
      "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
      "mark": {
        "tooltip": true,
        "type": "bar"
      },
      "encoding": {
        "x": {
          "field": "Horsepower",
          "type": "quantitative",
          "bin": true,
          "axis": {
            "format": "s"
          }
        },
        "y": {
          "field": "Horsepower",
          "type": "quantitative",
          "aggregate": "count",
          "axis": {
            "format": "s"
          }
        }
      },
      "transform": [
        {
          "filter": "lower(datum[\"Horsepower\"]) > 200.0"
        },
        {
          "filter": {
            "field": "Origin",
            "oneOf": [
              "US"
            ]
          }
        }
      ],
      "data": {
        "url": "./examples/assets/data/cars-w-year.csv",
        "format": {
          "type": "csv"
        }
      }
    }
  },
  {
    "attributes": [
      "Horsepower"
    ],
    "queryPhrase": null,
    "tasks": [
      "filter",
      "distribution"
    ],
    "inferenceType": "IMPLICIT",
    "vlSpec": {
      "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
      "mark": {
        "tooltip": true,
        "type": "tick"
      },
      "encoding": {
        "x": {
          "field": "Horsepower",
          "type": "quantitative",
          "axis": {
            "format": "s"
          }
        },
        "tooltip": {
          "field": "Model"
        }
      },
      "transform": [
        {
          "filter": "lower(datum[\"Horsepower\"]) > 200.0"
        },
        {
          "filter": {
            "field": "Origin",
            "oneOf": [
              "US"
            ]
          }
        }
      ],
      "data": {
        "url": "./examples/assets/data/cars-w-year.csv",
        "format": {
          "type": "csv"
        }
      }
    }
  }
]
```

</details>

## Examples
Please see [this page](/examples/) for details on how to run the example applications built using NL4DV.

## Documentation
NL4DV exposes a simple, intuitive API for developers to consume.

### class NL4DV.nl4dv
User facing class that takes in and processes user queries

### nl4dv.set_data():
Sets the dataset
* `args`: data_url(str) string path to location of data file
* `return`: `None`

### nl4dv.analyze_query():
Calls helper functions to analyze query
* `args`: query(str)
* `return`: `dict()` containing attributeMap, taskMap, and visList

### nl4dv.render_vis():
For the input query, returns a VegaLite() object of the best visualization.
* `args`: query(str) User query
* `return`: `VegaLite()`

## Configurations

### nl4dv.set_alias_map()
* `args`: query(str) User query
* `return`: `None`

### nl4dv.set_thresholds()
Sets the string matching, domain word limit, ... thresholds
* `args`: thresholds (dict)
* `return`: `None`

### nl4dv.set_importance_scores()
Sets the Scoring Weights for the way attributes / tasks and visualizations are detected.
* `args`: scores (dict)
* `return`: `None`

### nl4dv.set_attribute_datatype()
Update the attribute datatypes that were not correctly detected by NL4DV
* `args`: attr_type_obj (dict)
* `return`: `None`

### nl4dv.set_dependency_parser()
Create a dependency parser instance
e.g. {"name": "stanford", "model": "stanford-english-corenlp-2018-10-05-models.jar","parser": "stanford-parser.jar")}
* `args`: config (dict) 
* `return`: `None`

### nl4dv.set_reserve_words()
Custom STOPWORDS that should NOT removed from the query, as they might be present in the domain.
e.g. `A` in grades dataset
* `args`: reserve_words (list)
* `return`: `None`

### nl4dv.set_ignore_words()
Sets words that should be IGNORED in the query, i.e. NOT lead to the detection of attributes and tasks
E.g. `movie` in movies dataset
* `args`: ignore_words (list)
* `return`: `None`

### nl4dv.set_label_attribute()
Set Label attribute for the dataset, i.e. one that defines what the dataset is about.
e.g. "Correlate horsepower and MPG for sports car models" should NOT apply an explicit attribute for models since there are two explicit attributes already present.
* `args`: label_attribute (str)
* `return`: `None`

### nld4v.get_metadata()
* `args`: None
* `return`: `dict()` containing the attributes their domains and ranges

## Test

```sh
    pytest --cov=nl4dv nl4dv/tests
```

## Contribute
NL4DV can be installed as a Python package and imported in your own awesome applications!

* NL4DV is written in [Python 3](https://www.python.org/doc/versions/). Plea    se ensure you have a Python 3 environment already installed.
* Clone this repository (master branch) and enter (`cd`) into it.

* Install dependencies.
```
    python -m pip install -r requirements.txt
```

* Create a new [virtual environment](https://pypi.org/project/virtualenv/) in python3 and activate it.

```sh
    virtualenv --python=python3 venv
    source venv/bin/activate
```
- Create a python distributable: 
  ```py
  python setup.py sdist
  ```
- This will create **nl4dv-0.0.9.tar.gz** inside `dist/`.
- Install this .tar.gz in your Python environment: 
  ```py
  python -m pip install <PATH-TO-nl4dv-0.0.9.tar.gz>
  ```
- Verify by opening your Python console and importing it
  ```
  $python
  >>> import nl4dv from NL4DV
  ```
- Enjoy, NL4DV is now available as a Python package!

## Contributors
Anonymous

## License
MIT
