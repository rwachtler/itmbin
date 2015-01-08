var nodemailer = require('nodemailer');

Mailer = function(){
	console.log("Configuring the mailer...")
	this.from="michael.stifter2@edu.fh-joanneum.at"
	this.options={
		host:"mail.fh-joanneum.at",
		port:25
	}
}
Mailer.prototype.sendMail = function(to, subject, message, callback){
	var transporter = nodemailer.createTransport( this.options );
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
