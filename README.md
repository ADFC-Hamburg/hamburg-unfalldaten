### Requirements:

* webserver with php 
* git
* bower
* php composer
* Unfalldaten der Stadt Hamburg

### Install

``` bash
git clone https://github.com/ADFC-Hamburg/hamburg-unfalldaten
cd hamburg-unfalldaten/
npm install
grunt
cp $PATH_TO_UNFALLDATEN/RF_2014_Anonym.txt data/
cd api/
$PATH_TO_COMPOSER/composer.phar install
```

* Open bootstrap.php and change the path to sql-lite to a place you like.
* Create an empty comment sql databes with:
``` 
cd api
vendor/bin/doctrine orm:schema-tool:create
```
* Configure Apache to use the adfchh-map/dist as a base directory

### Update
``` bash
 cd hamburg-unfalldaten/
 git pull
 bower install
 cd api
 $PATH_TO_COMPOSER/composer.phar install
 vendor/bin/doctrine orm:schema-tool:update
```

### Thanks to...
* [Perrygeo Leaflet simple cvs](https://github.com/perrygeo/leaflet-simple-csv)
* [Leaflet](https://github.com/Leaflet/Leaflet)
* [Leaflet.geoCSV](https://github.com/joker-x/Leaflet.geoCSV)
* [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster)
* [Twitter Boostrap](http://twitter.github.io/bootstrap/)
* [jQuery](http://jquery.com/)
