#!/usr/bin/env node

// USAGE

// cat directions | node format_text_for_speech.js > directions_speech

function text_filters(text) {
	text.split("\n").forEach(function(line) {
		if (!line.length) return;
		line = line.replace(/Pkwy/, 'Parkway');
		line = line.replace(/Ave/, 'Avenue');
		line = line.replace(/Ln/, 'Lane');
		line = line.replace(/Blvd/, 'Boulevard');
		line = line.replace(/Dr/, 'Drive');
		line = line.replace(/E River/, 'East River');
		line = line.replace(/([0-9]+) E$/, '$1 East');
		line = line + ';.'; // mac speech likes this
		console.log(line);
	});
}

process.stdin.resume();

process.stdin.on('data', function(data) {
	text_filters(data.toString());
});