d3.dsv(",","state-year-earthquakes.csv", function(d){
    return{state: d.state,region: d.region,year: d.year,count: parseInt(d.count)}
}).then(function(values){

//SVG size and location definitions
    var margin = {top: 80, right: 40, bottom: 100, left: 40},
        width = 900 - margin.left - margin.right,
        height = 750 - margin.top - margin.bottom;

//Instantiating the SVG
	var svg = d3.select("body")
	  .append("svg")
	    .attr("width",width+margin.left+margin.right)
	    .attr("height",height+margin.top+margin.bottom)
	    .append("g")
	    .attr("transform", "translate("+margin.left+","+margin.top+")");

//Instantiating the SVG for the bar chart
	var bar_svg = d3.select("body")
	    .append("svg")
	    	.attr("class","barSVG")
	        .attr("width", width+margin.left+margin.right)
	        .attr("height", height+margin.top+margin.bottom)
	        .append("g")
	            .attr("transform", "translate("+margin.left+","+margin.top+")");

//Grouping the data by keys region first and then year
    grouped_quakes = d3.nest() 
        .key(function(d){return d.region;}).sortKeys(d3.ascending)        
        .key(function(d){return d.year;})
        .rollup(function(occ){return{"region":occ[0].region,"occ":occ,"count":d3.sum(occ,function(d){return parseInt(d.count);})}})
        .entries(values);

//Defining x and y scales and axes
    var xScale = d3.scaleTime()
    	.range([0,width])
        .domain(d3.extent(values, function(d){
            return new Date(parseInt(d.year),0);}));        

    var xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat("%Y"))    
        .ticks(5);

    svg.append("g")
        .attr("transform", "translate(0,"+height+")")
        .call(xAxis);

    var yScale = d3.scaleLinear()
        .range([height,0])
        .domain([0,800+d3.max(values,function(d){return parseInt(d.count);})]);

    var yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .call(yAxis);     
        
    svg.selectAll()
        .data(grouped_quakes)
        .enter()
        .append("path")
        .attr("d", function(d){
            return d3.line()
                .x(function(d){return xScale(new Date(parseInt(d.key),0));})
                .y(function(d){return yScale(+d.value.count);})
            (d.values);
        })
        .attr("fill", "none")
        .attr("stroke",function(d){
            if ((d.key).localeCompare("Northeast") == 0)
                {return "blue";}
            else if ((d.key).localeCompare("South") == 0)
                {return "green";}
            else if ((d.key).localeCompare("Midwest") == 0)
                {return "red";}
            else if ((d.key).localeCompare("West") == 0)
                {return "purple";}
            });

    var legendBox = svg.append("g")
        .attr("transform", "translate(750,150)");

    var legendEntries = legendBox.selectAll("g")
        .data(grouped_quakes)
        .enter()
        .append("g")
        .attr("transform", function(d,i) {return "translate(10,"+i*20+")"});
    legendEntries.append("circle")
        .attr("r", 5)
        .attr("fill", function(d){
        if ((d.key).localeCompare("South") == 0)
            {return "green";}
        else if ((d.key).localeCompare("Northeast") == 0)
            {return "blue";}
        else if ((d.key).localeCompare("Midwest") == 0)
            {return "red";}
        else if ((d.key).localeCompare("West") == 0)
            {return "purple";}
        });
    legendEntries.append("text")
        .attr("x", 15)
        .attr("y",7)
        .text(function(d){return d.key.toString();})
        .style("font-weight", "bold")
        .style("font-size", "20px");

//Controlling mouse over reaction (creating bars)
    function mouseOver(){
        d3.select(this)
        	.classed("mouseover",true)
        	.attr("r", 6);
        console.log("Mouse Over!");

        var data = this.__data__;   
//Setting parameters for bar chart display
        bar_svg.style("display","block");
        var bar_xScale = d3.scaleLinear()
            .range([0, width])
            .domain([0, d3.max(data.value.occ, function(d){return parseInt(d.count);})]);
        var bar_yScale = d3.scaleBand()
            .range([height, 0])
            .domain(data.value.occ.map(function(d){return d.state;}));
        bar_svg.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(80,"+height+")");

        bar_svg.select(".xAxis")
            .style("font-size","10px")
            .call(d3.axisBottom(bar_xScale)
                .tickSizeInner([-height]));

        bar_svg.append("g")
        .attr("class","yAxis")
            .attr("transform","translate(80,0)");
        bar_svg.select(".yAxis")
            .style("font-size","10px")
            .call(d3.axisLeft(bar_yScale));

        var bars = bar_svg.selectAll(".bar")
            .data(data.value.occ);            
        bars.exit()
        	.remove();

        bars.enter()
        	.append("rect")
            .merge(bars)
            .attr("class","bar")
            .attr("x",0)
            .attr("height", function(d){
            	return bar_yScale.bandwidth();})
            .attr("transform","translate(80,0)")
            .attr("y", function(d){return bar_yScale(d.state);})
            .attr("width", function(d){return bar_xScale(d.count);})
            .attr("fill","steelblue")
            .attr("stroke","white")
            .attr("stroke-width",0.8);

        const this_region = data.value.region;
        const this_year = data.key;
        
        var title = bar_svg.append("g")
            .attr("class","barTitle")
            .attr("id","barTitle")
            .append("text")
                .attr("transform", "translate(480,-10)")
                .text(this_region.toString()+"ern"+" Region Earthquakes "+this_year.toString());
    }

//Controlling mouse out reaction (removing bar_svg)
    function mouseOut(){
    d3.select(this)
	    .classed("mouseover", false)
	    .attr("r", 3);
    bar_svg.style("display", "none");
    svg.select(".barSVG").remove(); 
    d3.select("#barTitle").remove();   
    }

    svg.append("g")
        .selectAll()
        .data(grouped_quakes)
        .enter()
        .append("g")
        .selectAll()
        .data(function(d){return d.values;})
        .enter()
        .append("circle")
        .attr("r",3)
        .attr("cx",function(d){return xScale(new Date(parseInt(d.key),0))})
        .attr("cy",function(d){return yScale(parseInt(d.value.count))})
        .attr("fill",function(d){
            if ((d.value.occ[0].region).localeCompare("South") == 0) {return "green";}
            else if ((d.value.occ[0].region).localeCompare("Northeast") == 0) {return "blue";}
            else if ((d.value.occ[0].region).localeCompare("Midwest") == 0) {return "red";}
            else if ((d.value.occ[0].region).localeCompare("West") == 0) {return "purple";}
        })
        .on("mouseover",mouseOver)
        .on("mouseout",mouseOut);
});
