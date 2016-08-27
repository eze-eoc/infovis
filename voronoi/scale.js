var COORD_X_IDX = 0;
var COORD_Y_IDX = 1;

var LON = 0;
var LAT = 1;
var INFO_LON = 0;
var INFO_LAT = 1;
var INFO_NOMBRE = 2;
var INFO_CLASS = 3;

var Scale = function(coords, zoomScale) {
	var min = function(a, b){if (a<b)return a;else return b;};
	var max = function(a, b){if (a>b)return a;else return b;};
	var minextreme = coords.reduce(function(sofar, act){ return [min(sofar[LON], act[LON]), min(sofar[LAT], act[LAT])]; });
	var maxextreme = coords.reduce(function(sofar, act){ return [max(sofar[LON], act[LON]), max(sofar[LAT], act[LAT])]; });
	var data_width = maxextreme[COORD_X_IDX] - minextreme[COORD_X_IDX];
	var data_height = maxextreme[COORD_Y_IDX] - minextreme[COORD_Y_IDX];
	var data_center = [minextreme[COORD_X_IDX] + data_width/2, minextreme[COORD_Y_IDX] + data_height/2];
	var data_ar = data_width/data_height;
	var screen_ar = width/height;
	
	var lat_scale_fix = 1/Math.cos(minextreme[LAT]/180*3.1415926);
	if (data_ar > screen_ar) {
		var scale = width / data_width;
	} else {
		var scale = height / data_height;
	}

	var to_coords = function(v) {
		var x = width / 2 + (v[COORD_X_IDX] - data_center[COORD_X_IDX]) * scale * zoomScale;
		var y = height / 2 + (v[COORD_Y_IDX] - data_center[COORD_Y_IDX]) * scale * zoomScale * lat_scale_fix * -1; // <-- "-1" para invertirlo
		return [x, y];
	};
	this.adaptScale = function(array) {
		return array.map(function(d){return to_coords(d);});
	}
	this.adaptAllScale = function(array) {
		var self = this;
		return array.map(function(bar){return self.adaptScale(bar);});
	}
};

