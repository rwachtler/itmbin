"use strict"
var fs = require('fs')

// requirements for the Redis key/value store: install and start the server
// brew install redis
//	=> redis-server
//	(optional: => redis-cli
//       > set pers_01 '{"person":{"age":33,"name":"Karl"}}'" )
//       > keys per*
//       > get pers_01
//       > hset song 33 {artist:'queen',title:'anotherone'}
//       > hset song 34 {artist:'floyd',title:'anotherbrick'}
//       > HKEYS "song"
//       > hget song 12
	
// npm install redis
var redis = require("redis")


var Song = require("../model/song_model")

var SongData = function(){
	console.log("DEBUG SongData initialisation. We setup the db-connection.")
	this.db = redis.createClient(6379,"127.0.0.1")
}


//
// create a new song
//
SongData.prototype.create = function(theView,res,restUrl){
	var returnErr = this.returnErr
		
	// prepare the call-back-function
	var gotDataCallbackFunction = function(err, songs){
		if (err === null ){ // not: ...=== undefined
			theView.render(res,restUrl, songs )
		}else
			returnErr(res,"Error with database: "+err);
	}	

	console.log("DEBUG SongData store/persist songs by id '"+restUrl.id+"'...")
	var returnErr = this.returnErr
	var title=restUrl.params['title'] || "post/get param title unknown"
	var artist=restUrl.params['artist'] || "post/get param artist unknonw"
	var db = this.db
	db.incr("SEQUENCE_ID",function(err,data){ // we need a new (UNIQUE!) id for the new song
	  var nextUniqueSongID=data
	  console.log("for increase SEQUENCE_ID we got: ",nextUniqueSongID)
	  var song = new Song(title,artist,nextUniqueSongID)
	  console.log("DEBUG SongData create a new song with title='"+title+"' and artist='"+artist+"': ",song)
	  db.hset("song",song.id,JSON.stringify(song), function(err, data){ // async read data (from db)
		if (err === null ){
			db.hgetall('song',function(err,data){
				console.log("DEBUG: all songs as raw data:",data)
				var songs=[]
				for (var key in data){
					console.log("DEBUG: a song:",key, data[key] )
					songs.push( JSON.parse( data[key] ) )	
				}
				console.log("DEBUG: all songs:",songs)
				gotDataCallbackFunction( err, songs )
			});
		}else{
			console.log("ERROR: creating new song")
			returnErr(res,"Error creating new song: "+err);
		}
	  });
    })
}

//
// find all the songs (optional: fulfilling a given filter-criterium)
// 
SongData.prototype.findAll = function(theView,res,restUrl, filter){
	console.log("DEBUG SongData find all songs...")
	var returnErr = this.returnErr
		
	// prepare the call-back-function
	var gotDataCallbackFunction = function(err, songs){
		if (err === null ){ // not: ...=== undefined
			theView.render(res,restUrl, songs )
		}else
			returnErr(res,"Error reading file: "+err);
	}	
	// async read data from the database (see: http://redis.io/commands )
	//fs.readFile(this.filename);
	
	this.db.hgetall('song',function(err,data){
		console.log("DEBUG: all songs as raw data:",data)
		//console.log("DEBUG: songs['2']:",JSON.parse(data['2']).title )
		var songs=[]
		for (var key in data){
			console.log("DEBUG: a song:",key, data[key] )
			var newSong=JSON.parse( data[key] )
			// we make a song out of this object :)
			newSong.__proto__ = Song.prototype; 
			if ( newSong.fulfillsSearchCriteria(filter) ){
				songs.push( newSong )					
			} 
		}
		console.log("DEBUG: all songs:",songs)
		gotDataCallbackFunction( err, songs )
	});

}

SongData.prototype.deleteById = function(theView,res,restUrl){
	console.log("DEBUG SongData delete songs by id '"+restUrl.id+"'...")
	var returnErr = this.returnErr
	this.db.hdel("song",restUrl.id,function(err, data){ // async read data (from db)
		if (err === null ){
			console.log(" DEL: we got from the database raw data '"+data+"'");
			if (data>0) // hdel: 0 for error, 1 for success
				theView.render(res,restUrl,{status:'SUCCESS',message:"we deleted song with id "+restUrl.id}) // call view with the data-item
			else
				returnErr(res,"Delete-Error: Song with id '"+restUrl.id+"' not found.")
		}else
			returnErr(res,"Error reading database: "+err);
	}); 
}


//
// find a song by it's id
// 
SongData.prototype.findById = function(theView,res,restUrl){
	console.log("DEBUG SongData find songs by id '"+restUrl.id+"'...")
	var returnErr = this.returnErr
	this.db.hget("song",restUrl.id,function(err, data){ // async read data (from db)
		if (err === null ){
			console.log(" we got for song id='"+restUrl.id+"' raw db data '"+data+"'");
			if (data){
				var song= JSON.parse( data.toString('UTF-8') )
				console.log(" => song with id "+restUrl.id+":",song);
				theView.render(res,restUrl,song) // call view with the data-item				
			}else{
				returnErr(res,"Song with id '"+restUrl.id+"' not found.")				
			}
		}else
			returnErr(res,"Error reading database: "+err);
	}); 
}

// curl -X PUT "http://localhost:8888/testing/song/2.json?title=Another%20bites&artist=queen"
//
// update (=replace) a song with a given id
//
SongData.prototype.persistById = function(theView,res,restUrl,song){
	console.log("DEBUG SongData store/persist songs by id '"+restUrl.id+"'...")
	var returnErr = this.returnErr
	this.db.hset("song",restUrl.id,JSON.stringify(song), function(err, data){ // async read data (from db)
		if (err === null ){
			console.log(" we saved the song to the database.");
			theView.render(res,restUrl,song) // call view with the data-item
		}else
			returnErr(res,"Error reading database: "+err);
	}); 
}


// helper:
SongData.prototype.returnErr = function(res,msg){
  	res.writeHead(503, {'Content-Type': 'text/plain'});
  	res.end("ERROR: '"+msg+"'\n");	
}
module.exports = SongData