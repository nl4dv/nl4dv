from setuptools import setup, find_packages
from os import path

# read the contents of the README file
this_directory = path.abspath(path.dirname(__file__))
with open(path.join(this_directory, 'README.md'), encoding='utf-8') as f:
    long_description = f.read()

setup(
    name='nl4dv',
    version='4.1.0',
    author='Arpit Narechania',
    author_email='arpitnarechania@gmail.com',
    packages=find_packages(),
    include_package_data=True,
    setup_requires=['pytest-runner'],
    test_requires=['pytest', 'pytest-cov'],
    scripts=[],
    url='https://github.com/nl4dv/nl4dv',
    license='LICENSE',
    description='NL4DV is a Python toolkit that takes a natural language (NL) query about a given dataset as input and outputs a structured JSON object containing Data attributes, Analytic tasks, and Visualizations (Vega-Lite specifications).',
    long_description=long_description,
    long_description_content_type='text/markdown',
    install_requires=[
        "fuzzywuzzy~=0.8.1",
        "inflect~=5.5",
        "levenshtein~=0.27.1",
        "litellm~=1.71.1",
        "nltk~=3.5",
        "pandas~=2.2.3",
        "pytest~=3.10.1",
        "pytest-cov~=2.6.0",
        "si-prefix~=1.3.3",
        "spacy~=3.0",
        "vega~=4.1"
    ]
)