(function () {

    globalConfig = {
        "data": {
            nodes: [{
                    id: "ROOT",
                    text: "Dataset",
                    fx: 250, // override in main.js to half of width
                    fy: 500, // override in main.js to half of height
                    vlSpec: null,
                    dialog_id: 0,
                    query_id: 0
                }
            ],
            connections: []
        },
        vegaMainChartSize: {
            width: 150,
            height: 150
        },
        "dataList": [],
        "speechRecognizer": new webkitSpeechRecognition(),
        "recognizingSpeech": false,
        "colorPalette": ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf", "#FFD600", "#00BFA5", "#64DD17", "#AA00FF", "#00BFA5"],
        "activeFilterMap": {},
        "metadataMap": {}
    };
})();