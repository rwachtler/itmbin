"use strict"

var fs = require('fs')

// http://localhost:1337/public/img/logo.html
// http://localhost:1337/public/welcome.html
// http://localhost:1337/public/style/main.css

var StaticFilesController = function(){
	console.log("DEBUG StaticFilesController initialisation...")
}

StaticFilesController.prototype.handle = function(restUrl,res){
	var filename = restUrl.filename
	if (restUrl.resource.length>0) filename = restUrl.resource+"/"+filename
	if (restUrl.relPath.length>0)  filename = restUrl.relPath+"/"+filename
	console.log("DEBUG: serving static '"+restUrl.format+"' file: '"+filename+"'...")
		var returnErr=this.returnErr
	fs.readFile(filename,function(err, filedata){ // async read data (from fs/db)
		if (err === null ){
			if ( restUrl.format.indexOf('png')>=0 ){
				res.writeHead(200, {'Content-Type': 'image/png'} );
				res.end(filedata);
			}else if (restUrl.format.indexOf('jpg')>=0){
				res.writeHead(200, {'Content-Type': 'image/jpeg'} );
				res.end(filedata);
			}else if ( restUrl.format.indexOf('m4a')>=0 ){
				// TODO: streaming... 
				res.writeHead(200, {'Content-Type': 'audio/m4a'} );
				res.end(filedata);
			}else if (restUrl.format.indexOf('htm')>=0) {
				res.writeHead(200, {'Content-Type': 'text/html'} );
				res.end( filedata.toString('UTF-8') );
			}else if (restUrl.format.indexOf('js')>=0) {
				res.writeHead(200, {'Content-Type': 'text/javascript'} );
				res.end( filedata.toString('UTF-8') );
			}else
				returnErr(res,"Unsupported file type: '"+restUrl.format+"'")			
		}else
			returnErr(res,"Error reading file '"+filename+"': "+err);
		}
	)
}
var staticFileController = new StaticFilesController()
module.exports = staticFileController


// helper Errors for static files:
StaticFilesController.prototype.returnErr = function(res,msg){
	console.log("DEBUG: serving static files "+msg)
  	res.writeHead(503, {'Content-Type': 'text/plain'});
  	res.end("ERROR: '"+msg+"'\n");	
}