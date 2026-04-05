const dns = require("dns").promises;
const nodemailer = require("nodemailer");

const SMTP_HOSTNAME = "smtp.gmail.com";

const sendEmail = async (subject, text) => {
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, "");

  if (!emailUser || !emailPass) {
    throw new Error("Missing EMAIL_USER or EMAIL_PASS in server environment");
  }

  const [smtpIpv4] = await dns.resolve4(SMTP_HOSTNAME);

  if (!smtpIpv4) {
    throw new Error(`Could not resolve an IPv4 address for ${SMTP_HOSTNAME}`);
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpIpv4,
      port: 587,
      secure: false,
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: {
        servername: SMTP_HOSTNAME,
      },
    });

    const info = await transporter.sendMail({
      from: emailUser,
      to: emailUser,
      subject,
      text,
    });

    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email Error:", error.message);
    throw error;
  }
};

module.exports = sendEmail;
