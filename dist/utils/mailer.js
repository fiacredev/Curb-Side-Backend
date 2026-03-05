import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true only for port 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
// transporter.verify((error, success) => {
//   if (error) {
//     console.error("SMTP connection error:", error);
//   } else {
//     console.log("SMTP server is ready to send emails", success);
//   }
// });
export default transporter;
