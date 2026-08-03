var myCodeMirror;
var currentAnalyticSpec = null;

function emptyDatasetContainers() {
    $(globalConfig.extractedMetaDataContainer + " table tbody").empty();
}

function emptyQueryResponseContainers() {
    // VIS
    $(globalConfig.visContainer).empty();

    // JSON container
    if (myCodeMirror) {
        myCodeMirror.setValue("");
    } else {
        $("#inputContainer").empty();
    }
}

function firstVisualization(response) {
    if (!response || !Array.isArray(response.visList) || !response.visList.length) return null;
    return response.visList.find(function (item) {
        return item && item.vlSpec && Object.keys(item.vlSpec).length;
    }) || null;
}

function ensureResponseDataset(response) {
    var dataset = $(globalConfig.datasetSelect).val();
    if (!response || !dataset) return;

    var dataUrl = "assets/data/" + encodeURIComponent(dataset);
    if (response.dataset !== dataUrl) {
        response.dataset = dataUrl;
    }

    var specs = [response.vlSpec_design];
    (response.visList || []).forEach(function (visualization) {
        if (!visualization) return;
        specs.push(visualization.vlSpec, visualization.vlSpec_design);
    });

    specs.forEach(function (spec) {
        if (!spec || (spec.data &&
            Object.prototype.hasOwnProperty.call(spec.data, "values"))) return;

        if (!spec.data || spec.data.url !== dataUrl) {
            spec.data = {
                url: dataUrl,
                format: { type: "csv" }
            };
        }
    });
}

function renderVegaSpec(containerId, spec, emptyStateSelector) {
    if (!spec) {
        $(emptyStateSelector).removeClass("d-none");
        $(containerId).empty();
        return;
    }
    $(emptyStateSelector).addClass("d-none");
    $(containerId).empty();
    var renderSpec = $.extend(true, {}, spec);
    renderSpec.width = "container";
    renderSpec.height = 360;
    vegaEmbed(document.querySelector(containerId), renderSpec, vegaOptMode).catch(function (error) {
        console.error("Vega-Lite rendering error:", error);
        $(emptyStateSelector).removeClass("d-none").text("The returned Vega-Lite specification could not be rendered.");
    });
}

function showSpecification(response) {
    var value = JSON.stringify(response, null, 2);
    if (myCodeMirror) {
        myCodeMirror.setValue(value);
        myCodeMirror.refresh();
        return;
    }
    myCodeMirror = CodeMirror(document.getElementById("inputContainer"), {
        value: value,
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        mode: "application/ld+json",
        lineWrapping: true,
        readOnly: true
    });
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

function setWorkflowEnabled(enabled) {
    [
        "#datasetSelect",
        "#reviewDatasetBtn",
        "#queryInput",
        "#queryBtn"
    ].forEach(function (selector) {
        $(selector).prop("disabled", !enabled);
    });
}

var defaultModels = {
    "openai": "gpt-4o-mini",
    "anthropic": "claude-sonnet-4-5",
    "gemini": "gemini/gemini-1.5-flash",
    "groq": "groq/llama-3.1-8b-instant",
    "openrouter": "openrouter/openai/gpt-4o-mini",
    "custom": ""
};

function detectProviderFromKey(apiKey) {
    var key = (apiKey || "").trim();
    if (key.indexOf("sk-or-") === 0) return { provider: "openrouter", model: defaultModels.openrouter };
    if (key.indexOf("sk-ant-") === 0) return { provider: "anthropic", model: defaultModels.anthropic };
    if (key.indexOf("gsk_") === 0) return { provider: "groq", model: defaultModels.groq };
    if (key.indexOf("sk-") === 0) return { provider: "openai", model: defaultModels.openai };
    return null;
}

function syncProviderFromKey(apiKey) {
    var detected = detectProviderFromKey(apiKey);
    if (!detected) return;

    var previousProvider = $("#llmProviderSelect").val();
    if (previousProvider === "custom") return;
    var currentModel = ($("#llmModelInput").val() || "").trim();
    var modelIsDefault = !currentModel || Object.keys(defaultModels).some(function (provider) {
        return defaultModels[provider] && currentModel === defaultModels[provider];
    });

    $("#llmProviderSelect").val(detected.provider);
    // Provider inference should fill an untouched default, not overwrite a model
    // the user entered explicitly. The server adds any required LiteLLM prefix.
    if (modelIsDefault) {
        $("#llmModelInput").val(detected.model);
    }
}

// Dataset is optional here
function initializeNL4DV() {
    setWorkflowEnabled(false);

    var apiKey = document.getElementById("llmApiKeyInput").value;
    syncProviderFromKey(apiKey);

    var provider = document.getElementById("llmProviderSelect").value;
    var model = document.getElementById("llmModelInput").value;
    var apiBase = document.getElementById("llmApiBaseInput").value;

    $.post("/init", {
        "processing_mode": "language-model",
        "provider": provider,
        "model": model,
        "api_key": apiKey,
        "api_base": apiBase,
        "dependency_parser": null
    })
        .done(function (response) {
            if (response.provider) {
                $("#llmProviderSelect").val(response.provider);
            }
            if (response.model) {
                $("#llmModelInput").val(response.model);
            }

            setWorkflowEnabled(true);

            var dataset = $(globalConfig.datasetSelect).val();
            configureDatabase(dataset);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.error("Error:", textStatus, errorThrown);
            var msg = (jqXHR.responseJSON && jqXHR.responseJSON.error) ||
                "Some error occurred. Check your LLM provider settings.";
            alert(msg);
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
    if (!query.trim()) {
        alert("Enter an analytical query before generating a visualization.");
        return;
    }
    $.post("/analyze_query", { "query": query })
        .done(function (response_string) {
            var response = typeof response_string === "string" ? JSON.parse(response_string) : response_string;
            ensureResponseDataset(response);
            emptyQueryResponseContainers();
            var visualization = firstVisualization(response);
            if (!visualization) {
                currentAnalyticSpec = null;
                alert("The model did not return a visualization specification.");
                return;
            }

            currentAnalyticSpec = response;
            renderVegaSpec("#outputVisContainer", visualization.vlSpec, "#originalEmptyState");
            showSpecification(response);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            // Handle error response, including 500 errors
            console.error("Error:", textStatus, errorThrown);
            alert("Some error occurred. Check your LLM provider settings.");
        });
});

$(document).ready(function () {
    $("#llmProviderSelect").on("change", function () {
        var provider = $(this).val();
        $("#llmModelInput").val(defaultModels[provider] || "");
    });

    $("#llmApiKeyInput").on("input", function () {
        syncProviderFromKey(this.value);
    });
});
