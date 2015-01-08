"use strict"

var PageView = require("../view/page_view");

// Database connection
var db = require('../helper/db-mysql');
var conn = new db.Connection();

// ITM - Bin helper
var ItmBin = require('../helper/itmbin')
var binhelper = new ItmBin.ItmBin();

// Nodemailer
var mailer = require('../helper/mailer');
var mail = new mailer.Mailer();

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
			var auth_key = binhelper.getAuthKey();

			// we use decodeURIComponent because for instance @ gets converted to %40.
			var uname = decodeURIComponent(restUrl.params.user_name);
			var uemail = decodeURIComponent(restUrl.params.email);
			var upassw = decodeURIComponent(restUrl.params.password_1);

			var user_obj = [uname, uemail, upassw, auth_key];

			conn.create();
			conn.registerUser(user_obj, function () {
				// generate confirmation link
				var conf_link = "http://127.0.0.1:1337/login/confirm?mail=" + uemail + "&key=" + auth_key;

				var mail_subject = "Registrierung bei ITM - Bin";
				var mail_text = "";

				mail_text = mail_text.replace(/{LOGIN}/g, uname)
														.replace(/{CONFIRMATION_LINK}/g, conf_link);

				// send confirmation mail
				mail.sendMail(uemail, mail_subject, mail_text, function() {
					// redirect to confirmation page


				});
			});
			conn.close();
	} else if (restUrl.id == "confirm") {
			var mail = decodeURIComponent(restUrl.params.mail);
			var auth_key = decodeURIComponent(restUrl.params.key);

			// check database for matching mail / key combination
			// set auth to 1

			// redirect to successful registration page
	} else if (restUrl.id == "check") {
			console.log("Now we check the login")
	} else {
		console.log("DEBUG PageController handle: id unknown:",restUrl.id)
		var msg="DEBUG PageController: id should be 'welcome' or 'about' or '...'."+
				" We do not know how to handle '"+restUrl.id+"'!"
	}

}
var loginController = new LoginController()
module.exports = loginController
