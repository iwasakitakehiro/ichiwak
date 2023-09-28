var nodemailer = require("nodemailer");

export async function sendMail(subject, toEmail, otpText) {
  var transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 465,
    auth: {
      user: process.env.MAIL_AUTH_USER,
      pass: process.env.MAIL_AUTH_PASS,
    },
  });

  var mailOptions = {
    from: "no-reply@ichiwak.com",
    to: toEmail,
    subject: subject,
    html: otpText,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(new Error(error));
      } else {
        resolve(true);
      }
    });
  });
}
