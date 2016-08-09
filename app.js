var CTPS = {};
CTPS.demoApp = {};

var projection = d3.geo.conicConformal()
  .parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
  .scale([21000]) // N.B. The scale and translation vector were determined empirically.
  .translate([30,830]);
  
var geoPath = d3.geo.path().projection(projection); 

var comma = d3.format(",");

//Using the queue.js library
queue()
  .defer(d3.csv, "sourceTable.csv")
  .defer(d3.json, "tract_census.topojson")

  .awaitAll(function(error, results){ 
    CTPS.demoApp.generateMap(results[1]);
    CTPS.demoApp.generatePanel(results[0]);
    CTPS.demoApp.generateSavings(results[0]);
  }); 

CTPS.demoApp.generateMap = function(tracts) {  

  var projection = d3.geo.conicConformal()
    .parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
    .scale([50000]) // N.B. The scale and translation vector were determined empirically.
    .translate([40,1800]);
    
  var geoPath = d3.geo.path().projection(projection); 

  var tractMap = d3.select("#map").append("svg")
                .attr("width", "100%")
                .attr("height", 600)

  tractMap.selectAll(".tracts")
      .data(topojson.feature(tracts, tracts.objects.tract_census_2).features)
      .enter()
      .append("path")
        .attr("class", function(d) { return "t" + d.properties.TRACT; })
        .attr("d", function(d) { return geoPath(d); })
        .style("fill", "#ddd")
        .style("opacity", function(d) { return d.properties.MINORITY_HH_PCT; })
}

CTPS.demoApp.generatePanel = function(source) {
  var routes = [];

  source.forEach(function(i){
      routes.push(i.Route);
      i.Wdky_Riders = +i.Wdky_Riders;
      i.Minority_Percent = +i.Minority_Percent;
  })

  var height = 480; 

  var toggler = d3.select("#chart").append("svg")
                  .attr("width", "100%")
                  .attr("height", height)

  var w = $("#chart").width();


  var xScale = d3.scale.linear()
              .domain([0, 100])
              .range([120, w - 30])

  var xScaleLength = d3.scale.linear()
                    .domain([0, 100])
                    .range([0, w - 150])

  var yScale = d3.scale.ordinal()
              .domain(routes)
              .rangePoints([35, height - 15])

  var xAxis = d3.svg.axis().scale(xScale).orient("top").ticks(10);
  var yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(-w + 100, 0, 0);

  toggler.append("g").attr("class", "x axis")
    .attr("transform", "translate(0, 30)")
    .call(xAxis)
  
  toggler.append("g").attr("class", "axis")
    .attr("transform", "translate(50, 5)")
    .call(yAxis)
    .selectAll("text")
      .style("text-anchor", "middle")

  toggler.append("rect")
    .attr("class", "affected")
    .attr("x", xScale(0))
    .attr("y", 30)
    .attr("width", xScaleLength(47.5))
    .attr("height", height - 15)
    .style("fill", "#ddd")
    .style("fill-opacity", .05)

  toggler.selectAll(".minorityCI")
    .data(source)
    .enter()
    .append("rect")
      .attr("class", "minorityCI")
      .attr("x", function(d) { return xScale(d.MIN_90pct_Lower); })
      .attr("y", function(d) { return yScale(d.Route); })
      .attr("height", 10)
      .attr("width", function(d) { return xScaleLength(d.MIN_90pct_Upper - d.MIN_90pct_Lower); })
      .attr("fill-opacity", .1)
      .attr("fill", "#ddd")

  toggler.selectAll(".minorityPercent")
    .data(source)
    .enter()
    .append("rect")
      .attr("class", "minorityPercent")
      .attr("x", function(d) { return xScale(d.Minority_Percent); })
      .attr("y", function(d) { return yScale(d.Route); })
      .attr("height", 10)
      .attr("width", 2)
      .attr("fill-opacity", 1)
      .attr("fill", "#ddd")

  // parameters
var margin = 20,
  width = $("#slider").width();
  height = 40;


// scale function
var ratioScale = d3.scale.linear()
  .domain([.7, 1.3])
  .range([0, width - 2 * margin])
  .clamp(true);


// initial value
var startingValue = d3.round(1.0, 2) ;

//////////

// defines brush
brush = d3.svg.brush()
  .x(ratioScale)
  .extent([startingValue, startingValue])
  .on("brush", brushed);

var svg = d3.select("#slider").append("svg")
  .attr("width", width)
  .attr("height", height + margin * 2)
  .append("g")
  // classic transform to position g
  .attr("transform", "translate(" + margin + "," + 2 * margin + ")");

svg.append("g")
  .attr("class", "ratio")
  .attr("transform", "translate(0," + (height / 2 - 10) + ")")
.call(d3.svg.axis()
  .scale(ratioScale)
  .orient("bottom")
  .ticks(7)
  .tickValues([.7, 1.3]))
  .attr("class", "halo");

var slider = svg.append("g")
  .attr("class", "slider")
  .call(brush);

slider.selectAll(".extent,.resize")
  .remove();

slider.select(".background")
  .attr("height", height);

var handle = slider.append("g")
  .attr("class", "handle")

handle.append("path")
  .attr("transform", "translate(0," + (height / 2 - 10)+ ")")
  .attr("d", "M 0 -10 V 10")

handle.append('text')
  .text("1.0")
  .attr("transform", "translate(" + (-18) + " ," + (height / 2 - 35) + ")");

slider
  .call(brush.event)

function brushed() {
  d3.select("#routeNo").selectAll("text").remove();
  d3.select("#ridership").selectAll("text").remove();
  d3.select("#percentMin").selectAll("text").remove();
  d3.select("#minSavings").selectAll("text").remove();
  d3.select("#maxSavings").selectAll("text").remove();

  var value = brush.extent()[0];

  if (d3.event.sourceEvent) { // not a programmatic event
    value = ratioScale.invert(d3.mouse(this)[0]);
    brush.extent([value, value]);
  }

  handle.attr("transform", "translate(" + ratioScale(value) + ",0)");
  handle.select('text').text(d3.round(value, 2));

  d3.selectAll('#sliderRatio').text(d3.round(value, 2));
  d3.select('#sliderPercent').text(d3.round(value * 47.5, 2));
  d3.select('.affected')
      .attr("width", xScaleLength(value * 47.5))

  var minTotalSavings = 0; 
  var maxTotalSavings = 0; 
  var totalPercent = 0; 
  var totalPop = 0; 

  source.forEach(function(i){ 
      minTotalSavings += +i.MinSavings20pctHrs; 
      maxTotalSavings += +i.MaxSavings100pctHrs; 
      totalPercent += i.Wdky_Riders * i.Minority_Percent;
      totalPop += +i.Wdky_Riders;
    })

    d3.select("#minTotSavings").text("$" + comma(parseInt(minTotalSavings)));
    d3.select("#maxTotSavings").text("$" + comma(parseInt(maxTotalSavings)));
    d3.select("#globalMinority").text(d3.round(totalPercent/totalPop, 1))
    d3.select("#globalPop").text(parseInt(totalPercent/100));

}//end function brushed()


}


CTPS.demoApp.generateSavings = function(source) {
  var routes = [];

  source.forEach(function(i){
      routes.push(i.Route);
      i.Wdky_Riders = +i.Wdky_Riders;
      i.Minority_Percent = +i.Minority_Percent;
  })

  var height = 480; 

  var toggler = d3.select("#tableRows").append("svg")
                  .attr("width", "100%")
                  .attr("height", height)

  var w = $("#tableRows").width();


  var xScale = d3.scale.linear()
              .domain([0, 100])
              .range([120, w - 30])

  var xScaleLength = d3.scale.linear()
                    .domain([0, 100])
                    .range([0, w - 150])

  var yScale = d3.scale.ordinal()
              .domain(routes)
              .rangePoints([15, height - 35])

  var yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(-w + 100, 0, 0);
  
  toggler.append("g").attr("class", "axis")
    .attr("transform", "translate(20, -5)")
    .call(yAxis)
    .selectAll("text")
      .style("text-anchor", "middle")

  toggler.selectAll(".numRiders")
    .data(source)
    .enter()
    .append("text")
      .attr("class", "numRiders")
      .attr("x", 90)
      .attr("y", function(d) { return yScale(d.Route); })
      .attr("fill", "#ddd")
      .text(function(d) { return comma(d.Wdky_Riders); })
      .style("text-anchor", "middle")

  toggler.selectAll(".minPercent")
    .data(source)
    .enter()
    .append("text")
      .attr("class", "minPercent")
      .attr("x", 160)
      .attr("y", function(d) { return yScale(d.Route); })
      .attr("fill", "#ddd")
      .text(function(d) { return comma(d.Minority_Percent) + "%"; })
      .style("text-anchor", "middle")
}
