#!/usr/bin/env node
'use strict'

const cities = require('./cities')

const randomCity = cities[Math.floor(Math.random()*cities.length)]

console.log(randomCity)