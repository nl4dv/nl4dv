(function () {

    scatterplotRenderer = {};

    let svg, margin, width, height, xAxis, yAxis, xScale, yScale, xAxisLabel, yAxisLabel, zoom, pointsLayer, points, timer, zoomG, zoomRect, colorScale, sizeScale;
    let defaultRadius = 10, colorLegendRectWidth = 20, colorLegendRectHeight = 20, axisValueForRuler;
    let lastTransform = d3.zoomIdentity;
    let lassoStartPoint, lassoEndPoint, lassoPoints, visBgDragPoints = [];
    let colorLegendSvg = d3.select("#colorLegendSvg");
    let sizeLegendSvg = d3.select("#sizeLegendSvg");
    let detailsDisplayTimer, detailsStartPoint, detailtsRequested;
    let eraseStrokePoints = [];
    let panPointThresholdToClearDetails = 50, lassoRenderThreshold = 15;
    let erasedLegendItems = [], transitionDuration;

    scatterplotRenderer.init = function(data, visSpec){
        uiHandler.clearActiveVis();
        globalConfig.activeVisType = "SCATTER";
        width = $("#vis").width();
        height = $("#vis").height();

        margin = {top: 20, right: 20, bottom: 40, left: 40},
            width = width - margin.left - margin.right,
            height = height - margin.top - margin.bottom;

        svg = d3.select("#vis").attr("viewBox", [0, margin.top, width+margin.left+margin.right, height+margin.top]);
        svg.style("background-color","white");

        // Pan and zoom
        zoom = d3.zoom()
            .scaleExtent([.5, 4])
            .extent([[0, 0], [width, height]])
            .on("zoom", zoomed);

        // create a clipping region
        svg.append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        svg.call(zoom);

        zoomG = svg.append("g")
            .attr("id","zoomLayer");
        // .call(zoom);

        svg.on("dblclick.zoom", null);

        zoomRect = zoomG.append("rect")
            .attr("id","zoomRect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .on("click",function () {
                scatterplotRenderer.clearDefaultDetails();
            });

        pointsLayer = zoomG.append("g")
            .attr("class","pointsLayer")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")")
            .attr("clip-path", "url(#clip)");

        svg = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        xAxis = svg.append("g")
            .attr("id","xAxisG")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + height + ")")
            .attr("clip-path", "url(#clip)");

        yAxis = svg.append("g")
            .attr("id","yAxisG")
            .attr("class", "y axis");

        xAxis.append("rect")
            .attr("id","xAxisSelectionArea")
            .attr("class","axisSelectionArea")
            .attr("width",width)
            .attr("height",margin.bottom)
            .attr("x",0)
            .attr("y",0);

        yAxis.append("rect")
            .attr("id","yAxisSelectionArea")
            .attr("class","axisSelectionArea")
            .attr("width",margin.left)
            .attr("height",height)
            .attr("x",0-margin.left)
            .attr("y",0);

        xAxisLabel = d3.select("#xAxisSvg")
            .append("text")
            .attr("id","xAxisLabel")
            .attr("transform",function () {
                return "translate("+$("#xAxisSvg").width()/2+","+$("#xAxisSvg").height()/2+")";
            })
            .style("text-anchor", "middle")
            .text(function () {
                return visSpec.xLabel;
            });

        yAxisLabel = d3.select("#yAxisSvg")
            .append("text")
            .attr("id","yAxisLabel")
            .attr("transform",function () {
                return "translate("+$("#yAxisSvg").width()/2+","+$("#yAxisSvg").height()/2+")rotate(-90)";
            })
            .style("text-anchor", "middle")
            .text(function () {
                return visSpec.yLabel;
            });

        globalConfig.activeVisSpec = visSpec;
        scatterplotRenderer.update(data, visSpec);
    };

    scatterplotRenderer.update = function(data, visSpec, options){

        visSpec = typeof visSpec !== 'undefined' ? visSpec : globalConfig.activeVisSpec;
        options = typeof options !== 'undefined' ? options : {};
        globalConfig.activeVisType = "SCATTER";
        visSpec.visType = "SCATTER";
        visSpec.data = data;
        globalConfig.activeVisSpec = visSpec;
        // console.log(data);
        $("#testVisTypeChanger").val("SCATTER");
        $("#testVisTypeChanger option").prop('disabled', false);
        globalConfig.numericValueFormatStr = "";

        let activeColorCategories = [];

        if(utils.isNumericalAttr(visSpec.xAttr)){//globalConfig.metadataMap[visSpec.xAttr]['type']=='numeric'){
            xScale = d3.scaleLinear()
                .range([0, width])
                .nice();
            // xScale.domain([0, d3.max(data, function(d){return d['xVal'];})]);
            xScale.domain(d3.extent(data, function(d){
                if(d['xVal']>1000){
                    globalConfig.numericValueFormatStr = ".3s";
                }
                return d['xVal'];
            }));
            let extentDiff = xScale.domain()[1]-xScale.domain()[0], domainBuffer = extentDiff*0.025;
            xScale.domain([xScale.domain()[0]-domainBuffer, xScale.domain()[1]+domainBuffer]);
        }else {
            zoom.scaleExtent([1, 4]);
            xScale = d3.scaleBand()
                .padding([.05])
                .rangeRound([0,width]);

            xScale.domain(data.map(function(d) { return d['xVal']; }));
        }

        if(utils.isNumericalAttr(visSpec.yAttr)){//globalConfig.metadataMap[visSpec.yAttr]['type']=='numeric'){
            yScale = d3.scaleLinear()
                .range([height, 0])
                .nice();
            // yScale.domain([0, d3.max(data, function(d){return d['yVal'];})]);
            yScale.domain(d3.extent(data, function(d){
                if(d['yVal']>1000){
                    globalConfig.numericValueFormatStr = ".3s";
                }
                return d['yVal'];
            }));
            let extentDiff = yScale.domain()[1]-yScale.domain()[0], domainBuffer = extentDiff*0.025;
            yScale.domain([yScale.domain()[0]-domainBuffer, yScale.domain()[1]+domainBuffer]);
        }else {
            zoom.scaleExtent([1, 4]);
            yScale = d3.scaleBand()
                .padding([.05])
                .rangeRound([height,0]);

            yScale.domain(data.map(function(d) { return d['yVal']; }));
        }

        if(utils.isCategoricalAttr(visSpec.colorAttr) && options.updateColors!==false){
            // colorScale = d3.scaleOrdinal(d3.schemeCategory10);
            colorScale = d3.scaleOrdinal().domain(globalConfig.metadataMap[visSpec.colorAttr]['values'].sort()).range(globalConfig.colorPalette);
        }else if(utils.isNumericalAttr(visSpec.colorAttr)){
            // colorScale = d3.scaleOrdinal().domain(globalConfig.metadataMap[visSpec.colorAttr]['values'].sort()).range(globalConfig.colorPalette);
            colorScale = d3.scaleSequential(d3.interpolateBlues)
                .domain(d3.extent(globalConfig.metadataMap[visSpec.colorAttr]['values']));
        }

        if(utils.isNumericalAttr(visSpec.sizeAttr)){
            sizeScale = d3.scaleLinear().range([5,15]).domain(d3.extent(globalConfig.metadataMap[visSpec.sizeAttr]['values']));
        }

        points = pointsLayer.selectAll(".pointG")
            .data(data,function (d) {
                return d['idx'];
            });

        points.exit()
            .remove();

        let newPoints = points.enter()
            .append("g")
            .attr("id",function (d) {
                return d.idx;
            })
            .attr("class", "pointG")
            .attr("transform",function (d) {
                let xPos = xScale(d['xVal']), yPos = yScale(d['yVal']);
                if(!utils.isNumericalAttr(visSpec.xAttr)){// globalConfig.metadataMap[visSpec.xAttr]['type']!='numeric'){
                    xPos += xScale.bandwidth()/2;
                }
                if(!utils.isNumericalAttr(visSpec.yAttr)){// globalConfig.metadataMap[visSpec.yAttr]['type']!='numeric'){
                    yPos += yScale.bandwidth()/2;
                }
                return "translate("+xPos+","+yPos+")";
            });

        newPoints.append("circle")
            .attr("class","point")
            .transition()
            .attr("r", function(d){
                if(utils.isNumericalAttr(visSpec.sizeAttr)){
                    return sizeScale(d.sizeVal);
                }
                return defaultRadius;
            })
            .style("fill",function (d) {
                if(utils.isValidAttr(visSpec.colorAttr)){
                    return colorScale(d.colorVal);
                }else {
                    return "steelblue";
                }
            });

        points.transition()
            .attr("transform",function (d) {
                let xPos = xScale(d['xVal']), yPos = yScale(d['yVal']);
                if(!utils.isNumericalAttr(visSpec.xAttr)){// globalConfig.metadataMap[visSpec.xAttr]['type']!='numeric'){
                    xPos += xScale.bandwidth()/2;
                }
                if(!utils.isNumericalAttr(visSpec.yAttr)){//globalConfig.metadataMap[visSpec.yAttr]['type']!='numeric'){
                    yPos += yScale.bandwidth()/2;
                }
                return "translate("+xPos+","+yPos+")";
            })
            .attr("r", function(d){
                if(utils.isNumericalAttr(visSpec.sizeAttr)){
                    return sizeScale(d.sizeVal);
                }
                return defaultRadius;
            })
            .style("fill",function (d) {
                if(utils.isValidAttr(globalConfig.activeVisSpec.colorAttr)){
                    return colorScale(d.colorVal);
                }else {
                    return "steelblue";
                }
            });

        points.select("circle")
            .attr("r", function(d){
                if(utils.isNumericalAttr(visSpec.sizeAttr)){
                    return sizeScale(d.sizeVal);
                }
                return defaultRadius;
            })
            .style("fill",function (d) {
                if(utils.isValidAttr(globalConfig.activeVisSpec.colorAttr)){// 'colorAttr' in globalConfig.activeVisSpec && globalConfig.activeVisSpec.colorAttr!==undefined){
                    return colorScale(d.colorVal);
                }else {
                    return "steelblue";
                }
            });

        if(options.skipAxisUpdate!==true){
            // console.log(globalConfig.activeVisSpec)
            if (globalConfig.metadataMap[globalConfig.activeVisSpec.xAttr]['type'] === "numeric") {
                xAxis.call(d3.axisBottom(xScale).tickFormat(d3.format(globalConfig.numericValueFormatStr)));
            } else {
                xAxis.call(d3.axisBottom(xScale));
            }
            if (globalConfig.metadataMap[visSpec.yAttr]['type'] === "numeric") {
                yAxis.call(d3.axisLeft(yScale).tickFormat(d3.format(globalConfig.numericValueFormatStr)));
            } else {
                yAxis.call(d3.axisLeft(yScale));
            }
        }

        xAxisLabel.transition()
            .text(function () {
                return visSpec.xLabel;
            });

        yAxisLabel.transition()
            .text(function () {
                return visSpec.yLabel;
            });

        let axisTextToRotate;
        if(visSpec.xAttr in globalConfig.metadataMap && globalConfig.metadataMap[visSpec.xAttr]['type']!=='numeric'){
            axisTextToRotate = "xAxisG";
        }
        if(visSpec.yAttr in globalConfig.metadataMap && globalConfig.metadataMap[visSpec.yAttr]['type']!=='numeric'){
            axisTextToRotate = "yAxisG";
        }

        d3.selectAll("#"+axisTextToRotate).selectAll('.tick text')
            .attr('transform',function(d){
                return "rotate(-25)";
            })
            .style('text-anchor',function(d){
                return "end";
            });

        d3.selectAll(".point")
            .on("click",function (d) {
                scatterplotRenderer.clearDefaultDetails();
                let pointerDownEvent = d3.event;
                scatterplotRenderer.showDefaultDetails(false,d,pointerDownEvent.target.parentNode);
            });

        /*
        * Color Legend
        * */
        colorLegendSvg.html("");
        colorLegendSvg.attr("height", "50%");

        if(utils.isNumericalAttr(visSpec.colorAttr)){
            let legendColorScale, legendDivWidth, legendDivHeight, legendSquareDim = 25;
            legendDivWidth = $("#colorLegend").width();
            console.log("legendDivWidth", legendDivWidth);
            let attrValueExtent = d3.extent(globalConfig.metadataMap[visSpec.colorAttr]['values']);

            legendColorScale = d3.scaleSequential(d3.interpolateBlues)
                .domain([0,legendDivWidth*.8]);

            let legendRow = colorLegendSvg.append("g").attr("class",'colorLegendRow');

            let numericColorLegendRectData = [];
            for(let i = 0;i<legendDivWidth*.8;i++){
                numericColorLegendRectData.push(i);
            }

            legendRow.selectAll(".numericColorLegendStrip")
                .data(numericColorLegendRectData)
                .enter()
                .append('rect')
                .attr("class",'numericColorLegendStrip')
                .attr('width',1)
                .attr('height',legendSquareDim)
                .attr("x",function(d){
                    return legendDivWidth*.1+d;
                })
                .attr("y",legendDivWidth*.1)
                .style("fill",function(d,i){
                    return legendColorScale(d);
                });

            legendRow.append('text')
                .attr("x",legendDivWidth*.05)
                .attr("y",legendDivWidth*.1 + legendSquareDim*1.75)
                .text(function(){
                    return d3.format('.3s')(attrValueExtent[0]);
                });

            legendRow.append('text')
                .attr("x",legendDivWidth*.8)
                .attr("y",legendDivWidth*.1+legendSquareDim*1.75)
                .text(function(){
                    return d3.format('.3s')(attrValueExtent[1]);
                });
        }else if(utils.isCategoricalAttr(visSpec.colorAttr)){
            let colorCategories = globalConfig.metadataMap[visSpec.colorAttr]['values'];

            colorLegendSvg.attr("height",(colorCategories.length+2)*colorLegendRectHeight* 1.25);

            colorCategories.sort();

            let legendRows = colorLegendSvg.selectAll(".colorLegendRow")
                .data(colorCategories)
                .enter()
                .append("g")
                .attr("class",function (d) {
                    if(activeColorCategories.indexOf(d)!==-1){
                        return "colorLegendRow";
                    }else {
                        return "colorLegendRow faded";
                    }
                });

            legendRows.append("rect")
                .attr("x",function(d,i){
                    return colorLegendRectWidth;
                })
                .attr("y",function(d,i){
                    return colorLegendRectHeight * 1.25 * (i+1);
                })
                .attr("width",colorLegendRectWidth)
                .attr("height",colorLegendRectHeight)
                .style("fill",function(d){
                    return colorScale(d);
                });

            legendRows.append("text")
                .attr("x",function (d,i) {
                    return colorLegendRectWidth * 2.25;
                })
                .attr("y",function (d,i) {
                    return (colorLegendRectHeight * 1.25 * (i+1)) + colorLegendRectHeight/1.5;
                })
                .text(function(d){
                    return d;
                });
        }

        /*
        * Size Legend
        * */
        sizeLegendSvg.html("");
        if(utils.isNumericalAttr(visSpec.sizeAttr)){
            let legendDivWidth = $("#sizeLegend").width()*.95;
            let legendDivHeight = $("#sizeLegend").height();

            sizeLegendSvg.append("circle")
                .attr("r",sizeScale.range()[0])
                .style("fill","steelblue")
                .attr("transform","translate("+0.2*legendDivWidth+","+legendDivHeight*0.2+")");

            sizeLegendSvg.append("text")
                .attr("class",'sizeLegendValue')
                .attr("transform","translate("+0.1*legendDivWidth+","+legendDivHeight*0.45+")")
                .text(function () {
                    return d3.format('.3s')(sizeScale.domain()[0]);
                });

            sizeLegendSvg.append("circle")
                .attr("r",sizeScale.range()[1])
                .style("fill","steelblue")
                .attr("transform","translate("+0.8*legendDivWidth+","+legendDivHeight*0.2+")");

            sizeLegendSvg.append("text")
                .attr("class",'sizeLegendValue')
                .attr("transform","translate("+0.75*legendDivWidth+","+legendDivHeight*0.45+")")
                .text(function () {
                    return d3.format('.3s')(sizeScale.domain()[1]);
                });
        }

        utils.repositionAxisSelectionAreasInDOM();
        scatterplotRenderer.resetZoom();
    };

    function zoomed(){
        scatterplotRenderer.clearDefaultDetails();
        lastTransform = d3.event.transform;
        // console.log("lastTransform: ", lastTransform);

        let newXScale, newYScale, xAxisFunction, yAxisFunction;
        if(utils.isNumericalAttr(globalConfig.activeVisSpec.xAttr)){
            newXScale = lastTransform.rescaleX(xScale);
            xAxisFunction = d3.axisBottom(newXScale).tickFormat(d3.format(globalConfig.numericValueFormatStr));
        }else {
            newXScale = xScale.range([0, width].map(d => lastTransform.applyX(d)));
            xAxisFunction = d3.axisBottom(newXScale);
        }

        if(utils.isNumericalAttr(globalConfig.activeVisSpec.yAttr)){
            newYScale = lastTransform.rescaleY(yScale);
            yAxisFunction = d3.axisLeft(newYScale).tickFormat(d3.format(globalConfig.numericValueFormatStr));
        }else {
            newYScale = yScale.range([height, 0].map(d => lastTransform.applyY(d)));
            yAxisFunction = d3.axisLeft(newYScale);
        }

        xAxis.call(xAxisFunction);
        yAxis.call(yAxisFunction);

        d3.selectAll(".pointG")
            .attr("transform",function (d) {
                let xPos = newXScale(d['xVal']), yPos = newYScale(d['yVal']);
                if(!utils.isNumericalAttr(globalConfig.activeVisSpec.xAttr)){
                    xPos += xScale.bandwidth()/2;
                }
                if(!utils.isNumericalAttr(globalConfig.activeVisSpec.yAttr)){
                    yPos += yScale.bandwidth()/2;
                }
                return "translate("+xPos+","+yPos+")";
            });
        utils.repositionAxisSelectionAreasInDOM();
    }

    scatterplotRenderer.resetZoom = function(transitionDuration){
        // console.log("IN RESET ZOOM.");
        // console.log("pre reset: ", lastTransform);
        lastTransform = d3.zoomIdentity;
        svg.transition().duration(10).call(zoom.transform, lastTransform);
        // console.log("post reset: ", lastTransform);
    };

    scatterplotRenderer.clearDefaultDetails = function(pointData, pointElm){
        if(pointData===undefined || pointElm===undefined){
            d3.selectAll(".markDetailDiv").remove();
        }else {
            let detailLabelId = "markDetailDiv_"+d3.select(pointElm).attr("id");
            d3.select("#"+detailLabelId).remove();
            d3.select("#"+detailLabelId+"_bgRect").remove();
        }
    };

    scatterplotRenderer.showDefaultDetails = function(autofade, pointData, pointElm, xPos, yPos){
        // console.log("=============showDefaultDetails==============")
        let detailXPos, detailYPos, pointId = d3.select(pointElm).attr("id");
        if(xPos===undefined || yPos===undefined){
            detailXPos = $(pointElm).position()['left'];
            detailYPos = $(pointElm).position()['top'];
            let barBoundingRect = d3.select(pointElm).node().getBBox();
            detailXPos += barBoundingRect.width;
            // detailYPos += barBoundingRect.height*.15;
        }else {
            detailXPos = xPos;
            detailYPos = yPos;
        }

        // detailXPos += 1.5;
        // detailYPos -= 25;

        if(autofade===true){
            scatterplotRenderer.clearDefaultDetails();
        }else {
            clearTimeout(detailsDisplayTimer);
        }

        let detailLabelId = "markDetailDiv_"+d3.select(pointElm).attr("id");
        if(d3.select("#"+detailLabelId).empty()){
            d3.select("body")
                .append("div")
                .attr("id", detailLabelId)
                .attr("class","markDetailDiv")
                .style("opacity",0.9)
                .style("left",detailXPos+"px")
                .style("top",detailYPos+"px")
                .style("color",function () {
                    if(d3.select(pointElm).classed("faded")){
                        return "gray";
                    }
                })
                .style("font-weight",function () {
                    if(d3.select(pointElm).classed("faded")){
                        return "lighter";
                    }
                })
                .html(function () {
                    let xVal = pointData['xVal'], yVal = pointData['yVal'];
                    if(utils.isNumericalAttr(globalConfig.activeVisSpec.xAttr)){
                        xVal = d3.format(globalConfig.numericValueFormatStr)(xVal);
                    }
                    if(utils.isNumericalAttr(globalConfig.activeVisSpec.yAttr)){
                        yVal = d3.format(globalConfig.numericValueFormatStr)(yVal);
                    }
                    return pointData['label'] + " (" + xVal + ", " + yVal +")";
                });
        }else {
            d3.select("#"+detailLabelId)
                .style("left",detailXPos+"px")
                .style("top",detailYPos+"px");
        }

        if(autofade===true){
            detailsDisplayTimer = setTimeout(function () {
                d3.selectAll("#"+detailLabelId + " , " + "#"+detailLabelId+"_bgRect").remove();
            }, globalConfig.detailsTooltipDuration);
        }
    };

    scatterplotRenderer.filterPoints = function () {
        d3.selectAll(".pointG")
            .classed("filtered", function (d) {
                let meetsFilters = true, dataObj = globalConfig.dataMap[d.idx];
                for(let attr in globalConfig.activeFilterMap){
                    let filterVals = globalConfig.activeFilterMap[attr];
                    if(utils.isCategoricalAttr(attr)){
                        if(filterVals.length>0){
                            if(filterVals.indexOf(dataObj[attr])===-1){
                                meetsFilters = false;
                                break;
                            }
                        }
                    }else if(utils.isNumericalAttr(attr)){
                        if(+dataObj[attr]<filterVals[0] || +dataObj[attr]>filterVals[1]){
                            meetsFilters = false;
                            break;
                        }
                    }
                }

                return meetsFilters === false;

            });
    };

    scatterplotRenderer.getTransformedDataAndSpec = function (visSpec, dataList) {
        dataList = typeof dataList !== 'undefined' ? dataList : globalConfig.dataList;
        let transformedData = [];
        for(let dataObj of dataList){
            let label = dataObj[globalConfig.labelAttr];
            let xVal = dataObj[visSpec.xAttr];
            let yVal = dataObj[visSpec.yAttr];
            let colorVal = undefined, sizeVal = undefined;
            if(utils.isValidAttr(visSpec.colorAttr)){
                colorVal = dataObj[visSpec.colorAttr];
            }
            if(utils.isNumericalAttr(visSpec.sizeAttr)){
                sizeVal = +dataObj[visSpec.sizeAttr];
            }

            if(utils.isNumericalAttr(visSpec.xAttr)){
                xVal = +xVal;
            }
            if(utils.isNumericalAttr(visSpec.yAttr)){
                yVal = +yVal;
            }

            transformedData.push({
                "label" : label,
                "xVal" : xVal,
                "yVal" : yVal,
                "colorVal" : colorVal,
                "sizeVal" : sizeVal,
                "idx" : dataObj['idx']
            });
        }

        visSpec.xLabel = visSpec.xAttr;
        visSpec.yLabel = visSpec.yAttr;
        return transformedData;
    };
})();