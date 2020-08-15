
//Setting the margins variable for the SVG element
var margin = {top: 80, right: 40, bottom: 100, left: 40},
    width = 900 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;

//Setting bar width and padding gap
var bar_width = 10,bar_padding = 3;

//instantiating the SVG element
var svg = d3.select("body")
	.append("svg")
		.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

//Translating svg to correct location	
svg.append("g")
	.attr("transform","translate(" + margin.left + "," + margin.top + ")");

//Promise function to read in data from csv and then create plot
var xparser = d3.timeParse("%Y");

d3.dsv(",", "q3.csv", function(d){
	return {
		year: xparser(d.year),rt: parseInt(d.running_total)
	}
}).then(function(values){

//Creating x time scale values (years)
	var xScale = d3.scaleTime()
		.range([0,width])
		.domain(d3.extent(values,function(d){return d.year}));

//Creating y units scale values (linear)
	var yScale = d3.scaleLinear()
		.range([height,0])
		.domain([0,d3.max(values,function(d){return parseInt(d.rt)})]);

//Setting attributes of SVG element for each rectangular bar
	svg.selectAll()
		.data(values)
		.enter()
		.append("rect")
			.attr("class", "bar")
				.attr("fill", "blue")
				.attr("x",function(d) {return xScale(d.year)})
				.attr("y",function(d) {return yScale(parseInt(d.rt))})
				.attr("height",function(d) {
					return height - yScale(d.rt);})
				.attr("width",bar_width - bar_padding)
				.attr("transform", "translate("+margin.left+",0)");

//Creating x-axis element with ticks for every third year
	var x_axis = d3.axisBottom(xScale)
		.tickFormat(d3.timeFormat("%Y"))
		.ticks(d3.timeYear.every(3));

//Creating y-axis element with ticks for every 1000th unit
	var ytick_max = d3.max(values,function(d){return parseInt(d.rt)});	
	var y_axis = d3.axisLeft(yScale)
		.tickValues(d3.range(0,ytick_max,1000));

//Calling x and y axis elements and positioning text
	svg.append("g")
		.attr("class","axis")
		.attr("transform", "translate("+margin.left+","+height+")")
		.call(x_axis)
		.selectAll("text")	
	        .style("text-anchor", "middle");

	svg.append("g")
		.attr("class","axis")
		.attr("transform", "translate("+margin.left+",0)")
		.call(y_axis)
		.selectAll("text")	
	        .style("text-anchor", "left");
	
});



//HTTP Server: python -m http.server 8000