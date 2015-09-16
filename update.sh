#!/bin/bash
git pull
grunt
cd api
/home/sven/composer.phar install
vendor/bin/doctrine orm:schema-tool:update