#!/bin/bash
git pull
grunt
cd api
/home/sven/composer.phar install
./vendor/bin/doctrine orm:schema-tool:update
cd ..
grunt clean
grunt
rm -rf /var/www/anders.hamburg/adfc/test.old
mv /var/www/anders.hamburg/adfc/test /var/www/anders.hamburg/adfc/test.old
cp -r dist /var/www/anders.hamburg/adfc/test
