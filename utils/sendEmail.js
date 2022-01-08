const nodemailer = require("nodemailer");

// https://nodemailer.com/about/

const sendEmail = async (options) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    },
  });

  const msg = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    attachments: options.files
    // html: "<b>Hello world?</b>", // html body
  };

  const info = await transporter.sendMail(msg);

  console.log("Message sent: %s", info.messageId);
}

module.exports = sendEmail;



