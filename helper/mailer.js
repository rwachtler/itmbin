var nodemailer = require('nodemailer');

Mailer = function(){
	console.log("Configuring the mailer...")
	//this.from="michael.stifter2@edu.fh-joanneum.at"
	this.options={
		host:"mail.fh-joanneum.at",
		port:25
	}

	this.from = "itmbin.itm13@gmail.com";

	this.gmailSettings = {
		service: "Gmail",
		auth: {
			user: "itmbin.itm13@gmail.com",
			pass: "dynweb_itmbin"
		}
	}
}
Mailer.prototype.sendMail = function(to, subject, message, callback){
	//var transporter = nodemailer.createTransport( this.options );
	var transporter = nodemailer.createTransport( "SMTP", this.gmailSettings );
	console.log("Prepare to mail to '"+to+"'")
	transporter.sendMail({ // in the background:
		    from: this.from,
			to: to,
		    subject: subject,
		    html: message,
		}, function(err,info){
			if (err) {
				throw err
			}else {
				console.log("Final Message-ID: ", info.messageId)
				callback()
			}
		});
}

module.exports.Mailer = Mailer
