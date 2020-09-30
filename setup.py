from setuptools import setup, find_packages

setup(
    name='nl4dv',
    version='0.1.0',
    author='Arpit Narechania',
    author_email='arpitnarechania@gatech.edu',
    packages=find_packages(),
    include_package_data=True,
    setup_requires=['pytest-runner'],
    test_requires=['pytest', 'pytest-cov'],
    scripts=[],
    url='https://github.com/nl4dv/nl4dv',
    license='LICENSE.txt',
    description='Natural Language Toolkit for Data Visualization',
    long_description=open('README.txt').read(),
    install_requires=[
        "dateparser>=0.7.6",
        "fuzzywuzzy==0.8.1",
        "nltk>=3.5",
        "pytest==3.10.1",
        "pytest-cov==2.6.0",
        "python-dateutil==2.6.1",
        "python-Levenshtein==0.12.0",
        "si-prefix==1.2.2",
        "spacy>=2.2",
        "vega==3.1",
    ]
)
