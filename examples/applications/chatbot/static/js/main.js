(function(){
    main = {};

    vegaOptMode = {
        "actions": false,
        "renderer": "svg",
        "hover": true,
        "tooltip": true
    };

    // Dataset is optional here
    main.initializeNL4DV= function(dataset){
        $.post("/init", {"dependency_parser": "spacy"})
            .done(function (response) {
                main.configureDatabase(dataset);
            });
    };

    // Flush All Conversations
    main.flushAllConversations = function(){
        $.post("/flushAllConversations", {})
            .done(function (response) {
                // Not sure what to do with it, yet.
                console.log(response);
            });
    };

    // Flush Specific Conversation
    main.flushConversation = function(dialog_id, query_id){
        $.post("/flushConversation", {query_id: query_id, dialog_id: dialog_id})
            .done(function (response) {
                // Not sure what to do with it, yet.
                console.log(response);
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
        globalConfig.metadataMap = {};
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
    }

    function getTotalUnresolvedAmbiguities(ambiguityObj){
        let counter = 0;
        Object.keys(ambiguityObj).forEach(function(ambiguityType){
            Object.keys(ambiguityObj[ambiguityType]).forEach(function(ambiguousKeyword){
                if(!ambiguityObj[ambiguityType][ambiguousKeyword]["selected"]){
                    if (ambiguityObj[ambiguityType][ambiguousKeyword]["selected"] !== "NL4DV_Resolved") {
                        globalConfig.resolved[ambiguousKeyword] = false;
                        counter++;
                    }
                }
            });
        });
        console.log(counter);
        return counter;
    }

    function getUnresolvedAmbiguities(ambiguityObj){
        let counter = 0;
        Object.keys(ambiguityObj).forEach(function(keyword){
            if(!globalConfig.resolved[keyword]){
                counter++;
            }
        });
        return counter;
    }

    function ambiguityControlCenter(){
        let attribute_ambiguities = globalConfig.nl4dvResponse["ambiguity"]["attribute"];
        console.log(attribute_ambiguities)
        let attribute_ambiguity_count = getUnresolvedAmbiguities(attribute_ambiguities);
        let value_ambiguities = globalConfig.nl4dvResponse["ambiguity"]["value"];
        console.log(value_ambiguities)
        let value_ambiguity_count = getUnresolvedAmbiguities(value_ambiguities);

        if(attribute_ambiguity_count > 0){ // Attribute Ambiguities
            resolveAttributeAmbiguities(attribute_ambiguities, attribute_ambiguity_count-1);
        }else if(value_ambiguity_count > 0){ // Value Ambiguities
            resolveValueAmbiguities(value_ambiguities, value_ambiguity_count-1);
        }else{
            setTimeout(function(){
                main.updateQuery(globalConfig.ambiguity_response);
            }, 1000);
        }
    }

    function resolveValueAmbiguities(value_ambiguities, keyword_index){
        let keywords = Object.keys(value_ambiguities);
        let keyword = keywords[keyword_index];
        globalConfig.botui.message.add({
            delay: 1000,
            type: 'html', // this is 'text' by default
            content: 'What did you mean by "<b>' + keyword + '</b>"?'
        }).then(function(){
            let actions = [];

            value_ambiguities[keyword]["options"].forEach(function(attr){
                actions.push({
                    text: attr, // Text to show in the button.
                    value: attr // Value to identify what was clicked.
                })
            });

            if(actions.length < 1){
                return globalConfig.botui.action.button({ // show 'button' action
                    action: actions
                });
            }else{
                return globalConfig.botui.action.select({
                    action: {
                        placeholder : "Choose one",
                        value: null, // Selected value or selected object. Example: {value: "TR", text : "Türkçe" }
                        searchselect : true, // Default: true, false for standard dropdown
                        label : 'text', // dropdown label variable
                        options : actions,
                        button: {
                            icon: 'check',
                            label: 'OK'
                        }
                        }
                    });
            }

        }).then(function (res) { // get the result
            globalConfig.ambiguity_response['value'][keyword] = res.value;
            globalConfig.resolved[keyword] = true;
            if(keyword_index != 0){
                resolveValueAmbiguities(value_ambiguities, keyword_index - 1);
            }else{
                ambiguityControlCenter();
            }
        });
    }

    function resolveAttributeAmbiguities(attribute_ambiguities, keyword_index){
        let keywords = Object.keys(attribute_ambiguities);
        let keyword = keywords[keyword_index];
        globalConfig.botui.message.add({
            delay: 1000,
            type: 'html', // this is 'text' by default
            content: 'What did you mean by "<b>' + keyword + '</b>"?'
        }).then(function(){
            let actions = [];

            attribute_ambiguities[keyword]["options"].forEach(function(attr){
                actions.push({
                    text: attr, // Text to show in the button.
                    value: attr // Value to identify what was clicked.
                })
            });

            if(actions.length < 1){
                return globalConfig.botui.action.button({ // show 'button' action
                    action: actions
                });
            }else{
                return globalConfig.botui.action.select({
                    action: {
                        placeholder : "Choose one",
                        value: null, // Selected value or selected object. Example: {value: "TR", text : "Türkçe" }
                        searchselect : true, // Default: true, false for standard dropdown
                        label : 'text', // dropdown label variable
                        options : actions,
                        button: {
                            icon: 'check',
                            label: 'OK'
                        }
                        }
                    });
            }

        }).then(function (res) { // get the result
            globalConfig.ambiguity_response['attribute'][keyword] = res.value;
            globalConfig.resolved[keyword] = true;
            if(keyword_index != 0){
                resolveAttributeAmbiguities(attribute_ambiguities, keyword_index - 1);
            }else{
                ambiguityControlCenter();
            }
        });
    }

    function processQueryResponse(nl4dvResponse){
        globalConfig.nl4dvResponse = nl4dvResponse;
        globalConfig.ambiguity_response = {
            dialog_id: globalConfig.nl4dvResponse["dialogId"].toString(),
            query_id: globalConfig.nl4dvResponse["queryId"].toString(),
            attribute: {},
            value: {}
        }

        let total_unresolved_ambiguities = getTotalUnresolvedAmbiguities(globalConfig.nl4dvResponse["ambiguity"]);
        console.log(globalConfig.nl4dvResponse["ambiguity"])
        if(total_unresolved_ambiguities == 0){
            createVIS();
        }else{
            ambiguityControlCenter();
        }
    }

    function createVIS(){
        globalConfig.conversation.push(JSON.parse(JSON.stringify(globalConfig.nl4dvResponse['visList'])));
        let convID = globalConfig.conversation.length.toString();
        let visList = globalConfig.nl4dvResponse['visList'];
        if(visList.length>0){
            let newVisSpec = visList[0]['vlSpec'];
            newVisSpec["title"] = {"text": globalConfig.nl4dvResponse["query_raw"], "fontSize": 16, "subtitlePadding": 8};
            const elementRef = $(".botui-message").last();
            elementRef.append(`
                <div style="clear:both;">
                    <div style="width: 500px; overflow: auto;">
                        <div id='visDiv-${convID}'}></div>
                    </div>
                    <hr>
                </div>`
            );
            vegaEmbed(document.getElementById('visDiv-' + convID), newVisSpec, vegaOptMode);
            initConversation();
        }
    }



    main.updateQuery = function(queryObject){

        $.ajax({
            url: "/update_query",
            type: "POST",
            data: JSON.stringify(queryObject),
            contentType:"application/json; charset=utf-8",
            dataType: "json",
            success: function(response){
                processQueryResponse(response);
            }
          });
    }

    main.analyzeQuery = function(query){
        // let dialog = globalConfig.conversation.length == 0 ? false : true;
        // let dialog_id = 0;
        // let query_id = globalConfig.conversation.length == 0 ? 0 : globalConfig.conversation.length-1;
        // $.post("/analyze_query", {"query": query, "dialog":dialog, "dialog_id": dialog_id.toString(), "query_id": query_id.toString()})
        $.post("/analyze_query", {"query": query, "dialog": "auto"})
            .done(function (response_string) {
                processQueryResponse(JSON.parse(response_string));
            });
    };

    $("#datasetSelect").change(function () {
        let dataset = $(this).val();
        main.initializeNL4DV(dataset);
        main.flushAllConversations();

        if(globalConfig.botui != null){
            globalConfig.botui.message.removeAll();
        }
        initConversation();
    });

    function initConversation(){
        globalConfig.botui.message.add({ // show a message
            delay: 1000,
            type: 'text',
            content: 'What do you want to know?'
        }).then(function () { // wait till its shown
            return globalConfig.botui.action.text({ // show 'text' action
                action: {
                    placeholder: 'Enter Query'
                }
            });
        }).then(function (res) { // get the result
            let nlQuery = res.value;
            main.analyzeQuery(nlQuery);
        });
    }

    function init() {
        globalConfig.botui = new BotUI('my-botui-app');
        $("#datasetSelect").val("olympic_medals.csv").trigger("change");
    }
    init();

})();
