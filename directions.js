#!/usr/bin/env node

// USAGE:

// cat BLOB_OF_DIRECTIONS.json | node directions.js

// OUTPUTS LIST OF TEXT DIRECTIONS or JSON REPRESENTATION

var as_text = (!process.argv[2] || process.argv[2] !== 'false'),
	list = [];

process.stdin.resume();

var gm = require('googlemaps');
var util = require('util');

function colloquial_distance(ft, from_meters) {
	if (from_meters === true) ft = 3.280839895 * ft;
	ft = Math.round(ft); // round feet
	var in_miles = (ft/5280).toFixed(1);
	var ft_in_tens = Math.round(ft / 10) * 10;
	var colloquial = ''

	if (ft < 200) {
		colloquial = '';
	} else if(ft < 1200) {
		colloquial = ft + ' feet';
	} else if (ft < 1320) {
		colloquial = 'a quarter of a mile';
	} else if (ft < 2900) { // = 55%
		colloquial = 'half a mile';
	} else if (ft < 5280) {
		colloquial = in_miles + ' miles';
	} else if (in_miles < 1.1) {
		colloquial = '1 mile';
	} else {
		colloquial = in_miles + ' miles';
	}
	return colloquial;
}

function directions_from_points(points, first_time) {
	if (points.length <= 1) {
		if (as_text === false) {
			console.log(JSON.stringify(list));
		}
		return; // end
	}
	var pt1 = points.shift(),
		pt2 = points[0];

	gm.directions([pt1.lat,pt1.lng].join(','), [pt2.lat,pt2.lng].join(','), function(err, direction) {
		// console.log(direction)
		if (!direction || direction.routes.length < 1) { // couldn't make directions; plausibly it's an ISLAND with no BRIDGESSS
			throw 'CANT JOIN THESE TWO POINTS';
		} 
			var legs = direction.routes[0].legs,
				steps = legs[0].steps;
			steps.forEach(function(step,n) {
				var filtered = step.html_instructions.replace(/<(?:.|\n)*?>/gm, ' ').replace(/\s+/g,' ').trim()
					colloquial = colloquial_distance(step.distance.value),
					summary = '',
					distance = '';
				if ((n !== 0 || first_time !== true) && colloquial.length > 1) {
					distance = 'In '+colloquial + ', ';
				}
				summary = distance + filtered;
				if (as_text === true) {
					console.log(summary)
				}
				list.push({
					text : summary,
					lat : step.end_location.lat,
					lng : step.end_location.lng,
					polyline : step.polyline.points
				})
			})
		// }
		setTimeout(function() {
			directions_from_points(points);
		}, 1010)

	}, 'false', 'walking', null, null, 'highways')

}

process.stdin.on('data', function(data) {
	var pts = JSON.parse(data.toString());

	directions_from_points(pts, true);

})