#!/usr/bin/env node
console.log("We start up the legendary ITM-Bin")

theapp = require('./controller/main_controller')
theapp.startup()
