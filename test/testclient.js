#!/usr/bin/env node
// requirements:
// npm install superagent


// see also:
// https://www.npmjs.org/package/superagent

// http://nodejs.org/api/assert.html


'use strict'
var request = require('superagent'),
	assert  = require('assert')


	// GET http://localhost:8888/public/images/logo.png
	// GET http://localhost:8888/song/all.json
	// GET http://localhost:8888/song/1.json
	// PUT http://localhost:8888/song/1.json?title=Unten%20am%20Hafen
	// POST http://localhost:8888/song/create.json?title=Paperback%20Writer

var server="127.0.0.1"
var port=8888
			
var url="http://"+server+":"+port+'/song/all.json?lang=en'
var r = request
	.post(url)
	.send({ name: 'Manny', species: 'cat' })
	.end( function(err,resp){
		if (err){
			console.log("ERROR when retrieving url '"+url+"': ",err)
		}else{
			console.log("response-status: ",resp.status)
			console.log("response-text: ",resp.text)
			assert.ok(200 == resp.status, "we expect status code of 200")
			assert.ok( resp.text.indexOf('counter') )
		}
	});
console.log("We request url '"+url+"'...")
//console.log("We send the request: ",r)
