<?php
// XXX use for debugging
// ini_set("error_reporting", E_ALL & ~E_NOTICE); ini_set("display_errors", 1);
require_once("geoipweather.class.php");
/*
 * Copyright (c) 2009, 2010 Jolan Luff <geoipweather@gormsby.com>
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

// XXX This will clear the weather data cache.  Need to add some sort of admin
// interface.
// apc_clear_cache("user");

print html_header();
$GLOBALS["weather"] = new geoipweather();
$weather->init();
print html_form();
print html_conditions();
print html_forecast();
print html_ad_weathercom();
print html_footer();

function html_ad_weathercom() {
	$buf .= '<div style="clear:both">';
	if (!$GLOBALS["weather"]->conditions) {
		return($buf);
	}
	$buf .= '<p><br><h3>Weather data provided by:</h3>'
		. '<a href="http://www.weather.com/?par=xoap&amp;site=wx_logo'
		. '&amp;cm_ven=bd_oap&amp;cm_cat=' . $GLOBALS["config"]["partnerid"]
		. '&amp;cm_pla=HomePage&amp;cm_ite=Logo">'
		. '<img src="/img/logos/TWClogo_61px.png" alt="weather.com">'
		. '</a><br><br>';

	foreach ($GLOBALS["weather"]->conditions->lnks->link as $link) {
		$buf .= '<a href="' . str_replace("&", "&amp;", $link->l) . '">' . $link->t . "</a> ";
	}

	$buf .= "<br>\n";

	return($buf);
}

function html_conditions() {
	if (!$GLOBALS["weather"]->conditions) {
		$buf .= "<p><h3>Current conditions data temporarily unavailable.</h3>";
		return($buf);
	}
	$buf .= "<h1>Current weather for "
		. $GLOBALS["weather"]->conditions->loc->dnam . "</h1>\n";
	$buf .= '<img src="/img/icons/93x93/'
		. ($GLOBALS["weather"]->conditions->cc->icon == "0" ? $GLOBALS["weather"]->conditions->cc->icon : sprintf("%02d", $GLOBALS["weather"]->conditions->cc->icon))
		. '.png" alt="Weather Icon">' . "<br>\n";
	$buf .= "Condition: " . $GLOBALS["weather"]->conditions->cc->t . "<br>\n";
	$buf .= "Temperature: " . $GLOBALS["weather"]->conditions->cc->tmp
		. "&deg;" . $GLOBALS["weather"]->conditions->head->ut . "<br>\n";
	$buf .= "Feels Like: " . $GLOBALS["weather"]->conditions->cc->flik
		. "&deg;" . $GLOBALS["weather"]->conditions->head->ut . "<br>\n";
	$buf .= "Humidity: " . $GLOBALS["weather"]->conditions->cc->hmid
		. "%<br>\n";
	$buf .= "Observation time: " . $GLOBALS["weather"]->conditions->cc->lsup
		. "<br>\n";

	return($buf);
}

function html_footer() {
	list($usec, $sec) = explode(" ", microtime());
	$curtime = ((float)$usec + (float)$sec);

	$buf .= "</div>";
	$buf .= '<p><br>Powered by <a href="http://gormsby.com/opensource/geoipweather/">GeoIP Weather v0.4</a>; rendered in '
		. sprintf("%0.4f", ($curtime - $GLOBALS["weather"]->starttime))
		. " seconds.";
	$buf .= "</div></table></div>";
	return($buf);
}

function html_forecast() {
	if (!$GLOBALS["weather"]->forecast) {
		return("<p><h3>Forecast data temporarily unavailable.</h3>");
	}
	$buf .= "<p><h1>Forecasted weather for "
		. $GLOBALS["weather"]->forecast->loc->dnam . " as of "
		. $GLOBALS["weather"]->forecast->dayf->lsup
		. "</h1>\n";

	foreach ($GLOBALS["weather"]->forecast->dayf->day as $fcast) {
		$buf .= '<div class="day"><h2>' . $fcast->attributes->t
			. ", " . $fcast->attributes->dt . "</h2>";
		$buf .= "Sunrise: " . $fcast->sunr . "<br>";
		$buf .= "Sunset: " . $fcast->suns . "<br>";
		// Forecasted high isn't valid after 2:00PM.
		if ($fcast->hi != "N/A") {
			$buf .= "High: " . $fcast->hi . "&deg;"
				. $GLOBALS["weather"]->forecast->head->ut
				. "<br>";
		}
		$buf .= ' Low: ' . $fcast->low . "&deg;"
			. $GLOBALS["weather"]->forecast->head->ut . "<br>";
		foreach ($fcast->part as $pcast) {
			// Forecast isn't valid after 2:00PM.
			if ($pcast->icon == "44" || $pcast->t == "N/A") {
				continue;
			}
			$buf .= "<p><h3>" . ($pcast->attributes->p == "d" ? "Daytime" : "Nighttime") . "</h3>";
			$buf .= '<img src="/img/icons/93x93/'
				. ($pcast->icon == "0" ? $pcast->icon : sprintf("%02d", $pcast->icon))
				. '.png" alt="Weather Icon">'
				. "<br>\n";
			$buf .= "Chance of precipitation: " . $pcast->ppcp
				. "%<br>";
			$buf .= "Condition: " . $pcast->t . "<br>";
		}
		$buf .= "</div>";
	}

	return($buf);
}

function html_form() {
	$buf .= '<form action="' . $_SERVER["REQUEST_URI"] . '" name="input" method="post">';
	$buf .= 'Location: ';
	$buf .= '<input type="text" size="20" name="search"' . (!empty($GLOBALS["weather"]->hint) ? 'value="' . $GLOBALS["weather"]->hint . '"' : "") . '>';
	$buf .= '<input type="Submit" value="Get Weather">';
	//$buf .= ' &nbsp;<a href="help/">Help</a>';
	//$buf .= ' &nbsp;<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=10748372">Donate</a>';
	$buf .= '</form>';
	return($buf);
}

function html_header() {
	$buf = <<<EOF
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en-us">
<head>
<title>GeoIP Weather</title>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8">
<meta name="description" content="GeoIP Weather gives you local weather by estimating your location.">
<meta name="keywords" content="local weather, GeoIP weather">
<link rel="shortcut icon" href="/favicon.ico">
<link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="stylesheet" href="/style.css" type="text/css">
<style type="text/css">
div.day {float:left;margin-right:10px;padding-right:5px;border-right:3px #ddd solid;}
</style>
<!--[if lt IE 7.]>
<script defer type="text/javascript" src="/pngfix.js"></script>
<![endif]-->
</head>
<body id="gormsby-body">
<!-- BEGIN main -->
<div id="main">
<table cellpadding="0" cellspacing="0" border="0" width="100%">
<tbody>
<tr valign="top">
<td width="99%" id="gormsby-content">
<div id="gormsby-main-content">

EOF;
	return($buf);
}
?>
