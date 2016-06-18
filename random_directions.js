#!/usr/bin/env node

'use strict';

// USAGE:

// node random.js 'Los Angeles, CA'

// node random.js 'New York, NY' '(Brooklyn|Queens)'

// OUTPUTS JSON

var gm = require('googlemaps');
var util = require('util');

const city = process.argv[2] || 'New York, NY, USA';
const number_of_points = 20;
const final_points = [];

let regex = city;
// if a regex is passed in, use it
if (process.argv[3]) {
	regex = new RegExp(process.argv[3]);
} else {
	// otherwise, produce a regex from
	// a. the comma delimited city param
	// b. fallback to just the city name, raw
	const cityComponents = city.split(',')
	if (cityComponents.length) {
		regex = new RegExp(cityComponents.shift());
	}
}

function random_between() {
	if (!arguments || arguments.length < 1) throw "Must have at least two numbers";
	var args = Array.prototype.slice.call(arguments, 0),
		max = args.reduce( (prev,next) => Math.max(prev,next) ),
		min = args.reduce( (prev,next) => Math.min(prev,next) );
	return (Math.random() * (max - min) + min).toFixed(6);
}

function random_point(	max_lat,min_lat,max_lng,min_lng ) {
	return [
		random_between(max_lat,min_lat),
		random_between(max_lng,min_lng)
	];
}

function do_points(pts, bounds) {
	if (pts.length < 1) {
		console.log(JSON.stringify(final_points));
		return;
	}
	const pt = pts.pop();
	gm.reverseGeocode(pt.join(','), function(err, revgeo) {
		var first_result = revgeo.results[0],
			match,
			new_point = {
				'address' : first_result.formatted_address,
				'lat' : first_result.geometry.location.lat,
				'lng' : first_result.geometry.location.lng
			};
		match = first_result.address_components.reduce( (result, component) => result || regex.test(component.long_name), false);
		if (match === true) {
			console.error(`adding ${new_point.address}`)
			final_points.push(new_point)
		} else {
			pts = add_random_point(pts, bounds);
		}
		setTimeout(function() {
			do_points(pts, bounds)
		}, 1010);
	}, null, null, 'ROOFTOP')
}

function add_random_point(ptz, bounds) {
	ptz.push(random_point(
		bounds.northeast.lat,
		bounds.southwest.lat,
		bounds.northeast.lng,
		bounds.southwest.lng
	));
	return ptz;
};

gm.geocode(city, function(err,result) {
	const fr = result.results[0];
	let pts = [];

	const bounds = fr.geometry.bounds;

	for (var i = 0; i < number_of_points; i++) {
		pts = add_random_point(pts, bounds);
	};

	do_points(pts, bounds);
})
