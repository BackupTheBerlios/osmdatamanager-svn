<?php
	// XXX use for debugging
	// ini_set("error_reporting", E_ALL & ~E_NOTICE); ini_set("display_errors", 1);
	require_once("geoipweather.class.php");

	
	$weather = new geoipweather();
	$weather->init();



?>