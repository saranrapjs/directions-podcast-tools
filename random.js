// USAGE:

// node random.js 'Los Angeles, CA'

// OUTPUTS JSON

var gm = require('googlemaps');
var util = require('util');

var city = process.argv[2] || 'New York City, NY, USA',
	number_of_points = 20,
	bounds,
	my_filter,
	final_points = [];

// optional filter function:
try {
	my_filter = require('./filter.js');
} catch (e) {

}

function random_between() {
	if (!arguments || arguments.length < 1) throw "Must have at least two numbers";
	var args = Array.prototype.slice.call(arguments, 0),
		max = args.reduce(function(prev,next) { return Math.max(prev,next); }),
		min = args.reduce(function(prev,next) { return Math.min(prev,next); });
	return (Math.random() * (max - min) + min).toFixed(6);
}

function random_point(	max_lat,min_lat,max_lng,min_lng ) {
	return [
		random_between(max_lat,min_lat),
		random_between(max_lng,min_lng)
	];
}

function do_points(pts) {
	if (pts.length < 1) {
		console.log(JSON.stringify(final_points));		
		return;
	}
	pt = pts.pop();
	gm.reverseGeocode(pt.join(','), function(err, revgeo) {
		var first_result = revgeo.results[0],
			match,
			new_point = {
				'address' : first_result.formatted_address,
				'lat' : first_result.geometry.location.lat,
				'lng' : first_result.geometry.location.lng
			};
		if (my_filter) {
			match = my_filter(first_result.address_components);
			if (match === true) {
				final_points.push(new_point)
			} else {
				pts = add_random_point(pts);
			}
		} else {
			final_points.push(new_point)
		}
		setTimeout(function() {
			do_points(pts)
		}, 1010);
	}, null, null, 'ROOFTOP')
}

function add_random_point(ptz) {
	ptz.push(random_point(
		bounds.northeast.lat,
		bounds.southwest.lat,
		bounds.northeast.lng,
		bounds.southwest.lng
	));
	return ptz;
};

gm.geocode(city, function(err,result) {
	var first_result = result.results[0],
		pts = [];

	bounds = first_result.geometry.bounds;	

	for (var i = 0; i < number_of_points; i++) {
		pts = add_random_point(pts);
	};
	do_points(pts);
})