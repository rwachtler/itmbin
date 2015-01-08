// try with e.g.: 
//  	curl "http://localhost:8888/song/1.json?lan=ge&title=Paperback%20Writertoken=33 "

// examples of "resourceful routing":
// GET http://localhost:8888/public/images/logo.png
// GET http://localhost:8888/song/all.json
// GET http://localhost:8888/song/1.json
// POST http://localhost:8888/song/create.json?title=Paperback%20Writer

// PUT http://localhost:8888/song/1.json?title=Unten%20am%20Hafen&lang=de
// => method = PUT path = / resource = song id = 1 format = json params = { 'title' : "Unten am Hafen", 'lang': "de"}

UrlParser = function(req, postData){
	this.url=req.url;
	this.method=req.method
	
	// defaults:
	this.path="";
	this.resource="";
	this.id=null;
	this.format=null;
	this.params={};
	this.filename=null; // filename without leading / => public/img/logo.png
	
	// to update filename, suffix,... 

	// first we analyse the url of the request:	
	this.parseUrlData();
	// then we analyse the post-data of the request:	
	if (postData) this.parsePostData(postData)
	// => now we have for "resource-ful-routing" infos such as:
	//    method, path, resourceId, format (=suffix) 
}

UrlParser.prototype.parsePostData = function(data){
	// console.log("POST raw data:",data);
	dataStr = data.toString();
	listOfKV = dataStr.split('&');
	// console.log("POST: list of key/value pairs",listOfKV)
	var urlparser=this
	listOfKV.forEach(function(elem){
		kv= elem.split('=');
		k=kv[0];
		v=kv[1] || kv[0]; // if not key value we just use value
		// console.log(" adding POST params:",k,v)
		urlparser.params[k] = v;
	})
}

UrlParser.prototype.parseUrlData = function(){
	
	// /intern/admin/song/create.json?lan=ge==de&title=Paperback%20Writer&token=33
	var posLastSlash= this.url.lastIndexOf("/")
	pathAndResource=this.url.substring(0,posLastSlash)
	console.log("!! DEBUG:",pathAndResource)
	parts = pathAndResource.split("/") 		// [ '' , intern , admin , song ]
	if (parts.length>1) parts.shift() 		// we remove the first empty ""
	console.log("!! DEBUG:",parts)
	this.resource = parts.pop()			 	// song		
	this.relPath= parts.join("/")			// intern/admin
	this.path = parts						// | intern , admin ]	
	
		
	idAndFormatAndParams=this.url.substring(posLastSlash+1)
	parts = idAndFormatAndParams.split("?") // [ create.json , title=Paperback%20Writer ]
	this.filename=parts.shift()				// create.json 
	var paramString = parts[0] || null		// title=Paperback%20Writer
	parts = this.filename.split(".")		// [ create, json]
	this.id=parts.shift()					// create
	this.format=parts.join("")				// json
			
	if (paramString) { // we analyse the params (if available)
		var params={}
		kvs = paramString.split("&") 		// [ lan=ge==de title=Paperback%20Writer token=33 ]
		kvs.forEach(function(item){	
			parts=item.split("=")			// [lang,ge,,de]
			k=unescape(parts.shift())		// lang
			v=unescape(parts.join("="))		// ge==de
			params[k]=v						// {lang: "ge==de"}
		});
		this.params=params;
	}
	// console.log("DEBUG UrlParser: ", this);
}

module.exports.UrlParser = UrlParser