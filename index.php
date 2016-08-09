<!DOCTYPE html>
<head lang="en">
<meta charset="utf-8">
<title>Transitopia</title>

<!-- D3 Library --> 
<script src="https://d3js.org/d3.v3.min.js" charset="utf-8"></script>


<!-- Queue.JS --> <script src="http://d3js.org/queue.v1.min.js"></script>
<!-- Tooltip --> <script src="http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"></script>
<!-- TopoJSON --> <script src="https://cdnjs.cloudflare.com/ajax/libs/topojson/1.6.20/topojson.min.js"></script>

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css?family=Open+Sans:100,300,700|Raleway:400,700" rel="stylesheet">

<!-- Jquery -->
<script src="https://code.jquery.com/jquery-3.0.0.min.js"   integrity="sha256-JmvOoLtYsmqlsWxa7mDSLMwa6dZ9rrIdtrrVYRnDRH0="   crossorigin="anonymous"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>

<!-- Bootstrap-->
<script src="bootstrap.min.js"></script>
<link rel="stylesheet" href="bootstrap.min.css"/>
<!-- Custom Styling --> 
<link rel="stylesheet" href="app.css"/>

<!-- Leaflet -->
<link rel="stylesheet" href="https://npmcdn.com/leaflet@1.0.0-rc.2/dist/leaflet.css" />
<script src="https://npmcdn.com/leaflet@1.0.0-rc.2/dist/leaflet.js"></script>

</head>

<body>

<div id="container" class="col-md-12">

<div class="col-md-4" id="first-third">
	<h1>Transitopia</h1>
	<h2>Minority Bus Routes</h2>
	<p> How will budget cuts affect the minority population along these bus routes? What's the best way to take resources away while minimizing disparate impact? </p>
	<div class="col-md-12" id="map"></div>
</div>

<div class="col-md-4" id="second-third">
	<h3> Percent Minority </h3>
	<p> Choose a threshold that will define disparate burden or disparate benefit. <br> 
	Current weighted systemwide bus minority percentage: <span> 47.5% </span> </p>
	<div class="col-md-12" id="slider"></div>
	<p>You chose a threshold of <span id="sliderRatio"> 1.0 </span>, which limits affected bus routes to only those with up to <span id="sliderPercent"> 47.5 </span> % minority ridership.
	<div class="col-md-12" id="chart"></div>
</div>

<div class="col-md-4" id="calculations">
	<h3> Threshold: <span id="sliderRatio"> 1.0 </span> </h3>
	<h2> Minimum Savings: <span id="minTotSavings"> $0 </span> </h2>
	<h2> Maximum Savings: <span id="maxTotSavings"> $0 </span> </h2>
	<h4> Systemwide % Minority Affected: <span id="globalMinority"> 0 </span>%</h4>
	<h4> Systemwide # Minorities Affected: <span id="globalPop"> 0 </span> people</h4>
	<div class="col-md-12" id="tableNames">
		<h4 class="col-md-2">Route Number</h4>
		<h4 class="col-md-2">Weekday Ridership</h4>
		<h4 class="col-md-2">Percent Minority</h4>
		<h4 class="col-md-2">Min. Savings</h4>
		<h4 class="col-md-2">Max. Savings</h4>
	</div>
	<div class="col-md-12" id="tableRows">
		<p class="col-md-2"><span id="routeNo"></span></p>
		<p class="col-md-2"><span id="ridership"></span></p>
		<p class="col-md-2"><span id="percentMin"></span></p>
		<p class="col-md-2"><span id="minSavings"></span></p>
		<p class="col-md-2"><span id="maxSavings"></span></p>
	</div>
</div>

</div> 

<script src="app.js"></script>
<script src="slider.js"></script>

</body>
</html>