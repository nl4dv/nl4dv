$(document).ready(function(){

    var activeSideNavPillId = "v-pills-fs-tab";

    queryOutputMap = {};
    for(let key in queryMap){
        if(key==="other-examples" || key==="conversational-examples"){
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
        populateQueryContainer(queryMap['other-examples'][dataset],"queryContainer-otr-"+dataset);
    });

    $(".ciTab").click(function (evt) {
        let tabId =  $(this).attr('id'), dataset = tabId.split('tab-ci-')[1];
        populateQueryContainer(queryMap['conversational-examples'][dataset],"queryContainer-ci-"+dataset);
    });

    function populateQueryContainer(queryObjs, queryContainerId) {
        let queryRows = d3.select("#"+queryContainerId)
            .selectAll("div")
            .data(queryObjs)
            .enter()
            .append("div")
            .attr("id",function(d){
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
});
