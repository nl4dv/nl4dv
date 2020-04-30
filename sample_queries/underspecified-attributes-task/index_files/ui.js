function execute(){
    var table = document.getElementById('debugTable');
    initNL4DV("stanford");
    var data;
    var current_dataset = "";
	$.ajax({
	    type: "GET",
//	    url: "assets/1-fullyspecified-attributes-tasks-vis.txt?version="+Math.random(),
	    url: "assets/2-underspecified-attributes-tasks.txt?version="+Math.random(),
//	    url: "assets/3-underspecified-attributes-vis.txt?version="+Math.random(),
//	    url: "assets/4-underspecified-attributes.txt?version="+Math.random(),
//	    url: "assets/5-caveats.txt?version="+Math.random(),
	    dataType: "text",
	    success: function(data)
	    {
            var rows = data.split("\n");
            for (var i = 1; i < rows.length; i++) {

                var cells = rows[i].split("\t");

                if (cells.length > 1) { //Check to make sure row is not empty
                    var dataset = cells[0];
                    var alias = cells[1];
                    var query = cells[2];

                    // Set data ONLY if you detect a different dataset
                    if(current_dataset != dataset){
                        current_dataset = dataset;
                        configureDatabase(dataset); // Now synchronous
                    }

                    var attributeList = [];
                    var taskList = [];
                    var visObj;

                    var new_row = table.insertRow(-1);

//                    var cell = new_row.insertCell(-1);
//                    $(cell).append("<h1>" + cells[4] + "</h1"); //Attribute Combination section

                    cell = new_row.insertCell(-1);
//                    # 22px and 300
                    $(cell).append("<p style='padding:4px; font-size: 22px; font-weight:300'><i>" + query + "</i></p>"); //Attribute Combination section
//                    cell.innerHTML = query; //Query section

                    $.ajax("/analyze_query", {type: 'POST', data: {"query": query}, async:false})
                        .done(function (response_string) {
                            var response = JSON.parse(response_string);

                            // container for Extracted Attributes
                            var attributeMap = response['attributeMap'];
                            Object.keys(attributeMap).forEach(function(attr){
                                attributeList.push(attributeMap[attr]);
                            });

                            // container for Extracted Tasks
                            var tasksObjectList = response['taskMap'];
                            Object.keys(tasksObjectList).forEach(function(task){
                                tasksObjectList[task].forEach(function(taskObj){
                                    taskList.push(taskObj);
                                });
                            });

                            // Visualization
                            visObj = response['visList'];
                    });

                    var new_cell;
//                    // making table for attributes and the attribute names
//                    new_cell = new_row.insertCell(-1);
//                    var content = "<table class='table table-bordered table-sm'>"
//                    content += '<tr><th>Attributes</th></tr>';
//                    for(var t = 0; t < attributeList.length; t++){
//                        content += '<tr>' +
//                                        '<td>' + attributeList[t]['name'] + '</td>' +
//                                    '</tr>';
//                    }
//                    content += "</table>";
//                    $(new_cell).append(content);
//
//                    new_cell = new_row.insertCell(-1);
//                    //adding the task subtask attribute and value categories to the task table
//                    var content = "<table class='table table-bordered table-sm'>";
//                    content += '<tr><th>Task</th>';
//                    for (var t = 0; t < taskList.length; t++) {
//                        content += '<td>' + taskList[t]['task'] + '</td>'
//                        }
//                    content += '</tr>';
//                    content += '<tr><th>Operator</th>';
//                    for (var t = 0; t < taskList.length; t++) {
//                        content += '<td>' + (taskList[t]['operator'] === null ? '' : taskList[t]['operator']) + '</td>';
//                    }
//                    content += '</tr>';
//                    content += '<tr><th>Attribute</th>';
//                    for (var t = 0; t < taskList.length; t++) {
//                        content += '<td>' + taskList[t]['attributes'] + '</td>';
//                    }
//                    content += '</tr>';
//                    content += '<tr><th>Value</th>'
//                    for (var t = 0; t < taskList.length; t++) {
//                        content += '<td>' + (taskList[t]['values'] === null ? '' : taskList[t]['values']) + '</td>';
//                    }
//                    content += '</tr>';

//                    # -------
//                    content += '<tr><th>Is Ambiguous</th>'
//                    for (var t = 0; t < taskList.length; t++) {
//                        content += '<td>' + taskList[t]['isAttributeAmbiguous'] + '</td>';
//                    }
//                    content += '</tr>';
//                    content += '<tr><th>Interpretation</th>'
//                    for (var t = 0; t < taskList.length; t++) {
//                        content += '<td>' + taskList[t]['inferenceType'] + '</td>';
//                    }
//                    content += '</tr>';
//                    content += '<tr><th>Query Phrase</th>'
//                    for (var t = 0; t < taskList.length; t++) {
//                        content += '<td>' + taskList[t]['queryPhrase'] + '</td>';
//                    }
//                    content += '</tr>';
//                    # -------

//                    content += '</table>';
//                    $(new_cell).append(content);

                    var new_cell;
//                    // making table for Explicit Visualizations
//                    new_cell = new_row.insertCell(-1);
//                    var content = "<table class='table table-bordered table-sm'>"
//                    content += '<tr><th>VIS</th></tr>';
//                    content += '<tr>' +
//                                '<td>' + visObj[0]['visType'] + '</td>' +
//                            '</tr>';
//                    content += "</table>";
//                    $(new_cell).append(content);


                    // iterate and add all Vis to the Vis section
                    new_cell = new_row.insertCell(-1);
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


function initNL4DV(dependency_parser) {
    $.post("/init", {"dependency_parser": dependency_parser})
        .done(function (response) {
           // All OK
        });
}

function configureDatabase(dataset){
    $.ajax("/setData", {type: 'POST', data: {"dataset": dataset}, async:false})
        .done(function (response) {
                        var attributeTypeChanges = {};
            var ignore_words = [];
            if(dataset == "cars-w-year.csv"){
                attributeTypeChanges = {
                    "Year": "T"
                };
                ignore_words = ['car'];
            }else if(dataset == "cars.csv"){
                ignore_words = ['car'];
            }else if(dataset == "movies-w-year.csv"){
                attributeTypeChanges = {
                    "Release Year": "T"
                };
                ignore_words = ['movie','movies'];
            }else if(dataset == "housing.csv"){
                attributeTypeChanges = {
                    "Year": "T"
                }
                ignore_words = [];
            }else if(dataset == "olympic_medals.csv"){
                attributeTypeChanges = {
                    "Gold Medal": 'Q',
                    "Silver Medal": 'Q',
                    "Bronze Medal": 'Q',
                    "Total Medal": 'Q',
                    "Year": "T"
                }
                ignore_words = [];
            }

            if(attributeTypeChanges != {}){
                $.post("/setAttributeDataType", {"attr_type_obj": JSON.stringify(attributeTypeChanges), async:false})
                    .done(function (r2) {
                    });
            }

            if(ignore_words.length > 0){
                $.post("/setIgnoreList", {"ignore_words": JSON.stringify(ignore_words), async:false})
                    .done(function (r3) {
                    });
            }

        });
}

$(document).ready(function() {

});
