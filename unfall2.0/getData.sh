#!/bin/bash

BASEURL=https://fragdenstaat.de/files/foi/
URLS=(
    "${BASEURL}106840/Geodaten2009_2011anonymisiert.zip"
    "${BASEURL}106841/Geodaten2012_2014anonymisiert.zip"
    "${BASEURL}106842/Geodaten2015_2017anonymisiert.zip"
)
mkdir data
cd data

for URL in ${URLS[@]}; do
    FILE=$(basename $URL)
    if [ ! -f "$FILE" ] ; then
        wget $URL
    fi
    unzip $FILE
done

cd ..
