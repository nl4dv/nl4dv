function findMinMaxAvg(arr) {
    var min = arr[0]; // min
    var max = arr[0]; // max
    var sum = arr[0]; // sum

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            min = arr[i];
        }
        if (arr[i] > max) {
            max = arr[i];
        }
        sum = sum + arr[i];
    }
    return [min, max, sum / arr.length, arr.length]
}

function execute() {
    var query_sets = ["fullyspecified-attributes-tasks-vis", "underspecified-attributes-tasks", "underspecified-attributes-vis", "underspecified-attributes", "other-examples"]
    var executionTimes = [];
    for (var query_file_index = 0; query_file_index < query_sets.length; query_file_index++) {
        var url = "assets/queries/" + query_sets[query_file_index] + ".tsv?version=" + Math.random()
        var current_dataset = "";
        var table = document.getElementById(query_sets[query_file_index] + "-table");
        $.ajax({
            type: "GET",
            url: url,
            dataType: "text",
            async: false,
            success: function (data) {
                var rows = data.split("\n");
                for (var i = 1; i < rows.length; i++) {

                    var cells = rows[i].split("\t");

                    if (cells.length > 1) { //Check to make sure row is not empty
                        var dataset = cells[0];
                        var alias = cells[1];
                        var query = cells[2];

                        // Set data ONLY if you detect a different dataset
                        if (current_dataset != dataset) {
                            current_dataset = dataset;
                            configureDatabase(dataset); // Now synchronous
                        }

                        var attributeList = [];
                        var taskList = [];
                        var visObj;

                        var new_row = table.insertRow(-1);

                        cell = new_row.insertCell(-1);
                        $(cell).append("<p style='padding:4px; font-size: 22px; font-weight:300'><i>" + query + "</i></p>"); //Attribute Combination section

                        $.ajax("/analyze_query", {
                            type: 'POST',
                            data: {
                                "query": query
                            },
                            async: false,
                            error: function (response) {
                                console.log(response);
                            },
                            success: function (response_string) {
                                var response = JSON.parse(response_string);
                                executionTimes.push(response["debug"]["execution_durations"]["total"])

                                // container for Extracted Attributes
                                var attributeMap = response['attributeMap'];
                                Object.keys(attributeMap).forEach(function (attr) {
                                    attributeList.push(attributeMap[attr]);
                                });

                                // container for Extracted Tasks
                                var tasksObjectList = response['taskMap'];
                                Object.keys(tasksObjectList).forEach(function (task) {
                                    tasksObjectList[task].forEach(function (taskObj) {
                                        taskList.push(taskObj);
                                    });
                                });

                                // Visualization
                                visObj = response['visList'];
                            }
                        });

                        var new_cell = new_row.insertCell(-1);
                        var vizContainer = document.createElement('div');
                        $(vizContainer).addClass("parent");

                        for (var l = 0; l < visObj.length; l++) {
                            var div = document.createElement('div');
                            $(div).addClass("child");
                            vegaEmbed(div, visObj[l]['vlSpec'], vegaOptMode);
                            $(vizContainer).append(div);
                        }
                        new_cell.appendChild(vizContainer);

                    }
                }
            }
        });
    }

    console.log(findMinMaxAvg(executionTimes));
}


function initNL4DV(dependency_parser) {
    $.post("/init", {
            "dependency_parser": dependency_parser
        })
        .done(function (response) {
            // All OK
        });
}

function configureDatabase(dataset) {
    $.ajax("/setData", {
        type: 'POST',
        data: {
            "dataset": dataset
        },
        async: false,
        error: function (response) {
            console.log(response);
        },
        success: function (response) {
            var attributeTypeChanges = {};
            var ignore_words = [];
            if (dataset == "cars-w-year.csv") {
                attributeTypeChanges = {
                    "Year": "T"
                };
                ignore_words = ['car'];
            } else if (dataset == "cars.csv") {
                ignore_words = ['car'];
            } else if (dataset == "movies-w-year.csv") {
                attributeTypeChanges = {
                    "Release Year": "T"
                };
                ignore_words = ['movie', 'movies'];
            } else if (dataset == "housing.csv") {
                attributeTypeChanges = {
                    "Year": "T",
                    "Rooms": "O"
                }
                ignore_words = [];
            } else if (dataset == "olympic_medals.csv") {
                attributeTypeChanges = {
                    "Gold Medal": 'Q',
                    "Silver Medal": 'Q',
                    "Bronze Medal": 'Q',
                    "Total Medal": 'Q',
                    "Year": "T"
                }
                ignore_words = [];
            } else if (dataset == "superstore.csv") {
                attributeTypeChanges = {
                    "Order Date": 'T',
                    "Ship Date": 'T'
                }
                ignore_words = [];
            }

            if (attributeTypeChanges != {}) {
                $.post("/setAttributeDataType", {
                        "attr_type_obj": JSON.stringify(attributeTypeChanges),
                        async: false
                    })
                    .done(function (r2) {});
            }

            if (ignore_words.length > 0) {
                $.post("/setIgnoreList", {
                        "ignore_words": JSON.stringify(ignore_words),
                        async: false
                    })
                    .done(function (r3) {});
            }

        }

    });
}

$(document).ready(function () {
    initNL4DV("spacy");
});