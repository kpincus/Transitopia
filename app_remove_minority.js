var CTPS = {};
CTPS.demoApp = {};


var minTotal = 0; 
var popTotal = 0; 
var vrhSavings = 0; 
var vrhSavingsTotal = 0; 
var globalVRH = 0; 
// new below
var minTotalBen = 0;
var popTotalBen = 0;
var minTotalBur = 0;
var popTotalBur = 0;


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
	
	
////////// start of scenario /////////////////

	// d3.selectAll("#testScenario").on("click", function() {	 // changed
	 
		var routes = ["routeK", "routeF", "routeO", "routeS"];
		var changes = ["percent-100", "percent20", "percent20", "percent20"];
	 
	 for (var i = 0; i < 4; i++) { 
	 
		//this.												// changed
		routeName = routes[i];	//"routeA";					// changed
		//this.												// changed
		routeChange = changes[i];	//"percent30";			// changed
        var letterRef = routeName.split("e")[1];
        var percentRef = +routeChange.split("t")[1];

        if ( $(this).hasClass("clicked") == false) {
          //highlight appropriate bus routes on map and on text
          d3.selectAll("." + routeName).filter("text").filter(".numRiders, .minPercent, .letterName, .vrhTime")
            .style("font-weight", 700)
            .style("fill", "rgb(182,0,141)")
            .classed("clicked", true);

          d3.selectAll("." + routeName).filter(".routes")
            .style("stroke", "rgb(182,0,141)")
            .classed("clicked", true);

          d3.selectAll("." + routeName).filter(".minorityChart")
              .style("fill", "rgb(182,0,141)")
              .classed("clicked", true);

        //  var letterRef = routeName.split("e")[1];

// kp: calc of affected minority percent if rect not previously selected		  
		  results[0].forEach(function(i){
            if (i.Route == letterRef) { 
			
				if (i.Selected != 0){
					minTotal -= i.Wdky_Riders * (i.Minority_Percent / 100) * i.Selected; // i.Selected is the key!
					popTotal -= i.Wdky_Riders * i.Selected;
				}	  
				minTotal += i.Wdky_Riders * (i.Minority_Percent / 100) * i.TotalHours * (percentRef / 100);
                popTotal += i.Wdky_Riders * i.TotalHours * percentRef / 100;
						
				if (i.Selected < 0) {	  
					  minTotalBur -= i.Wdky_Riders * (i.Minority_Percent / 100) * i.Selected;
					  popTotalBur -= i.Wdky_Riders * i.Selected; 
				}
				if (i.Selected > 0) {
					  minTotalBen -= i.Wdky_Riders * (i.Minority_Percent / 100) * i.Selected;
					  popTotalBen -= i.Wdky_Riders * i.Selected; 
				}
				
				if (percentRef < 0) { 
					minTotalBur += i.Wdky_Riders * (i.Minority_Percent / 100) * i.TotalHours * (percentRef / 100);
					popTotalBur += i.Wdky_Riders * i.TotalHours * percentRef / 100;  	
				}
				if (percentRef > 0) {
					minTotalBen += i.Wdky_Riders * (i.Minority_Percent / 100) * i.TotalHours * (percentRef / 100);
					popTotalBen += i.Wdky_Riders * i.TotalHours * percentRef / 100;	
				}           
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
              .style("fill", "rgb(182,0,141)")

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

// kp: calc of affected minority percent if rect previously selected		  
          results[0].forEach(function(i){
            if (i.Route == letterRef) {
				
                minTotal -= i.Wdky_Riders * (i.Minority_Percent / 100) * i.TotalHours * (percentRef / 100);
			    popTotal -= i.Wdky_Riders * i.TotalHours * percentRef / 100;
				
				if (percentRef < 0) {
					minTotalBur -= i.Wdky_Riders * (i.Minority_Percent / 100) * i.TotalHours * (percentRef / 100);
					popTotalBur -= i.Wdky_Riders * i.TotalHours * percentRef / 100;
				}
				if (percentRef > 0) {
					minTotalBen -= i.Wdky_Riders * (i.Minority_Percent / 100) * i.TotalHours * (percentRef / 100);
					popTotalBen -= i.Wdky_Riders * i.TotalHours * percentRef / 100;		
				}				
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
          }})

          d3.selectAll("." + routeName).filter(".vrhSlider").filter("." + routeChange)
                .classed("clicked", false)
        }
        
        d3.select("#vrhTotSavings").text(d3.round(100 * vrhSavings / globalVRH, 2) + "%")
        d3.select("#vrhTotSavings-dollars").text(d3.round(vrhSavings, 2) + " hours")

      //Update front-end numbers
	  	  
        var diRatio = (100 * minTotal / (popTotal + .01))/41.9; 
		
		//new
		var diRatioBur = (100 * minTotalBur / (popTotalBur + .01))/41.9;
		var diRatioBen = (100 * minTotalBen / (popTotalBen + .01))/41.9;

        d3.selectAll(".yourChange")
          .attr("x", ratioScale(diRatio));
		
        d3.selectAll('#calculatedRatio').text(d3.round(diRatio, 2).toFixed(2));
		 
		// new, just updated this section for new calculations
		d3.selectAll('#calculatedRatioBur')
		  .text(function() {
			  if (diRatioBur == 0) {return "N/A"} //needed?
			  else if (diRatio < 0) {return d3.round(diRatioBur, 2).toFixed(2)}
			  else if (diRatio > 0 && minTotal < 0) {return d3.round(diRatio, 2).toFixed(2)}
			  else { return "N/A"}
		  })
		  
		d3.selectAll('#calculatedRatioBen')
		  .text(function() {
			  if (diRatioBen == 0) {return "N/A"}
			  else if (diRatio < 0) {return d3.round(diRatioBen, 2).toFixed(2)}
			  else if (diRatio > 0 && minTotal > 0) { return d3.round(diRatio, 2).toFixed(2)}
			  else { return "N/A"}
		  })		
		  
		d3.selectAll('#isThereBurden')
          .text(function() { 
		    if (diRatioBur == 0) {return "N/A"}
			else if (diRatio < 0 && diRatioBur < brushValue) {return "No Disparate Burden"}
            else if (diRatio > 0 && minTotal < 0 && diRatio < brushValue) { return "No Disparate Burden" }
			else if (diRatio > 0 && minTotal > 0) {return "N/A"}
            else { return "Disparate Burden" }
          })  
		  
		d3.selectAll('#isThereBenefit')
          .text(function() { 
		    if (diRatioBen == 0) {return "N/A"}
			else if (diRatio < 0 && diRatioBen > 2-brushValue) {return "No Disparate Benefit"}
            else if (diRatio > 0 && minTotal > 0 && diRatio > (2-brushValue)) { return "No Disparate Benefit" }
			else if (diRatio > 0 && minTotal < 0) {return "N/A"}
            else { return "Disparate Benefit" }
          })   
	// }});
	 }; 

/////////// end of scenario //////////////////


    //highlight rectangles
    d3.selectAll(".selection").on("mouseover", function() { 
      if($(this).hasClass("clicked") == false){ 
            var routeName = this.getAttribute("class").split(" ")[0];
            
            d3.selectAll("." + routeName).filter("text").filter(".numRiders, .minPercent, .letterName, .vrhTime")
              .style("font-weight", 700)
              .style("fill", "rgb(182,0,141)") // this was a hashtag

            d3.selectAll("." + routeName).filter(".routes")
              .style("stroke", "rgb(182,0,141)")

            d3.selectAll("." + routeName).filter(".minorityChart")
              .style("fill", "rgb(182,0,141)")

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
          .style("fill", "rgb(182,0,141)")
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
            .style("fill", "rgb(182,0,141)")
            .classed("clicked", true);

          d3.selectAll("." + routeName).filter(".routes")
            .style("stroke", "rgb(182,0,141)")
            .classed("clicked", true);

          d3.selectAll("." + routeName).filter(".minorityChart")
              .style("fill", "rgb(182,0,141)")
              .classed("clicked", true);

          var letterRef = routeName.split("e")[1];

// kp: calc of affected minority percent if rect not previously selected		  
		  results[0].forEach(function(i){
            if (i.Route == letterRef) { 
			
				if (i.Selected != 0){
					minTotal -= i.Wdky_Riders * (i.Minority_Percent / 100) * i.Selected; // i.Selected is the key!
					popTotal -= i.Wdky_Riders * i.Selected;
				}	  
				minTotal += i.Wdky_Riders * (i.Minority_Percent / 100) * i.TotalHours * (percentRef / 100);
                popTotal += i.Wdky_Riders * i.TotalHours * percentRef / 100;
						
				if (i.Selected < 0) {	  
					  minTotalBur -= i.Wdky_Riders * (i.Minority_Percent / 100) * i.Selected;
					  popTotalBur -= i.Wdky_Riders * i.Selected; 
				}
				if (i.Selected > 0) {
					  minTotalBen -= i.Wdky_Riders * (i.Minority_Percent / 100) * i.Selected;
					  popTotalBen -= i.Wdky_Riders * i.Selected; 
				}
				
				if (percentRef < 0) { 
					minTotalBur += i.Wdky_Riders * (i.Minority_Percent / 100) * i.TotalHours * (percentRef / 100);
					popTotalBur += i.Wdky_Riders * i.TotalHours * percentRef / 100;  	
				}
				if (percentRef > 0) {
					minTotalBen += i.Wdky_Riders * (i.Minority_Percent / 100) * i.TotalHours * (percentRef / 100);
					popTotalBen += i.Wdky_Riders * i.TotalHours * percentRef / 100;	
				}           
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
              .style("fill", "rgb(182,0,141)")

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

// kp: calc of affected minority percent if rect previously selected		  
          results[0].forEach(function(i){
            if (i.Route == letterRef) {
				
                minTotal -= i.Wdky_Riders * (i.Minority_Percent / 100) * i.TotalHours * (percentRef / 100);
			    popTotal -= i.Wdky_Riders * i.TotalHours * percentRef / 100;
				
				if (percentRef < 0) {
					minTotalBur -= i.Wdky_Riders * (i.Minority_Percent / 100) * i.TotalHours * (percentRef / 100);
					popTotalBur -= i.Wdky_Riders * i.TotalHours * percentRef / 100;
				}
				if (percentRef > 0) {
					minTotalBen -= i.Wdky_Riders * (i.Minority_Percent / 100) * i.TotalHours * (percentRef / 100);
					popTotalBen -= i.Wdky_Riders * i.TotalHours * percentRef / 100;		
				}				
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
          }})

          d3.selectAll("." + routeName).filter(".vrhSlider").filter("." + routeChange)
                .classed("clicked", false)
        }
        
        d3.select("#vrhTotSavings").text(d3.round(100 * vrhSavings / globalVRH, 2) + "%")
        d3.select("#vrhTotSavings-dollars").text(d3.round(vrhSavings, 2) + " hours")

      //Update front-end numbers
	  	  
        var diRatio = (100 * minTotal / (popTotal + .01))/41.9; 
		
		//new
		var diRatioBur = (100 * minTotalBur / (popTotalBur + .01))/41.9;
		var diRatioBen = (100 * minTotalBen / (popTotalBen + .01))/41.9;

        d3.selectAll(".yourChange")
          .attr("x", ratioScale(diRatio));
		
        d3.selectAll('#calculatedRatio').text(d3.round(diRatio, 2).toFixed(2));
		 
		// new, just updated this section for new calculations
		d3.selectAll('#calculatedRatioBur')
		  .text(function() {
			  if (diRatioBur == 0) {return "N/A"} //needed?
			  else if (diRatio < 0) {return d3.round(diRatioBur, 2).toFixed(2)}
			  else if (diRatio > 0 && minTotal < 0) {return d3.round(diRatio, 2).toFixed(2)}
			  else { return "N/A"}
		  })
		  
		d3.selectAll('#calculatedRatioBen')
		  .text(function() {
			  if (diRatioBen == 0) {return "N/A"}
			  else if (diRatio < 0) {return d3.round(diRatioBen, 2).toFixed(2)}
			  else if (diRatio > 0 && minTotal > 0) { return d3.round(diRatio, 2).toFixed(2)}
			  else { return "N/A"}
		  })		
		  
		d3.selectAll('#isThereBurden')
          .text(function() { 
		    if (diRatioBur == 0) {return "N/A"}
			else if (diRatio < 0 && diRatioBur < brushValue) {return "No Disparate Burden"}
            else if (diRatio > 0 && minTotal < 0 && diRatio < brushValue) { return "No Disparate Burden" }
			else if (diRatio > 0 && minTotal > 0) {return "N/A"}
            else { return "Disparate Burden" }
          })  
		  
		d3.selectAll('#isThereBenefit')
          .text(function() { 
		    if (diRatioBen == 0) {return "N/A"}
			else if (diRatio < 0 && diRatioBen > 2-brushValue) {return "No Disparate Benefit"}
            else if (diRatio > 0 && minTotal > 0 && diRatio > (2-brushValue)) { return "No Disparate Benefit" }
			else if (diRatio > 0 && minTotal < 0) {return "N/A"}
            else { return "Disparate Benefit" }
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
    .parallels([40 + 43 / 60, 41 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
    .scale([60000]) // N.B. The scale and translation vector were determined empirically.
    .translate([-170,2100]);
    
  var geoPath = d3.geo.path().projection(projection); 

  var tractMap = d3.select("#map").append("svg")
                .attr("width", "95%") //480) // "100%")
                .attr("height", 552)

  tractMap.call(tipRoute);

  tractMap.selectAll(".tracts")
      .data(topojson.feature(tracts, tracts.objects.tract_census_2).features)
      .enter()
      .append("path")
        .attr("class", function(d) { return "t" + d.properties.TRACT; })
        .attr("d", function(d) { return geoPath(d); })
        .style("fill", "royalblue") /*change map colors*/
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
    /*tractMap.append("text")
      .style("font-weight", 700)
      .attr("x", xPos).attr("y", yPos - 12)
      .text("KEY");*/
    tractMap.append("text")
      .style("font-weight", 700)
      .attr("x", xPos).attr("y", yPos - 22)
      .text("Minority Population");

    //text and colors
    tractMap.append("rect")
      .style("fill", "royalblue").style("stroke", "none").style("opacity", .39)
      .attr("x", xPos).attr("y", yPos - 12).attr("height", "7px").attr("width", height/35);
    tractMap.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos - 5)
      .text("15%");
    tractMap.append("rect")
      .style("fill", "royalblue").style("stroke", "none").style("opacity", .55)
      .attr("x", xPos).attr("y", yPos + 3).attr("height", "7px").attr("width", height/35);
    tractMap.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 10)
      .text("30%");
    tractMap.append("rect")
      .style("fill", "royalblue").style("stroke", "none").style("opacity", .67)
      .attr("x", xPos).attr("y", yPos + 18).attr("height", "7px").attr("width", height/35);
    tractMap.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 25)
      .text("45%");
    tractMap.append("rect")
      .style("fill", "royalblue").style("stroke", "none").style("opacity", .76)
      .attr("x", xPos).attr("y", yPos + 33).attr("height", "7px").attr("width", height/35);
    tractMap.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 40)
      .text("60%");
    tractMap.append("rect")
      .style("fill", "royalblue").style("stroke", "none").style("opacity", .85)
      .attr("x", xPos).attr("y", yPos + 48).attr("height", "7px").attr("width", height/35);
    tractMap.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 55)
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

	  
// parameters
var margin = 10,
  width = $("#slider").width()/1.15; //change width here
  height = 80;


// scale function
ratioScale = d3.scale.linear()
  .domain([.7, 1.3])
  .range([0, width - 4 * margin]) // changed 2 to a 4
  .clamp(true);


// initial value
var startingValue = d3.round(1.0, 2) ;


// defines brush
brush = d3.svg.brush()
  .x(ratioScale)
  .extent([startingValue, startingValue])
  .on("brush", brushed);

var svg = d3.select("#slider").append("svg")
  .attr("width", width + margin * 6) 
  .attr("height", height + margin * 6)
  .append("g")
  // classic transform to position g
  .attr("transform", "translate(" + 3 * margin + "," + 5 * margin + ")"); //added first 2

svg.append("g")
  .attr("class", "ratio")
  .attr("transform", "translate(0," + (height / 2 - 10) + ")")
.call(d3.svg.axis()
  .scale(ratioScale)
  .orient("bottom")
  .ticks(0))
  //.tickValues([.7, 1.3]))
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
  .attr("transform", "translate(0," + (height / 2 - 19)+ ")")
  .attr("d", "M 0 -8 V 15")
  .style("stroke-width", 5)

handle.append('text')
  .text("1.0")
  .attr("transform", "translate(" + (-18) + " ," + (height / 2 - 35) + ")");
  
  
handle.append('text')
  .text("Burden")
  .attr("transform", "translate(" + (-30) + " ," + (height / 2 - 55) + ")");
  
  
// second handlevar handle = slider.append("g")
var handle2 = slider.append("g")
  .attr("class", "handle")

handle2.append("path")
  .attr("transform", "translate(0," + (height/2 - 1)+ ")")
  .attr("d", "M 0 -10 V 15")
  .style("stroke-width", 5)

handle2.append('text')
  .text("1.0")
  .attr("transform", "translate(" + (-18) + " ," + (height / 2 + 32) + ")");
  
handle2.append('text')
  .text("Benefit")
  .attr("transform", "translate(" + (-30) + " ," + (height / 2 + 50) + ")");
  
  
 
slider
  .call(brush.event)

/*
slider.append("rect")
    .attr("class", "yourChange")
    .attr("x", ratioScale(0))
    .attr("y", 0)
    .attr("width", 5)
    .attr("height", 25)
    .style("fill", "#"rgb(182,0,141)"")
    .style("fill-opacity", 1)
*/

function brushed() {
  var value = brush.extent()[0];
  brushValue = brush.extent()[0];

  if (d3.event.sourceEvent) { // not a programmatic event
    if (ratioScale.invert(d3.mouse(this)[0]) < 1) {
		value = 1; //ratioScale.invert(1);
		// value = 2-ratioScale.invert(d3.mouse(this)[0]); 
	}
	else{
		value = ratioScale.invert(d3.mouse(this)[0]);
	}
    brush.extent([value, value]);
  }

  handle.attr("transform", "translate(" + ratioScale(value) + ",0)")
  handle.select('text').text(d3.round(value, 2).toFixed(2));
  
  // second handle
  handle2.attr("transform", "translate(" + ratioScale(2-value) + ",0)")
  handle2.select('text').text(d3.round(2-value, 2).toFixed(2));
  
 
  d3.select("#sliderRatio").text(d3.round(value, 2).toFixed(2));
  d3.select("#sliderRatioCopy").text(d3.round(value, 2).toFixed(2));
  d3.select("#sliderRatioOpp").text(d3.round(2-value, 2).toFixed(2));
  d3.select('.affected')
      .attr("width", xScaleLength(value * 41.9))

  //Update front-end numbers
  var diRatio = (100 * minTotal / (popTotal + .01))/41.9;
  
  //added this here
  var diRatioBur = (100 * minTotalBur / (popTotalBur + .01))/41.9;
  var diRatioBen = (100 * minTotalBen / (popTotalBen + .01))/41.9;
  
  // copied from above
  
	d3.selectAll('#calculatedRatioBur')
	  .text(function() {
		  if (diRatioBur == 0) {return "N/A"} //needed?
		  else if (diRatio < 0) {return d3.round(diRatioBur, 2).toFixed(2)}
		  else if (diRatio > 0, minTotal < 0) {return d3.round(diRatio, 2).toFixed(2)}
		  else { return "N/A"}
	  })
	  
	d3.selectAll('#calculatedRatioBen')
	  .text(function() {
		  if (diRatioBen == 0) {return "N/A"}
		  else if (diRatio < 0) {return d3.round(diRatioBen, 2).toFixed(2)}
		  else if (diRatio > 0, minTotal > 0) { return d3.round(diRatio, 2).toFixed(2)}
		  else { return "N/A"}
	  })	
		  
  d3.selectAll('#isThereImpact')
    .text(function() { 
      if (diRatio < brushValue) { return "No Disparate Impact" }
      else { return "Disparate Impact" }
    })

	d3.selectAll('#isThereBurden')
	  .text(function() { 
		if (diRatioBur == 0) {return "N/A"}
		else if (diRatio < 0, diRatioBur < brushValue) {return "No Disparate Burden"}
		else if (diRatio > 0, diRatio < brushValue) { return "No Disparate Burden" }
		else if (diRatio > 0 && minTotal > 0) {return "N/A"}
		else { return "Disparate Burden" }
	  })  
	  
	d3.selectAll('#isThereBenefit')
	  .text(function() { 
		if (diRatioBen == 0) {return "N/A"}
		else if (diRatio < 0, diRatioBen > 2-brushValue) {return "No Disparate Benefit"}
		else if (diRatio > 0, minTotal > 0, diRatio > (2-brushValue)) { return "No Disparate Benefit" }
		else if (diRatio > 0 && minTotal < 0) {return "N/A"}
		else { return "Disparate Benefit" }
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
    .attr("x", xLabel + 3).attr("y", yLabel + 15)
    .style("text-anchor", "end").style("font-size", 12).style("font-weight", 700)

  toggler.append("text")
    .text("Total")
    .attr("x", xLabel + 85).attr("y", yLabel)
    .style("text-anchor", "end").style("font-size", 12).style("font-weight", 700)

  toggler.append("text")
    .text("Ridership")
    .attr("x", xLabel + 85).attr("y", yLabel + 15)
    .style("text-anchor", "end").style("font-size", 12).style("font-weight", 700)

  toggler.append("text")
    .text("Percent")
    .attr("x", xLabel + 165).attr("y", yLabel - 15)
    .style("text-anchor", "end").style("font-size", 12).style("font-weight", 700)

  toggler.append("text")
    .text("Minority")
    .attr("x", xLabel + 165).attr("y", yLabel)
    .style("text-anchor", "end").style("font-size", 12).style("font-weight", 700)

  toggler.append("text")
    .text("Ridership")
    .attr("x", xLabel + 165).attr("y", yLabel + 15)
    .style("text-anchor", "end").style("font-size", 12).style("font-weight", 700)

  toggler.append("text")
    .text("Existing")
    .attr("x", xLabel + 240).attr("y", yLabel - 15)
    .style("text-anchor", "end").style("font-size", 12).style("font-weight", 700)

  toggler.append("text")
    .text("Service")
    .attr("x", xLabel + 240).attr("y", yLabel)
    .style("text-anchor", "end").style("font-size", 12).style("font-weight", 700)

   toggler.append("text")
    .text("Hours")
    .attr("x", xLabel + 240).attr("y", yLabel + 15)
    .style("text-anchor", "end").style("font-size", 12).style("font-weight", 700)

  toggler.append("text")
    .text("Change in")
    .attr("x", xLabel + 315).attr("y", yLabel - 15)
    .style("text-anchor", "end").style("font-size", 12).style("font-weight", 700)

  toggler.append("text")
    .text("Service")
    .attr("x", xLabel + 315).attr("y", yLabel)
    .style("text-anchor", "end").style("font-size", 12).style("font-weight", 700)

   toggler.append("text")
    .text("Hours")
    .attr("x", xLabel + 315).attr("y", yLabel + 15)
    .style("text-anchor", "end").style("font-size", 12).style("font-weight", 700)


  toggler.append("text")
    .text("Change in Service Hours")
    .attr("x", ((w - 30 - 375) / (7/4)) + 380).attr("y", yLabel - 15)
    .style("text-anchor", "middle").style("font-size", 12).style("font-weight", 700)

  //Filling in the table
  toggler.selectAll(".letterName")
    .data(source)
    .enter()
    .append("text")
      .attr("class", function(d) { return "route" + d.Route + " letterName selection"}) // SETS CLASS HERE BASED ON CSV DATA!
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
      .attr("x", 115)
      .attr("y", function(d) { return yScale(d.Route); })
      .attr("fill", "black")
      .text(function(d) { return comma(d.Wdky_Riders); })
      .style("text-anchor", "end")

  toggler.selectAll(".minPercent")
    .data(source)
    .enter()
    .append("text")
      .attr("class", function(d) { return "route" + d.Route + " minPercent selection"})
      .attr("x", 195)
      .attr("y", function(d) { return yScale(d.Route); })
      .attr("fill", "black")
      .text(function(d) { return comma(d.Minority_Percent) + "%"; })
      .style("text-anchor", "end")

  toggler.selectAll(".vrhTime")
    .data(source)
    .enter()
    .append("text")
      .attr("class", function(d) { return "route" + d.Route + " vrhTime selection"})
      .attr("x", 270)
      .attr("y", function(d) { return yScale(d.Route); })
      .attr("fill", "black")
      .text(function(d) { return d.TotalHours; })
      .style("text-anchor", "end")

  vrhScale = d3.scale.ordinal()
              .domain([-100, -30, -20, -10, 0, 10, 20, 30])
              .rangePoints([375, w - 30])

  vrhScaleLabels = d3.scale.ordinal()
              .domain(["-100%", "-30%","-20%","-10%","0%","+10%","+20%","+30%",])
              .rangePoints([375, w - 30])

  var vrhScaleLength = d3.scale.linear()
                    .domain([0, 60])
                    .range([0, w - 230])

  var vrhAxis = d3.svg.axis().scale(vrhScaleLabels).orient("top");

  toggler.append("g").attr("class", "x axis")
    .attr("transform", "translate(12, 30)")
    .call(vrhAxis)
    .selectAll("text")
      .style("font-size", 12)

  toggler.append("line")
    .attr("x1", (w - 30 - 375) / (7/4) + 387) 	//(vrhScale(0) + vrhScale(10))/2 - 25)
    .attr("x2", (w - 30 - 375) / (7/4) + 387)	//(vrhScale(0) + vrhScale(10))/2 - 25)
    .attr("y1", yScale("A") - 25)
    .attr("y2", yScale("Z") + 5)
    .style("stroke-dasharray", "2, 1")
    .style("stroke", "gray")

  var increments = [-100, -30, -20, -10, 10, 20, 30]; // APPENDS DATA BELOW!
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
          if (i == -100) { return  "orange" } // "rgb(255,198,39)" } 
          else { return "black";}})
        .style("stroke", "rgb(182,0,141)")
        .style("stroke-width", 0)
        .attr("width", 28)
        .attr("height", 10)
        .style("fill-opacity", function() { 
          if (i == -100) { return .8 } 
          else { return 2.5 * Math.abs((i+1)/100);}})

    toggler.selectAll("vrhText")
      .data(source)
      .enter()
      .append("text")
        .attr("class", function(d) { 
            return "route" + d.Route + " " + "percent" + i + " vrhSlider selection";
        })
        .attr("x", 345)
        .attr("y", function(d) { return yScale(d.Route); })
        .style("fill", "none")
        .text(function(d) {  return d3.round((d.TotalHours * i / 100)); })
        .style("font-size", 14)
        .style("text-anchor", "end")
        .style("font-weight", 700)
        .style("font-family", "Open Sans")
  })
  
 } 