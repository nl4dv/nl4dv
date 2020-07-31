function findMinMaxAvg(arr){
  var min = arr[0]; // min
  var max = arr[0]; // max
  var sum = arr[0]; // sum

  for(var i = 1; i < arr.length; i++){
    if (arr[i] < min) {
      min = arr[i];
    }
    if (arr[i] > max) {
      max = arr[i];
    }
    sum = sum + arr[i];
  }
  return [min, max, sum / arr.length, arr.length]
}

function execute(){
    var query_sets = ["fullyspecified-attributes-tasks-vis", "underspecified-attributes-tasks", "underspecified-attributes-vis", "underspecified-attributes", "other-examples"]
    for(var query_file_index=0; query_file_index<query_sets.length; query_file_index++){
        var table = document.getElementById(query_sets[query_file_index] + "-table");
        var rows = modelOutputs[query_sets[query_file_index]]

        for (var i = 1; i < rows.length; i++) {
            var row = rows[i];
            var dataset = row["dataset"]

            if(query_sets[query_file_index] == "other-examples"){
                console.log(dataset);
                table = document.getElementById(dataset.split(".csv")[0] + "-table");
            }

            var alias = row["alias"];
            var query = row["query"];
            var response = row["response"];

            var attributeList = [];
            var taskList = [];
            var visObj;

            var new_row = table.insertRow(-1);

            cell = new_row.insertCell(-1);
            $(cell).append("<p style='padding:4px; font-size: 22px; font-weight:300'><i>" + query + "</i></p>"); //Attribute Combination section

            // container for Extracted Attributes
            var attributeMap = response['attributeMap'];
            Object.keys(attributeMap).forEach(function(attr){
                attributeList.push(attributeMap[attr]);
            });

            // container for Extracted Tasks
            var tasksObjectList = response['taskMap'];
            Object.keys(tasksObjectList).forEach(function(task){
                tasksObjectList[task].forEach(function(taskObj){
                    taskList.push(taskObj);
                });
            });

            // Visualization
            visObj = response['visList'];
            var new_cell = new_row.insertCell(-1);
            var vizContainer = document.createElement('div');
            $(vizContainer).addClass("parent");

             for (var l = 0; l < visObj.length; l++) {
                 var div = document.createElement('div');
                 $(div).addClass("child");
                 vegaEmbed(div, visObj[l]['vlSpec'], vegaOptMode);
                 $(vizContainer).append(div);
             }
            new_cell.appendChild(vizContainer);
        }
    }
}

$(document).ready(function() {
    setTimeout(function(){
        execute();
    }, 1000);
});
