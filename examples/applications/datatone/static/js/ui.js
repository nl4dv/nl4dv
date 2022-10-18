// Stores list of visualization recommendations
var visList = [];

// oldNewAmbiguousAttribute
var oldNewAmbiguousAttribute = {};

// oldNewAmbiguousValues
var oldNewAmbiguousValues = {};

// Data to QueryPhrase Mapping
var dataQueryPhraseMapping = {};

// QueryPhrase to Attribute Mapping
var queryPhraseToAttrMapping = {};

// Attribute to Data Mapping
var attrToDataMapping = {};

// List of attribute ambiguities
var attributeAmbiguityList = [];

// List of value ambiguities
var valueAmbiguityList = [];

// The AttributeMap: Response from NL4DV
var attributeMap = {};

function emptyDatasetContainers(){
    $(globalConfig.extractedMetaDataContainer + " table tbody").empty();
}

function emptyQueryResponseContainers(){
    // Variables
    visList = [];
    oldNewAmbiguousValues = {};
    oldNewAmbiguousAttribute = {};
    attrToDataMapping = {};
    queryPhraseToAttrMapping = {};
    dataQueryPhraseMapping = {};
    attributeAmbiguityList = [];
    valueAmbiguityList = [];
    attributeMap = {};

    // Generated Ambiguity Dropdowns and the Formattted Query
    document.getElementById("inputQueryContainer").innerHTML = "No query executed!"

    // VIS
    $(globalConfig.visContainer).empty();
}

function processDataResponse(response, dataset){
    emptyDatasetContainers();

    // container for Extracted Meta  Data
    $("#datasetUrl").text(dataset);
    $("#columnCount").text(response['columnCount']);
    $("#rowCount").text(response['rowCount']);

    Object.keys(response['summary']).forEach(function(attr){
        var row = document.createElement('tr');

//        var cell_attribute = document.createElement('td');
//        $(cell_attribute).addClass("text-no-wrap");
//        $(cell_attribute).text(attr);
//        $(row).append(cell_attribute);
//
//        var cell_domain = document.createElement('td');
//        $(cell_domain).addClass("text-no-wrap");
//        $(cell_domain).text(JSON.stringify(response['summary'][attr]['summary']));
//        $(row).append(cell_domain);

        var cell_attribute = document.createElement('td');
        $(cell_attribute).addClass("text-no-wrap");
        $(cell_attribute).text(attr);
        $(row).append(cell_attribute);

        var domain = JSON.stringify(response['summary'][attr]['summary']);
        var dataType = response['summary'][attr]['dataType'];

        var cell_domain = document.createElement('td');
        $(cell_domain).addClass("text-no-wrap");
        if(dataType == "Q"){
            $(cell_domain).text(response['summary'][attr]['summary']["min"] + "-" + response['summary'][attr]['summary']["max"]);
        }else if(dataType == "T"){
            var start = (new Date(response['summary'][attr]['summary']["start"])).getFullYear();
            var end = (new Date(response['summary'][attr]['summary']["end"])).getFullYear();
            $(cell_domain).text(start + "-" + end);
        }else{
            $(cell_domain).text(Object.keys(response['summary'][attr]['summary']["group_counts"]).slice(1, 3) + " ...");
        }

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
                ignore_words = ['movie'];
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
            visList = response['visList'];

            // container for Input query
            attributeMap = response['attributeMap'];
            Object.keys(attributeMap).forEach(function(attr){
                // ToDo:- "correlate miles per gallon horsepower and price" results in horsepower getting detected BUT due to 'horsepwer price' n-gram which becomes the queryPhrase which messes up 'price' on its own
                // ToDo:- DataTone recreation will fail in such cases; need to modify nl4dv to maybe ensure no "words" belong to several "query_phrases" ?
                if (attributeAmbiguityList.indexOf(attributeMap[attr]['queryPhrase'][0]) === -1 && query.includes(attributeMap[attr]['queryPhrase'][0])){
                    attributeAmbiguityList.push(attributeMap[attr]['queryPhrase'][0]);
                }

                 Object.keys(attributeMap[attr]["meta"]["ambiguity"]).forEach(function(val){
                    valueAmbiguityList.push(val);
                    queryPhraseToAttrMapping[val] = attr;
                    attributeMap[attr]["meta"]["ambiguity"][val].forEach(function(j){
                        dataQueryPhraseMapping[j] = val;
                    })
                 });
            });

            // Modify the query into a HTML formatted string highlighting the words that have ambiguities from attributes
            attributeAmbiguityList.forEach(function (item) {
                attrList = [];
                Object.keys(attributeMap).forEach(function(attr) {

                    if ((attributeMap[attr]['queryPhrase'][0]).toString() == (item).toString()) {
                        attrList.push(attr);
                    }
                });
                if(attrList.length >= 2){
                    response['query'] = response['query'].replace(item, "<div class='ambiguity_query_phrase' id='" + 'queryPhrase-' + item  + "' ><strong>" + item + "</strong></div>");
                }
            });

            // Modify the query into a HTML formatted string highlighting the words that have ambiguities from data values
            valueAmbiguityList.forEach(function (item) {
                response['query'] = response['query'].replace(item, "<div class='ambiguity_query_phrase' id='" + 'queryPhrase-' + item  + "' ><strong>" + item + "</strong></div>");
            });

            // Renders the FORMATTED query highlighting the query keywords.
            document.getElementById("inputQueryContainer").innerHTML = response['query'];

            // Render Ambiguity Widgets for Attribute-Level Ambiguity Keywords
            attributeAmbiguityList.forEach(function (item) {
                attrList = [];
                Object.keys(attributeMap).forEach(function(attr) {
                    if ((attributeMap[attr]['queryPhrase'][0]).toString() == (item).toString()) {
                        attrList.push(attr);
                    }
                });
                if(attrList.length >= 2){
                    var ulbox = document.createElement('ul');
                    ulbox.id = item + "-ul";
                    ulbox.className = "ambiguity-ul";

                    for (i = 0; i < attrList.length; i++) {
                        var opt = attrList[i];
                        var li = document.createElement("li");
                        li.innerText = opt;
                        li.id = opt;
                        ulbox.append(li);

                        li.addEventListener("click", function() {
                            $(this).parent().find("li").removeClass("ambiguity-li-active");
                            $(this).addClass("ambiguity-li-active");
                            var _item = attributeMap[this.id]['queryPhrase'][0];
                            var _old = oldNewAmbiguousValues[_item]["new"];
                            var _new = this.id;
                            oldNewAmbiguousValues[_item] = {
                                "old": _old,
                                "new": _new
                            }
                            var spec = getVisSpec();
                            updateViz(spec);
                            updateJSONTree(spec);
                        });

                        // The 1st element will determine the current setting of this mapping
                        if(i==0){
                            oldNewAmbiguousValues[item] = {
                                "old": opt,
                                "new": opt
                            };
                            li.className = "ambiguity-li-active";
                        }
                        attrToDataMapping[opt] = item;
                    }

                    var spacing = document.createElement('div');
                    spacing.className = 'm-t-sm';
                    document.getElementById('queryPhrase-' + item).appendChild(spacing);
                    document.getElementById('queryPhrase-' + item).appendChild(ulbox);

                }else{
                    var opt = attrList[0];
                    oldNewAmbiguousValues[item] = {
                        "old": opt,
                        "new": opt
                    };
                }
            });

            // Render Ambiguity Widgets for Value-Level Ambiguity Keywords
            valueAmbiguityList.forEach(function (item) {
                valList = attributeMap[queryPhraseToAttrMapping[item]]["meta"]["ambiguity"][item];

                if(valList.length >= 2){
                    var ulbox = document.createElement('ul');
                    ulbox.id = item + "-ul";
                    ulbox.className = "ambiguity-ul";

                    for (i = 0; i < valList.length; i++) {
                        var opt = valList[i];
                        var li = document.createElement("li");
                        li.innerText = opt;
                        li.id = opt;
                        ulbox.append(li);

                        li.addEventListener("click", function() {
                            $(this).parent().find("li").removeClass("ambiguity-li-active");
                            $(this).addClass("ambiguity-li-active");

                            var clickedItem = this.id;
                            var value = dataQueryPhraseMapping[clickedItem];
                            var _item = queryPhraseToAttrMapping[value]; // attribute
                            var _old = JSON.parse(JSON.stringify(oldNewAmbiguousAttribute[_item]["new"])); // old value
                            var _new = []; // new value

                            attributeMap[_item]["meta"]["ambiguity"][dataQueryPhraseMapping[clickedItem]].forEach(function(to_remove){
                                var index = _old.indexOf(to_remove);
                                if (index !== -1) _old.splice(index, 1);
                            });
                            _new = _old.concat(clickedItem);

                            oldNewAmbiguousAttribute[_item] = {
                                "old": _old,
                                "new": _new
                            }
                            var spec = getVisSpec();
                            updateViz(spec);
                            updateJSONTree(spec);
                        });


                        // The 1st element will determine the current setting of this mapping
                        if(i==0){
                            if(queryPhraseToAttrMapping[item] in oldNewAmbiguousAttribute){
                                oldNewAmbiguousAttribute[queryPhraseToAttrMapping[item]]["old"].push(attributeMap[queryPhraseToAttrMapping[item]]["meta"]["ambiguity"][item][0]);
                                oldNewAmbiguousAttribute[queryPhraseToAttrMapping[item]]["new"].push(attributeMap[queryPhraseToAttrMapping[item]]["meta"]["ambiguity"][item][0]);
                            }else{
                                oldNewAmbiguousAttribute[queryPhraseToAttrMapping[item]] = {
                                    "old": [attributeMap[queryPhraseToAttrMapping[item]]["meta"]["ambiguity"][item][0]],
                                    "new": [attributeMap[queryPhraseToAttrMapping[item]]["meta"]["ambiguity"][item][0]]
                                };
                            }
                            li.className = "ambiguity-li-active";
                        }
                        // attrToDataMapping[opt] = item;
                    }

                    var spacing = document.createElement('div');
                    spacing.className = 'm-t-sm';
                    document.getElementById('queryPhrase-' + item).appendChild(spacing);
                    document.getElementById('queryPhrase-' + item).appendChild(ulbox);

                }else{
                    var opt = valList[0];
                    oldNewAmbiguousAttribute[item] = {
                        "old": opt,
                        "new": opt
                    };
                }
            });

            var spec = getVisSpec();

            // Inline Panel Container
            var panel_container = document.createElement('div');
            $(panel_container).addClass("w-700 valign-top m-sm display-inline-block");

            // container for Vis
            var div = document.createElement('div');
            div.id = 'datatone-viz';
            $(div).addClass("text-center overflow");
            $(panel_container).append(div);

            // container for Data
            var div = document.createElement('div');
            $(div).addClass("h-500 overflow-y-auto");
            div.id = 'datatone-spec';
            $(panel_container).append(div);

            // Append Panel container to main Vis container
            $(globalConfig.visContainer).append(panel_container);

            // Separator
            $(globalConfig.visContainer).append($("hr"));

            // Update VIS and JSONTREE
            updateViz(spec);
            updateJSONTree(spec);

    });
});

function getVisSpec(){
    var currSelections = [];
    Object.keys(oldNewAmbiguousValues).forEach(function(item){
       currSelections.push(oldNewAmbiguousValues[item]["new"]);
    });

    for(var i=0; i < visList.length; i++){

        // We just want BAR CHART to recreate DataTone
        if (visList[i]["vlSpec"]["mark"]["type"] != "bar"){
            continue
        }

        var is_x = "x" in visList[i]["vlSpec"]["encoding"];
        var is_y = "y" in visList[i]["vlSpec"]["encoding"];
        var is_c = "color" in visList[i]["vlSpec"]["encoding"];
        var is_s = "size" in visList[i]["vlSpec"]["encoding"];

        var x = null, y = null, c = null, s = null;

        if(is_x){
            x = visList[i]["vlSpec"]["encoding"]["x"]["field"];
            visList[i]["vlSpec"]["encoding"]["x"]["axis"] = {"labelFontSize": 14, "titleFontSize": 16, "titlePadding": 16}
        }
        if(is_y){
            y = visList[i]["vlSpec"]["encoding"]["y"]["field"];
            visList[i]["vlSpec"]["encoding"]["y"]["axis"] = {"labelFontSize": 14, "titleFontSize": 16, "titlePadding": 16}
        }
        if(is_c){
            c = visList[i]["vlSpec"]["encoding"]["color"]["field"];
        }
        if(is_s){
            s = visList[i]["vlSpec"]["encoding"]["size"]["field"];
        }

        if((x!= null && currSelections.indexOf(x) === -1) || (y!=null &&  currSelections.indexOf(y) === -1) || (c!=null && currSelections.indexOf(c) === -1) || (s!=null && currSelections.indexOf(s) === -1)){
            // console.log(x, y, c);
            continue;
        }
        if(is_x && x in attrToDataMapping){
            visList[i]["vlSpec"]["encoding"]["x"]["field"] = oldNewAmbiguousValues[attrToDataMapping[x]]["new"];
        }
        if(is_y && y in attrToDataMapping){
            visList[i]["vlSpec"]["encoding"]["y"]["field"] = oldNewAmbiguousValues[attrToDataMapping[y]]["new"];
        }
        if(is_c && c in attrToDataMapping){
            visList[i]["vlSpec"]["encoding"]["color"]["field"] = oldNewAmbiguousValues[attrToDataMapping[c]]["new"];
        }
        if(is_s && s in attrToDataMapping){
            visList[i]["vlSpec"]["encoding"]["size"]["field"] = oldNewAmbiguousValues[attrToDataMapping[s]]["new"];
        }

        var chartTitle = [];
        // MODIFY FILTER VALUE LEVEL AMBIGUITY
        visList[i]["vlSpec"]["transform"].forEach(function(transformObj){
            var _item = transformObj["filter"]["field"];
            var clickedItems = oldNewAmbiguousAttribute[_item]["new"];
            if("filter" in transformObj){
                if(transformObj["filter"]["field"] == _item){
                    clickedItems.forEach(function(clickedItem){
                        attributeMap[_item]["meta"]["ambiguity"][dataQueryPhraseMapping[clickedItem]].forEach(function(to_remove){
                            var index = transformObj["filter"]["oneOf"].indexOf(to_remove);
                            if (index !== -1) transformObj["filter"]["oneOf"].splice(index, 1);
                        });
                        transformObj["filter"]["oneOf"].push(clickedItem);
                    });
                    chartTitle.push(_item + " = " + transformObj["filter"]["oneOf"].toString());
                }
            }
        });

        // Add FILTERS in the chart title
        visList[i]["vlSpec"]["title"] = {
          "text": chartTitle.join(" | "),
          "align": "right",
          "orient": "top",
          "fontSize": 14,
          "color": "gray",
          "fontWeight": "light",
          "anchor": "end"
        }

        break
    }

    return visList[i];
}

function updateViz(spec){
    if(spec != null){
        if(JSON.stringify(spec["vlSpec"]['encoding']) != "{}"){
            var visDiv = document.getElementById('datatone-viz');
            spec["vlSpec"]["width"] = 500;
            spec["vlSpec"]["height"] = 300;
            vegaEmbed(visDiv, spec["vlSpec"], vegaOptMode);
        }
    }
}

function updateJSONTree(spec){
    if(spec != null){
        var divSpec = document.getElementById('datatone-spec');
        var tree = jsonTree.create(spec, divSpec);
        tree.expand();
    }
}

$(document).ready(function() {
    initializeNL4DV();
    $(globalConfig.queryInput).val("show me medals for hockey and skating by country")
});
