<?php
// REUIRES: composer install
namespace Suin\RSSWriter;
require_once './vendor/autoload.php';

$feed = new Feed();

$prefix = "http://bigboy.us/directions/";
$audio = $prefix . "audio/";

$channel = new Channel();
$channel
    ->title("Directions podcast")
    ->description("Monthly walking directions for selected metro areas")
    ->url('http://bigboy.us/directions/')
    ->appendTo($feed);

// RSS item
$item = new Item();
$item
    ->title("Episode 1: New York")
    ->enclosure($audio . 'new_york_city_final.mp3', 30863733, 'audio/mpeg')
    ->appendTo($channel);

echo $feed;