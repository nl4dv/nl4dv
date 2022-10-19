(function () {

    function refineS2T(query) {
        query = query.replace(/\-/g, ' ');
        query = query.replace(/[^a-zA-Z0-9\s]/g, '');
        return query;
    };

    uiHandler = {};
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
                    query = refineS2T(query);
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
        // main.analyzeQuery(query);
    };

})();