#!/bin/bash

# cat directions | ./format.bash > directions_speech

VALUE=$(cat)
while read -r line; do
	line=$(sed -e 's/Pkwy/Parkway/g' <<< "$line")
	line=$(sed -e 's/Ave/Avenue/g' <<< "$line")
	line=$(sed -e 's/E River/East River/g' <<< "$line")
    echo "$line;."
done <<< "$VALUE"
