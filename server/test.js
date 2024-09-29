const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVICE,
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: "your-email@gmail.com", // Replace with the recipient's email
  subject: "Test Email from Nodemailer",
  text: "This is a test email sent from nodemailer using Gmail!",
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Error occurred while sending email:", error);
  } else {
    console.log("Email sent successfully:", info.response);
  }
});
