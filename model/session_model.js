var globalSessionIdCounter=100
function Session(id,params){	
	this.id=id || this.newId()
	this.created=new Date()
	
	// some info we have only on the server
	this.hits=0
	this.user=null // no known logged-in user at the moment
	
	// extract info from the get/post parameter or set defaults 
	this.lang = params['lang'] || "en"
}
Session.prototype.newId=function(){
	globalSessionIdCounter++
	return globalSessionIdCounter + "_"+new Date()
}
Session.prototype.incHitCounter=function(){
	this.hits++
}
Session.prototype.toString = function(){
	return "Session "+this.id + " (created "+this.created+"): lang="+this.lang;
}

module.exports = Session