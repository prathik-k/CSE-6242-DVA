var margin = {top: 100, right: 40, bottom: 100, left: 70},
    width = 900 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;

//Declaring SVGs
var svg1 = d3.select("body")
  .append("svg")
  .attr("class","SVG")
    .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
  
svg1.append("g")
  .attr("transform","translate(" + margin.left + "," + margin.top + ")");

var legend1 = svg1.append("g")
	.attr("class","legend1")
	.attr("transform","translate(" + (width + margin.right) + "," + (margin.top) + ")")


var svg2 = d3.select("body")
  .append("svg")
    .attr("class","SVG")
    .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
  
svg2.append("g")
  .attr("transform","translate(" + margin.left + "," + margin.top + ")");

var legend1 = svg2.append("g")
	.attr("class","legend2")
	.attr("transform","translate(" + (width + margin.right) + "," + (margin.top) + ")")

var svg3 = d3.select("body")
  .append("svg")
    .attr("class","SVG")
    .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
  
svg3.append("g")
  .attr("transform","translate(" + margin.left + "," + margin.top + ")");

var legend1 = svg3.append("g")
	.attr("class","legend3")
	.attr("transform","translate(" + (width + margin.right) + "," + (margin.top) + ")")

var svg4 = d3.select("body")
  .append("svg")
    .attr("class","SVG")
    .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
  
svg4.append("g")
  .attr("transform","translate(" + margin.left + "," + margin.top + ")");

var legend1 = svg4.append("g")
	.attr("class","legend4")
	.attr("transform","translate(" + (width + margin.right) + "," + (margin.top) + ")")


//Beginning plots

var xparser = d3.timeParse("%Y");

d3.dsv(",","earthquakes.csv",function(d){
  return {
    year: xparser(d.year),"8.0+":d["8.0+"],"7_7.9":d["7_7.9"],"6_6.9":d["6_6.9"],"5_5.9":d["5_5.9"],"Est_deaths":d["Estimated Deaths"]
  }
}).then(function(values){
  const mags = ["5_5.9","6_6.9","7_7.9","8.0+"];
  const colors = ["#FFC300","#FF5733","#C70039","#900C3F"]

  var grouped_quakes = d3.nest()
    .key(function(d){return d['5_5.9'];}).sortKeys(d3.descending)
    .entries(values); 

  const max_quakes = grouped_quakes[0].key;
  var xScale = d3.scaleTime()
    .range([0,width])
    .domain(d3.extent(values,function(d){return d.year}));


  var yScale1 = d3.scaleLinear()
  	.range([height,0])
  	.domain([0,parseInt(max_quakes)]);
   
  var xAx = d3.axisBottom(xScale)
  	.tickFormat(d3.timeFormat("%Y"));

  var yAx1 = d3.axisLeft(yScale1);

  svg1.append("g")
  	.attr("id","xAxis1")
    .attr("class","xAxis")
      .attr("transform", "translate(40," + (height+8).toString() + ")")
      .call(xAx);
  svg1.append("g")
  	.attr("id","yAxis1")
    .attr("class","yAxis")
  		.attr("transform", "translate(40,8)")
  		.call(yAx1);

  var legend1 = svg1.append("g")
    .attr("class","legend1")
    .attr("transform","translate(750,60)");

  legend1.selectAll(".legend1")
    .data(mags)
    .enter()
    .append("rect")
    .style("width", "40px")
    .style("height", "20px")
    .attr("transform", function(d, i) {
      return "translate(10, " + (i * 30) + ")";
    })
    .style("fill",function(d){
      if (d.localeCompare("5_5.9")==0){return colors[0];}
      else if (d.localeCompare("6_6.9")==0){return colors[1];}
      else if (d.localeCompare("7_7.9")==0){return colors[2];}
      else if (d.localeCompare("8.0+")==0){return colors[3];}    
      });  

  svg1.append("text")
    .attr("class","title")
    .text("Earthquake Statistics for 2000-2015")
    .style("font-size","13px")
    .attr("transform", "translate(230,12)");

  legend1.selectAll(".legend1text")
    .data(mags)
    .enter()
    .append("text")
      .attr("transform", function(d, i) {return "translate(55,"+(i*30+15)+")";})
      .text(function(d){return d;});

  var plotlines1 = svg1.append("g")
    .attr("transform", "translate(40,8)");


  mags.forEach(function(value){
    var line1 = d3.line()
        .x(function(d) { return xScale(d.year); })
        .y(function(d) { return yScale1(d[value]); })
        .curve(d3.curveMonotoneX);

    plotlines1.append("path")
      .datum(values)
      .attr("class", "path")
      .attr("d", line1)
      .attr("fill", "none")
      .style("stroke-width",2)
      .style("stroke", function(d) { 
        if (value.localeCompare("5_5.9")==0){return colors[0];}
        else if (value.localeCompare("6_6.9")==0){return colors[1];}
        else if (value.localeCompare("7_7.9")==0){return colors[2];}
        else if (value.localeCompare("8.0+")==0){return colors[3];}
        });

  });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //Plot 2

//Finding Maximum and minimum number of deaths for symbol size scaling.

  var maxDeaths = d3.max(values,function(d){return parseInt(d["Est_deaths"])});
  var minDeaths = d3.min(values,function(d){return parseInt(d["Est_deaths"])});



  svg2.append("g")
    .attr("id","xAxis2")
    .attr("class","xAxis")
      .attr("transform", "translate(40," + (height+8).toString() + ")")
      .call(xAx);

  var yScale2 = d3.scaleLinear()
    .range([height,0])
    .domain([0,parseInt(max_quakes)]);

  var yAx2 = d3.axisLeft(yScale2);

  svg2.append("g")
    .attr("id","yAxis2")
    .attr("class","yAxis")
      .attr("transform", "translate(40,8)")
      .call(yAx2);

  var legend2 = svg2.append("g")
    .attr("class","legend2")
    .attr("transform","translate(760,50)");

  legend2.selectAll(".legend2")
    .data(mags)
    .enter()
    .append("rect")
    .style("width", "40px")
    .style("height", "20px")
    .attr("transform", function(d, i) {return "translate(10,"+(i*30)+")";})
    .style("fill",function(d){
      if (d.localeCompare("5_5.9")==0){return colors[0];}
      else if (d.localeCompare("6_6.9")==0){return colors[1];}
      else if (d.localeCompare("7_7.9")==0){return colors[2];}
      else if (d.localeCompare("8.0+")==0){return colors[3];}    
      });  

  legend2.selectAll(".legend2text")
    .data(mags)
    .enter()
    .append("text")
      .attr("transform", function(d, i) {return "translate(55,"+(i*30+15)+")";})
      .text(function(d){return d;});

  svg2.append("text")
    .attr("class","title")
    .text("Earthquake Statistics for 2000-2015 with Symbols")
    .style("font-size","13px")
    .attr("transform", "translate(200,12)");

  var plotlines2 = svg2.append("g")
    .attr("transform", "translate(40,8)");

  var symScale = d3.scaleLinear()
    .range([10,100])
    .domain([minDeaths,maxDeaths])


  mags.forEach(function(value){
    var line2 = d3.line()
        .x(function(d) {
          return xScale(d.year); })
        .y(function(d) {return yScale2(d[value]); })
        .curve(d3.curveMonotoneX);

    plotlines2.append("path")
      .datum(values)
      .attr("class", "path")
      .attr("d", line2)
      .attr("fill", "none")
      .style("stroke-width",2)
      .style("stroke", function(d) { 
        if (value.localeCompare("5_5.9")==0){return colors[0];}
        else if (value.localeCompare("6_6.9")==0){return colors[1];}
        else if (value.localeCompare("7_7.9")==0){return colors[2];}
        else if (value.localeCompare("8.0+")==0){return colors[3];}
        }); 

    plotlines2.selectAll()
      .data(values)
      .enter()
      .append("path")
      .attr("transform", function(d){return "translate(" + xScale(d.year) + ", " + yScale2(d[value])+")";})
      .attr("d",d3.symbol()
        .type(function(d){
          if (value.localeCompare("5_5.9")==0){return d3.symbolCircle;}
          else if (value.localeCompare("6_6.9")==0){return d3.symbolTriangle;}
          else if (value.localeCompare("7_7.9")==0){return d3.symbolDiamond;}
          else if (value.localeCompare("8.0+")==0){return d3.symbolSquare;}

        })
        .size(function(d){return 3*symScale(d["Est_deaths"]);}))
        .attr("fill",function(d){
          if (value.localeCompare("5_5.9")==0){return colors[0];}
          else if (value.localeCompare("6_6.9")==0){return colors[1];}
          else if (value.localeCompare("7_7.9")==0){return colors[2];}
          else if (value.localeCompare("8.0+")==0){return colors[3];}
        });
  });

/////////////////////////////////////////////////////////////////////////////////
//Plot 3
  svg3.append("g")
  .attr("id","xAxis3")
    .attr("class","xAxis")
      .attr("transform", "translate(40," + (height+8).toString() + ")")
      .call(xAx);

//Changing y-axis type

  var yScale3 = d3.scaleSqrt()
    .range([height,0])
    .domain([0,parseInt(max_quakes)]);

  var yAx3 = d3.axisLeft(yScale3);

  svg3.append("g")
    .attr("id","yAxis3")
    .attr("class","yAxis")
      .attr("transform", "translate(40,8)")
      .call(yAx3);

  var legend3 = svg3.append("g")
    .attr("class","legend3")
    .attr("transform","translate(670,0)");

  legend3.selectAll(".legend3")
    .data(mags)
    .enter()
    .append("rect")
    .style("width", "40px")
    .style("height", "20px")
    .attr("transform", function(d, i) {return "translate(10,"+(i*30)+")";})
    .style("fill",function(d){
      if (d.localeCompare("5_5.9")==0){return colors[0];}
      else if (d.localeCompare("6_6.9")==0){return colors[1];}
      else if (d.localeCompare("7_7.9")==0){return colors[2];}
      else if (d.localeCompare("8.0+")==0){return colors[3];}    
      });  

  legend3.selectAll(".legend3text")
    .data(mags)
    .enter()
    .append("text")
      .attr("transform", function(d, i) {return "translate(55,"+(i*30+15)+")";})
      .text(function(d){return d;});

  svg3.append("text")
    .attr("class","title")
    .text("Earthquake Statistics for 2000-2015 with Symbols (Square root Scale)")
    .style("font-size","13px")
    .attr("transform", "translate(80,12)");

  var plotlines3 = svg3.append("g")
    .attr("transform", "translate(40,8)");

  var symScale = d3.scaleLinear()
    .range([10,100])
    .domain([minDeaths,maxDeaths])


  mags.forEach(function(value){
    var line3 = d3.line()
        .x(function(d) {
          return xScale(d.year); })
        .y(function(d) {return yScale3(d[value]); })
        .curve(d3.curveMonotoneX);

    plotlines3.append("path")
      .datum(values)
      .attr("class", "path")
      .attr("d", line3)
      .attr("fill", "none")
      .style("stroke-width",2)
      .style("stroke", function(d) { 
        if (value.localeCompare("5_5.9")==0){return colors[0];}
        else if (value.localeCompare("6_6.9")==0){return colors[1];}
        else if (value.localeCompare("7_7.9")==0){return colors[2];}
        else if (value.localeCompare("8.0+")==0){return colors[3];}
        }); 

    plotlines3.selectAll()
      .data(values)
      .enter()
      .append("path")
      .attr("transform", function(d){return "translate(" + xScale(d.year) + ", " + yScale3(d[value])+")";})
      .attr("d",d3.symbol()
        .type(function(d){
          if (value.localeCompare("5_5.9")==0){return d3.symbolCircle;}
          else if (value.localeCompare("6_6.9")==0){return d3.symbolTriangle;}
          else if (value.localeCompare("7_7.9")==0){return d3.symbolDiamond;}
          else if (value.localeCompare("8.0+")==0){return d3.symbolSquare;}

        })
        .size(function(d){return 3*symScale(d["Est_deaths"]);}))
        .attr("fill",function(d){
          if (value.localeCompare("5_5.9")==0){return colors[0];}
          else if (value.localeCompare("6_6.9")==0){return colors[1];}
          else if (value.localeCompare("7_7.9")==0){return colors[2];}
          else if (value.localeCompare("8.0+")==0){return colors[3];}
        });
  });
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Plot 4
var symbols =  svg4.append("g")
    .attr("class","xAxis")
      .attr("transform", "translate(40," + (height+8).toString() + ")")
      .call(xAx);

//Changing y-axis type to logarithmic, and shifting domain to handle zero values.
  var yScale4 = d3.scaleLog()
    .range([height,0])
    .domain([0.5,parseInt(max_quakes)]);

  var yAx4 = d3.axisLeft(yScale4);

  svg4.append("g")
    .attr("class","yAxis4")
      .attr("transform", "translate(40,8)")
      .call(yAx4);

  var legend4 = svg4.append("g")
    .attr("class","legend4")
    .attr("transform","translate(760,50)");

  legend4.selectAll(".legend4")
    .data(mags)
    .enter()
    .append("rect")
    .style("width", "40px")
    .style("height", "20px")
    .attr("transform", function(d, i) {return "translate(10,"+(i*30)+")";})
    .style("fill",function(d){
      if (d.localeCompare("5_5.9")==0){return colors[0];}
      else if (d.localeCompare("6_6.9")==0){return colors[1];}
      else if (d.localeCompare("7_7.9")==0){return colors[2];}
      else if (d.localeCompare("8.0+")==0){return colors[3];}    
      });  

  legend4.selectAll(".legend4text")
    .data(mags)
    .enter()
    .append("text")
      .attr("transform", function(d, i) {return "translate(55,"+(i*30+15)+")";})
      .text(function(d){return d;});

  svg4.append("text")
    .attr("class","title")
    .text("Earthquake Statistics for 2000-2015 with Symbols (Log Scale)")
    .style("font-size","13px")
    .attr("transform", "translate(65,12)");

  var plotlines4 = svg4.append("g")
    .attr("transform", "translate(40,8)");

  var symScale = d3.scaleLinear()
    .range([10,100])
    .domain([minDeaths,maxDeaths])


  mags.forEach(function(value){
    var line4 = d3.line()
        .x(function(d) {
          return xScale(d.year); })
        .y(function(d) {
          if (d[value] == 0){return yScale4(0.5);}
          else {return yScale4(d[value]); }})
        .curve(d3.curveMonotoneX);

    plotlines4.append("path")
      .datum(values)
      .attr("class", "path")
      .attr("d", line4)
      .attr("fill", "none")
      .style("stroke-width",2)
      .style("stroke", function(d) {
        if (value.localeCompare("5_5.9")==0){return colors[0];}
        else if (value.localeCompare("6_6.9")==0){return colors[1];}
        else if (value.localeCompare("7_7.9")==0){return colors[2];}
        else if (value.localeCompare("8.0+")==0){return colors[3];}
        }); 

    plotlines4.selectAll()
      .data(values)
      .enter()
      .append("path")
      .attr("transform", function(d){return "translate(" + xScale(d.year) + "," + yScale4(d3.max([0.5,d[value]]))+")";})
      .attr("d",d3.symbol()
        .type(function(d){
          if (value.localeCompare("5_5.9")==0){return d3.symbolCircle;}
          else if (value.localeCompare("6_6.9")==0){return d3.symbolTriangle;}
          else if (value.localeCompare("7_7.9")==0){return d3.symbolDiamond;}
          else if (value.localeCompare("8.0+")==0){return d3.symbolSquare;}

        })
        .size(function(d){return 3*symScale(d["Est_deaths"]);}))
        .attr("fill",function(d){
          if (value.localeCompare("5_5.9")==0){return colors[0];}
          else if (value.localeCompare("6_6.9")==0){return colors[1];}
          else if (value.localeCompare("7_7.9")==0){return colors[2];}
          else if (value.localeCompare("8.0+")==0){return colors[3];}
        });
  });


});
