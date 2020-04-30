function changeStrokeColor(element){
    stroke_color = element.value;
    drawChart();
}

function changeMaxColor(element){
    max_color = element.value;
    drawChart();
}

function changeMinColor(element){
    min_color = element.value;
    drawChart();
}

function changeSpotRadius(element){
    spot_radius = element.value;
    drawChart();
}

function changeSpotCellMargin(element){
    spot_cell_margin = element.value;
    drawChart();
}

function changeSpotCellPadding(element){
    spot_cell_padding = element.value;
    drawChart();
}

function changeSpotMatrixType(element){
    spot_matrix_type = element.value;
    drawChart();
}

function drawChart(){
    var chartElement = document.getElementById("SpotMatrix");
    chartElement.innerHTML="";

    var dataset = [{
        "Options": "Option 1",
        "Usable": 82,
        "Scalable": 32,
        "Flexible": 34,
        "Durable": 10,
        "Capable": 73,
        "Stable": 17
    }, {
        "Options": "Option 2",
        "Usable": 55,
        "Scalable": 12,
        "Flexible": 42,
        "Durable": 50,
        "Capable": 19,
        "Stable": 61
    }, {
        "Options": "Option 3",
        "Usable": 10,
        "Scalable": 43,
        "Flexible": 50,
        "Durable": 80,
        "Capable": 65,
        "Stable": 12
    } , {
        "Options": "Option 4",
        "Usable": 13,
        "Scalable": 20,
        "Flexible": 32,
        "Durable": 57,
        "Capable": 21,
        "Stable": 53
    }, {
        "Options": "Option 5",
        "Usable": 87,
        "Scalable": 85,
        "Flexible": 19,
        "Durable": 80,
        "Capable": 23,
        "Stable": 43
    }];

    var chart_options = {
        min_color: min_color,
        max_color: max_color,
        stroke_color: stroke_color,
        spot_matrix_type: spot_matrix_type,
        spot_cell_margin : spot_cell_margin,
        spot_cell_padding : spot_cell_padding,
        spot_radius : spot_radius
    };

    SpotMatrix(dataset,chart_options);
}

var min_color = document.getElementById("min_color").value;
var max_color = document.getElementById("max_color").value;
var stroke_color = document.getElementById("stroke_color").value;
var spot_matrix_type = document.getElementById("spot_matrix_type").value;
var spot_cell_margin = document.getElementById("spot_cell_margin").value;
var spot_cell_padding = document.getElementById("spot_cell_padding").value;
var spot_radius = document.getElementById("spot_radius").value;

drawChart();