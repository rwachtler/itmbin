var Cookie = require('./cookie_model')
var Session = require('./session_model')

// current sessions stored in memory:	
// console.log("Session-Management module loaded.")
var sessions=[];

var sessionManagement = {
	

	extractCookiesFromRequest: function(req){
		// and requestCookies e.g.: {7987654321: {name: sessionId, value: 7987654321, domain: null, path: / ... }, ...}
	    var requestCookies = this.extractCookiesDict(req)
		// console.log("Extracted Cookie-Dict: ", requestCookies )
		return requestCookies
	},
	getOrCreateSession: function(sessionId,params){
		var session = sessions[sessionId] // get existing session (or undefined)
		if (! session){ // create session if necessary
			session = new Session(sessionId,params)
			sessions[sessionId] = session
		} 
		session.incHitCounter()
		// console.log("DEBUG sessionManagement getOrCreateSession. All-Sessions: ",sessions,"\nSession:",session)
		return session
	},
	
	// e.g. (copy demo-string from Google-Chrome-Browser/Inspect/Network Tab/Request-Header/ViewSource):
	// Cookie: _gist_session=BAh7B0kiD3Nlc3Npb25faWQGOgZFVEkiJTc1MTI4ZTVmOWRhMDlmOWZlY2Q3Zjk3YzkyZDNmNzc2BjsAVEkiEF9jc3JmX3Rva2VuBjsARkkiMTlCNWtaLzAzbzhaTnZ0d0FHMHAvOVM1Mm81cWF3UXBVbm5lbmd6UmJtZzA9BjsARg%3D%3D--795173a68e0b63e6cacac41c056a8b952ad4c244; _ga=GA1.1.1172211433.1417765803; _gat=1; _octo=GH1.1.2032726499.1417765803
	
	// try with curl: 
	// curl --cookie "session_id=7; _lang=en; info=Hi%20World" -X PUT --data "user=5" "http://localhost:8888/testing/song/2.json?title=Another%20bites&artist=queen"
	extractCookiesDict: function(req){
		// console.log("Now extract req.headers.cookie: '"+ req.headers.cookie+ "'" )
		var cookiesDict = {};
		var rc = req.headers.cookie;

		rc && rc.split(';').forEach(function( cookie ) {
		        var parts = cookie.split('=');
				var name=parts.shift().trim()
				var value=unescape(parts.join('='))
				//console.log("DEBUG: we got name="+name)
				//console.log("DEBUG: we got value="+value)
				cookiesDict[name] = new Cookie(name,value)
		});
		return cookiesDict;
	},
	
	getSessionId: function(cookies){
		var session_id=null;
		var theCookieWithSessionId = cookies['session_id']
		if (theCookieWithSessionId) {
			var session_id = theCookieWithSessionId.value
		}
		return session_id	
	},
	
	
	updateTheResponseHeaders: function(cookies,session,res){
		var respCookies =[];
		// we send back the session id
		respCookies.push( new Cookie('session_id',session.id) )
		
		// maybe we resent further cookies
		// e.g a client based hit counter:
		var clientBasedHitCountingCookie=cookies['client-hit-counter']
		var clientBasedHitCount = (clientBasedHitCountingCookie) ? parseInt(clientBasedHitCountingCookie.value) : 1
		respCookies.push( new Cookie('client-hit-counter',++clientBasedHitCount) )
		
			
		res.setHeader("Set-Cookie",respCookies)
	}
	
	
	
	// Set-Cookie	user_id=BAhpA3SNBQ%3D%3D--5fcd763b6a6a8a6bcdbaa763d7feff87fcd69a67; path=/; expires=Mon, 05 Jan 2015 07:46:41 -0000; secure; HttpOnly
}
module.exports = sessionManagement
