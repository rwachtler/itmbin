"use strict"

var fs = require("fs");

var PageView = require("../view/page_view");

// Database connection-
var db = require('../helper/db-mysql');
var conn = new db.Connection();

// ITM - Bin helper
var ItmBin = require('../helper/itmbin')
var binhelper = new ItmBin.ItmBin();

// Nodemailer
var mailer = require('../helper/mailer');
var mail_sender = new mailer.Mailer();

var mailTemplateFile = "view/login/mail_template.html";

var LoginController = function(){

}

LoginController.prototype.handle = function(restUrl,res,config,session_id,sessMgmt){

	// PUT http://localhost:8888/song/1.json?title=Unten%20am%20Hafen&lang=de
	// => method = PUT path = / resource = song id = 1 format = json params = { 'title' : "Unten am Hafen", 'lang': "de"}

	var session	= sessMgmt.getOrCreateSession(session_id,restUrl.params);



	if (restUrl.id == "login"){
		var data = { title: "ITM - Bin Login" };

		var theView = new PageView()
		theView.render(res,restUrl, data)
	} else if (restUrl.id == "save") {
			if (restUrl.params.new_user !== undefined) {
				// we use decodeURIComponent because for instance @ gets converted to %40.
				var uname = decodeURIComponent(restUrl.params.new_user);
				var uemail = decodeURIComponent(restUrl.params.new_email);
				var upassw = decodeURIComponent(restUrl.params.new_password);

				// save the registration and send confirmation mail
				var auth_key = binhelper.getAuthKey();

				var user_obj = [uname, uemail, upassw, auth_key];

				conn.create();
				conn.registerUser(user_obj, function () {
					// read mail template
					fs.readFile(mailTemplateFile, function(err, filedata){
						if (err === null ){
							// generate confirmation link
							var conf_link = "http://" + config.server + ":" + config.port + "/login/confirm?mail=" + uemail + "&key=" + auth_key;

							var mail_subject = "Registrierung bei ITM - Bin";
							var mail_text = filedata.toString('UTF-8');

							mail_text = mail_text.replace(/{LOGIN}/g, uname)
																	.replace(/{CONFIRMATION_LINK}/g, conf_link);

							// send confirmation mail
							mail_sender.sendMail(uemail, mail_subject, mail_text, function() {
								// redirect to confirmation page
								// show please confirm via email page
								var data = {
										title: "ITM - Bin Confirmation successful",
										success: 1
									};

									var theView = new PageView()
									theView.render(res,restUrl, data)
							});
						}else
							returnErr(res,"Error reading mail template file: " + err);
					});
				});
			} else {
				// no valid post params --> unsuccessful page
				var data = {
						title: "ITM - Bin",
						success: 0
					};

					var theView = new PageView()
					theView.render(res,restUrl, data)
			}
	} else if (restUrl.id == "confirm") {
			var auth_mail = decodeURIComponent(restUrl.params.mail);
			var auth_key = decodeURIComponent(restUrl.params.key);

			var user_data = [auth_mail, auth_key];

			conn.create();
			conn.confirmUser(user_data, function () {

				// Success
				var data = {
						title: "ITM - Bin Confirmation successful",
						success: 1
					};

					var theView = new PageView()
					theView.render(res,restUrl, data)
			}, function () {
				// Failure
				// redirect to not successful page
				var data = {
					title: "ITM - Bin Confirmation not successful",
					success: 0
				};

				var theView = new PageView()
				theView.render(res,restUrl, data)
			});
	} else if (restUrl.id == "auth") {
			// check if login was valid
			var entered_login = decodeURIComponent(restUrl.params.login);
			var entered_pw = decodeURIComponent(restUrl.params.password);

			// entered_login is in there twice because we check for either user name or email address
			var login_data = [entered_login, entered_login, entered_pw];

			conn.create();
			conn.performLogin(login_data, function (user_) {
				// Success
				console.log(user_);

				// set the user as the user for this session
				var session	= sessMgmt.getOrCreateSession(session_id,restUrl.params)

				session.user = user_;

				var data = {
						title: "ITM - Bin Login successful",
						success: 1
					};

					var theView = new PageView()
					theView.render(res,restUrl, data)
			}, function () {
				// Failure, redirect to unsuccessful login page
				var data = {
					title: "ITM - Bin Login not successful",
					success: 0
				};

				var theView = new PageView()
				theView.render(res,restUrl, data)
			});

	} else if (restUrl.id == "list") {
			// save this object
			var listThis = this;

			// get all users
			conn.create();
			conn.getUsers( function (users) {

				// parse user list to table
				var user_table = listThis.getUserListTable(users);

				var data = {
					title: "ITM - Bin User list",
					user_list: user_table,
					login: sessMgmt.getLoginHtml(session.user)
				};

				var theView = new PageView()
				theView.render(res,restUrl, data)
			} );
	} else if (restUrl.id == "logout") {
		// reset session.user so user is logged out
		session.user = null;

		var data = {
				title: "ITM - Bin Logout successful",
				success: 1
			};

			var theView = new PageView()
			theView.render(res,restUrl, data)
	} else {
		console.log("DEBUG PageController handle: id unknown:",restUrl.id)
		var msg="DEBUG PageController: id should be 'welcome' or 'about' or '...'."+
				" We do not know how to handle '"+restUrl.id+"'!"

		// return oops page
		var staticFileController = require('./static_files_controller')
		staticFileController.handle(restUrl,res,"oops")
	}

}

/**
	Returns html table string of user_list array
*/
LoginController.prototype.getUserListTable = function (user_list) {
	var html = "";

	html += "<table>";

	console.log(user_list);

	// Table header
	html += "<tr>";
		html += "<th>Id</th>";
		html += "<th>E-Mail</th>";
		html += "<th>Login</th>";
		html += "<th>Password</th>";
		html += "<th>Authenticated</th>";
		html += "<th>Authentication key</th>";
	html += "</tr>";

	for (var user in user_list) {
		html += "<tr>";
			html += "<td>" + user_list[user].id + "</td>";
			html += "<td>" + user_list[user].email + "</td>";
			html += "<td>" + user_list[user].user_name + "</td>";
			html += "<td>" + user_list[user].pw + "</td>";
			html += "<td>" + user_list[user].auth + "</td>";
			html += "<td>" + user_list[user].auth_key + "</td>";
		html += "</tr>";
	}

	html += "</table>";

	return html;
}

var loginController = new LoginController()
module.exports = loginController
