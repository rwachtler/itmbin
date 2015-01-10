"use strict"

// curl "http://localhost:8888/test/registration/mail.html"

var TestingController = function(){
	console.log("DEBUG TestingController initialisation...")
}

TestingController.prototype.handle = function(restUrl,res,config){
	switch (restUrl.id){
	case "mail":
		this.testMail(restUrl,res,config); break;
	
	// place some other tests here:
	// case "..."
	//    breadk;
		
	default:
		this.returnErr(res,"what should we test??")	
	}
}


// helper Errors for static files:
TestingController.prototype.returnErr = function(res,msg){
  	res.writeHead(503, {'Content-Type': 'text/plain'});
  	res.end("ERROR: '"+msg+"'\n");	
}


// some things we would like to test:
TestingController.prototype.testMail=function(restUrl,res,config){
	var Mailer = require("../helper/mailer")
	new Mailer().sendMail(function(){},
					"johannes.feiner@fh-joanneum.at",
					"testmail",
					'<a href="'+getServerBaseUrl(config)+'/register?token=987">click to register</a>');
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end("Testmail sent! Check mail now! ");	 	
}


// helpers:

function getServerBaseUrl(config){
	return "http://"+config.server+":"+config.port
}		
	
	
var testingController = new TestingController()
module.exports = testingController

