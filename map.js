#!/usr/bin/env node

'use strict';

// USAGE:

// cat BLOB_OF_DIRECTIONS.json | node map.js

// OUTPUTS SVG MAP of DIRECTION POINTS

var fs = require('fs'),
	d3 = require('d3'),
	line_color = process.argv[2] || 'purple';

let input = ''

process.stdin.resume();
process.stdin.on('data', data => input += data.toString());
process.stdin.on('end', function() {
	let pts
	try {
		pts = JSON.parse(input);
	} catch (e) {
		console.error("JSON parse error:", e)
	}
	map_points(pts)
});

function map_points(pts) {
	var formattd = pts.map(function(pt) {
		return [pt.lng, pt.lat]
	})
	var geoJSON = {
	    "type": "FeatureCollection",
	    "features":[
	        {
	            "type":"Feature",
	            "geometry":{
	                "type":"Polygon",
	                "coordinates":formattd
	            },
	        }
	    ]
	}

	var width = 500,
	    height = 500;

	var document = require('jsdom').jsdom();
	var svg = d3.select(document.body).html('').append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    // .append("g")

	var g = svg.append("g")
	    // .attr("transform", "translate(-" + width / 2 + ",-" + height / 2 + ")")
	    // .style("stroke-width", "1.5px");

	var path = d3.geo.path();

	var projection = d3.geo.mercator()
	    // .translate([width / 2, height / 2]);
	 var path = d3.geo.path()
	    .projection(projection);

	var data = {
	        type: "LineString",
	        coordinates: formattd
	    }

	var dr = g.append("path")
	    .datum(data)
	    // .attr("class", "route")
	    .attr("d", path)
	    .attr('fill', 'none')
	    // .attr('stroke-linecap',"square")
	   .attr('stroke', line_color)


	  var bounds = path.bounds(data),
	      dx = bounds[1][0] - bounds[0][0],
	      dy = bounds[1][1] - bounds[0][1],
	      x = (bounds[0][0] + bounds[1][0]) / 2,
	      y = (bounds[0][1] + bounds[1][1]) / 2,
	      scale = .9 / Math.max(dx / width, dy / height),
	      translate = [width / 2 - scale * x, height / 2 - scale * y];

	g.append("svg:circle")
	    .style("fill", "black")
	    .attr("r", 1)
	    .attr("transform", function(d) {return "translate(" + projection(data.coordinates[0]) + ")scale("+(3 / scale)+")";})

	g.append("svg:circle")
	    .style("fill", "black")
	    .attr("r", 1)
	    .attr("transform", function(d) {return "translate(" + projection(data.coordinates[data.coordinates.length-1]) + ")scale("+(3 / scale)+")";})

	  g
	      .attr("transform", "translate(" + translate + ")scale(" + scale + "," + scale + ")");
	  dr
	  	.style("fill", "none")
	  	.style("stroke", line_color)
		.style("stroke-width", 1 + "px")
		.attr("vector-effect","non-scaling-stroke")

	// get a reference to our SVG object and add the SVG NS
	var svgGraph = svg
	  .attr('xmlns', 'http://www.w3.org/2000/svg');
	console.log(`<?xml version="1.0" encoding="utf-8"?>
	<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
	<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">
	${svgGraph.html()}
	</svg>`);
	return
}