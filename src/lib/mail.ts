import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not real password
    },
});

export async function sendVerificationEmail(email: string, code: string) {
    const mailOptions = {
        from: `"MissionLink AI" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "MissionLink Verification Code",
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #2563eb; text-align: center;">MissionLink AI Assistant</h2>
        <p>Hello! Use the verification code below to complete your registration:</p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 10px; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #111827;">
          ${code}
        </div>
        <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
    };

    return transporter.sendMail(mailOptions);
}
