(function(){
    main = {};

    vegaOptMode = {
        "actions": false,
        "renderer": "svg",
        "hover": true,
        "tooltip": true
    };

    // Flush All Conversations
    main.flushAllConversations = function(){
        return $.post("/flushAllConversations", {})
            .done(function (response) {
                console.log(response);
            });
    };

    main.resetMindMapData = function(){
        globalConfig.data = {
            nodes: [{
                id: "ROOT",
                text: "Dataset",
                fx: window.innerWidth / 2,
                fy: (window.innerHeight - 250) / 2,
                vlSpec: null,
                dialog_id: 0,
                query_id: 0
            }],
            connections: []
        };
    };

    // Flush Specific Conversation
    main.flushConversation = function(dialog_id, query_id){
        $.post("/flushConversation", {query_id: query_id, dialog_id: dialog_id})
            .done(function (response) {
                console.log(response);
            });
    };

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
    }

    main.analyzeQuery = function(query){
        $.post("/analyze_query", {"query": query})
            .done(function (response_string) {
                let nl4dvResponse = JSON.parse(response_string);
                console.log(nl4dvResponse);
                let visList = nl4dvResponse['visList'];
                if(visList.length>0){
                    let newVisSpec = visList[0]['vlSpec'];
                }
            });
    };

    $("#datasetSelect").change(function () {
        let dataset = $(this).val();

        // Clear server-side dialogs first, then re-init on the new dataset and
        // rebuild a fresh mindmap (ROOT only) so prior queries do not linger.
        main.flushAllConversations().always(function () {
            main.resetMindMapData();
            main.initializeNL4DV(dataset);

            let data = JSON.parse(JSON.stringify(globalConfig.data));
            let mindmap = new MindMap("mindmap-svg", data);
            mindmap.renderMap();
        });
    });

    function init() {
        $("#datasetSelect").val("euro.csv").trigger("change");
    }
    init();

})();
