#!/bin/bash
git pull
bower install
cd api
/home/sven/composer.phar install
vendor/bin/doctrine orm:schema-tool:update