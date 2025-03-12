import nodemailer from "nodemailer";
import { emailTemplate } from "./email.template.js";
import jwt from "jsonwebtoken";

export async function sendEmail(email) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "amhmdslah104@gmail.com", // Replace with your email or use environment variables
      pass: "qgsy guda swgz vckf", // Replace with your password or use environment variables
    },
  });

  // Create a JWT token with the email as the payload
  const encryptedMail = jwt.sign({ email }, "Ahmed", { expiresIn: "1h" });

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"ARAF Market Support 🚀" <amhmdslah104@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Verify Your ARAF Market Account", // Subject line
      text: `Welcome to ARAF Market! Please verify your account by clicking the link: http://127.0.0.1:3000/auth/verify/${encryptedMail}`,
      html: emailTemplate(encryptedMail), // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }

  // Call the main function and handle errors
  return main().catch(console.error);
}
