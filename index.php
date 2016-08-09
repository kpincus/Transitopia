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

<div id="container" class="col-md-12 container-fluid">
<div class="col-md-12">
<h1>Transitopia</h1>
<div class="col-md-8">
<h2> Context </h2>
<p> How will services cuts and additions affect the minority population along these bus routes? What's the best way to take and give resources while minimizing disparate impact and disparate benefit? This a problem with which policy makers must grapple on the daily. There are many factors to be considered, which makes the decision complicated. In this app, you can explore how bus routes and bus route services affect each other and the people that use them.<br><br>
</p>
<h4> Some Useful Definitions: </h4>
<p><b> Disparate Impact: </b> Policies, practices, rules, or other systems that appear to be neutral, but result in a disproportionate impact on protected group</p>
<p><b> Disparate Benefit: </b></p>
<p><b> DI/DB Ratio: </b></p>
<p><b> Vehice Revenue Hours: </b></p>
<br>
</div>
</div>

<div class="col-md-4" id="first-third">
	<h2> The App </h2>
	<p>Choose which factor you would like to consider per bus route. Your current factor is highlighted: </p><br>
	<h4><a href="#"> Routes by Percent Minority Ridership </a></h4>
	<h4><a href="#"> Routes by Percent Low Income Ridership</a></h4>
	<br>
	<p>Select your own routes and disparate impact/benefit ratios to discover how budgetting decisions might be made. You can start by clicking bus routes on the map.</p>
	<div class="col-md-12" id="map"></div>
</div>

<div class="col-md-4" id="second-third">
	<h2> 1) Choosing a target DI/DB Ratio </h2>
	<p>  Choose a target disparate ratio to keep in mind while selecting proposed service changes. <br> 
	Current weighted systemwide bus minority percentage: <span> 47.5% </span> </p>
	<div class="col-md-12" id="slider"></div>
	<p>You chose a threshold of <span id="sliderRatio"> 1.0 </span>, which <b> ideally should </b> limit affected bus routes to only those with up to <span id="sliderPercent"> 47.5 </span> % minority ridership.<br><br></p>
	<h2> 2) Choosing affected bus routes </h2>
	<p> Choose bus routes from which to add or cut services. Your selections will appear highlighted on the right-most panel, as well as on the map.</p><br>
	<div class="col-md-12" id="routePercents">
		<h4 class="col-md-3">Route Name</h4>
		<h4 class="col-md-9">Route Minority Ridership Percentage</h4>
	</div>
	<div class="col-md-12" id="chart"></div>
</div>

<div class="col-md-4" id="calculations">
	<h2> 3) Allocating Spending and Saving </h2>
	<h2>Your Target: <span id="target-savings">300</span></h2>
	<h4>Vehicle Revenue Hours (VRH) saved per day</h4>
	<br>
	<p> The bus routes that you selected are highlighted below. You can change the extent to which each bus route is affected by dragging each slider to save more or less vehicle revenue hours.</p>
	<br>

	<h3 class="lowercase"> Your Current Policy Threshold Ratio: <span id="sliderRatio" class="highlighted"> 1.0 </span> </h3>
	<h3 class="lowercase"> Your Current Calculated VRH Savings: <span id="minTotSavings" class="highlighted"> 0 </span></h3>
	<br>
	<h4 class="lowercase"> Systemwide % Minority Affected: <span id="globalMinority" class="highlighted"> 0%</span></h4>
	<h4 class="lowercase"> Systemwide # Minorities Affected: <span id="globalPop" class="highlighted"> 0 people</span></h4>

	<div class="col-md-12" id="tableNames">
		<h4 class="col-md-2">Route Name</h4>
		<h4 class="col-md-2">Weekday Ridership</h4>
		<h4 class="col-md-2">Percent Minority</h4>
		<h4 class="col-md-6">Vehicle Revenue Hours</h4>
	</div>
	<div class="col-md-12" id="tableRows"></div>

</div>

</div> 

<script src="app.js"></script>
<script src="slider.js"></script>

</body>
</html>