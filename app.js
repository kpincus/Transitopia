var CTPS = {};
CTPS.demoApp = {};


var minTotal = 0; 
var popTotal = 0; 
var vrhSavings = 0; 
var vrhSavingsTotal = 0; 
var globalVRH = 0; 

var projection = d3.geo.conicConformal()
  .parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
  .scale([21000]) // N.B. The scale and translation vector were determined empirically.
  .translate([30,830]);
  
var geoPath = d3.geo.path().projection(projection); 

var comma = d3.format(",");

var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("drag", dragmove);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return d.Minority_Percent + "%" ;
  })


var tipRoute = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "Route " + d.properties.letter;
  })

function dragmove(d) {
  d3.select(this)
  console.log(d3.event.x)
      .attr("x", function(d) { return d.x = Math.min(vrhScale(-30), d3.event.x)})
}

var colorScale = d3.scale.linear()
                .domain([0, .12, .18, .30, .36, .42, 1])
                .range(["#feebe2","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177"])

//Using the queue.js library
queue()
  .defer(d3.csv, "sourceTable.csv")
  .defer(d3.json, "tract_census.topojson")
  .defer(d3.json, "routes.topojson")

  .awaitAll(function(error, results){ 
    CTPS.demoApp.generateMap(results[1], results[2]);
    CTPS.demoApp.generatePanel(results[0]);
    CTPS.demoApp.generateSavings(results[0]);

    results[0].forEach(function(i){ globalVRH += +i.TotalHours; })
     d3.select("#target-savings-dollars").text(d3.round(-globalVRH * .05, 2) + " hours")

    //highlight rectangles
    d3.selectAll(".selection").on("mouseover", function() { 
      if($(this).hasClass("clicked") == false){ 
            var routeName = this.getAttribute("class").split(" ")[0];
            
            d3.selectAll("." + routeName).filter("text").filter(".numRiders, .minPercent, .letterName, .vrhTime")
              .style("font-weight", 700)
              .style("fill", "#EE4000")

            d3.selectAll("." + routeName).filter(".routes")
              .style("stroke", "EE4000")

            d3.selectAll("." + routeName).filter(".minorityChart")
              .style("fill", "EE4000")

            d3.selectAll(".selection") 
              .style("cursor", "pointer");
      }
    })

    d3.selectAll(".selection").on("mouseout", function() { 
      if($(this).hasClass("clicked") == false){ 
            var routeName = this.getAttribute("class").split(" ")[0];
            
            d3.selectAll("." + routeName).filter("text").filter(".numRiders, .minPercent, .letterName, .vrhTime")
              .style("font-weight", 300)
              .style("fill", "black")

            d3.selectAll("." + routeName).filter(".routes")
              .style("stroke", "black")

            d3.selectAll("." + routeName).filter(".minorityChart")
              .style("fill", function(d) { return colorScale(d.Minority_Percent/100)})
      }
    })


    d3.selectAll(".vrhSlider").on("mouseover", function() { 
      if($(this).hasClass("clicked") == false){
        d3.selectAll(".vrhSlider").style("cursor", "pointer");

        var routeName = this.getAttribute("class").split(" ")[0];
        var routeChange = this.getAttribute("class").split(" ")[1];

        d3.selectAll("." + routeName).filter(".vrhSlider").filter("." + routeChange).filter("rect")
          .style("stroke-width", 2)

        d3.selectAll("." + routeName).filter(".vrhSlider").filter("." + routeChange).filter("text")
          .style("fill", "EE4000")
      }
    })

    d3.selectAll(".vrhSlider").on("mouseout", function() { 
      if($(this).hasClass("clicked") == false){
        var routeName = this.getAttribute("class").split(" ")[0];
        var routeChange = this.getAttribute("class").split(" ")[1];
      
        d3.selectAll("." + routeName).filter(".vrhSlider").filter("." + routeChange).filter("rect")
          .style("stroke-width", 0)

        d3.selectAll("." + routeName).filter(".vrhSlider").filter("." + routeChange).filter("text")
          .style("fill", "none")
      }
    })

    // If VRH rectangle is clicked
     d3.selectAll(".vrhSlider").on("click", function() { 
        var routeName = this.getAttribute("class").split(" ")[0];
        var routeChange = this.getAttribute("class").split(" ")[1];
        var letterRef = routeName.split("e")[1];
        var percentRef = +routeChange.split("t")[1];

        if ( $(this).hasClass("clicked") == false) {
          //highlight appropriate bus routes on map and on text
          d3.selectAll("." + routeName).filter("text").filter(".numRiders, .minPercent, .letterName, .vrhTime")
            .style("font-weight", 700)
            .style("fill", "EE4000")
            .classed("clicked", true);

          d3.selectAll("." + routeName).filter(".routes")
            .style("stroke", "EE4000")
            .classed("clicked", true);

          d3.selectAll("." + routeName).filter(".minorityChart")
              .style("fill", "EE4000")
              .classed("clicked", true);

          var letterRef = routeName.split("e")[1];

          results[0].forEach(function(i){
            if (i.Route == letterRef) { 
              minTotal += i.Wdky_Riders * i.Minority_Percent / 100;
              popTotal += i.Wdky_Riders;
            }
          })

          //highlight appropriate VRH rectangles
            d3.selectAll("." + routeName).filter(".vrhSlider").filter("rect")
              .style("stroke-width", 0)
              .classed("clicked", false)

            d3.selectAll("." + routeName).filter(".vrhSlider").filter("text")
              .style("fill", "none")
              .classed("clicked", false)

            d3.selectAll("." + routeName).filter(".vrhSlider").filter("." + routeChange).filter("rect")
              .style("stroke-width", 2)

            d3.selectAll("." + routeName).filter(".vrhSlider").filter("." + routeChange).filter("text")
              .style("fill", "EE4000")

            results[0].forEach(function(i){
              if (i.Route == letterRef) { 
                if (i.Selected != 0){
                  vrhSavings -= i.Selected;
                }
                vrhSavings += i.TotalHours * percentRef / 100;
                i.Selected = i.TotalHours * percentRef / 100;
            }})

            d3.selectAll("." + routeName).filter(".vrhSlider").filter("." + routeChange)
                .classed("clicked", true)
        } else {
          //highlight bus routes and text
          d3.selectAll("." + routeName).filter("text").filter(".numRiders, .minPercent, .letterName, .vrhTime")
            .style("font-weight", 300)
            .style("fill", "black")
            .classed("clicked", false);

          d3.selectAll("." + routeName).filter(".routes")
            .style("stroke", "black")
            .classed("clicked", false);

          d3.selectAll("." + routeName).filter(".minorityChart")
              .style("fill", function(d) { return colorScale(d.Minority_Percent/100)})
              .classed("clicked", false);

          var letterRef = routeName.split("e")[1];

          results[0].forEach(function(i){
            if (i.Route == letterRef) { 
              minTotal -= i.Wdky_Riders * i.Minority_Percent / 100;
              popTotal -= i.Wdky_Riders;
            }
          })

          //highlight appropriate VRH rectangles
          d3.selectAll("." + routeName).filter(".vrhSlider").filter("." + routeChange).filter("rect")
            .style("stroke-width", 0)

          d3.selectAll("." + routeName).filter(".vrhSlider").filter("." + routeChange).filter("text")
            .style("fill", "none")

          results[0].forEach(function(i){
            if (i.Route == letterRef) { 
                vrhSavings -= i.TotalHours * percentRef / 100;
                i.Selected = 0;
            }
          })

          d3.selectAll("." + routeName).filter(".vrhSlider").filter("." + routeChange)
                .classed("clicked", false)
        }
        
        d3.select("#vrhTotSavings").text(d3.round(100 * vrhSavings / globalVRH, 2) + "%")
        d3.select("#vrhTotSavings-dollars").text(d3.round(vrhSavings, 2) + " hours")

      //Update front-end numbers
        var diRatio = (100 * minTotal / (popTotal + .01))/47.5;

        d3.selectAll(".yourChange")
          .attr("x", ratioScale(diRatio));

        d3.selectAll('#calculatedRatio').text(d3.round(diRatio, 2));

        d3.selectAll('#isThereImpact')
          .text(function() { 
            if (diRatio < brushValue) { return "No Disparate Impact" }
            else { return "Disparate Impact" }
          })
    })


  }); 

CTPS.demoApp.generateMap = function(tracts, routes) {  
  var routes = topojson.feature(routes, routes.objects.select_routes_modified).features;

  var index = 0; 
  routes.forEach(function(i){ 
    i.properties.letter = alphabet[index];
    index++;
  })

  var projection = d3.geo.conicConformal()
    .parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
    .scale([70000]) // N.B. The scale and translation vector were determined empirically.
    .translate([-240,2450]);
    
  var geoPath = d3.geo.path().projection(projection); 

  var tractMap = d3.select("#map").append("svg")
                .attr("width", "100%")
                .attr("height", 600)

  tractMap.call(tipRoute);

  tractMap.selectAll(".tracts")
      .data(topojson.feature(tracts, tracts.objects.tract_census_2).features)
      .enter()
      .append("path")
        .attr("class", function(d) { return "t" + d.properties.TRACT; })
        .attr("d", function(d) { return geoPath(d); })
        .style("fill", "black")
        .style("opacity",  function(d) { return Math.sqrt(d.properties.MINORITY_HH_PCT);})

  tractMap.selectAll(".routes")
      .data(routes)
      .enter()
      .append("path")
        .attr("class", function(d) { return "route" + d.properties.letter + " routes selection"})
        .attr("d", function(d) { return geoPath(d); })
        .style("stroke", "black")
        .style("fill", "none")
        .style("stroke-width", 3)
        .style("opacity", 1)
        .on("mouseenter", function(d) { tipRoute.show(d); })
        .on("mouseleave", function(d) { tipRoute.hide(d); })

     //Color key
    var xPos = 5;
    var yPos = 40; 
    var height = 600; 
    //background
    tractMap.append("text")
      .style("font-weight", 700)
      .attr("x", xPos).attr("y", yPos - 12)
      .text("KEY");
    tractMap.append("text")
      .style("font-weight", 700)
      .attr("x", xPos).attr("y", yPos + 5)
      .text("% Minority Households");

    //text and colors
    tractMap.append("rect")
      .style("fill", "black").style("stroke", "none").style("opacity", .39)
      .attr("x", xPos).attr("y", yPos + 15).attr("height", "7px").attr("width", height/35);
    tractMap.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 22)
      .text("15%");
    tractMap.append("rect")
      .style("fill", "black").style("stroke", "none").style("opacity", .55)
      .attr("x", xPos).attr("y", yPos + 30).attr("height", "7px").attr("width", height/35);
    tractMap.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 37)
      .text("30%");
    tractMap.append("rect")
      .style("fill", "black").style("stroke", "none").style("opacity", .67)
      .attr("x", xPos).attr("y", yPos + 45).attr("height", "7px").attr("width", height/35);
    tractMap.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 52)
      .text("45%");
    tractMap.append("rect")
      .style("fill", "black").style("stroke", "none").style("opacity", .76)
      .attr("x", xPos).attr("y", yPos + 60).attr("height", "7px").attr("width", height/35);
    tractMap.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 67)
      .text("60%");
    tractMap.append("rect")
      .style("fill", "black").style("stroke", "none").style("opacity", .85)
      .attr("x", xPos).attr("y", yPos + 75).attr("height", "7px").attr("width", height/35);
    tractMap.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 82)
      .text(">75%");

}

CTPS.demoApp.generatePanel = function(source) {
  var routes = [];

  source.forEach(function(i){
      routes.push(i.Route);
      i.Wdky_Riders = +i.Wdky_Riders;
      i.Minority_Percent = +i.Minority_Percent;
      i.Selected = 0;
  })

  var height = 600; 

  var toggler = d3.select("#chart").append("svg")
                  .attr("width", "100%")
                  .attr("height", height)

  var w = $("#chart").width();


  var xScale = d3.scale.linear()
              .domain([0, 100])
              .range([80, w - 30])

  var xScaleLength = d3.scale.linear()
                    .domain([0, 100])
                    .range([0, w - 110])

  var yScale = d3.scale.ordinal()
              .domain(routes)
              .rangePoints([110, height - 10])

  var xAxis = d3.svg.axis().scale(xScale).orient("top").ticks(10);

  toggler.append("g").attr("class", "x axis")
    .attr("transform", "translate(0, 100)")
    .call(xAxis)
    .selectAll("text").style("font-size", 10)

//Labelling
var yPos = 55;

  toggler.append("text")
    .text("Route")
    .attr("x", 25)
    .attr("y", yPos + 35)
    .style("text-anchor", "middle")
    .style("font-weight", 300)

  toggler.append("text")
    .text("Percent Minority Ridership")
    .attr("x", 210)
    .attr("y", yPos + 20)
    .style("text-anchor", "middle")
    .style("font-weight", 300)
    .style("font-size", 12)

//Key 

toggler.append("text")
    .text("KEY:")
    .attr("x", 10)
    .attr("y", yPos - 32)
    .style("font-size", 11)

toggler.append("text")
    .text("90% Confidence Interval")
    .attr("x", 145)
    .attr("y", yPos - 17)
    .style("font-weight", 300)
    .style("font-size", 10)

toggler.append("text")
    .text("% Minority")
    .attr("x", 145)
    .attr("y", yPos - 43)
    .style("font-weight", 300)
    .style("font-size", 10)

toggler.append("rect") //CI key
    .attr("x", 55)
    .attr("y", yPos - 40)
    .attr("width", 50)
    .attr("height", 10)
    .style("fill", "black")
    .style("fill-opacity", .3)

toggler.append("path") //path for CI key
    .attr("d", "M 53 27 L 53 30 L 108 30 L 108 27 L 108 30 L 81 30 L 81 35 L 140 35")
    .style("stroke", "black")
    .style("stroke-width", 1)

toggler.append("rect") //% key
    .attr("x", 80)
    .attr("y", yPos - 40)
    .attr("width", 2)
    .attr("height", 10)
    .style("fill", "black")
    .style("fill-opacity", 1)

toggler.append("path")
    .attr("d", "M 81 12 L 81 8 L 140 8")
    .style("stroke", "black")
    .style("stroke-width", 1)

//Graphing
  toggler.selectAll(".letterLabel")
    .data(source)
    .enter()
    .append("text")
    .text(function(d) { return d.Route})
    .attr("class", function(d) { return "route" + d.Route + " letterName selection"})
    .attr("x", 15)
    .attr("y", function(d) { return yScale(d.Route) + 10})
    .style("fill", "black")
    .style("font-weight", 300)

//graph DI coverage
  toggler.append("rect")
    .attr("class", "affected")
    .attr("x", xScale(0))
    .attr("y", 105)
    .attr("width", xScaleLength(47.5))
    .attr("height", height - 55)
    .style("fill", "black")
    .style("fill-opacity", .05)

toggler.call(tip);

//graph confidence intervals (grey)
  toggler.selectAll(".minorityCI")
    .data(source)
    .enter()
    .append("rect")
      .attr("class", function(d) { return "route" + d.Route + " minorityChart";})
      .attr("x", function(d) { return xScale(d.MIN_90pct_Lower); })
      .attr("y", function(d) { return yScale(d.Route); })
      .attr("height", 10)
      .attr("width", function(d) { return xScaleLength(d.MIN_90pct_Upper - d.MIN_90pct_Lower); })
      .style("fill-opacity", .3)
      .style("fill", function(d) { return colorScale(d.Minority_Percent/100)})
      .style("stroke-width", 1)
      .style("stroke", "none")
      .on("mouseenter", function(d) { tip.show(d); })
      .on("mouseout", function(d) { tip.hide(d); })

//graph minority percentage (black bar)
  toggler.selectAll(".minorityPercent")
    .data(source)
    .enter()
    .append("rect")
      .attr("class", function(d) { return "route" + d.Route + " minorityChart";})
      .attr("x", function(d) { return xScale(d.Minority_Percent); })
      .attr("y", function(d) { return yScale(d.Route); })
      .attr("height", 10)
      .attr("width", 2)
      .style("fill-opacity", 1)
      .style("fill", function(d) { return colorScale(d.Minority_Percent/100)})
      .on("mouseenter", function(d) { tip.show(d); })
      .on("mouseout", function(d) { tip.hide(d); })
  // parameters
var margin = 20,
  width = $("#slider").width();
  height = 40;


// scale function
ratioScale = d3.scale.linear()
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
  .attr("d", "M 0 -15 V 15")
  .style("stroke-width", 5)

handle.append('text')
  .text("1.0")
  .attr("transform", "translate(" + (-18) + " ," + (height / 2 - 35) + ")");

slider
  .call(brush.event)

slider.append("rect")
    .attr("class", "yourChange")
    .attr("x", ratioScale(0))
    .attr("y", 0)
    .attr("width", 5)
    .attr("height", 25)
    .style("fill", "#EE4000")
    .style("fill-opacity", 1)

function brushed() {
  var value = brush.extent()[0];
  brushValue = brush.extent()[0];

  if (d3.event.sourceEvent) { // not a programmatic event
    value = ratioScale.invert(d3.mouse(this)[0]);
    brush.extent([value, value]);
  }

  handle.attr("transform", "translate(" + ratioScale(value) + ",0)")
  handle.select('text').text(d3.round(value, 2));

  d3.select("#sliderRatio").text(d3.round(value, 2));
  d3.select('.affected')
      .attr("width", xScaleLength(value * 47.5))

  //Update front-end numbers
  var diRatio = (100 * minTotal / (popTotal + .01))/47.5;

  d3.selectAll('#isThereImpact')
    .text(function() { 
      if (diRatio < brushValue) { return "No Disparate Impact" }
      else { return "Disparate Impact" }
    })
    

}//end function brushed()



}

CTPS.demoApp.generateSavings = function(source) {

  var routes = [];

  source.forEach(function(i){
      routes.push(i.Route);
      i.Wdky_Riders = +i.Wdky_Riders;
      i.Minority_Percent = +i.Minority_Percent;
  })

  var height = 550; 

  var toggler = d3.select("#tableRows").append("svg")
                  .attr("width", "100%")
                  .attr("height", height)
                  .style("overflow", "visible")

  var w = $("#tableRows").width();


  var xScale = d3.scale.linear()
              .domain([0, 100])
              .range([120, w - 30])

  var xScaleLength = d3.scale.linear()
                    .domain([0, 100])
                    .range([0, w - 150])

  var yScale = d3.scale.ordinal()
              .domain(routes)
              .rangePoints([55, height - 15])

  var yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(-w + 100, 0, 0);
  
  var xLabel = 30;
  var yLabel = 15;
  //Labelling
   toggler.append("text")
    .text("Route")
    .attr("x", xLabel + 3).attr("y", yLabel + 8)
    .style("text-anchor", "end").style("font-size", 12).style("font-weight", 700)

  toggler.append("text")
    .text("Total")
    .attr("x", xLabel + 70).attr("y", yLabel)
    .style("text-anchor", "end").style("font-size", 12).style("font-weight", 700)

  toggler.append("text")
    .text("Ridership")
    .attr("x", xLabel + 70).attr("y", yLabel + 15)
    .style("text-anchor", "end").style("font-size", 12).style("font-weight", 700)

  toggler.append("text")
    .text("Percent")
    .attr("x", xLabel + 140).attr("y", yLabel - 15)
    .style("text-anchor", "end").style("font-size", 12).style("font-weight", 700)

  toggler.append("text")
    .text("Minority")
    .attr("x", xLabel + 140).attr("y", yLabel)
    .style("text-anchor", "end").style("font-size", 12).style("font-weight", 700)

  toggler.append("text")
    .text("Ridership")
    .attr("x", xLabel + 140).attr("y", yLabel + 15)
    .style("text-anchor", "end").style("font-size", 12).style("font-weight", 700)

  toggler.append("text")
    .text("Existing")
    .attr("x", xLabel + 200).attr("y", yLabel - 15)
    .style("text-anchor", "end").style("font-size", 12).style("font-weight", 700)

  toggler.append("text")
    .text("Service")
    .attr("x", xLabel + 200).attr("y", yLabel)
    .style("text-anchor", "end").style("font-size", 12).style("font-weight", 700)

   toggler.append("text")
    .text("Hours")
    .attr("x", xLabel + 200).attr("y", yLabel + 15)
    .style("text-anchor", "end").style("font-size", 12).style("font-weight", 700)

  toggler.append("text")
    .text("Selected")
    .attr("x", xLabel + 260).attr("y", yLabel - 15)
    .style("text-anchor", "end").style("font-size", 12).style("font-weight", 700)

  toggler.append("text")
    .text("Service")
    .attr("x", xLabel + 260).attr("y", yLabel)
    .style("text-anchor", "end").style("font-size", 12).style("font-weight", 700)

   toggler.append("text")
    .text("Hours")
    .attr("x", xLabel + 260).attr("y", yLabel + 15)
    .style("text-anchor", "end").style("font-size", 12).style("font-weight", 700)


  toggler.append("text")
    .text("Change in Service Hours")
    .attr("x", xLabel + 500).attr("y", yLabel - 10)
    .style("text-anchor", "end").style("font-size", 12).style("font-weight", 700)

  //Filling in the table
  toggler.selectAll(".letterName")
    .data(source)
    .enter()
    .append("text")
      .attr("class", function(d) { return "route" + d.Route + " letterName selection"})
      .attr("x", 15)
      .attr("y", function(d) { return yScale(d.Route); })
      .attr("fill", "black")
      .text(function(d) { return d.Route; })
      .style("text-anchor", "middle")


  toggler.selectAll(".numRiders")
    .data(source)
    .enter()
    .append("text")
      .attr("class", function(d) { return "route" + d.Route + " numRiders selection"})
      .attr("x", 100)
      .attr("y", function(d) { return yScale(d.Route); })
      .attr("fill", "black")
      .text(function(d) { return comma(d.Wdky_Riders); })
      .style("text-anchor", "end")

  toggler.selectAll(".minPercent")
    .data(source)
    .enter()
    .append("text")
      .attr("class", function(d) { return "route" + d.Route + " minPercent selection"})
      .attr("x", 165)
      .attr("y", function(d) { return yScale(d.Route); })
      .attr("fill", "black")
      .text(function(d) { return comma(d.Minority_Percent) + "%"; })
      .style("text-anchor", "end")

  toggler.selectAll(".vrhTime")
    .data(source)
    .enter()
    .append("text")
      .attr("class", function(d) { return "route" + d.Route + " vrhTime selection"})
      .attr("x", 225)
      .attr("y", function(d) { return yScale(d.Route); })
      .attr("fill", "black")
      .text(function(d) { return d.TotalHours; })
      .style("text-anchor", "end")

  vrhScale = d3.scale.ordinal()
              .domain([-100, -30, -20, -10, 0, 10, 20, 30])
              .rangePoints([310, w - 30])

  vrhScaleLabels = d3.scale.ordinal()
              .domain(["-100%", "-30%","-20%","-10%","0%","+10%","+20%","+30%",])
              .rangePoints([310, w - 30])

  var vrhScaleLength = d3.scale.linear()
                    .domain([0, 60])
                    .range([0, w - 230])

  var vrhAxis = d3.svg.axis().scale(vrhScaleLabels).orient("top");

  toggler.append("g").attr("class", "x axis")
    .attr("transform", "translate(12, 30)")
    .call(vrhAxis)
    .selectAll("text")
      .style("font-size", 8)

  toggler.append("line")
    .attr("x1", (vrhScale(0) + vrhScale(10))/2 )
    .attr("x2", (vrhScale(0) + vrhScale(10))/2)
    .attr("y1", yScale("A"))
    .attr("y2", yScale("Z"))
    .style("stroke-dasharray", "2, 1")
    .style("stroke", "black")

  var increments = [-100, -30, -20, -10, 10, 20, 30];
  increments.forEach(function(i){
    toggler.selectAll("vrhSlider")
      .data(source)
      .enter()
      .append("rect")
        .attr("class", function(d) {  
            return "route" + d.Route + " " + "percent" + i + " vrhSlider selection"
        })
        .attr("x", vrhScale(i))
        .attr("y", function(d) { return yScale(d.Route) - 8; })
        .style("fill", function() { 
          if (i == -100) { return  "red" } 
          else { return "black";}})
        .style("stroke", "EE4000")
        .style("stroke-width", 0)
        .attr("width", 28)
        .attr("height", 10)
        .style("fill-opacity", function() { 
          if (i == -100) { return .8 } 
          else { return 1 - 2.5 * Math.abs((i+1)/100);}})

    toggler.selectAll("vrhText")
      .data(source)
      .enter()
      .append("text")
        .attr("class", function(d) { 
            return "route" + d.Route + " " + "percent" + i + " vrhSlider selection";
        })
        .attr("x", 290)
        .attr("y", function(d) { return yScale(d.Route); })
        .style("fill", "none")
        .text(function(d) {  return d3.round(d.TotalHours - (- d.TotalHours * i / 100)); })
        .style("font-size", 14)
        .style("text-anchor", "end")
        .style("font-weight", 700)
        .style("font-family", "Open Sans")
  })


    
}



