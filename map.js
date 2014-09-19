var fs = require('fs'),
	d3 = require('d3'),
	pts = JSON.parse(fs.readFileSync('./directions.json'));

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

// for (var i = 0; i < pts.length; i++) {
// 	console.log(pts[i]);
// };

var xmldom = require('xmldom');
 
// var dataset = {
//   apples: [53245, 28479, 19697, 24037, 40245],
// };
 
var width = 500,
    height = 500;
    // radius = Math.min(width, height) / 2;
 
// var color = d3.scale.category20();
 
// var pie = d3.layout.pie()
//     .sort(null);
 
// var arc = d3.svg.arc()
//     .innerRadius(radius - 100)
//     .outerRadius(radius - 50);

 
var svg = d3.select("body").append("svg")
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
   .attr('stroke','purple')


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
  	.style("stroke", 'purple')
	.style("stroke-width", 1 + "px")
	.attr("vector-effect","non-scaling-stroke")

// get a reference to our SVG object and add the SVG NS  
var svgGraph = d3.select('svg')
  .attr('xmlns', 'http://www.w3.org/2000/svg');
var svgXML = (new xmldom.XMLSerializer()).serializeToString(svgGraph[0][0]);

function dom_string_lower(ds){  // per http://stackoverflow.com/questions/20693235/get-lowercase-tag-names-with-xmldom-xmlserializer-in-node-js/20704228
    var cd = {}, //var to backup cdata contents
        i = 0,//key integer to cdata token
        tk = String(new Date().getTime());//cdata to restore

    //backup cdata and attributes, after replace string by tokens
    ds = ds.replace(/\<!\[CDATA\[.*?\]\]\>|[=]["'].*?["']/g, function(a){
        var k = tk + "_" + (++i);
        cd[k] = a;
        return k;
    });

    //to lower xml/html tags
    ds = ds.replace(/\<([^>]|[^=])+([=]| |\>)/g, function(a, b){
        return String(a).toLowerCase();
    });

    //restore cdata contents
    for(var k in cd){
        ds = ds.replace(k, cd[k]);
    }

    cd = null;//Clean variable
    return ds;
}

fs.writeFile('graph.svg', dom_string_lower(svgXML));