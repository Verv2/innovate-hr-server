import nodemailer from "nodemailer";
import config from "../config";

const emailSender = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: '"Verv" <rahat@vervrooms.com>', // sender address
    to: email, // list of receivers
    subject: "Innovate HR account", // Subject line
    //text: "Hello world?", // plain text body
    html, // html body
  });

  //console.log("Message sent: %s", info.messageId);
};

export default emailSender;
