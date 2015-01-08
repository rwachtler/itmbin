"use strict"
	
var Song = function(title,artist,id){
	this.id=id
	this.title=title
	this.artist=artist|| "unknown"
}

Song.prototype.toString = function(){
	return "This is song '"+this.title+"'."
}

Song.prototype.fulfillsSearchCriteria = function(searchTerm){
	console.log("DEBUG-FILTER we filter by term="+searchTerm+"'")
	if (searchTerm == undefined) return true
	var included=false
	if (this.title.indexOf(searchTerm) >=0) included=true 
	if (this.artist.indexOf(searchTerm) >=0) included=true 
	return included
}


module.exports = Song