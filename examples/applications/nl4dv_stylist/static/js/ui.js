var myCodeMirror;
var currentAnalyticSpec = null;
var designExampleCount = 0;
var maxDesignExamples = 5;

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

function findStyledSpec(response) {
    if (!response || typeof response !== "object") return null;
    if (response.vlSpec_design) return response.vlSpec_design;
    if (Array.isArray(response.visList)) {
        for (var i = 0; i < response.visList.length; i += 1) {
            if (response.visList[i] && response.visList[i].vlSpec_design) {
                return response.visList[i].vlSpec_design;
            }
        }
    }
    return null;
}

function selectedDatasetReference() {
    var dataset = $(globalConfig.datasetSelect).val();
    if (!dataset) return null;
    return {
        url: "assets/data/" + encodeURIComponent(dataset),
        format: { type: "csv" }
    };
}

function needsDatasetUrl(url) {
    return typeof url !== "string" ||
        !url.trim() ||
        url.toLowerCase().indexOf("add dataset url") !== -1;
}

function ensureDatasetUrl(spec) {
    var dataReference = selectedDatasetReference();
    if (!spec || typeof spec !== "object" || !dataReference) return;

    var currentUrl = spec.data && spec.data.url;
    if (needsDatasetUrl(currentUrl)) {
        spec.data = $.extend(true, {}, dataReference);
    }
}

function ensureResponseDataset(response) {
    var dataReference = selectedDatasetReference();
    if (!response || typeof response !== "object" || !dataReference) return;

    if (needsDatasetUrl(response.dataset)) {
        response.dataset = dataReference.url;
    }

    ensureDatasetUrl(response.vlSpec_design);
    if (Array.isArray(response.visList)) {
        response.visList.forEach(function (visualization) {
            if (!visualization || typeof visualization !== "object") return;
            ensureDatasetUrl(visualization.vlSpec);
            ensureDatasetUrl(visualization.vlSpec_design);
        });
    }
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
    ensureDatasetUrl(renderSpec);
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
        "#queryBtn",
        "#designInstructionInput",
        "#addDesignExampleBtn",
        "#applyDesignBtn"
    ].forEach(function (selector) {
        $(selector).prop("disabled", !enabled);
    });

    $(".design-example-file, .design-example-instruction, .remove-design-example")
        .prop("disabled", !enabled);
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

function addDesignExample() {
    if ($(".design-example").length >= maxDesignExamples) {
        alert("You can add up to " + maxDesignExamples + " example charts.");
        return;
    }
    designExampleCount += 1;
    var exampleId = designExampleCount;
    var row = $("<div>", { "class": "design-example", "data-example-id": exampleId });
    var preview = $("<div>", { "class": "design-example-preview" }).append(
        $("<span>", { "class": "text-muted", text: "No image selected" })
    );
    var fileInput = $("<input>", {
        "class": "form-control-file design-example-file",
        type: "file",
        accept: "image/png,image/jpeg,image/webp,image/gif"
    });
    var instruction = $("<textarea>", {
        "class": "form-control design-example-instruction",
        rows: 2,
        placeholder: "Example: Use this chart's colors and axis styling, but not its legend."
    });
    var removeButton = $("<button>", {
        "class": "btn btn-sm btn-outline-danger remove-design-example",
        type: "button",
        title: "Remove example chart",
        html: '<i class="fa fa-trash"></i>'
    });

    row.append(
        $("<div>", { "class": "design-example-number" }),
        preview,
        $("<div>", { "class": "design-example-fields" }).append(fileInput, instruction),
        removeButton
    );
    $("#designExamples").append(row);
    renumberDesignExamples();
}

function renumberDesignExamples() {
    $(".design-example").each(function (index) {
        $(this).find(".design-example-number").text("Example " + (index + 1));
    });
}

function readDesignImage(file) {
    return new Promise(function (resolve, reject) {
        if (!file) {
            reject(new Error("Select an image for every example chart."));
            return;
        }
        if (["image/png", "image/jpeg", "image/webp", "image/gif"].indexOf(file.type) === -1) {
            reject(new Error("Example charts must be PNG, JPEG, WebP, or GIF images."));
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            reject(new Error("Each example chart must be smaller than 5 MB."));
            return;
        }
        var reader = new FileReader();
        reader.onload = function () { resolve(reader.result); };
        reader.onerror = function () { reject(new Error("An example chart could not be read.")); };
        reader.readAsDataURL(file);
    });
}

function collectDesignConfig() {
    var config = [];
    var overallInstruction = $("#designInstructionInput").val().trim();
    if (overallInstruction) {
        config.push({ type: "text", text: "Overall styling instruction: " + overallInstruction });
    }

    var examplePromises = [];
    $(".design-example").each(function (index) {
        var row = $(this);
        var file = row.find(".design-example-file")[0].files[0];
        var instruction = row.find(".design-example-instruction").val().trim();
        examplePromises.push(readDesignImage(file).then(function (dataUrl) {
            return [
                { type: "image_url", image_url: { url: dataUrl } },
                {
                    type: "text",
                    text: "Instructions for example chart " + (index + 1) + ": " +
                        (instruction || "Use all visible design and layout aspects from this chart.")
                }
            ];
        }));
    });

    return Promise.all(examplePromises).then(function (examples) {
        examples.forEach(function (items) { config = config.concat(items); });
        if (!config.length) throw new Error("Add a styling instruction or an example chart before applying styles.");
        return config;
    });
}

function applyDesign() {
    if (!currentAnalyticSpec) {
        alert("Generate a visualization before applying styles.");
        return;
    }
    collectDesignConfig().then(function (designConfig) {
        return $.ajax({
            url: "/apply_design",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ analytic_spec: currentAnalyticSpec, design_config: designConfig })
        });
    }).then(function (response) {
        ensureResponseDataset(response);
        var styledSpec = findStyledSpec(response);
        if (!styledSpec) throw new Error("The model did not return a styled Vega-Lite specification.");
        renderVegaSpec("#outputVisContainer", styledSpec, "#originalEmptyState");
        showSpecification(response);
    }).catch(function (error) {
        console.error("Styling error:", error);
        var message = error.responseJSON && error.responseJSON.error ? error.responseJSON.error : error.message;
        alert(message || "The visualization could not be styled. Check the model and design instructions.");
    });
}

$(document).ready(function () {
    $("#llmProviderSelect").on("change", function () {
        var provider = $(this).val();
        $("#llmModelInput").val(defaultModels[provider] || "");
    });

    $("#llmApiKeyInput").on("input", function () {
        syncProviderFromKey(this.value);
    });

    $("#addDesignExampleBtn").on("click", addDesignExample);
    $("#applyDesignBtn").on("click", applyDesign);

    $("#designExamples").on("click", ".remove-design-example", function () {
        $(this).closest(".design-example").remove();
        renumberDesignExamples();
    });

    $("#designExamples").on("change", ".design-example-file", function () {
        var input = this;
        var preview = $(input).closest(".design-example").find(".design-example-preview");
        preview.empty();
        if (!input.files || !input.files[0]) {
            preview.append($("<span>", { "class": "text-muted", text: "No image selected" }));
            return;
        }
        var url = URL.createObjectURL(input.files[0]);
        var image = $("<img>", { alt: "Example chart preview", src: url });
        image.on("load", function () { URL.revokeObjectURL(url); });
        preview.append(image);
    });
});
