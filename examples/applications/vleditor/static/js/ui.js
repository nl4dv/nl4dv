var extractedAttributesDataTable = null;
var extractedTasksDataTable = null;
var myCodeMirror;

function emptyDatasetContainers(){
    $(globalConfig.extractedMetaDataContainer + " table tbody").empty();
}

function emptyQueryResponseContainers(){
    // Output JSON
    $(globalConfig.jsonContainer).empty();

    // VIS
    $(globalConfig.visContainer).empty();

    // VIS Thumbnails
    $(globalConfig.visThumbnailContainer).empty();

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

        var cell_attribute_aliases = document.createElement('td');
        $(cell_attribute_aliases).text(response['summary'][attr]['aliases']);
        $(row).append(cell_attribute_aliases);

        var cell_unique_items_count = document.createElement('td');
        $(cell_unique_items_count).text(response['summary'][attr]['domain'].length);
        $(row).append(cell_unique_items_count);

        var cell_domain = document.createElement('td');
        $(cell_domain).addClass("text-no-wrap");
        $(cell_domain).text(response['summary'][attr]['domain']);
        $(row).append(cell_domain);

        $(globalConfig.extractedMetaDataContainer + " table tbody").append(row);
    });
}

// Dataset is optional here
function initializeNL4DV(){
    var dataset = $(globalConfig.datasetSelect).val();
    $.post("/init", {"dependency_parser": "corenlp"})
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
                $.post("/setAttributeDataType", {"attr_type_obj": JSON.stringify(attributeTypeChanges)})
                    .done(function (r2) {
                        processDataResponse(r2, dataset);
                    });
            }

            if(ignore_words.length > 0){
                $.post("/setIgnoreList", {"ignore_words": JSON.stringify(ignore_words)})
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

function runNL4DV(query){
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
                var type = attributeMap[attr]['metric'];
                var relevance = attributeMap[attr]['matchScore'];
                var meta = attributeMap[attr]['meta'];
                extractedAttributesDataTable.row.add([attr, word, type, relevance, JSON.stringify(meta)]).draw(false);
            });

            // container for Extracted Tasks
            var tasksObjectList = response['taskMap'];
            Object.keys(tasksObjectList).forEach(function(task){
                tasksObjectList[task].forEach(function(taskObj){

                    var operator = taskObj['operator'];
                    var values = taskObj['values'];
                    var attribute = taskObj['attributes'];
                    var queryPhrase = taskObj['queryPhrase'];
                    if(queryPhrase){
                        queryPhrase = queryPhrase.toString()
                    }
                    if(values){
                        values = values.toString()
                    }
                    extractedTasksDataTable.row.add([task, operator, values, attribute, queryPhrase, "1"]).draw(false);

                });
            });

            for(var i=0; i<response['visList'].length; i++){

                var obj = response['visList'][i];
                if(JSON.stringify(obj['encoding']) != "{}"){

                    // container for Vis
                    if(i == 0){
                        // Main Viz
                        obj["vlSpec"]['width'] = globalConfig.vegaMainChartSize.width;
                        obj["vlSpec"]['height'] = globalConfig.vegaMainChartSize.height;
                        vegaEmbed(document.getElementById("outputVisContainer"), obj["vlSpec"], vegaOptMode);

                        // container for Data
                        $("#inputContainer").empty();
                        myCodeMirror = CodeMirror(document.getElementById("inputContainer"), {
                          value: JSON.stringify(obj["vlSpec"], null, 2),
                          lineNumbers: true,
                          matchBrackets: true,
                          autoCloseBrackets: true,
                          mode: "application/ld+json",
                          lineWrapping: true
                        });
                    }

                    var objclone = JSON.parse(JSON.stringify(obj));

                    var thumbnail = document.createElement("div");
                    thumbnail.id = "visThumbnail-" + i.toString()
                    if(i != 0){
                        thumbnail.className = "thumbnail";
                    }else{
                        thumbnail.className = "thumbnail thumbnail-active";
                    }
                    thumbnail.addEventListener("click", function() {
                        $(this).parent().find(".thumbnail").removeClass("thumbnail-active");
                        $(this).addClass("thumbnail-active");
                        var index = parseInt(this.id.split("-")[1]);
                        var obj = response['visList'][index];

                        // Update main Vis
                        $("#outputVisContainer").empty();
                        obj["vlSpec"]['width'] = globalConfig.vegaMainChartSize.width;
                        obj["vlSpec"]['height'] = globalConfig.vegaMainChartSize.height;
                        vegaEmbed(document.getElementById("outputVisContainer"), obj["vlSpec"], vegaOptMode);

                        // Update CodeMirror
                        $("#inputContainer").empty();
                        myCodeMirror = CodeMirror(document.getElementById("inputContainer"), {
                          value: JSON.stringify(obj["vlSpec"], null, 2),
                          lineNumbers: true,
                          matchBrackets: true,
                          autoCloseBrackets: true,
                          mode: "application/ld+json",
                          lineWrapping: true
                        });
                    });

                    objclone["vlSpec"]['width'] = globalConfig.vegaThumbnailSize.width;
                    objclone["vlSpec"]['height'] = globalConfig.vegaThumbnailSize.height;
                    vegaEmbed(thumbnail, objclone["vlSpec"], vegaOptMode);

                    $(globalConfig.visThumbnailContainer).append(thumbnail);
                }

            }
    });
}

$(globalConfig.vegaSpecBtn).on("click",function(evt){
    var spec = myCodeMirror.getValue();
    $("#outputVisContainer").empty();
    $(globalConfig.visThumbnailContainer).empty();
    spec['width'] = globalConfig.vegaMainChartSize.width;
    spec['height'] = globalConfig.vegaMainChartSize.height;
    vegaEmbed(document.getElementById("outputVisContainer"), JSON.parse(spec), vegaOptMode);
});

$(globalConfig.queryBtn).on("click",function(evt){
    var query = $(globalConfig.queryInput).val();
    runNL4DV(query);
});

$(document).ready(function() {
    var parentWidth = $("#outputVisContainer").parent().width();
    var parentHeight = $("#outputVisContainer").parent().height();
//    globalConfig.vegaMainChartSize.width = parentWidth * 0.70;
//    globalConfig.vegaMainChartSize.height = parentHeight - 400;

    globalConfig.vegaMainChartSize.width = 400;
    globalConfig.vegaMainChartSize.height = 400;

    extractedAttributesDataTable = $(globalConfig.extractedAttributesContainer).DataTable(globalConfig.attributeDataTablesOptions);
    extractedTasksDataTable = $(globalConfig.extractedTasksContainer).DataTable(globalConfig.taskDataTablesOptions);
    initializeNL4DV();

    myCodeMirror = CodeMirror(document.getElementById("inputContainer"), {
      value: "",
      lineNumbers: true,
      matchBrackets: true,
      autoCloseBrackets: true,
      mode: "application/ld+json",
      lineWrapping: true
    });
});
