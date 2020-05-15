var extractedAttributesDataTable = null;
var extractedTasksDataTable = null;

function emptyDatasetContainers(){
    $(globalConfig.extractedMetaDataContainer + " table tbody").empty();
}

function emptyQueryResponseContainers(){
    // Output JSON
    $(globalConfig.jsonContainer).empty();

    // VIS
    $(globalConfig.visContainer).empty();

    // Debug
    $(globalConfig.executionTimeViz).empty();

    // Tasks
    if(extractedTasksDataTable != null){
        extractedTasksDataTable.clear().draw(false);
    }

    // Attributes
    if(extractedAttributesDataTable != null){
        extractedAttributesDataTable.clear().draw(false);
    }

    // VIS
    if(extractedVisDataTable != null){
        extractedVisDataTable.clear().draw(false);
    }
}

function saveImportanceScores(){
    var payload = {
        'attribute_similarity_match': parseFloat($("#attribute_similarity_match").val()),
        'attribute_alias_similarity_match': parseFloat($("#attribute_alias_similarity_match").val()),
        'attribute_synonym_match': parseFloat($("#attribute_synonym_match").val()),
        'attribute_domain_value_match': parseFloat($("#attribute_domain_value_match").val()),
        'task_match': parseFloat($("#task_match").val()),
        'explicit_vis_match': parseFloat($("#explicit_vis_match").val()),
    }

    $.post("/setImportanceScores", {"importance_scores": JSON.stringify(payload)})
        .done(function (response) {
            // Done
            console.log(response);
    });
}

function saveThresholds(){
    var payload = {
        'word_similarity_score': parseFloat($("#word_similarity_score").val()),
        'string_similarity_score': parseFloat($("#string_similarity_score").val())
    }

    $.post("/setThresholds", {"thresholds": JSON.stringify(payload)})
        .done(function (response) {
            // Done
            console.log(response);
    });
}

function processDataResponse(response, dataset){
    emptyDatasetContainers();

    // container for Extracted Meta  Data
    $("#datasetUrl").text(dataset);
    $("#columnCount").text(response['columnCount']);
    $("#rowCount").text(response['rowCount']);

    Object.keys(response['summary']).forEach(function(attr){
        var row = document.createElement('tr');

        var cell_attribute = document.createElement('td');
        $(cell_attribute).text(attr);
        $(row).append(cell_attribute);

        var cell_attribute_type = document.createElement('td');
        $(cell_attribute_type).text(response['summary'][attr]['dataType']);
        $(row).append(cell_attribute_type);

        var cell_is_label_attribute = document.createElement('td');
        $(cell_is_label_attribute).text(response['summary'][attr]['isLabelAttribute']);
        $(row).append(cell_is_label_attribute);

        var cell_attribute_aliases = document.createElement('td');
        $(cell_attribute_aliases).text(response['summary'][attr]['aliases']);
        $(row).append(cell_attribute_aliases);

        var cell_unique_items_count = document.createElement('td');
        $(cell_unique_items_count).text(response['summary'][attr]['domain'].length);
        $(row).append(cell_unique_items_count);

        var cell_item_summary = document.createElement('td');
        $(cell_item_summary).addClass("text-no-wrap");
        $(cell_item_summary).text(JSON.stringify(response['summary'][attr]['summary'], 4));
        $(row).append(cell_item_summary);

        var cell_domain = document.createElement('td');
        $(cell_domain).addClass("text-no-wrap");
        $(cell_domain).text(response['summary'][attr]['domain']);
        $(row).append(cell_domain);

        $(globalConfig.extractedMetaDataContainer + " table tbody").append(row);
    });
}

// Dataset is optional here
function initializeNL4DV(){
    var dependency_parser = document.getElementById("dependency_parser_select").value;
    var dataset = $(globalConfig.datasetSelect).val();
    $.post("/init", {"dependency_parser": dependency_parser})
        .done(function (response) {
            configureDatabase(dataset);
        });
}

function configureDatabase(dataset){
    $.post("/setData", {"dataset": dataset})
        .done(function (r1) {
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
                        processDataResponse(r2, dataset);
                    });
            }

            if(ignore_words.length > 0){
                $.post("/setIgnoreList", {"ignore_words": JSON.stringify(ignore_words), async:false})
                    .done(function (r3) {
                    });
            }

            if(attributeTypeChanges == {} && ignore_words.length == 0){
                processDataResponse(r1, dataset);
            }

        });
}
$(globalConfig.datasetSelect).change(function() {
    emptyQueryResponseContainers();
    emptyDatasetContainers();
    var dataset = $(this).val();
    configureDatabase(dataset);
});

$(globalConfig.queryBtn).on("click",function(evt){
    var query = $(globalConfig.queryInput).val();
    $.post("/analyze_query", {"query": query})
        .done(function (response_string) {
            var response = JSON.parse(response_string);
            emptyQueryResponseContainers();

            // Output JSON
            var div = document.createElement('div');
            var tree = jsonTree.create(response, div);
            tree.expand(function(node) {
                return true;
            });
            $(globalConfig.jsonContainer).append(div);

            // container for Input query
            $(globalConfig.inputQueryContainer).text(response['query']);

            // container for Extracted Attributes
            var attributeMap = response['attributeMap'];
            Object.keys(attributeMap).forEach(function(attr){
                var word = attributeMap[attr]['queryPhrase']
                var metric = attributeMap[attr]['metric'];
                var isLabel = attributeMap[attr]['isLabel'];
                var encode = attributeMap[attr]['encode'];
                var isAmbiguous = attributeMap[attr]['isAmbiguous'];
                var ambiguity = attributeMap[attr]['ambiguity'];
                var inferenceType = attributeMap[attr]['inferenceType'];
//                var relevance = attributeMap[attr]['matchScore'];
                var meta = attributeMap[attr]['meta'];
                extractedAttributesDataTable.row.add([attr, word, isLabel, encode, isAmbiguous, ambiguity, inferenceType, metric, JSON.stringify(meta)]).draw(false);
            });

            // container for Extracted Tasks
            var tasksObjectList = response['taskMap'];
            Object.keys(tasksObjectList).forEach(function(task){
                tasksObjectList[task].forEach(function(taskObj){

                    var operator = taskObj['operator'];
                    var values = taskObj['values'];
                    var attribute = taskObj['attributes'];
                    var queryPhrase = taskObj['queryPhrase'];
                    var inferenceType = taskObj['inferenceType'];
                    var isAttrAmbiguous = taskObj['isAttrAmbiguous'];
                    var isValueAmbiguous = taskObj['isValueAmbiguous'];
                    var meta = taskObj['meta'];
//                    var matchScore = parseFloat(taskObj['matchScore']);
                    if(queryPhrase){
                        queryPhrase = queryPhrase.toString()
                    }
                    if(values){
                        values = values.toString()
                    }
                    extractedTasksDataTable.row.add([task, operator, values, attribute, queryPhrase, inferenceType, isAttrAmbiguous, isValueAmbiguous, JSON.stringify(meta)]).draw(false);

                });
            });

            // Render VIS
            if(response['visList'].length > 0){
                // Container for Extracted VIS
                var vis_type = response['visList'][0]['visType'];
                var vis_token = response['visList'][0]['queryPhrase'];
                extractedVisDataTable.row.add([vis_type, vis_token]).draw(false);

                // Render the Visualizations
                response['visList'].forEach((obj) => {
                    if(JSON.stringify(obj['encoding']) != "{}"){
                        // Inline Panel Container
                        var panel_container = document.createElement('div');
                        $(panel_container).addClass("w-500 valign-top m-sm display-inline-block");

                        // Panel
                        var panel = document.createElement('div');
                        $(panel).addClass("panel panel-default");
                        $(panel_container).append(panel);

                        // Panel Heading
                        var panel_title = document.createElement('div');
                        $(panel_title).addClass("badge badge-light pull-left b-r-none");
                        $(panel_title).text("Score: " + parseInt(obj["score"]*100)/100)
                        $(panel).append(panel_title);

                        // Panel Body
                        var panel_body = document.createElement('div');
                        $(panel_body).addClass("panel-body");
                        $(panel).append(document.createElement('br'));
                        $(panel).append(document.createElement('br'));
                        $(panel).append(panel_body);

                        // container for Vis
                        var div = document.createElement('div');
                        $(div).addClass("h-300 text-center overflow");
                        vegaEmbed(div, obj["vlSpec"], vegaOptMode);
                        $(panel_body).append(div);

                        // container for Data
                        var div = document.createElement('div');
                        $(div).addClass("h-350 overflow-y-auto");
                        var tree = jsonTree.create(obj, div);
                        tree.expand();
                        $(panel_body).append(div);

                        // Append Panel container to main Vis container
                        $(globalConfig.visContainer).append(panel_container);

                        // Separator
                        $(globalConfig.visContainer).append($("hr"));
                    }
                });
            }
    });
});

$(document).ready(function() {
    extractedAttributesDataTable = $(globalConfig.extractedAttributesContainer).DataTable(globalConfig.attributeDataTablesOptions);
    extractedTasksDataTable = $(globalConfig.extractedTasksContainer).DataTable(globalConfig.taskDataTablesOptions);
    extractedVisDataTable = $(globalConfig.extractedVisContainer).DataTable(globalConfig.visDataTableOptions)
    initializeNL4DV();
});
