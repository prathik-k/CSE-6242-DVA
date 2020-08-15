
//SVG size and location definitions
var margin = {top: 80,right: 40,bottom: 100,left: 40},
    width = 1200 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;
    
//Reading in data from json and csv files
var eq = d3.map();

//Defining the map type and location
var projection = d3.geoAlbersUsa()
    .scale(1000)
    .translate([width/2,height/2]);

var path = d3.geoPath()
    .projection(projection);

//Variable containing data from json and csv files
var readData = [
    d3.json("states-10m.json"),
    d3.csv("state-earthquakes.csv",function(d){
        var state = d["States"];
        eq.set(state,{
            "Region":d["Region"],"2010":d["2010"],"2011":d["2011"],"2012":d["2012"],"2013":d["2013"],"2014":d["2014"],"2015":d["2015"]
        })
    })]; 
   
//Formulating promise based on read data
Promise.all(readData).then(function([values]){

	//Making an array of all years in dataset
	var years = [2010,2011,2012,2013,2014,2015];
	var yearScale = years.map(function(d){return new Date(d,0,1);});
    var year = "2010";

    var svg = d3.select("body")
    .append("svg")
        .attr("width",width + margin.left + margin.right)
        .attr("height",height + margin.top + margin.bottom);

	//Designing the tool tip
    var toolTip = d3.tip()
    .attr("class","toolTip").html(function(d){
        return "State:"+d.properties.name+"<br>Region:"+eq["$"+d.properties.name].Region+"<br>Year:"+year+"<br>Earthquakes:"+eq["$"+d.properties.name][year];
    })
    .attr("fill","white");
    svg.call(toolTip);

    var slider = d3.sliderBottom()
        .min(d3.min(yearScale))
        .max(d3.max(yearScale))
        .width(500)
        .height(200)
        .tickValues(yearScale)
        .tickFormat(d3.timeFormat("%Y"))
        .on("onchange",function(map){
            year = d3.timeFormat("%Y")(map);
            choropleth_gen(d3.timeFormat("%Y")(map));
        });

    d3.select("div#slider")
        .append("svg")
            .attr("width",700)
            .attr("height",200)
            .append("g")
                .attr("transform","translate(150,50)")
                .call(slider);

	//Selecting the data for the map
    var choro = svg.append("g")
        .attr("class","states")
        .selectAll("path")
        .data(topojson.feature(values,values.objects.states).features)
        .enter()
        .append("path")
        .attr("d",path)
            .attr("stroke","black");

    svg.append("path")
        .attr("class","border")
        .attr("d",path(topojson.mesh(values,values.objects.states,function(state){return state;})));

	//Defining the color palette
    var colorlist = ["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"];
    var color = d3.scaleThreshold()
        .range(colorlist)
        .domain([1,2,3,4,5,6,7,8,9]);
        
    var colorScale = d3.scaleLog()
        .range([1,10])
        .domain([1,d3.max(eq.values().map(function(quakes){return parseInt(quakes["2010"]);}))]);

	//Declaring and defining the legend
    var legend = svg.append("g")
        .attr("class","legend")
        .attr("transform","translate(980,100)");

    legend.selectAll("g")
        .data(color.range())
        .enter()
        .append("g")
        .append("rect")
            .attr("x",60)
            .attr("y",function (d,i) {return i*40;})
            .attr("width",30)
            .attr("height",30)
            .attr("fill",function(d){return d;})
            .attr("stroke","black");
    
    //Function to generate choropleth map based on slider value
    function choropleth_gen(year){
        colorScale.domain([1,d3.max(eq.values().map(function(quakes){return parseInt(quakes[year]);}))]);
        choro.attr("fill",function(d){
            var stateName = d.properties.name;
            if ((eq.get(stateName)!=undefined)){
                if ((eq.get(stateName))[year] == 0){return "white";}
                else if ((eq.get(stateName))[year]>0){
                    return color(colorScale(parseInt(eq.get(stateName)[year])));}                
            }
            else if ((eq.get(stateName)==undefined)){return "white";}
        })
            .attr("d",path)
                .on("mouseover",toolTip.show)
                .on("mouseout",toolTip.hide);  
    }
    choropleth_gen(year);
})

