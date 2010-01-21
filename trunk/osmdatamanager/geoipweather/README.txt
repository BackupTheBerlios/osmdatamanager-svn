GeoIP Weather Installation Notes
--------------------------------

Required Software:

- PHP 5.2

Registration for weather.com may be done at:

https://registration.weather.com/ursa/xmloap/step1

You will receive an email with your Partner ID, License Key, and a link
to a file called "sdk.zip".  Download sdk.zip and extract the images to
your server.  Also read and understand the enclosed agreement before
modifying any of the source code.  geoipweather strives for 100%
compliance with the license terms and modification of the source code
may cause license violations.

Edit config.inc.php and fill in the "partnerid" and "licensekey" lines.

The default image path is img/icons for weather icons and img/logos for
the weather.com logos.

Download GeoLite City from:

http://geolite.maxmind.com/download/geoip/database/GeoLiteCity.dat.gz

and uncompress it and place it within the /geoip/ subdirectory.
