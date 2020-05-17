(function(){
	
    globalConfig = {
        visContainer: "#outputVisContainer",
        jsonContainer: "#outputJSONContainer",
        extractedAttributesContainer: "#extractedAttributesContainer",
        extractedTasksContainer: "#extractedTasksContainer",
        extractedMetaDataContainer: "#metaDataTableContainer",
        inputQueryContainer: "#inputQueryContainer",
        queryInput: "#queryInput",
        queryBtn: "#queryBtn",
        datasetSelect: "#datasetSelect",
        executionTimeViz: "#executionTimeViz",
        attributeDataTablesOptions:  {
            paging: false,
            searching: false,
            ordering: false,
            select: false,
            bInfo : false,
            language: {
              emptyTable: "No data"
            },
            scrollX: false,
        },
        taskDataTablesOptions:  {
            paging: false,
            searching: false,
            ordering: false,
            select: false,
            bInfo : false,
            language: {
              emptyTable: "No data"
            },
//            rowGroup: {
//                dataSrc: 0 // task
//            },
//            columnDefs: [
//                { "visible": false, "targets": 0 }
//            ],
            scrollX: false,
        }
    };
})()
