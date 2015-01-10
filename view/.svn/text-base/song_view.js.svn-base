"use strict"
var fs = require('fs')
	
var SongView = function(){
	console.log("DEBUG SongView initialise...")
	this.layout="view/layout.html"
	this.song_template	="view/song/song_template.html"
	this.songs_template	="view/song/songs_template.html"
	this.search_template="view/song/search_template.html"
}


SongView.prototype.formatHtml = function(res,restUrl,data,htmlTemplate){
	var result = htmlTemplate
		
	if (restUrl.id=="all"){ // a list of songs
		// TODO smarter replacement
		var songHTML=""
		for (var song in data){
			var curr_song=data[song]
			songHTML+= "<li>"
			songHTML+= "<a href=\""+curr_song.id+".html\">"
			songHTML+= curr_song.title
			songHTML+= "</a>"
			songHTML+= "</li>"
		}
		result=result.replace(/{SONGS}/g,songHTML ) 
			
	}else{ // a single song:
		// TODO smarter replacement
		if (data && data.title)
			result=result.replace(/{TITLE}/g,data.title ) 
						 .replace(/{ARTIST}/g,data.artist ) 
						 .replace(/{SONGID}/g,data.id)
						 .replace(/{COUNTER}/g,7 ) // TODO add more data :)		
		
	}
			
	// send html data back to client	
	res.writeHead(200, {'Content-Type': 'text/html'} );
	res.end(result);	
	
}

SongView.prototype.getDetailTemplate = function(songView, res,restUrl,data,layoutHtml){
	var format = restUrl.format
	if (restUrl.id=="search"){
		var filenameDetailTemplate = this.search_template	
	}else if (restUrl.id=="all"){
		var filenameDetailTemplate = this.songs_template			
	}else{
		var filenameDetailTemplate = this.song_template		
	}
	console.log("Template for Details: '"+filenameDetailTemplate+"'");
	// put it into the layout
	fs.readFile(filenameDetailTemplate,function(err, layoutdata){ 
		if (err === null ){
			var templateDetail= layoutdata.toString('UTF-8')
			var htmlTemplate = layoutHtml.replace("{CONTENTS}",templateDetail)
			songView.formatHtml(res,restUrl,data,htmlTemplate);
		}else
			returnErr(res,"Error reading detail-template file '"+filenameDetailTemplate+"' for songs: "+err);
	});
}
	
SongView.prototype.getOverallLayout = function(songView, res,restUrl,data){
	var filenameLayout=this.layout	
	console.log("DEBUG SongView render in format HTML with template '"+filenameLayout+"'")
	var returnErr = this.returnErr
	fs.readFile(filenameLayout,function(err, filedata){ // async read data (from fs/db)
		if (err === null ){
			var layoutHtml= filedata.toString('UTF-8')
			console.log("DEBUG SongView HTML Layout '"+layoutHtml+"'")
			songView.getDetailTemplate(songView,res,restUrl,data,layoutHtml)
		}else
			returnErr(res,"Error reading global layout-template file '"+filenameLayout+"'. Error "+err);
	})
}
SongView.prototype.render = function(res,restUrl ,data){
	var format = restUrl.format
	console.log("DEBUG SongView render in format: ",format)
	
	var songView = this // we save the reference/pointer to this object
		
	if (format=="json"){ // content type for JSON
		console.log("DEBUG: combine data and template for JSON...")
		res.writeHead(200, {'Content-Type': 'application/json'} );
		// format out data <= here into JSON
		var result = JSON.stringify(data) // fill template
		result +="\n"
		res.end(result); // return formatted data to the client

	}else if (format=="html"){	
		// now we render one song, many songs or the song-search form
		if (data) 	
			this.getOverallLayout(songView, res,restUrl,data)
		else
			this.getOverallLayout(songView, res,restUrl,data)
	}else{
		this.returnErr(res,"Error: The specified format '"+format+"' is unknown!")
	}
}


// Some helpers:

// JSON render Not-Implemented Error on data-loading
SongView.prototype.renderNotImplemented = function(res,restUrl,data){
	console.log("DEBUG SongView render not implemented yet.")
	res.writeHead(400, {'Content-Type': 'application/json'} );
	res.end( JSON.stringify(data)+"\n" );
}	

// JSON render Error on data-loading
SongView.prototype.renderError = function(res,restUrl,data){
	console.log("DEBUG SongView render not implemented yet.")
	res.writeHead(404, {'Content-Type': 'application/json'} );
	res.end(  JSON.stringify(data)+"\n" );
}
module.exports = SongView


// helper Errors for this view:
SongView.prototype.returnErr = function(res,msg){
	console.log("DEBUG SongView: "+msg)
  	res.writeHead(503, {'Content-Type': 'text/plain'});
  	res.end("ERROR: '"+msg+"'\n");	
}

