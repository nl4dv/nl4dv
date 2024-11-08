var myCodeMirror;

function emptyDatasetContainers() {
    $(globalConfig.extractedMetaDataContainer + " table tbody").empty();
}

function emptyQueryResponseContainers() {
    // VIS
    $(globalConfig.visContainer).empty();

    // JSON container
    $("#inputContainer").empty();
}

function processDataResponse(response, dataset) {
    emptyDatasetContainers();

    // container for Extracted Meta  Data
    $("#datasetUrl").text(dataset);
    $("#columnCount").text(response['columnCount']);
    $("#rowCount").text(response['rowCount']);

    Object.keys(response['summary']).forEach(function (attr) {
        var row = document.createElement('tr');

        var cell_attribute = document.createElement('td');
        $(cell_attribute).addClass("text-no-wrap");
        $(cell_attribute).text(attr);
        $(row).append(cell_attribute);

        var cell_attribute_type = document.createElement('td');
        $(cell_attribute_type).addClass("text-no-wrap");
        $(cell_attribute_type).text(response['summary'][attr]['dataType']);
        $(row).append(cell_attribute_type);

        var cell_unique_items_count = document.createElement('td');
        $(cell_unique_items_count).addClass("text-no-wrap");
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
function initializeNL4DV() {
    var openAIKey = document.getElementById("openAIKeyInput").value;
    $.post("/init", { "processing_mode": "gpt", "openAIKey": openAIKey, "dependency_parser": null })
        .done(function (response) {

            // Using the element IDs to remove 'disabled' attribute
            document.getElementById("datasetSelect").disabled = false;
            document.getElementById("reviewDatasetBtn").disabled = false;
            document.getElementById("queryInput").disabled = false;
            document.getElementById("queryBtn").disabled = false;

            var dataset = $(globalConfig.datasetSelect).val();
            configureDatabase(dataset);
        });
}

function configureDatabase(dataset) {
    $.post("/setData", { "dataset": dataset })
        .done(function (r1) {
            processDataResponse(r1, dataset);
        });
}
$(globalConfig.datasetSelect).change(function () {
    emptyQueryResponseContainers();
    emptyDatasetContainers();
    var dataset = $(this).val();
    configureDatabase(dataset);
});

$(globalConfig.queryBtn).on("click", function (evt) {
    var query = $(globalConfig.queryInput).val();
    $.post("/analyze_query", { "query": query })
        .done(function (response_string) {
            var response = JSON.parse(response_string);
            emptyQueryResponseContainers();

            // Render VIS
            if (response['visList'].length > 0) {

                // Render the Visualizations
                response['visList'].forEach((obj) => {
                    if (JSON.stringify(obj['encoding']) != "{}") {

                        // container for VIS
                        obj["vlSpec"]['width'] = "container";
                        obj["vlSpec"]['height'] = "container";
                        vegaEmbed(document.getElementById("outputVisContainer"), obj["vlSpec"], vegaOptMode);

                        // container for Data
                        $("#inputContainer").empty();
                        myCodeMirror = CodeMirror(document.getElementById("inputContainer"), {
                            value: JSON.stringify(obj, null, 2),
                            lineNumbers: true,
                            matchBrackets: true,
                            autoCloseBrackets: true,
                            mode: "application/ld+json",
                            lineWrapping: true
                        });
                    }
                });
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            // Handle error response, including 500 errors
            console.error("Error:", textStatus, errorThrown);
            alert("Some error occured. Check your Open AI key.");
        });
});

$(document).ready(function () {});
