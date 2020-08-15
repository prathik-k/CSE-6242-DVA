
d3.csv("earthquake.csv").then(function(values){

//SVG size and location definitions
  var margin = {top: 20, right: 160, bottom: 35, left: 30};
  var width = 960 - margin.left - margin.right;
  var height = 600 - margin.top - margin.bottom;  

//Setting color palette
  var colors = ["#b33040","#d25c4d","#f2b447"];
  var xScale = d3.scaleBand()
    .range([margin.left,width-margin.right]);

  var yScale = d3.scaleLinear()
    .range([height - margin.bottom, margin.top]);

//Instantiating the SVG
  var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate("+margin.left+","+margin.top+")");

  var categories = values.columns.slice(2);
  var year = [...new Set(values.map(function(d){return d.Year}))];
  var states = [...new Set(values.map(function(d){return d.State}))];

//Defining x and y scales for axes
  var xScale = d3.scaleBand()
  	.range([30, width-30])
  	.domain(values.map(function(d){return d.State;}));

  var yScale = d3.scaleLinear()
  	.rangeRound([height-100,100]);

//Appending choices for the selection box
  var choices = d3.select("#sel").selectAll("option")
  	.data(year)
  	.enter()
  	.append("option")
  	.text(function(d){return d;});

//Declaring and defining title and axes
  var title = svg.append("g")
  	.append("text")
  	.attr("class","title")
  	.attr("x",(width/2)-60)
  	.attr("y",height-390)
  	.attr("font-family","sans-serif")
  	.text("Visualizing Earthquake Counts by State");
 
  var xAxis = svg.append("g")
  	.attr("transform", "translate(0," + (height-10) + ")")
  	.attr("class","xAxis");

  var yAxis = svg.append("g")
    .attr("transform", "translate(30,90)")
    .attr("class","yAxis");

//Function that will be called for the appropriate year based on selection in box
  function selectYear(sel){
  	var data = values.filter(function(f){
		if (f.Year == sel){return true;}
		else if (f.Year != sel){return false;}
  	})  	
  	data.forEach(function(d) {
      d.total = d3.sum(categories, function(k){return d[k];});
      return d;
    }); 

    var ymax = d3.max(data,function(d){return d3.sum(categories,function(k){return d[k];})});
    yScale.domain([0,ymax]).nice();

    svg.selectAll(".yAxis")
      .transition()      
      .call(d3.axisLeft(yScale)
      .ticks(null, "s"));

    svg.selectAll(".xAxis")
      .transition()      
      .call(d3.axisBottom(xScale));

//Entering data and filling up columns
    var columns = svg.selectAll("g.columns")
    	.data(d3.stack()
        	.keys(categories)(data),function(d){return d.key;});

    columns.enter()
    	.append("g")
	        .classed("columns",true)
	        .style("fill", function(d,i){return colors[i];});

    var bars = svg.selectAll("g.columns")
      .selectAll("rect");

//Making the bars for the stacked bar chart
    bars.data(function(d){return d;}, function(d){return d.data.State})
      .enter()
      .append("rect")
      .attr("width", parseInt(xScale.bandwidth())-10)
      .merge(bars)
      .transition()      
      .attr("x",function(d){return parseInt(xScale(d.data.State));})
      .attr("y",function(d){return parseInt(yScale(d[1]));})
      .attr("height", function(d){return yScale(d[0])-yScale(d[1])})
      .attr("transform", "translate(0,90)");

//Displaying totals about each stacked bar above the bars
    var totals = svg.selectAll(".totals")
      	.data(data,function(d){return d.State;});
    totals.exit().remove();
    totals.enter()
        .append("text")
        .attr("class", "totals")
        .merge(totals)
        .transition()        
        .attr("x",function(d){return xScale(d.State)+37;})
        .attr("y",function(d){return yScale(d.total)+84;})
        .text(function(d){return d.total;});

//Declaring and defining the legend
    var legend = svg.append("g")
          .attr("class","legend")
          .attr("width",200)
          .attr("height",200)
          .attr("transform", "translate(-20,90)");

        legend.selectAll("marker")
          .data(colors)
          .enter()
          .append("circle")
          .attr("cy",function(d,i){return (-5+margin.top+30+22*i);})
          .attr("cx",800)
          .attr("r",7)
          .attr("fill", function(d){ return d; });

      var mags = ["7.0+", "6_6.9", "5_5.9"];
      legend.selectAll("text")
            .data(mags)
            .enter().append("text")
            .attr("x", 820)
            .attr("y", function(d,i){return margin.top+30+i*22; })
            .text(function(d){return d});
      }

//Calling the update function on changing the selected year.
  selectYear(d3.select("#sel").property("value"),0);
  var choice = d3.select("#sel")
  	.on("change",function(){selectYear(this.value)});
});