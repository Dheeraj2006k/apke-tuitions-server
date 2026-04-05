const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (subject, text) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Apke Tuitions <onboarding@resend.dev>",
      to: process.env.EMAIL_USER,
      subject,
      text,
    });

    if (error) {
      console.error("Resend Error:", error);
      throw new Error(error.message);
    }

    console.log("Email sent successfully:", data.id);
    return data;
  } catch (error) {
    console.error("Email Error:", error.message);
    throw error;
  }
};

module.exports = sendEmail;
