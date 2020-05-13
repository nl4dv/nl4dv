# The package name is same as module name so!
from nl4dv import NL4DV
import os
from pprint import pprint
import json

# -------------------- File INPUT ---------------------------
dependency_parser = "stanford" # stanford / spacy

# -------------------- File INPUT ---------------------------
# data_url = "olympic_medals.csv"
# alias_url = "olympic_medals.json"
# label_attribute = "Name"
# ignore_words = []
# data_url = "cars.csv"
# alias_url = "cars.json"
# label_attribute = "Name"
# ignore_words = ['car']
# data_url = "euro.csv"
# alias_url = "euro.json"
# label_attribute = "Name"
# ignore_words = []
# data_url = "cars-w-year.csv"
# alias_url = "cars-w-year.json"
# label_attribute = "Model"
# ignore_words = ['car']
data_url = "movies-w-year.csv"
alias_url = "movies-w-year.json"
label_attribute = "Title"
ignore_words = ['movie','movies']
# data_url = "colleges.csv"
# alias_url = "colleges.json"
# label_attribute = "Name"
# ignore_words = ['college', 'university', 'institute']
# data_url = "housing.csv"
# alias_url = "housing.json"
# label_attribute = None
# ignore_words = ['']

# Currently using the files relative to the current directory but prefer giving absolute path to the dataset.
data_url = os.path.join(".", "examples","assets","data",data_url)
alias_url = os.path.join(".", "examples","assets","aliases",alias_url)

print("\nData files: \n" + data_url + " (data), " + alias_url + " (alias)")

# -------------------- QUERY INPUT ---------------------------
# query = "compare cost and hp"
# query = "correlate rwd and awd"
# query = "show me players with more than 25 goals for spain"
# query = "players with highest salary for spain"
# query = "correlate goals and salary"
# query = "width len horsepower weight"
# query = "distribution of goals"
# query = "outlier in goals scored by players"
# query = 'correlate horsepower price'
# query = 'players with most goals for spain'
# query = 'show me expensive sports car with horsepower more than 200'
# query = 'show me operator by date'
# query = 'What model has the highest MPG?'
# query = "cylinders, year, horsepower, type"
# query = "origin acceleration"
# query = "genre evf feef title ffsd feff type"
# query = "highway miles per gallon"
# query = "show me medals for hockey and skating by country"
# query = 'show average gross for different genres'
# query = 'show rating for different genres'
# query = "average horsepower"
# query = "correlate acceleration and horsepower for mercedes cars"
# query = "show me movies with budget more than 50M"
# query = "show me a scatterplot of imdb content rating and budget"
# query = "how have comedy movies evolved over the years"
# query = "years"
# query = "show me mpg and horsepower for all cars"
# query = "Runtime of a movie with its box office gross."
# query = "Does having a RWD affect the AWD and number of cylinders in a car?"
# query = "what is the worth of sports cars"
# query = "players with highest salary for spain"
# query = "cars with more than 5 cylinders and horsepower more than 100"
# query = "visualize rating and budget"
# query = "Show average gross across genres for science fiction and fantasy movies"
# query = "Show average gross for comedy movies"
# query = "Create a histogram showing distribution of IMDB ratings"
# query = "correlate budget and rotten tomatoes rating"
# query = "how have comedy movies evolved over the years"
# query = "Total salary paid by each of the clubs"
# query = "Show a distribution of a movie's budget."
# query = "show me players with more than 25 goals for Germany"
# query = "show me cars with mpg more than 100"
# query = "show me cars with horsepower more than 100 and retail price less than 20k"
# query = "players with more than 5 goals and less than 15 goals and age greater than 30"
# query = "movie"
# query = "visualize sum of goals and salary"
# query = "visualize trend of release year"
# query = "players who have scored between 5 and 10 goals"
# query = "players who scored more than 25.5 goals"
# query = "players who scored 15 goals"
# query = "players who scored goals equalling 15"
# query = "players who scored goals equal to 15"
# query = "show me a piechart of average budget and type"  # WORKS
# query = "show me a piechart of median budget and type"  # WORKS
# query = "show me a piechart of total budget and type"  # WORKS
# query = "show me a piechart of type and average budget"  # ToDo: Doesn't work due to the dependency parser
# query = "correlate the runtime of a movie with its box office gross"
# query = "players who scored between 5 and 10 goals"
# query = "players who scored between 5 and 10 goals and age more than 25"
# query = "players with salaries between 5M and 10M and age between 24 and 30"
# query = "players under the age of 25"
# query = "players with salaries more than 10M"
# query = "relate goals and salary"
# query = "compare goals and salary"
# query = "find correlation between goals and salary"
# query = "which player has scored the highest goals for spain"
# query = "correlate rating and budget"
# query = "visualize budget and gross"
# query = "players who scored under 25.5 goals"
# query = "players who are under the age of 25"
# query = "visualize rating and budget"
# query = "show me mean goals scored by spain players"
# query = "gross budget"
# query = "scatterplot of budget"
# query = "price home type"
# query = "home type year"
# query = "correlate rating and budget"
# query = "price basement area lot area"
# query = "scatterplot of budget and rating"
# query = "movies with gross more than 10M"
# query = "movies with the highest budget"
# query = "average gross for comedy movies"
# query = "comedy movies"
# query = "bar chart of gross"
# query = "correlate budget and rating for different movie titles across genres"
# query = "correlation of budget and rating for different movie titles across genres"
# query = "runtime"
# query = "action and adventure"
# query = "imdb ratings"
# query = "show the relationship between budget and rating for Action and Adventure movies that grossed over 100M"
# query = "movies with gross more than 100M"
# query = "movies with gross over 100M"
# query = "movies that grossed over 100M"
# query = "movies with gross more than 100M and budget less than 50M"
# query = "movies that grossed over 100M and budget less than 50M and budget more than 25M"
# query = "movies that grossed under 100M"
# query = "movies that grossed under 100M"
# query = "Show a scatterplot of age and salary for players over the age of 30"
# query = "Show a scatterplot of age and salary excluding players over the age of 30"
# query = "Show a scatterplot of age and salary not over the age of 30 and salary not greater than 500000000"
# query = "Show a scatterplot of age and salary not over the age of 30"
# query = "Show a scatterplot of age and salary not over the age of 30 and salary not greater than 500000000"
# query = "Show a scatterplot of budget and gross with budget not between 25 and 30"
# query = "Show a scatterplot of budget and gross with budget between 50M and 100M for movies with gross more than 300M"
# query = "rating more than 5"
# query = "Show debt and earnings for different types of colleges"
# query = "movies with gross over 100M"
# query = "movies that grossed over 100M"
# query = "movies that grossed over 100M and less than 50M"
# query = "correlate budget rating gross"
# query = "relate budget, rating and gross"
# query = "find the relationship between budget and rating"
# query = "find the relationship between budget and rating for action and adventure movies"
# query = "correlate budget and rating"
# query = "find the relationship between budget rating and gross"
# query = "find the relationship between budget and gross for action and adventure movies"
# query = "distribution of budget"
# query = "highest grossing movie"
# query = "show average gross for different genres"
# query = "show me a piechart of type and average budget"
# query = "highest gross"
# query = "budget more than 50M"
# query = "gross more than 50M"
# query = "correlate budget and gross for fiction movies"
# query = "correlate budget and gross"
# query = "find the relationship between budget and gross for fiction movies"

# TODO query = correlate budget and gross for movies with rating more than 5
# TODO query = correlate budget and rating for movies with rating more than 5
# TODO query = budget and gross with rating more than 5 # NOTE: You should put CORRELATE
# TODO query = budget and gross for movie rating greater than 5
# TODO query = correlate budget and gross for movies with rating more than 5
# query = "find the relationship between budget and gross for fiction movies"
# query = "correlate budget and gross for movies with gross more than 200M" # ToDo: WRONG attribute gets TAGGED. If you make it budget more than 200M, same thing.
# query = "budget and gross with rating more than 5"
# query = "correlate budget and gross across genres for action movies"
# query = "budget and gross for movies with budget more than 100M"
# query = "distribution of budget and gross across genres"
# query = "distribution of year"
# query = "distribution of price hometype rooms"
# query = "rating more than 5"
# query = "hometype year distribution"
# query = "budget and gross for movie rating greater than 5"
# query = "mean of budget"
# query = "price hometype year distribution"
# query = "hometype heatingtype year distribution"
# query = "show me price of US cars with horsepower more than 200"

## PAPER QUERIES
query = "show the relationship between budget and rating for action and adventure movies that grossed over 100M"  # Figure 3
query = "show me medals for hockey and skating by country"  # Datatone
query = "visualize horsepower mpg and cylinders"  # Jupyter
query = "create a boxplot of acceleration"  # Jupyter
query = "show debt and earning for different types of colleges"  # Learn Vegalite
query = "Create a histogram showing distribution of IMDB ratings"  # Figure 1A
query = "Show average gross across genres for science fiction and fantasy movies" # Figure 1B
query = "Visualize rating and budget"  # Figure 1C
query = "Show a scatter-plot of age and salary for players under the age of 30"  # MMPLOT
## --------------

# query = "visualize imdb rating and gross"
query = "Show average gross across genres for science fiction and fantasy movies" # Figure 1B
query = "show me goals and salary"
query = "Home Type Heating Type Price as a distribution"
query = "gross and sum of budget"

print("\nQuery Input: \n" + query)

# For the below eg to work, you will have to install the `en_core_web_sm` model using `python3 -m spacy download en_core_web_sm` before running this script.
# If all goes well, the nl4dv instance should be available for use.
# Read about valid input parameters to spacy.load method at https://spacy.io/api/top-level

if dependency_parser == "spacy":
    dependency_parser_config = {'name': 'spacy','model': 'en_core_web_sm','parser': None}
elif dependency_parser == "stanford":
    dependency_parser_config = {'name': 'stanford','model': os.path.join("examples","assets","jars","stanford-english-corenlp-2018-10-05-models.jar"),'parser': os.path.join("examples","assets","jars","stanford-parser.jar")}
else:
    dependency_parser_config = {}

# Initialize NL4DV
nl4dv_instance = NL4DV(verbose=False)
nl4dv_instance.set_dependency_parser(config=dependency_parser_config)
nl4dv_instance.set_data(data_url=data_url)
nl4dv_instance.set_alias_map(alias_url=alias_url)
nl4dv_instance.set_label_attribute(label_attribute=label_attribute)
nl4dv_instance.set_ignore_words(ignore_words=ignore_words)
# nl4dv_instance.set_attribute_datatype({"Year": "T"})
# nl4dv_instance.set_attribute_datatype({"Year": "T", "Gold Medal": "Q", "Silver Medal": "Q", "Bronze Medal": "Q", "Total Medal": "Q"})

# WHAT HAPPENS IF WE CHANGE THE DEPENDENCY PARSER?
# dependency_parser_config = {'name': 'stanford','model': os.path.join("examples","assets","jars","stanford-english-corenlp-2018-10-05-models.jar"),'parser': os.path.join("examples","assets","jars","stanford-parser.jar")}
# nl4dv_instance = NL4DV(dependency_parser_config=dependency_parser_config, data_url=data_url, alias_url=alias_url)
# print(nl4dv_instance.data)
# print(nl4dv_instance.data_attribute_map)
# print(nl4dv_instance.alias_map)

# -------------------- QUERY RESPONSE ---------------------------
response = nl4dv_instance.analyze_query(query, debug=True)
# print("\nData Attribute Map:")
# print(nl4dv_instance.data_genie_instance.data_attribute_map)

# print("\nAttributes:")
# pprint(response['attributeMap'])
# print("-----------------------------------------")
#
# print("\nTasks:")
# pprint(response['taskMap'])
# print("-----------------------------------------")
#
# print("\nVisList:")
# print(response['visList'])
# print("-----------------------------------------")

# print("\nFull Output:")
# print(json.dumps(response))
# print("-----------------------------------------")
