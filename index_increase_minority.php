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
<link rel="stylesheet" href="app_minority.css"/>

<!-- Leaflet -->
<link rel="stylesheet" href="https://npmcdn.com/leaflet@1.0.0-rc.2/dist/leaflet.css" />
<script src="https://npmcdn.com/leaflet@1.0.0-rc.2/dist/leaflet.js"></script>

</head>

<body>

<div class="container-fluid">

<!-- Row 1 -->	

	<div class="col-md-10">
	<h1> Transitopia <span style="font-family:Open Sans;font-weight:400;font-size:26px;text-transform:lowercase;"> a service equity analysis teaching tool</span></h1>
	</div>
	
<!-- Row 2 -->
	
	<div class="col-md-4" id="first-third">

	<div class="dropdown">
	<button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown"> Choose a service change scenario
	<span class="caret"></span></button>
	<ul class="dropdown-menu">
	<li><a href="index_increase_minority.php" class="active">Increase service on high-ridership routes</a></li>
	<li><a href="index_remove_minority.php">Remove a route and increase parallel service</a></li>
	<li><a href="index_decrease_minority.php">Decrease service on low-ridership routes</a></li>
	<li><a href="index_none_minority.php">[clear scenarios]</a></li>
	</ul>
	</div>	
	
	<br><br><br><br>

	<div class="dropdown">
	<button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown"> Choose an equity analysis type
	<span class="caret"></span></button>
	<ul class="dropdown-menu">
	<li><a href="#" class="active">Disparate impact (minority)</a></li>
	<li><a href="index_increase_lowincome.php">Disproportionate burden (low-income)</a></li>
	</ul>
	</div>
	
	</div>
	
	<div class="col-md-4">
	<h2 class="subtitle"> Set Disparity Threshold </h2>
	<div class="col-md-12" id="slider"></div>	
	</div>
	
	<div class="col-md-4" id="calculations">
	
	<h2 class="subtitle">Analysis Summary</h2><br>
	<h3 class="lowercase"> Disparate Burden Threshold: <span id="sliderRatioCopy" class="highlighted">  </span> </h3>			
	<h3 class="lowercase"> Disparate Burden Ratio: <span id="calculatedRatioBur" class="highlighted">  </span> </h3>
	<h3 class="lowercase"> Result: <span id="isThereBurden" class="highlighted"> </span> </h3><br>
	<h3 class="lowercase"> Disparate Benefit Threshold: <span id="sliderRatioOpp" class="highlighted">  </span> </h3>
	<h3 class="lowercase"> Disparate Benefit Ratio: <span id="calculatedRatioBen" class="highlighted">  </span> </h3>
	<h3 class="lowercase"> Result: <span id="isThereBenefit" class="highlighted"> </span> </h3>
	
	</div>
		
<!-- Row 3 -->

	<div class="col-md-4">		
	<h2 class="subtitle"> <br> Identify Routes </h2>
	<div class="col-md-12" id="map"></div>	
	</div>
	
	<div class="col-md-7" id="second-third">
	<h2 class="subtitle"> <br> Adjust Service Hours by Route</h2><br>
	<div class="col-md-12" id="tableRows"></div>	
	<div class="col-md-12" id="chart"></div>	
	</div>
	
</div>


<script src="app_increase_minority.js"></script>
<script src="slider.js"></script>

</body>
</html>