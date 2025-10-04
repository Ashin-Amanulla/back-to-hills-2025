const nodemailer = require("nodemailer");
require("dotenv").config();

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendSuccessEmail = async (registration) => {
  try {
    const transporter = createTransporter();
    const message = `
    Dear ${registration.name},
        Thank you for registering for Back to Hills 4.0 Alumni Meet. Your registration has been successful.

        Registration ID: ${registration.registrationId}
        Name: ${registration.name}
        Email: ${registration.email}
        Mobile Number: ${registration.mobile}
        Batch: ${registration.batch}

        We look forward to seeing you at Back to Hills 4.0!

    Regards,
        Back to Hills 4.0 Team
    `;
    const subject = "Back to Hills 4.0 - Registration Successful";
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: registration.email,
      subject,
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email: %s", error);
    throw error;
  }
};

module.exports = {
  sendSuccessEmail,
};
