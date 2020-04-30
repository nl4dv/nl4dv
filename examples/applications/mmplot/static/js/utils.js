function Point(x,y){if(arguments.length>0){this.init(x,y);}}
	Point.prototype.init=function(x,y){this.x=x;this.y=y;};
	Point.prototype.min=function(that){return new Point(Math.min(this.x,that.x),Math.min(this.y,that.y));};
	Point.prototype.max=function(that){return new Point(Math.max(this.x,that.x),Math.max(this.y,that.y));};
	Point.prototype.lerp=function(that,t){return new Point(this.x+(that.x-this.x)*t,this.y+(that.y-this.y)*t);};
	Point.prototype.distanceFrom=function(that){var dx=this.x-that.x;var dy=this.y-that.y;return Math.sqrt(dx*dx+dy*dy);};

	function Intersection(status) {
    if ( arguments.length > 0 ) {
        this.init(status);
    }
}
Intersection.prototype.init = function(status) {
    this.status = status;
    this.points = new Array();
};
Intersection.prototype.appendPoint = function(point) {
    this.points.push(point);
};
Intersection.prototype.appendPoints = function(points) {
    this.points = this.points.concat(points);
};

Intersection.intersectCircleLine = function(c, r, a1, a2) {
    var result;
    var a  = (a2.x - a1.x) * (a2.x - a1.x) +
        (a2.y - a1.y) * (a2.y - a1.y);
    var b  = 2 * ( (a2.x - a1.x) * (a1.x - c.x) +
        (a2.y - a1.y) * (a1.y - c.y)   );
    var cc = c.x*c.x + c.y*c.y + a1.x*a1.x + a1.y*a1.y -
        2 * (c.x * a1.x + c.y * a1.y) - r*r;
    var deter = b*b - 4*a*cc;
    if ( deter < 0 ) {
        result = new Intersection("Outside");
    } else if ( deter == 0 ) {
        result = new Intersection("Tangent");
    } else {
        var e  = Math.sqrt(deter);
        var u1 = ( -b + e ) / ( 2*a );
        var u2 = ( -b - e ) / ( 2*a );
        if ( (u1 < 0 || u1 > 1) && (u2 < 0 || u2 > 1) ) {
            if ( (u1 < 0 && u2 < 0) || (u1 > 1 && u2 > 1) ) {
                result = new Intersection("Outside");
            } else {
                result = new Intersection("Inside");
            }
        } else {
            result = new Intersection("Intersection");
            if ( 0 <= u1 && u1 <= 1)
                result.points.push( a1.lerp(a2, u1) );

            if ( 0 <= u2 && u2 <= 1)
                result.points.push( a1.lerp(a2, u2) );
        }
    }
    return result;
};

(function () {
	
	utils = {};

	utils.isNumericalAttr = function (attr) {
        return attr in globalConfig.metadataMap && globalConfig.metadataMap[attr]['type'] === 'numeric';
    };

    utils.isCategoricalAttr = function (attr) {
        return attr in globalConfig.metadataMap && globalConfig.metadataMap[attr]['type'] === 'categorical';
    };

    utils.isValidAttr = function (attr) {
        return attr in globalConfig.metadataMap;
    };

    utils.isTemporalAttr = function (attr) {
        return attr in globalConfig.metadataMap && globalConfig.metadataMap[attr]['type'] === 'temporal';
    };

    utils.isEraserEvent = function(){
    	return false;
	};

    utils.repositionAxisSelectionAreasInDOM = function () {
        let removed = d3.select("#xAxisSelectionArea").remove();
        d3.select("#xAxisG").append(function() {
            return removed.node();
        });
        removed = d3.select("#yAxisSelectionArea").remove();
        d3.select("#yAxisG").append(function() {
            return removed.node();
        });
    };

    utils.refineS2T = function (query) {
        query = query.replace(/\-/g, ' ');
        query = query.replace(/[^a-zA-Z0-9\s]/g, '');
        return query;
    };
	
	utils.sortObj = function(list, key,order) {
	    order = typeof order !== 'undefined' ? order : 'a';
	    function compare(a, b) {
	        a = a[key];
	        b = b[key];
	        var type = (typeof(a) === 'string' || typeof(b) === 'string') ? 'string' : 'number';
	        var result;
	        if (type === 'string'){
	            if(key=='startDate' || key=='endDate'){
	                a = new Date(a).getTime();
	                b = new Date(b).getTime();
	                if(order=='a'){
	                    result = a - b;
	                }else if(order=='d'){
	                    result = b - a;
	                }
	                //if(order=='a'){
	                //    result = a < b;
	                //}else if(order=='d'){
	                //    result = a > b;
	                //}
	            }else{
	                if(order=='a'){
	                    result = a.localeCompare(b);
	                }else if(order=='d'){
	                    result = b.localeCompare(a);
	                }
	            }
	        } else {
	            if(order=='a'){
	                result = a - b;
	            }else if(order=='d'){
	                result = b - a;
	            }
	        }
	        return result;
	    }
	    return list.sort(compare);
	}

	utils.cloneObj = function(obj) {
	    // Handle the 3 simple types, and null or undefined
	    if (null == obj || "object" != typeof obj) return obj;

	    // Handle Date
	    if (obj instanceof Date) {
	        var copy = new Date();
	        copy.setTime(obj.getTime());
	        return copy;
	    }

	    // Handle Array
	    if (obj instanceof Array) {
	        var copy = [];
	        for (var i = 0, len = obj.length; i < len; i++) {
	            copy[i] = clone(obj[i]);
	        }
	        return copy;
	    }

	    // Handle Object
	    if (obj instanceof Object) {
	        var copy = {};
	        for (var attr in obj) {
	            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
	        }
	        return copy;
	    }

	    throw new Error("Unable to copy obj! Its type isn't supported.");
	};

})()