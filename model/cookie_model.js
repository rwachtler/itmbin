function Cookie(name,v){	
	this.name=name
	this.value=v
	this.maxage=null; //60*60*3 // 60 sec * 60 min => 3h
	var expireOn = new Date()
	expireOn.setDate( expireOn.getDate() + 3) // expire in three days
	this.expires=expireOn.toUTCString() // "Mon, 31-Dec-2035 23:00:01 GMT"
	this.domain=null
	this.path="/"
	this.secure=null // true: set only for https connections
	this.httponly=true // what is this ??
}
Cookie.prototype.toString = function(){
	var result  =  this.name + "="+this.value;
	if (this.maxage)    result += "; Max-Age="+this.maxage;
	if (this.expires) 	result += "; expires="+this.expires;
	if (this.domain) 	result += "; domain="+this.domain;
	if (this.path) 		result += "; path="+this.path;
	if (this.secure) 	result += "; secure"
	if (this.httponly) 	result += "; HttpOnly"
	// console.log("DEBUG: this is cookie '"+result+"'...")
	return result
}
module.exports = Cookie