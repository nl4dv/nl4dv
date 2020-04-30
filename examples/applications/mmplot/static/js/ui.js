(function () {
    uiHandler = {};
    
    uiHandler.initPageDimensions = function(){
        $("#mainbody").height($(window).height()*.95);
        $("#mainbody").width($(window).width()*.98);
        
        $(".mainContainer").height($(window).height()*.95);
    };

    $("#datasetSelect").change(function () {
        let dataset = $(this).val();
        main.initializeNL4DV(dataset);
    });

    uiHandler.populateEncodingDropdowns = function(){
        $('#colorAttrPicker').empty();
        $('#sizeAttrPicker').empty();
        $('#xAxisPicker').empty();
        $('#yAxisPicker').empty();

        $("#colorAttrPicker").append($("<option></option>").val("").html(""));
        $("#sizeAttrPicker").append($("<option></option>").val("").html(""));

        for(let attr in globalConfig.metadataMap){
            if(attr!==globalConfig.labelAttr){
                $("#xAxisPicker").append($("<option></option>").val(attr).html(attr));
                $("#yAxisPicker").append($("<option></option>").val(attr).html(attr));
                $("#colorAttrPicker").append($("<option></option>").val(attr).html(attr));
                if(globalConfig.metadataMap[attr]['type']==="numeric"){
                    $("#sizeAttrPicker").append($("<option></option>").val(attr).html(attr));
                }
            }
        }
    };

    uiHandler.populateFilterContainer = function(){
        $("#filterContainer").html("");
        for(let attr in globalConfig.metadataMap){
            if(utils.isCategoricalAttr(attr) && attr!==globalConfig.labelAttr){
                let filterId = "filter_"+ attr.replace(/\s/g,'');
                let filterDropdownHTML = "<select multiple data-actions-box='true' id='"+filterId+"' class='selectpicker filterWidget filterDropdown' associatedAttr='"+attr+"'>";
                for(let val of globalConfig.metadataMap[attr]['values']){
                    filterDropdownHTML += "<option value='"+val+"'>"+val+"</option>"
                }
                filterDropdownHTML += "</select>";

                $("#filterContainer").append("<span class='filterHeader'>" + attr + "</span><br>"+filterDropdownHTML+"<br><hr>");
            }
        }
        $(".filterDropdown").selectpicker();
        categoricalFilterChangeHandler();

        for(let attr in globalConfig.metadataMap){
            if(utils.isNumericalAttr(attr)){
                let filterId = "filter_"+ attr.replace(/\s/g,'');
                $("#filterContainer").append("<span class='filterHeader'>" + attr + "</span><br><div id='"+filterId+"' class='filterWidget filterSlider' associatedAttr='"+attr+"'></div><br><hr>");

                let attrVals = d3.extent(globalConfig.metadataMap[attr]['values']);

                let slider = document.getElementById(filterId);
                noUiSlider.create(slider, {
                    start: [attrVals[0], attrVals[1]],
                    step: 1,
                    tooltips: true,
                    connect: true,
                    range: {
                        'min': attrVals[0],
                        'max': attrVals[1]
                    }
                    // ,
                    // format: {
                    //     to: function (value) {
                    //         return "" + d3.format('.3s')(value);
                    //     },
                    //     from: function (value) {
                    //         console.log(value, +value);
                    //         return +value;
                    //     }
                    // }
                });

                slider.noUiSlider.on('update', function (values) {
                    let filterAttr = $(slider).attr("associatedAttr"), filterVals = [parseFloat(values[0]),parseFloat(values[1])];
                    // console.log(filterAttr, filterVals);
                    globalConfig.activeFilterMap[filterAttr] = filterVals;
                    scatterplotRenderer.filterPoints();
                });
            }
        }
    };

    function categoricalFilterChangeHandler() {
        $(".filterDropdown").change(function (evt) {
            let filterAttr = $(this).attr("associatedAttr"), filterVals = $(this).val();
            if(filterAttr!=undefined){ // weird selectpicker thing that fires twice with second time being undefined
                if(filterVals===null){
                    filterVals = [];
                }
                globalConfig.activeFilterMap[filterAttr] = filterVals;
            }
            scatterplotRenderer.filterPoints();
        });
    }

    uiHandler.clearActiveVis = function(){
        d3.selectAll("#vis, #xAxisSvg, #yAxisSvg, #colorLegendSvg, #colorLegendAttr").html('');
    };

    $("#filterPanelShowButton").click(function(evt){
        globalConfig.filterPanelActive = true;
        document.getElementById("filterPanel").style.width = $("#mainbody").width()*.225+"px";
    });

    $("#filterPanelHideButton").click(function(evt){
        globalConfig.filterPanelActive = false;
        document.getElementById("filterPanel").style.width = "0";
    });

    $(".encodingPicker").change(function(evt){
        let xAttr = $("#xAxisPicker").val();
        let yAttr = $("#yAxisPicker").val();
        let colorAttr = $("#colorAttrPicker").val();
        let sizeAttr = $("#sizeAttrPicker").val();

        globalConfig.activeVisSpec.xAttr = xAttr;
        globalConfig.activeVisSpec.yAttr = yAttr;
        globalConfig.activeVisSpec.colorAttr = colorAttr;
        globalConfig.activeVisSpec.sizeAttr = sizeAttr;

        let chartData = scatterplotRenderer.getTransformedDataAndSpec(globalConfig.activeVisSpec);
        scatterplotRenderer.update(chartData, globalConfig.activeVisSpec);
    });

    uiHandler.record = function(options) {
        options = typeof options !== 'undefined' ? options : {};
        let final_transcript = '';
        $("#queryBox").val('');
        globalConfig.speechRecognizer.continuous = true;
        globalConfig.speechRecognizer.interimResults = true;
        globalConfig.speechRecognizer.onresult = function(event) {
            var interim_transcript = '';
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                interim_transcript += event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                    let query = final_transcript.toLowerCase();
                    utils.refineS2T(query);
                    $("#queryBox").val(final_transcript);
                    uiHandler.processSpeechQuery(final_transcript);
                }
            }
            if(interim_transcript!=''){
                $("#queryBox").val(interim_transcript);
            }
        };
        if(globalConfig.recognizingSpeech===false){
            if($("#queryBox").hasClass("blinkingBorder")){
            }else{
                try{
                    globalConfig.speechRecognizer.start();
                }catch (e) {
                    console.log("recognizer active");
                }
            }
        }
    };

    uiHandler.updateFilterWidgets = function(){
        for(let attr in globalConfig.activeFilterMap){
            let filterId = "filter_"+ attr.replace(/\s/g,'');
            let filterVals = globalConfig.activeFilterMap[attr];
            if(utils.isCategoricalAttr(attr)){
                if(filterVals.length>0){
                    $("#"+filterId).val(filterVals).trigger("change");
                }
            }else if(utils.isNumericalAttr(attr)){
                let slider = document.getElementById(filterId);
                slider.noUiSlider.set(filterVals);
            }
        }
    };

    $("#recordButton").click(function (evt) {
        uiHandler.record();
    });

    globalConfig.speechRecognizer.onstart = function () {
        globalConfig.recognizingSpeech = true;
        $("#recordButton").addClass("blinkingButton");
        $("#queryBox").addClass("blinkingBorder");
    };

    globalConfig.speechRecognizer.onend = function () {
        globalConfig.recognizingSpeech = false;
        $("#recordButton").removeClass("blinkingButton");
        $("#queryBox").removeClass("blinkingBorder");
    };

    globalConfig.speechRecognizer.onerror = function (event) {
        globalConfig.recognizingSpeech = false;
    };

    uiHandler.processSpeechQuery = function (query) {
        globalConfig.speechRecognizer.stop();
        main.analyzeQuery(query);
    };

})();