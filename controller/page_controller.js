"use strict"

var PageView = require("../view/page_view")
	
var PageController = function(){
	console.log("DEBUG PageController initialise: not implemented yet")
}

PageController.prototype.handle = function(restUrl,res){
	
	// PUT http://localhost:8888/song/1.json?title=Unten%20am%20Hafen&lang=de
	// => method = PUT path = / resource = song id = 1 format = json params = { 'title' : "Unten am Hafen", 'lang': "de"}
	
	
	if (restUrl.id == "welcome"){
		var theView = new PageView()
		theView.render(res,restUrl)
	}else if (restUrl.id == 'about'){
		var theView = new PageView()
		theView.render(res,restUrl)
	}else{ 
		console.log("DEBUG PageController handle: id unknown:",restUrl.id)
		var msg="DEBUG PageController: id should be 'welcome' or 'about' or '...'."+
				" We do not know how to handle '"+restUrl.id+"'!"
	}
	
}
var pageController = new PageController()
module.exports = pageController
