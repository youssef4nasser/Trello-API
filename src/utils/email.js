import { createTransport } from "nodemailer";

export const sendEmail = async ({from = process.env.EMAIL, to, cc, bcc, subject, text, html, attachments = []} = {})=>{
    const transporter = createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    
    const info = await transporter.sendMail({
        from: `"Saraha" <${from}>`, // sender address
        to, // list of receivers
        cc,
        bcc,
        subject, // Subject line
        text, // plain text body
        html, // html body
        attachments,
    });
}