(function(){

    $body = $("body");
    $(document).on({
        ajaxStart: function() { $body.addClass("loading");},
        ajaxStop: function() { $body.removeClass("loading"); }
    });

    vegaOptMode = {
	  "actions": false,
	  "renderer": "svg",
	  "hover": true,
	  "tooltip": true
	};

})();
