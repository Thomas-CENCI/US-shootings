src="https://d3js.org/d3.v3.js"
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 530 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#mort")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("../data/us_shootings.csv",

  // When reading the csv, I must format variables:
  function(d){
    if((d.date.split('/')[2]).length == 2){
        years = '20' + d.date.split('/')[2];
    }
    else{
        years =  d.date.split('/')[2];
    }

    return  {date : years, value : d.total_victims}
  },

  // Now I can use this dataset:
  function(data) {
    let newD = []
    data.forEach(element => {
        let Mdate = element.date;
        let b = true;

        newD.forEach(el => {
            if(el.date == Mdate){
                el.value = parseInt(el.value) + parseInt(element.value);
                el.nbr= el.nbr + 1;
                b = false;
            }
        })
        if(b){
            newD.push({date : Mdate, value: element.value, 'nbr': 1});
        }
        b = true;
    })
    newD.forEach(element => {
        element.date = d3.timeParse("%Y")(element.date);
        element.value = parseInt(element.value);
    })
    data = newD;
    console.log(data);

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.value; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#D99F55")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
        )
    // second line
    var y2 = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.nbr; })])
      .range([ height, 0 ]);

    svg.append("g")
      .attr("transform", "translate( " + width + ", 0 )")
      .call(d3.axisRight(y2));

    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Nombre de mort");

    console.log(width);
    svg.append("text")
    .attr("y2",margin.left)
    .attr("x",0 - (height/2))
    .attr("dy", "1em")
    .attr("transform", "translate( " + (width + 12  ) + ", 0 ) rotate(-90)")
    .style("text-anchor", "middle")
    .text("Nombre de fusillade");

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#594D3E")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y2(d.nbr) })
        )

        svg.append("circle").attr("cx",10).attr("cy",30).attr("r", 6).style("fill", "#D99F55")
        svg.append("circle").attr("cx",10).attr("cy",50).attr("r", 6).style("fill", "#594D3E")
        svg.append("text").attr("x", 30).attr("y", 30).text("Nombre de mort").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 30).attr("y", 50).text("Nombre de fusillade").style("font-size", "15px").attr("alignment-baseline","middle")

})


function countOccurences(tab){
var result = {};
tab.forEach(function(elem){
    if(elem in result){
        result[elem] = ++result[elem];
    }
    else{
        result[elem] = 1;
    }
});
return result;
}