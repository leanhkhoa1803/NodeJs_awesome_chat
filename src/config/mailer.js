const nodemailer = require("nodemailer");

const sendMail = (to, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  const options = {
    from: process.env.MAIL_USER,
    to: to,
    subject: subject,
    html: htmlContent,
  };
  return transporter.sendMail(options);
};

module.exports = sendMail;
