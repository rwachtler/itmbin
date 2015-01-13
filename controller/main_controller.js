// node modules:
var http = require('http');
var fs = require('fs');

// read the config ONCE
var config = require('../config')
console.log("About: author ",config.author," version ",config.version)

// our custom modules:
var up = require('../helper/urlparser')
var routes = require('./routes')
var sessMgmt = require('../model/session_mgmt')

// MySql connector
var db = require('../helper/db-mysql');
var conn = new db.Connection();
conn.create();
conn.init();
// ITM - Bin helper
var ItmBin = require('../helper/itmbin')
var binhelper = new ItmBin.ItmBin();

var restRouting = function(req,res,restUrl){

	sessMgmt.log();

	// get or create a session from SessionManagement
	var cookies 	= sessMgmt.extractCookiesFromRequest(req)
	var session_id	= sessMgmt.getSessionId(cookies);
	var session 	= sessMgmt.getOrCreateSession(session_id,restUrl.params)
	sessMgmt.updateTheResponseHeaders(cookies,session,res)

	// get current User from Session
	if (session.user === null) {
		console.log("No user logged in");
	} else {
		console.log("User in this session: " + session.user['user_name']);
	}

  // routing section
  console.log("Routing: we analyse url and return 'something' for restUrl: ", restUrl);

  switch(routes.getController(restUrl)){
    case 'static':
		console.log("We will return static files by url");
		var staticFileController = require('./static_files_controller')
		staticFileController.handle(restUrl,res)
	  	break;
	case 'page':
		// you can't view /page/main when you are not logged in!
		if (session.user === null && restUrl.id == "main") {
			var staticFileController = require('./static_files_controller')
			staticFileController.handle(restUrl,res,"not_logged_in")
		} else {
			var pageController = require('./page_controller')
			pageController.handle(restUrl, res, session_id, sessMgmt)
		}

		break;
	case 'testing':
		var testingController = require('./testing_controller')
		testingController.handle(restUrl,res,config)
		break;
	case 'login':
		var loginController = require('./login_controller')
		loginController.handle(restUrl, res, config, session_id, sessMgmt)
		break;
	default:
		/*res.writeHead(400, {'Content-Type': 'text/plain'});
		res.end('We will NOT return the "unknown" resource "'+restUrl.filename+'" with path="'+restUrl.path+'", id="'+restUrl.id+'" and type="'+restUrl.format+'" !\n');*/

		// unknown filename/path/id/format --> redirct to oops page
		var staticFileController = require('./static_files_controller')
		staticFileController.handle(restUrl,res,"oops")
  }
}


startup = function(){
	// we start up the server:
	http.createServer(function (req, res) {
	  console.log("\nWe got a new request: for url '"+req.url+"'\n")

		// we handle default url setting (re-routing):
		req.url = routes.checkForUrlRedirection(req)
	    if (req.method == 'POST' || req.method == 'PUT' ) { // POST & PUT might send data
			// try e.g.: curl -X PUT --data "user=5" "http://localhost:8888/testing/song/2.json?title=Another%20bites&artist=queen"
	        var body = '';
			req.on('data', function(data) { // we 'wait' for postData first
				body += data;
			})
	        req.on('end', function () {
 				console.log("POST, so we got a data: '"+body+"'")
 				var restUrl= new up.UrlParser(req,body);
 				restRouting(req,res,restUrl)
	        });

		}else{ // GET, DELETE
			var restUrl= new up.UrlParser(req);
			restRouting(req,res,restUrl)
		}
  	}).listen(config.port, config.server);

	console.log('Server running at http://'+config.server+':'+config.port+'/')
}

module.exports.startup=startup
