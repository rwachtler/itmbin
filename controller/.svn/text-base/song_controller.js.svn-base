"use strict"

var SongData = require("../model/song_mgmt")
var Song 	 = require("../model/song_model")
var SongView = require("../view/song_view")
	
var SongController = function(){
	console.log("DEBUG SongController initialise the redis db ONCE!")
	this.songData=new SongData()
	this.songView=new SongView()
}

SongController.prototype.handle = function(restUrl,res){
	
	// PUT http://localhost:8888/song/1.json?title=Unten%20am%20Hafen&lang=de
	// => method = PUT path = / resource = song id = 1 format = json params = { 'title' : "Unten am Hafen", 'lang': "de"}
	
	if (restUrl.id == "all"){
		this.songData.findAll( this.songView ,res,restUrl)		
	}else if (restUrl.id == 'create'){ 
		this.songData.create( this.songView ,res,restUrl)
	}else if (restUrl.id == 'first'){
		var msg="DEBUG SongController: TODO implement action 'first'"
		this.songView.renderNotImplemented(res,restUrl,msg)
	}else if (restUrl.id == 'search'){
		var searchTerm=restUrl.params['searchterm']
		this.songData.findAll( this.songView ,res,restUrl,searchTerm) // we filter by searchTerm
	}else{ 
		var no = parseInt(restUrl.id)
		if ( ! isNaN(no)  ){
			console.log("DEBUG SongController handle: id='"+no+"'")
			if (restUrl.method=='PUT'){ // we update an id
				var title=restUrl.params['title'] || "please specify title"
				var artist=restUrl.params['artist'] || "please specify an artist"
				var aNewSong= new Song(title,artist,restUrl.id)
				this.songData.persistById( this.songView ,res,restUrl,aNewSong)									
			}else if (restUrl.method=='DELETE'){ // we update an id
				new SongData().deleteById( this.songView ,res,restUrl)	
			}else{ // just GET the data
				var theView = new SongView()
				this.songData.findById( this.songView ,res,restUrl)					
			}
		}else{
			console.log("DEBUG SongController handle: id unknown:",restUrl.id)
			var msg="DEBUG SongController: id should be a number or 'first' or 'all'."+
					" We do not know how to handle '"+restUrl.id+"'!"
			this.songView.renderError(res,restUrl,msg)
		}
	}
	
}
// we create a songController OBJECT and return it:
var songController=new SongController()
module.exports = songController
