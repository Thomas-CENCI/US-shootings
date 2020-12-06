
d3.csv("../data/us_shootings.csv", (d) => {
	var cases = []
    var total = 0
    d.forEach(element => {
    	var cas = element.prior_signs_mental_health_issues.toString().toLowerCase().split(" ").join("")
    	cases.push(cas)
    	total++
    });

	cases = count(cases)

	var data = [{'label':'yes', 'value':cases['yes'], 'description':"Mentally ill criminals"}, {'label':'no', 'value':cases['no'], 'description':"Presumably sane criminals"}, {'label':'unknown', 'value':cases['unknown'] + cases['-'], 'description':"Criminals whose mental health is unknown"}, {'label':'unclear', 'value':cases['tbd'] + cases['unclear'], 'description':"Criminals whose mental health is to be evaluated"}]
	console.log("data :", data)
	var svg = d3.select("#cardi");
	svg.select('card-column')
	    .data(data)
	    .enter()
	    .append("div") // append div here
	    .classed("card", true)
	    .each(function(d) { // i dont know why, but html function does not helps, i used each over all nodes here
			console.log(this);
			d3.select(this).html(

	        `<div class="card-body">
	           <h1 class="card-title">${d.value}</h1>
	           <h3 class="card-text">${d.description}</h3>
	        </div>`)
	    });
	});

function count(list) {
	var counts = [];
	for (var i = 0; i < list.length; i++) {
	  var num = list[i];
	  counts[num] = counts[num] ? counts[num] + 1 : 1;
	}
	return counts;
}