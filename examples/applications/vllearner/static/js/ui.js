var extractedAttributesDataTable = null;
var extractedTasksDataTable = null;
var myCodeMirror;
var conversation = [];
var selectedQueryID = 0;
var codeEditorType = "full";
var oldObj = null, newObj = null;

function emptyDatasetContainers(){
    $(globalConfig.extractedMetaDataContainer + " table tbody").empty();
}

function emptyConversationTable(){
    $(globalConfig.conversationContainer + " table tbody").empty();
}

function emptyQueryResponseContainers(){
    // Vega-Lite Code Panel
    $(globalConfig.inputContainer).empty();

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
    $.post("/init", {"dependency_parser": "spacy"})
        .done(function (response) {
            configureDatabase(dataset);
        });
}

function flushAllConversations(){
    $.post("/flushAllConversations", {})
    .done(function (response) {
        // Not sure what to do with it, yet.
        console.log(response);
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
                    "Year": "T",
                    "Rooms": "O"
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

function refreshApp(){
    conversation = [];
    initializeNL4DV();
    flushAllConversations();
    emptyConversationTable();
    emptyQueryResponseContainers();
}

$(globalConfig.datasetSelect).change(function() {
    refreshApp();
    emptyDatasetContainers();
    var dataset = $(this).val();
    configureDatabase(dataset);    
});

function updateCodeEditor(){
    // Main Viz
    newObj['width'] = globalConfig.vegaMainChartSize.width;
    newObj['height'] = globalConfig.vegaMainChartSize.height;
    vegaEmbed(document.getElementById("outputVisContainer"), newObj, vegaOptMode);

    // Code Editor
    $("#inputContainer").empty();
    if(codeEditorType != "diff"){
        myCodeMirror = CodeMirror(document.getElementById("inputContainer"), {
            value: JSON.stringify(newObj, null, 2),
            lineNumbers: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            mode: "application/ld+json",
            lineWrapping: true,
            readOnly: false
          });
    }else{
        // let diffObj = Diff.createTwoFilesPatch('old', 'new', JSON.stringify(oldObj, null, 2), JSON.stringify(newObj, null, 2), null, null, { context: 1 });

        // let diffObj = Diff.diffTrimmedLines(JSON.stringify(oldObj, null, 2), JSON.stringify(newObj, null, 2), { context: 1 });

        // let diffObj2 = Diff.structuredPatch('old', 'new', JSON.stringify(oldObj, null, 2), JSON.stringify(newObj, null, 2), null, null, { context: 1 });
        // console.log(diffObj2);

        let diffObj3 = Diff.diffJson(oldObj, newObj);    
        let displayStr = "";
        diffObj3.forEach(function(item){
            if(!("added" in item && "removed" in item)){
                displayStr += item["value"];
            }else if(item["added"]){
                displayStr += "+" + item["value"].replace(/\n/g,"\n+").slice(0, -1);
            }else if(item["removed"]){
                displayStr += "-" + item["value"].replace(/\n/g,"\n-").slice(0, -1);
            }
        });

        myCodeMirror = CodeMirror(document.getElementById("inputContainer"), {
            value: displayStr,
            lineNumbers: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            mode: "text/x-diff",
            lineWrapping: true,
            readOnly: true
        });
    }
}

function runNL4DV(query){

    let dialog = conversation.length == 0 ? false : true;
    let dialog_id = 0;
    let query_id = conversation.length == 0 ? 0 : conversation.length-1;
    $.post("/analyze_query", {"query": query, "dialog":dialog, "dialog_id": dialog_id, "query_id": query_id})
        .done(function (response_string) {

            var response = JSON.parse(response_string);
            emptyQueryResponseContainers();

            for(var i=0; i<response['visList'].length; i++){

                var obj = response['visList'][0];                
                if(JSON.stringify(obj['encoding']) != "{}"){

                    // ADD query to conversation
                    let queryObj = {};
                    queryObj['query'] = query;
                    queryObj['response'] = response;
                    addRowToConversation(queryObj);

                    // container for Vis
                    if(i == 0){
                        // container for Data
                        if(conversation.length > 1){
                            oldObj = conversation[conversation.length - 2]['response']["visList"][0]["vlSpec"];
                            newObj = obj["vlSpec"];
                            updateCodeEditor();
                        }else{
                            oldObj = null;
                            newObj = obj["vlSpec"];
                            updateCodeEditor();
                        }
                    }
                }
                // Just take the first, best visualization!
                break;
            }

    });
}

function addRowToConversation(queryObj){
    // Update variable
    conversation.push(queryObj);
    selectedQueryID = conversation.length - 1;

    // Append to UI
    $('input[name=selectQueryRadioGroup]').attr('checked',false);
    let tr = `<tr>
        <td style="width: 1px;"><input type="radio" name="selectQueryRadioGroup" checked="checked" value="${selectedQueryID}"/></td>
        <td style="width: 1px;">${selectedQueryID.toString()}</td>
        <td>${queryObj['query']}</td>
    </tr>`
    $(globalConfig.conversationContainer + " table tbody").append(tr);
}

$(globalConfig.vegaSpecBtn).on("click",function(evt){
    var spec = myCodeMirror.getValue();
    $("#outputVisContainer").empty();
    $(globalConfig.visThumbnailContainer).empty();
    spec['width'] = globalConfig.vegaMainChartSize.width;
    spec['height'] = globalConfig.vegaMainChartSize.height;
    vegaEmbed(document.getElementById("outputVisContainer"), JSON.parse(spec), vegaOptMode);
});

$(document).on('click', '[name="selectQueryRadioGroup"]', function () {
    selectedQueryID = parseInt($(this).val());
    if(selectedQueryID == 0){
        oldObj =  null;
        newObj = conversation[selectedQueryID]["response"]['visList'][0]["vlSpec"];
    }else{
        oldObj = conversation[selectedQueryID-1]["response"]['visList'][0]["vlSpec"];
        newObj = conversation[selectedQueryID]["response"]['visList'][0]["vlSpec"];
    }
    updateCodeEditor();
});

$(document).on('click', '[name="codeEditorType"]', function () {
    codeEditorType = $(this).val();
    if(codeEditorType == "diff"){
        $("#vegaSpecBtn").hide();
    }else{
        $("#vegaSpecBtn").show();
    }
    updateCodeEditor();
});

$(globalConfig.queryBtn).on("click",function(evt){
    var query = $(globalConfig.queryInput).val();
    runNL4DV(query);
});

$(globalConfig.restartConversationBtn).on("click",function(evt){
    refreshApp();
});

$(document).ready(function() {

    globalConfig.vegaMainChartSize.width = 300;
    globalConfig.vegaMainChartSize.height = 300;

    extractedAttributesDataTable = $(globalConfig.extractedAttributesContainer).DataTable(globalConfig.attributeDataTablesOptions);
    extractedTasksDataTable = $(globalConfig.extractedTasksContainer).DataTable(globalConfig.taskDataTablesOptions);
    refreshApp();
});
