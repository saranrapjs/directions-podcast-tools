#!/bin/sh

WD=`pwd`"/"

city=$(${WD}random_city.js)
city_sanitized=$(echo $city | sed 's/[^A-Za-z0-9]//g' | tr '[:upper:]' '[:lower:]')

echo "Producing podcast for ${city}"
filename=$(date "+%Y-%m-%d-")$city_sanitized
echo $filename

TMPDIR="./${filename}"

mkdir -p $TMPDIR

pushd $TMPDIR

if [ \! -s points.json ]; then
	echo "Picking random points..."
	"${WD}random_directions.js" "$city" > points.json
fi

if [ \! -s directions_speech.txt ]; then
	echo "Producing directions, as text..."
	cat points.json | "${WD}directions.js" true > directions.txt
	cat directions.txt | "${WD}format_text_for_speech.js" > directions_speech.txt
fi

if [ \! -s directions.json ]; then
	echo "Producing directions, as json..."
	cat points.json | "${WD}directions.js" false > directions.json
fi

if [ \! -s map.svg ]; then
	echo "Producing directions, as map..."
	cat directions.json | "${WD}map.js" > map.svg
fi

popd