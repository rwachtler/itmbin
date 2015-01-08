module.exports = {
	
	// should we redirect to a specific page?
	checkForUrlRedirection: function(req){
	  // console.log("request-url: '"+req.url+"'");
	  var curr_url = req.url
  	  if (curr_url == "/" || curr_url == "" ){
		  console.log("INFO routes: we redirect '/' to our welcome page 'welcome.html'... ")
  		  curr_url="/index.html"
  	  }
	  return curr_url
	},
	
	// return a controller based on the path/resource/filename/authentication/cookie/...
	getController: function(restUrl){
		console.log("DEBUG routes: restUrl.filename='"+restUrl.filename+"'... ")
		var controllerString = "default"
			
		if (restUrl.path.indexOf("public") >=0 ) controllerString = 'static'
		if (restUrl.resource == "public") 		 controllerString = 'static'
		if (restUrl.filename == "index.html" )   controllerString = 'static'
			
		if (restUrl.resource == "song") 		 controllerString = 'song'
			
		if (restUrl.resource == "page") 		 controllerString = 'page'
			
		if (restUrl.resource == "testing") 		 controllerString = 'testing'
			 
		return controllerString
	}
	
}