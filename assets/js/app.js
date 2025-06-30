$(document).ready(function(){

    var activeSideNavPillId = "v-pills-fs-tab";

    queryOutputMap = {};
    for(let key in queryMap){
        if(key==="other-examples" || key==="conversational-examples" || key==="conversational-examples-gpt-outputs" || key==="other-examples-gpt-outputs"){
            for(let dataset in queryMap[key]){
                for(let queryObj of queryMap[key][dataset]){
                    queryOutputMap["queryId-"+queryObj.queryId] = queryObj.output;
                }
            }
        }else {
            for(let queryObj of queryMap[key]){
                queryOutputMap["queryId-"+queryObj.queryId] = queryObj.output;
            }
        }
    }
    console.log(queryOutputMap)

    $(".sideNavTab").click(function (evt) {
        let sideNavPillId = $(this).attr('id'), queryObjs, queryContainerId;
        if(activeSideNavPillId!==sideNavPillId){
            // to clear out unused content on page
            if(sideNavPillId==="v-pills-fs-tab"){
                populateQueryContainer(queryMap['fullyspecified-attributes-tasks-vis'], "queryContainer-fs");
            }else if(sideNavPillId==="v-pills-us-tab"){
                populateQueryContainer(queryMap['underspecified-attributes'], "queryContainer-us-attributes");
            }else if(sideNavPillId==="v-pills-otr-tab"){
                populateQueryContainer(queryMap['other-examples']['cars-w-year'], "queryContainer-otr-cars");
            }
            activeSideNavPillId = sideNavPillId;
        }
    });

    $(".usTab").click(function (evt) {
       let tabId =  $(this).attr('id'), queryType = tabId.split("tab-us-")[1];
       populateQueryContainer(queryMap['underspecified-'+queryType],"queryContainer-us-"+queryType);
    });

    $(".otrTab").click(function (evt) {
        let tabId =  $(this).attr('id'), dataset = tabId.split('tab-otr-')[1];
        //console.log(tabId);
        if (!tabId.includes("llm-outputs")) {
            populateQueryContainer(queryMap['other-examples'][dataset],"queryContainer-otr-"+dataset);
        } else {
            dataset = dataset.split("-gpt-outputs")[0];
            populateQueryContainer(queryMap['other-examples-gpt-outputs'][dataset],"queryContainer-otr-"+dataset+"-gpt-outputs");
        }
        
    });

    $(".ciTab").click(function (evt) {
        let tabId =  $(this).attr('id'), dataset = tabId.split('tab-ci-')[1];
        if (!tabId.includes("llm-outputs")) {
            populateQueryContainer(queryMap['conversational-examples'][dataset],"queryContainer-ci-"+dataset);
        } else {
            dataset = dataset.split("-gpt-outputs")[0];
            console.log(dataset);
            populateQueryContainer(queryMap['conversational-examples-gpt-outputs'][dataset],"queryContainer-ci-"+dataset+"-gpt-outputs");
        }
    });

    function populateQueryContainer(queryObjs, queryContainerId) {
        let queryRows = d3.select("#"+queryContainerId)
            .selectAll("div")
            .data(queryObjs)
            .enter()
            .append("div")
            .attr("id",function(d){
                console.log(d.queryId);
                return "queryId-"+d.queryId;
            });

        queryRows.append("div")
            .attr("class","queryAccordion")
            .html(function(d){
                return "<ul><li>"+d.query+"</li></ul>";
            });

        queryRows.append("div")
            .attr("class","queryPanel");

        bindEventsToQueryAccordions();
    }

    function bindEventsToQueryAccordions(){
        let acc = document.getElementsByClassName("queryAccordion");
        let i;

        for (i = 0; i < acc.length; i++) {
            acc[i].onclick = function() {
                this.classList.toggle("activeQuery");
                let panel = this.nextElementSibling;
                if (panel.style.maxHeight){
                    let queryId = $(this).parent().attr("id");
                    console.log(queryId);
                    d3.select("#" + queryId).select(".queryPanel").html("");
                    panel.style.border = "none";
                    panel.style.maxHeight = null;
                } else {
                    let queryId = $(this).parent().attr("id");
                    let visList = queryOutputMap[queryId]["visList"];
                    let htmlStr = "";
                    for(let chartIdx in visList){
                        let vlSpec = visList[chartIdx];
                        let chartId = queryId + "-" + "chart-" + chartIdx;
                        htmlStr += "<div id='"+chartId+"' class='visThumbnail'>test</div>"
                    }
                    d3.select("#" + queryId).select(".queryPanel").html(htmlStr);
                    for(let chartIdx in visList){
                        let vlSpec = visList[chartIdx]["vlSpec"];

                        let chartId = queryId + "-" + "chart-" + chartIdx;
                        vegaEmbed('#'+chartId, vlSpec);
                    }
                    panel.style.maxHeight = (panel.scrollHeight + 20) + "px";
                    panel.style.border = "1px solid lightgray";
                }
            }
        }
    }

    $(".expandAllQueriesBtn").click(function (evt) {
        const acc = $(this).parent().parent().find(".queryAccordion");
        console.log(acc);
        for (var i = 0; i < acc.length; i++) {
            if(acc[i].classList.contains("activeQuery")===false){
                $(acc[i]).trigger("click");
            }
        }
    });

    $(".collapseAllQueriesBtn").click(function (evt) {
        const acc = $(this).parent().parent().find(".queryAccordion");
        console.log(acc);
        for (var i = 0; i < acc.length; i++) {
            if(acc[i].classList.contains("activeQuery")===true){
                $(acc[i]).trigger("click");
            }
        }
    });

    populateQueryContainer(queryMap['fullyspecified-attributes-tasks-vis'], "queryContainer-fs");
    populateQueryContainer(queryMap['underspecified-attributes'], "queryContainer-us-attributes");
    populateQueryContainer(queryMap['other-examples']['cars-w-year'], "queryContainer-otr-cars-w-year");
    populateQueryContainer(queryMap['conversational-examples']['cars-w-year'], "queryContainer-ci-cars-w-year");
    populateQueryContainer(queryMap['underspecified-attributes-gpt-outputs'], "queryContainer-us-attributes-gpt-outputs")
    populateQueryContainer(queryMap['fullyspecified-attributes-tasks-vis-gpt-outputs'], "queryContainer-fs-gpt-outputs")
    populateQueryContainer(queryMap['other-examples-gpt-outputs']['cars-w-year'], "queryContainer-otr-cars-w-year-gpt-outputs");
    populateQueryContainer(queryMap['conversational-examples-gpt-outputs']['cars-w-year'], "queryContainer-ci-cars-w-year-gpt-outputs");

});
