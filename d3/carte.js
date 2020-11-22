src="https://d3js.org/d3.v3.min.js";
type="text/css";
/* On mouse hover, lighten state color */



//Width and height of map
var width = 960;
var height = 500;

// D3 Projection
var projection = d3.geo.albersUsa()
				   .translate([width/2, height/2])    // translate to center of screen
				   .scale([1000]);          // scale things down so see entire US

// Define path generator
var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection);  // tell path generator to use albersUsa projection


// Define linear scale for output
var color = d3.scale.linear()
			  .range(["rgb(50,190,240)","rgb(50,145,240)","rgb(50,100,240)","rgb(190,47,47)"]);

var legendText = ["Shooting", ">50 shootings", ">20 shootings", "<20 shootings"];

//Create SVG element and append map to the SVG
var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height);

// Append Div for tooltip to SVG
var div = d3.select("body")
		    .append("div")
    		.attr("class", "tooltip")
    		.style("opacity", 0);

// make a dataset containing the number of fatalities per state
d3.csv("../data/us_shootings.csv", (d) => {
    data = []
    states = []
    d.forEach(element => {
    	var state = element.location.split(', ')[1]
    	var fatalities = element.fatalities
    	if (!(states.includes(state))) {
    		states.push(state)
    	}
	    data.push({"state": state, 'fatalities': fatalities});
    })
    res = []
    states.forEach(state => {
    	var fatalities = parseInt(0, 10)
	    d.forEach(element => {
	    	if (state == element.location.split(', ')[1]) {
	    		fatalities = fatalities + parseInt(element.fatalities, 10)				// Pas trouvé de moyen plus facile pour faire cette liste
	    	}
	    })
	    res.push({"state": state, "fatalities": fatalities})
    })

    // Load in my states data!
    res.forEach(result => {
	color.domain([0,1,2,3]); // setting the range of the input data

	// Load GeoJSON data and merge with states data
	d3.json("../data/us-states.json", function(json) {

	// Bind the data to the SVG and create one path per GeoJSON feature
	svg.selectAll("path")
		.data(json.features)
		.enter()
		.append("path")
		.attr("d", path)
		.style("stroke", "#fff")
		.style("stroke-width", "1")
		.style("fill", function(d) {

			var name = d.properties.name.toString()

			if (!(states.includes(name))) {
				fatalities = NaN
			}
			else {
				var fatalities = res[states.indexOf(name)].fatalities

			}

			if (fatalities >= 50) {
				return color(2);
			}
			if (fatalities >= 20) {
				return color(1);
			}
			if (fatalities >= 0) {
				return color(0);
			}
			else {
				return "rgb(213,222,217)";
			}
		});
	})

d3.csv("../data/us_shootings.csv", (d) => {
    data = []
    d.forEach(element => {
	    data.push({"place": element.case, 'lat': element.latitude, 'lon':element.longitude, 'people': element.fatalities});
	});

	svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", function(d) {
			return projection([d.lon, d.lat])[0];
		})
		.attr("cy", function(d) {
			return projection([d.lon, d.lat])[1];
		})
		.attr("r", function(d) {
			return Math.sqrt(d.people)*4;
		})
			.style("fill", "rgb(217,91,67)")
			.style("opacity", 0.85)

	// Modification of custom tooltip code provided by Malcolm Maclean, "D3 Tips and Tricks" 
	// http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
	.on("mouseover", function(d) {
    	div.transition()
      	   .duration(200)
           .style("opacity", .9);
           div.text('Attaque du ' + d.place + ', \n\n nombre de mort: ' + d.people)
           .style("left", (d3.event.pageX) + "px")
           .style("top", (d3.event.pageY - 28) + "px");

	})

    // fade out tooltip on mouse out
    .on("mouseout", function(d) {
        div.transition()
           .duration(500)
           .style("opacity", 0);
    });
});

// Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
var legend = d3.select("body").append("svg")
      			.attr("class", "legend")
     			.attr("width", 140)
    			.attr("height", 200)
   				.selectAll("g")
   				.data(color.domain().slice().reverse())
   				.enter()
   				.append("g")
     			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  	legend.append("rect")
   		  .attr("width", 18)
   		  .attr("height", 18)
   		  .style("fill", color);

  	legend.append("text")
  		  .data(legendText)
      	  .attr("x", 24)
      	  .attr("y", 9)
      	  .attr("dy", ".35em")
      	  .text(function(d) { return d; });
		});

	});