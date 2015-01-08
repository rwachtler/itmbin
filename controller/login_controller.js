"use strict"

var PageView = require("../view/page_view")

var LoginController = function(){

}

LoginController.prototype.handle = function(restUrl,res){

	// PUT http://localhost:8888/song/1.json?title=Unten%20am%20Hafen&lang=de
	// => method = PUT path = / resource = song id = 1 format = json params = { 'title' : "Unten am Hafen", 'lang': "de"}


	if (restUrl.id == "login"){
		var data = { title: "ITM - Bin Login" };

		var theView = new PageView()
		theView.render(res,restUrl, data)
	} else if (restUrl.id == "register") {
		var data = { title: "ITM - Bin Register"};

		var theView = new PageView()
		theView.render(res,restUrl, data)
	} else if (restUrl.id == "save") {
			// save the registration and send confirmation mail
			
	} else if (restUrl.id == "check") {
			console.log("Now we check the login")
	} else{
		console.log("DEBUG PageController handle: id unknown:",restUrl.id)
		var msg="DEBUG PageController: id should be 'welcome' or 'about' or '...'."+
				" We do not know how to handle '"+restUrl.id+"'!"
	}

}
var loginController = new LoginController()
module.exports = loginController
