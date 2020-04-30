(function(){
	
    globalConfig = {
        visContainer: "#outputVisContainer",
        jsonContainer: "#outputJSONContainer",
        extractedAttributesContainer: "#extractedAttributesContainer",
        extractedTasksContainer: "#extractedTasksContainer",
        extractedMetaDataContainer: "#metaDataTableContainer",
        inputQueryContainer: "#inputQueryContainer",
        visThumbnailContainer: "#visThumbnailContainer",
        queryInput: "#queryInput",
        queryBtn: "#queryBtn",
        vegaSpecBtn: "#vegaSpecBtn",
        datasetSelect: "#datasetSelect",
        executionTimeViz: "#executionTimeViz",
        vegaMainChartSize: {
            width: 500,
            height: 500
        },
        vegaThumbnailSize: {
            width: 100,
            height: 100
        },
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
