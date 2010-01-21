<?php
require_once("config.inc.php");
set_include_path(get_include_path() . ":" . dirname(__FILE__) . "/geoip/");
include("geoipcity.inc");
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
 
 class xmldataobject {
 	
	var $xmldoc;
	var $xpath;
	
	function xmldataobject($xmldoc) {
		$this->xmldoc = $xmldoc;
		//var_dump($xmldoc);
		//echo "<br>/////////////////////";
		//$this->xpath  = $this->xmldoc->xpath_new_context();
	}
	
	function elements() {
		return;
		$obj = $this->xpath->xpath_eval('//loc');
		var_dump($obj);	
		echo $obj->value;
		return $obj;
	}
	
	function getId($searchwords) {
		return $this->findValue($searchwords);
	}
	
	function singleMatch($searchword,$value) {	
		$lst1 = explode(",", $value);
		foreach ($lst1 as $k => $v) {
			$val = rtrim(ltrim($v));
			if (strtolower($searchword) == strtolower($val)) {
				return true;	
			}	
		}
		return false;
	}
	
	function getHits($searchwords, $value) {		
		$hits = 0;
		foreach ($searchwords as $k => $v) {
			if ($this->singleMatch($v,$value)) {
				$hits += 1;	
			}
		}
		return $hits;
	}
	
	function findValue($searchwords) {
		$xp = $this->xmldoc->xpath_new_context();
		
		$obj = $xp->xpath_eval('/search/loc');
		if ($obj) {
			$nodeset = $obj->nodeset;
			$hitcount = 0;
			$result = "";
			if ($nodeset != null) {
				foreach ($nodeset as $node) {					
					$txt = $xp->xpath_eval('./text()',$node);
					
					$attr = $xp->xpath_eval('./@id',$node);
					$id = $attr->nodeset[0]->value;
					
					$hc = $this->getHits($searchwords,$txt->nodeset[0]->content);
					if ($hc > $hitcount) {
						$hitcount = $hc;
						$result = $id;	
					}
				}
			}
		}
		
		return $result;
	}
	
	function attributes($id) {
		echo "<br>eeeeeeeeeeeeeeee<br>";
		return;
		$obj = $this->xpath->xpath_eval('//loc[@id=\'USNY0011\']');
		var_dump($obj);	
		echo $obj->value;
	}
 }

function simplexml_load_string($xmlstring) {
	
	if ($xmlstring == null) {
		return null;
	}
	
	//$dom = new DOMDocument('1.0');
	/*
	$dom = domxml_new_doc  ('1.0');
	var_dump($url);
	$dom->loadXML($url);
	var_dump($dom);
	*/
	//var_dump($xmlstring);
	echo "<br>???";
	$dom = domxml_open_mem($xmlstring);
	
	echo "<!-- ".$xmlstring."-->";
	$x1 = new xmldataobject($dom);
	return $x1;
}

class geoipweather {
	
	var $ccraw = "";
	var $conditions = "";
	var $errors = 0;
	var $fcraw = "";
	var $forecast = "";
	var $geoiprecord = "";
	var $hint = "";
	var $locid = "";
	var $starttime = 0;

	function init() {
		list($usec, $sec) = explode(" ", microtime());
		$this->starttime = ((float)$usec + (float)$sec);
		$funcs = array(
			"geoip_set",
			"hint_set",
			"locid_set",
			"fetch_conditions",
			"fetch_forecast",
		);

		foreach ($funcs as $func) {
			if ($this->errors > 0) {
				continue;
			} else {
				$this->$func();
			}
		}
	}

	function cache_fetch($name) {
		$buf = "";
		$cachedir = dirname(__FILE__) . "/cache/";
		$fd = opendir($cachedir);
		while (($entry = readdir($fd)) !== false) {
			list($_, $type, $locid, $filetime) = explode("_", $entry);
			$curtime = time();
			$delete = 0;

			switch($type) {
			case "cc":
				if ($curtime - $filetime > (25 * 60)) {
					$delete = 1;
				}
				break;
			case "fc":
				if ($curtime - $filetime > (210 * 60)) {
					$delete = 1;
				}
				break;
			}

			if ($delete) {
				unlink($cachedir . $entry);
			} else {
				if (stristr($entry, $name)) {
					$buf = file_get_contents($cachedir . $entry);
				}
			}
		}
		closedir($fd);
		return($buf);
	}

	function cache_store($name, $data) {
		$fd = fopen(dirname(__FILE__) . "/cache/" . $name
			. "_" . time(), "w");
		fwrite($fd, $data);
		fclose($fd);
	}

	function error($str, $soft = 0) {
		$this->logger(__FUNCTION__ . ": $str");
		if (!$soft) {
			++$this->errors;
		}
		print '<p><span style="color: red">Error: ' . $str . "</span>\n";
	}

	function logger($str) {
		if ($GLOBALS["config"]["log"] > 0) {
			error_log(date("YmdHis") . " " . $str . "\n", 3, dirname(__FILE__) . "/log/geoipweather.log");
		}
	}

	function http_request($req) {
		$this->logger(__FUNCTION__ . ": making request '$req'");
		$buf = "";
		$timeout = 2;

		$fp = fsockopen("xoap.weather.com", 80, $errno, $errstr, $timeout);

		if ($fp) {
			$req .= " HTTP/1.1\r\n";
			$req .= "Host: xoap.weather.com\r\n";
			$req .= "Connection: close\r\n\r\n";
			
			echo $req;
			fwrite($fp, $req);
			stream_set_blocking($fp, TRUE);
			stream_set_timeout($fp, $timeout);
			while ((!feof($fp)) && (!$info["timed_out"])) {
				$buf .= fgets($fp, 4096);
				$info = stream_get_meta_data($fp);
				ob_flush();
				flush();
			}
			fclose($fp);
		}

		//logger(__FUNCTION__ . ": returning buffer '$buf'");
		if (empty($buf)) {
			$this->logger(__FUNCTION__ . ": empty buffer");
		}
		if ($info["timed_out"]) {
			$this->logger(__FUNCTION__ . ": timed out");
		}
		return($buf);
	}

	function geoip_purephp($ip) {
		$g = geoip_open(dirname(__FILE__) . "/geoip/GeoLiteCity.dat",GEOIP_STANDARD);
		$rec = GeoIP_record_by_addr($g,$ip);
		geoip_close($g);

		$rec = (array)$rec;
/*
		$record["city"] = $rec->city;
		$record["country_code"] = 
		$record["country_name"] = $rec->country_name;
		$record["postal_code"] = $rec->postal_code;
		$record["region"] = $rec->region;

		print $record->country_code . " " . $record->country_code3 . " " . $record->country_name . "\n";
		print $record->region . " " . $GEOIP_REGION_NAME[$record->country_code][$record->region] . "\n";
		print $record->city . "\n";
		print $record->postal_code . "\n";
		print $record->latitude . "\n";
		print $record->longitude . "\n";
		print $record->metro_code . "\n";
		print $record->area_code . "\n";
*/
		return($rec);
}

	function geoip_set() {
		if (isset($_REQUEST["ip"])) {
			$ip = $_REQUEST["ip"];
			$this->logger(__FUNCTION__ . ': using _REQUEST["ip"] ' . $ip);
			if(!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4|FILTER_FLAG_NO_PRIV_RANGE)) {
				$this->error("Invalid IP address specified.\n");
			}
		} else {
			if (!empty($_SERVER["HTTP_CLIENT_IP"]) && filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4|FILTER_FLAG_NO_PRIV_RANGE)) {
				$ip = $_SERVER["HTTP_CLIENT_IP"];
				$this->logger(__FUNCTION__ . ": HTTP_CLIENT_IP " . $ip);
			} elseif (!empty($_SERVER["HTTP_X_FORWARDED_FOR"]) && filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4|FILTER_FLAG_NO_PRIV_RANGE)) {
				$ip = $_SERVER["HTTP_X_FORWARDED_FOR"];
				$this->logger(__FUNCTION__ . ": using HTTP_X_FORWARDED_FOR " . $ip);
			} else {
				$ip = $_SERVER["REMOTE_ADDR"];
				$this->logger(__FUNCTION__ . ": using REMOTE_ADDR " . $ip);
			}
		}

		$this->geoiprecord = $this->geoip_purephp($ip);
		$this->geoiprecord["city"] = utf8_encode($this->geoiprecord["city"]);

		/* map foreign chars to english ones so weather.com city search works */
		$foreign_chars = array("�","�","�","�","�","�","�","�","�","�","�");
		$replace_chars = array("a","a","E","e","e","i","o","o","o","ss","u");

		$this->geoiprecord["city"] = str_replace($foreign_chars, $replace_chars, utf8_decode($this->geoiprecord["city"]));
		$this->geoiprecord["city"] = utf8_encode($this->geoiprecord["city"]);

		/* fixup geoip's silly country names */
		if ($this->geoiprecord["country_name"] == "Russian Federation") {
			$this->geoiprecord["country_name"] = "Russia";
		} else if ($this->geoiprecord["country_name"] == "Korea, Republic of") {
			$this->geoiprecord["country_name"] = "South Korea";
		}
	}

	function locid_set() {
		echo $_REQUEST["search"];
		if (!empty($_REQUEST["search"])) {
			$this->logger(__FUNCTION__ . ": search request for '" . $_REQUEST["search"] . "'");
			if (preg_match("/^\d{5}$/", $_REQUEST["search"])) {
				$this->locid = $_REQUEST["search"];
				return;
			} else {
				if (!stristr($_REQUEST["search"], ",")) {
					$this->error("Location must be in the form of City, Country or for the US a 5 digit zip code or City, ST.");
					return;
				}
				$this->locid_search($_REQUEST["search"]);
			}
		} else {
			/* U.S. 5 digit zip codes can be used as is. */
			if (isset($this->geoiprecord["postal_code"]) &&
			preg_match("/^\d{5}$/", $this->geoiprecord["postal_code"])) {
				$this->locid = $this->geoiprecord["postal_code"];
				$this->logger(__FUNCTION__ . ": set locid to US zip " . $this->locid);
				return;
			/* Call weather.com's location ID search service if we have a city. */
			} else if (!empty($this->geoiprecord["city"])) {
				$this->logger(__FUNCTION__ . ": calling locid_search() for " . $this->geoiprecord["city"]);
				
				$this->locid_search($this->geoiprecord["city"]);
				if (!$this->locid) {
					$this->locid_search($this->geoiprecord["city"] . ", " . $this->geoiprecord["region"]);
				}
			} else {
				$this->error("We could not detect your city so we cannot find weather for your location. Please try the search box instead.");
				return;
			}
		}
		echo "<br>---".$this->locid."<br>";
		if (!$this->locid) {
			$this->error("We could not map your search/IP to a weather.com location ID. Try searching for a larger city.");
			return;
		}
	}

	function locid_search($search) {
		$matchdata = array();
		$this->logger(__FUNCTION__ . ": looking for '$search'");

		if (stristr($search, ",")) {
			$searchwords = explode(",", $search);
			foreach ($searchwords as $k => $v) {
				$searchwords[$k] = rtrim(ltrim($v));
			}
			$matchdata = $searchwords;
		} else {
			/* probably just geoip */
			$geoipdata = array(
				"0" => $this->geoiprecord["city"],
				"1" => $this->geoiprecord["region"],
				"2" => $this->geoiprecord["country_name"],
			);
			$matchdata = $geoipdata;
		}
		
		$req = "GET /search/search?where=" . urlencode($search);
		echo $req;
		$data = $this->http_request($req);
		if (empty($data)) {
			$this->error("The weather.com location ID search service had a temporary failure.  Please reload or try again later.");
			return;
		}

		preg_match("/(\<\?xml.*?\<\/search\>)/ms", $data, $m);
		$searchdata = simplexml_load_string($m[0]);
				
		if (!$searchdata) {
			$this->error("The weather.com location ID search service didn't return any results.  Please try searching for a larger city in the search box.");
			return;
		}
		
		echo "<br>first<br>";
		$this->locid =  $searchdata->getId($matchdata);
		echo $this->locid;
		return;
		//
		
		//foreach ($searchdata->loc as $loc) {
		foreach ($searchdata->elements() as $loc) {
			var_dump($loc);	
		
			if (stristr($loc, ",")) {
				$locwords = explode(",", $loc);
				foreach ($locwords as $k => $v) {
					$locwords[$k] = rtrim(ltrim($v));
				}
			}
			echo $loc;
			
			$this->logger(__FUNCTION__ . ": comparing " . $locwords[0] . " " . $locwords[1] . " to " . $matchdata[0] . " " . $matchdata[1] . " (field 1)");
			if (strtolower($locwords[0]) == strtolower($matchdata[0]) && strtolower($locwords[1]) == strtolower($matchdata[1])) {
				$this->logger(__FUNCTION__ . ": matched on field 1");
				//$this->locid = $loc->attributes()->id;
				echo "<br>1<br>";
				var_dump($loc);
				$this->locid = $loc->attributes->id;
				return;
			}
		}
		foreach ($searchdata->loc as $loc) {
			if (stristr($loc, ",")) {
				$locwords = explode(",", $loc);
				foreach ($locwords as $k => $v) {
					$locwords[$k] = rtrim(ltrim($v));
				}
			}

			$this->logger(__FUNCTION__ . ": comparing " . $locwords[0] . " " . $locwords[1] . " to " . $matchdata[0] . " " . $matchdata[2] . " (field 2)");
			if (strtolower($locwords[0]) == strtolower($matchdata[0]) && strtolower($locwords[1]) == strtolower($matchdata[2])) {
				$this->logger(__FUNCTION__ . ": matched on field 2");
				//$this->locid = $loc->attributes()->id;
				echo "<br>2<br>";
				var_dump($loc);
				$this->locid = $loc->attributes->id;
				return;
			}
		}
	}

	function fetch_conditions() {
		/* check the cache first */
		//$cache = apc_fetch("gw_cc_" . $this->locid, $success);
		$cache = $this->cache_fetch("gw_cc_" . $this->locid);
		if (!empty($cache)) {
			$this->logger(__FUNCTION__ . ": using cache for " . $this->locid);
			$this->ccraw = $cache;
		} else {
			$this->logger(__FUNCTION__ . ": no cache available for " . $this->locid);
			$req = "GET /weather/local/" . $this->locid . "?cc=*"
				. "&par=" . $GLOBALS["config"]["partnerid"]
				. "&key=" . $GLOBALS["config"]["licensekey"] 
				. "&link=xoap&prod=xoap&unit="
				. ($this->geoiprecord["country_code"] == "US" ? "s" : "m");

			
			$this->ccraw = $this->http_request($req);
			if (empty($this->ccraw)) {
				$this->error("Weather.com had an error and could not return the current conditions data.", 1);
			} else {
				/* Current condition data must be cached for 25 minutes. */
				//apc_store("gw_cc_" . $this->locid, $this->ccraw, 25*60);
				$this->cache_store("gw_cc_" . $this->locid, $this->ccraw);
			}
		}

		preg_match("/(\<\?xml.*?\<\/weather\>)/ms", $this->ccraw, $m);
		$this->conditions = simplexml_load_string($m[0]);
		echo "second";
	}

	function fetch_forecast() {
		/* check the cache first */
		//$cache = apc_fetch("gw_fc_" . $this->locid, $success);
		$cache = $this->cache_fetch("gw_fc_" . $this->locid);
		if (!empty($cache)) {
			$this->logger(__FUNCTION__ . ": using cache for " . $this->locid);
			$this->fcraw = $cache;
		} else {
			$this->logger(__FUNCTION__ . ": no cache available for " . $this->locid);
			$req = "GET /weather/local/" . $this->locid . "?cc=*&dayf=5"
				. "&par=" . $GLOBALS["config"]["partnerid"]
				. "&key=" . $GLOBALS["config"]["licensekey"]
				. "&link=xoap&prod=xoap&unit="
				. ($this->geoiprecord["country_code"] == "US" ? "s" : "m");

			$this->fcraw = $this->http_request($req);
			if (empty($this->fcraw)) {
				$this->error("Weather.com had an error and could not return the forecast data.", 1);
			} else {
				/* Forecast data must be cached for 210 minutes. */
				//apc_store("gw_fc_" . $this->locid, $this->fcraw, 210*60);
				$this->cache_store("gw_fc_" . $this->locid, $this->fcraw);
			}
		}

		preg_match("/(\<\?xml.*?\<\/weather\>)/ms", $this->fcraw, $m);
		$this->forecast = simplexml_load_string($m[0]);
		echo "third";
	}

	function hint_set() {
		if ($_REQUEST["search"]) {
			$this->hint = $_REQUEST["search"];
		} else if (isset($this->geoiprecord["postal_code"]) &&
		preg_match("/^\d{5}$/", $this->geoiprecord["postal_code"])) {
			$this->hint = $this->geoiprecord["postal_code"];
		} else if ($this->geoiprecord["country_code"] == "US" && empty($this->geoiprecord["postal_code"])) {
			$this->hint = $this->geoiprecord["city"] . ", " . $this->geoiprecord["region"];
		} else {
			if (!empty($this->geoiprecord["city"]) && !empty ($this->geoiprecord["country_name"])) {
				$this->hint = $this->geoiprecord["city"] . ", " . $this->geoiprecord["country_name"];
			} else {
				$this->hint = $this->geoiprecord["country_name"];
			}
		}
	}
}
?>
