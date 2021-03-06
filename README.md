# a series of tools for producing the DIRECTIONS PODCAST

#### random_directions.js

get random points within a geographic boundary, and optionally filter using additional administrative criteria

#### directions.js

get text directions for a series of points, interpolated with distances

#### map.js

convert a JSON array of lat and lng points into an purple SVG polyline with endpoints

#### format_text_for_speech.js

take a series of directions (one per line) and making a number of substitutions to optimize the sound of them as spoken by a Mac text-to-speech voice

### Run as a script

The following script wraps all of these together:
```
./produce.sh
```

### A sample workflow

```
# produce the points and directions
node random_directions.js > points.json

# produce directions for speech...
cat points.json | node directions.js true > directions.txt
cat directions.txt | node format_text_for_speech.js > directions_speech.txt

# on a mac:
cat directions_speech.txt | say

# ...and for an SVG map:
cat points.json | node directions.js false > directions.json
cat directions.json | node map.js > map.svg
```