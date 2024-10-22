(function(){
    $body = $("body");
    $(document).on({
        ajaxStart: function() { $body.addClass("loading");},
        ajaxStop: function() { $body.removeClass("loading"); }
    });

    main = {};

    // Dataset is optional here
    main.initializeNL4DV= function(dataset){
        $.post("/init", {"dependency_parser": "spacy"})
            .done(function (response) {
                main.configureDatabase(dataset);
            });
    };

    main.configureDatabase = function(dataset){
        $.post("/setData", {"dataset": dataset})
            .done(function (r1) {
                var attributeTypeChanges = {};
                var ignore_words = [];
                if(dataset === "cars-w-year.csv"){
                    attributeTypeChanges = {
                        "Year": "T"
                    };
                    ignore_words = ['car'];
                }else if(dataset === "cars.csv"){
                    ignore_words = ['car'];
                }else if(dataset === "movies-w-year.csv"){
                    attributeTypeChanges = {
                        "Release Year": "T"
                    };
                    ignore_words = ['movie','movies'];
                }else if(dataset === "housing.csv"){
                    attributeTypeChanges = {
                        "Year": "T"
                    };
                    ignore_words = [];
                }else if(dataset === "olympic_medals.csv"){
                    attributeTypeChanges = {
                        "Gold Medal": 'Q',
                        "Silver Medal": 'Q',
                        "Bronze Medal": 'Q',
                        "Total Medal": 'Q',
                        "Year": "T"
                    };
                    ignore_words = [];
                }

                if(attributeTypeChanges !== {}){
                    $.post("/setAttributeDataType", {"attr_type_obj": JSON.stringify(attributeTypeChanges)})
                        .done(function (r2) {
                            processData(r1, dataset);
                        });
                }

                if(ignore_words.length > 0){
                    $.post("/setIgnoreList", {"ignore_words": JSON.stringify(ignore_words)})
                        .done(function (r3) {
                        });
                }

                if(attributeTypeChanges === {} && ignore_words.length === 0){
                    processData(r1, dataset);
                }

            });
    };

    function processData(nl4dvMetadataMap, dataset){
        // console.log(nl4dvMetadataMap);
        globalConfig.metadataMap = {};
        globalConfig.dataList = [];
        for(let attr in nl4dvMetadataMap['summary']){
            globalConfig.metadataMap[attr] = {
                "type" : ""
            };
            if(nl4dvMetadataMap['summary'][attr]['dataType']==="Q"){
                globalConfig.metadataMap[attr]['type'] = "numeric";
            }else { // for this example, all non-quantitative/numeric attributes are treated as categorical
                globalConfig.metadataMap[attr]['type'] = "categorical";
            }

            if(nl4dvMetadataMap['summary'][attr]['isLabelAttribute']){
                globalConfig.labelAttr = attr;
                globalConfig.metadataMap[attr]['isLabelAttr'] = true;
            }
        }

        d3.csv("assets/data/"+dataset)
            .then(function(dataList){
                let dataIdx = 0;
                for(let dataObj of dataList){
                    dataObj['idx'] = dataIdx;
                    globalConfig.dataMap[dataObj.idx] = dataObj;
                    dataIdx += 1;
                    for(let attr in dataObj){
                        if(attr==='idx'){
                            continue;
                        }
                        let attrVal = dataObj[attr];
                        if(utils.isNumericalAttr(attr)){
                            attrVal = +dataObj[attr];
                        }else if(utils.isCategoricalAttr(attr)){
                            attrVal = attrVal.replace(/[\(\).+?!//@'"&:]/g, '');
                            dataObj[attr] = attrVal;
                        }

                        if(!('values' in globalConfig.metadataMap[attr])){
                            globalConfig.metadataMap[attr]['values'] = [attrVal];
                        }else {
                            if(globalConfig.metadataMap[attr]['values'].indexOf(attrVal)===-1){
                                globalConfig.metadataMap[attr]['values'].push(attrVal);
                            }
                        }

                        globalConfig.activeFilterMap[attr] = [];
                    }
                    globalConfig.dataList.push(dataObj);
                }

                let startAttrs = [];
                for(let attr in globalConfig.metadataMap){
                    if(utils.isNumericalAttr(attr)){
                        if(startAttrs.length<2){
                            startAttrs.push(attr);
                        }else {
                            break;
                        }
                    }
                }
                globalConfig.activeVisSpec = {
                    "xAttr" : startAttrs[0],
                    "yAttr" : startAttrs[1]
                };

                // console.log(globalConfig.metadataMap);

                uiHandler.initPageDimensions();
                uiHandler.populateEncodingDropdowns();
                uiHandler.populateFilterContainer();

                $("#xAxisPicker").val(startAttrs[0]);
                $("#yAxisPicker").val(startAttrs[1]);

                let chartData = scatterplotRenderer.getTransformedDataAndSpec(globalConfig.activeVisSpec);
                scatterplotRenderer.init(chartData, globalConfig.activeVisSpec);
            });
    }

    main.analyzeQuery = function(query){
        $.post("/analyze_query", {"query": query})
            .done(function (response_string) {
                let nl4dvResponse = JSON.parse(response_string);
                console.log(nl4dvResponse);
                let taskMap = nl4dvResponse['taskMap'], visList = nl4dvResponse['visList'];
                if("filter" in taskMap){
                    for(let taskObj of taskMap['filter']){
                        let filterAttr = taskObj['attributes'][0];
                        if(utils.isNumericalAttr(filterAttr)){
                            if(taskObj['operator']==="LT"){
                                globalConfig.activeFilterMap[filterAttr][1] = taskObj['values'][0];
                            }else if(taskObj['operator']==="GT"){
                                globalConfig.activeFilterMap[filterAttr][0] = taskObj['values'][0];
                            }else if(taskObj['operator']==="RANGE"){
                                globalConfig.activeFilterMap[filterAttr] = taskObj['values'];
                            }
                        }else {
                            if(taskObj['operator']==="IN"){
                                globalConfig.activeFilterMap[filterAttr] = taskObj['values'];
                            }
                        }
                    }
                }
                if(visList.length>0){
                    let newVisSpec = visList[0]['vlSpec'];
                    let markType = newVisSpec.mark.type, xAttr = "", yAttr = "", colorAttr = "", sizeAttr = "";
                    if('x' in newVisSpec.encoding){
                        xAttr = newVisSpec.encoding.x.field;
                    }
                    if('y' in newVisSpec.encoding){
                        yAttr = newVisSpec.encoding.y.field;
                    }
                    if('size' in newVisSpec.encoding){
                        sizeAttr = newVisSpec.encoding.size.field;
                    }
                    if('color' in newVisSpec.encoding){
                        colorAttr = newVisSpec.encoding.color.field;
                    }
                    // console.log(xAttr, yAttr, sizeAttr, colorAttr);
                    if(markType==="point" && utils.isValidAttr(xAttr) && utils.isValidAttr(yAttr)){
                        globalConfig.activeVisSpec.xAttr = xAttr;
                        globalConfig.activeVisSpec.yAttr = yAttr;
                        globalConfig.activeVisSpec.colorAttr = colorAttr;
                        globalConfig.activeVisSpec.sizeAttr = sizeAttr;
                        $("#xAxisPicker").val(xAttr);
                        $("#yAxisPicker").val(yAttr);
                        $("#colorAttrPicker").val(colorAttr);
                        $("#sizeAttrPicker").val(sizeAttr);
                        let chartData = scatterplotRenderer.getTransformedDataAndSpec(globalConfig.activeVisSpec);
                        scatterplotRenderer.update(chartData, globalConfig.activeVisSpec);
                    }
                }

                uiHandler.updateFilterWidgets();
            });
    };

    $("#datasetSelect").val("euro.csv").trigger("change");
})();
