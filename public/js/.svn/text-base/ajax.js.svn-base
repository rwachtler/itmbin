window.onload = function() 
{
	// set js-action for retriefing the LIST of songs
	document.getElementById('searchButton').onclick = function(){ajaxCall("search");};  // search 
	document.getElementById('getAllButton').onclick = function(){ajaxCall("loadAll");   };	// refresh (=getAll)
	
	// set jsc-action for CRUD-functions: create-read-update-delete a SINGLE song
	document.getElementById('postButton').onclick   = function(){ajaxCall("create");};	// create

	 // refresh the list on startup	
	ajaxCall("loadAll");
}

// helper method: format a single song...
function songToHTML(){
	var aLineOfHtmlForTheSong = "<li id=\""+song.id+"\">"
	//aLineOfHtmlForTheSong += "<form>id="+song.id+":" // better hide the id from the user
	aLineOfHtmlForTheSong += "<input id=\"song_"+song.id+"_title\" type=\"text\" value=\""+song.title+"\" >"
	aLineOfHtmlForTheSong += " by "
	aLineOfHtmlForTheSong += "<input id=\"song_"+song.id+"_artist\" type=\"text\" value=\""+song.artist+"\" >"
	aLineOfHtmlForTheSong += "<button id=\"putButton_"+song.id+"\" >Update</button>"
	aLineOfHtmlForTheSong += "<button id=\"deleteButton_"+song.id+"\" title=\"Delete the song "+song.title+"...\">Delete</button>"
	aLineOfHtmlForTheSong += "<button id=\"getButton_"+song.id+"\">Refresh</button>"
	//aLineOfHtmlForTheSong += "</form>"
	aLineOfHtmlForTheSong += "</li>"
	return aLineOfHtmlForTheSong
}

function setJavaScriptActionsForButtons(songs){
	for (var j in songs){
		var curr_song=songs[j]
		console.log("curr-song: ", curr_song)
		document.getElementById('putButton_'+curr_song.id).setAttribute(	'onClick',"javascript:ajaxCall(\"update\","+curr_song.id+")")	
		document.getElementById('deleteButton_'+curr_song.id).setAttribute(	'onClick',"javascript:ajaxCall(\"delete\","+curr_song.id+")")	
		document.getElementById('getButton_'+curr_song.id).setAttribute(	'onClick',"javascript:ajaxCall(\"refresh\","+curr_song.id+")")
	}
}

function debug(msg){
	document.getElementById('message').innerHTML = new Date()+": "+ msg+"<br/>"+document.getElementById('message').innerHTML;
}

// for search, loadAll, create we update the list
function updateTheList(xmlhttp,action){
	try {
		songs=JSON.parse(xmlhttp.responseText)
		if (songs instanceof Array){
			songsHTML="";
			for (var i in songs){
				song=songs[i]
				songsHTML += songToHTML(song)
			}
			document.getElementById('listOfSongs').innerHTML=songsHTML;
			setJavaScriptActionsForButtons(songs)	
			debug("INFO: for "+action+" we got: '"+xmlhttp.responseText+"': ");
		}else{
			debug("Error: for "+action+" we did not get a list??: '"+xmlhttp.responseText+"': ");
		}
	}catch(err) {
		debug("Error: for "+action+" we got: '"+xmlhttp.responseText+"': "+err);
	}
	
}
// for update, refresh we update the current item only
function updateSingleItem(xmlhttp,action){
	song=JSON.parse(xmlhttp.responseText)	
	debug("INFO: for "+action+" we got: '"+xmlhttp.responseText+"': ",song);
	document.getElementById('song_'+song.id+'_title').value = song.title
	document.getElementById('song_'+song.id+'_artist').value = song.artist
}


function updateThePageWithNewData(xmlhttp,action){
	debug("INFO: for "+action+" we update the page now...	");
	if ( (action=='search') || (action=='loadAll') || (action=='create') ){ // update the list
		updateTheList(xmlhttp,action)
	}else if (action=='delete'){
		debug("INFO: for action '"+action+"' we got: '"+xmlhttp.responseText+"'.");
		ajaxCall("loadAll");
	}else{ // update a single line (a single song)
		updateSingleItem(xmlhttp,action)
	}

}

function ajaxCall(action,id) // for thed list
{
	debug("Button-Click: action="+action+" for id="+id)
	var xmlhttp;
	xmlhttp=new XMLHttpRequest();
		
	if (action=="search"){
		var searchTerm = encodeURIComponent(document.getElementById('searchterm').value)
		url="search.json?searchterm=" + searchTerm
		xmlhttp.open('get',url,true);
	}else if (action=="loadAll"){
		url="all.json"
		xmlhttp.open('get',url,true);
	}else if (action=="create"){
		var title =encodeURIComponent(document.getElementById('newsong_title').value)
		var artist=encodeURIComponent(document.getElementById('newsong_artist').value)
		url="create.json?title=" + title + "&artist=" + artist
		xmlhttp.open('post',url,true);
	}else if (action=="update"){
		var title =encodeURIComponent(document.getElementById('song_'+id+'_title').value)
		var artist=encodeURIComponent(document.getElementById('song_'+id+'_artist').value)
		url=id+".json?title=" + title + "&artist=" + artist
		xmlhttp.open('put',url,true);		
	}else if (action=="delete"){
		url=id+".json" 
		xmlhttp.open('delete',url,true);
	}else if (action=="refresh"){
		url=id+".json"
		xmlhttp.open('get',url,true);
	}else{
		debug("Error: action '"+action+"' unknown!");
		return;
	}
	// TODO: disable "relevant" buttons
	xmlhttp.onreadystatechange=function(){
  		if (xmlhttp.readyState==4){
  			if (xmlhttp.status==200){
				// TODO: enable "relevant" buttons again
				updateThePageWithNewData(xmlhttp,action)
			}else{
				debug("Error from the web service for action "+action+": "+xmlhttp.status+": "+xmlhttp.responseText)
			}
    	}
  	}

	xmlhttp.send();

}
