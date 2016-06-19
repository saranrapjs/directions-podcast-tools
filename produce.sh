#!/bin/sh

WD=`pwd`"/"

if [ -z "$1" ]; then
	city=$(${WD}random_city.js)
	city_sanitized=$(echo $city | sed 's/[^A-Za-z0-9]//g' | tr '[:upper:]' '[:lower:]')

	filename=$(date "+%Y-%m-%d-")$city_sanitized

	TMPDIR="./${filename}"
else
	TMPDIR="$1"
fi
mkdir -p $TMPDIR

pushd $TMPDIR

if [ \! -s city.txt ]; then
	echo $city > city.txt
else
	city=$(cat city.txt)
fi

echo "Producing podcast for ${city}"

if [ \! -s points.json ]; then
	echo "Picking random points..."
	"${WD}random_directions.js" "$city" > points.json
fi

if [ \! -s directions_speech.txt ]; then
	echo "Producing directions, as text..."
	cat points.json | "${WD}directions.js" true > directions.txt
	cat directions.txt | "${WD}format_text_for_speech.js" > directions_speech.txt
fi

if [ \! -s raw.aif ]; then
	if type "say" > /dev/null; then
		echo "Producing an audiofile..."
		cat directions.txt | say -o raw.aif
	fi
fi

if [ \! -s city.aif ]; then
	if type "say" > /dev/null; then
		echo "Producing an audiofile..."
		echo "$city" | say -o city.aif
	fi
fi

if [ \! -s directions.json ]; then
	echo "Producing directions, as json..."
	cat points.json | "${WD}directions.js" false > directions.json
fi

if [ \! -s map.svg ]; then
	echo "Producing directions, as map..."
	cat directions.json | "${WD}map.js" > map.svg
fi

BEGIN_CITY_ID=":11.240"
BEGIN_MAIN_AUDIO=":14.920"

if [ \! -s output.mp3 ]; then
	echo "Producing the audio itself..."
	melt \
		-track "../scratch/etc/intro_raw.aif" \
		-track -blank $BEGIN_CITY_ID "city.aif" \
		-track -blank $BEGIN_MAIN_AUDIO "raw.aif" \
		-transition mix a_track=0 b_track=1 mlt_service=mix always_active=1 combine=1 \
		-transition mix a_track=0 b_track=2 mlt_service=mix always_active=1 combine=1 \
		-transition mix a_track=0 b_track=2 mlt_service=mix always_active=1 combine=1 \
		-consumer avformat:output.mp3 acodec=libmp3lame
fi

popd
