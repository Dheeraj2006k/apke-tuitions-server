const nodemailer = require("nodemailer");

const sendEmail = async (subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject,
      text,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email Error:", error);
  }
};

module.exports = sendEmail;