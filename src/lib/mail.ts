import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Sends a verification code to the specified email.
 */
export async function sendVerificationEmail(email: string, code: string) {
    const mailOptions = {
        from: `"WITHUS" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "[WITHUS] Verification Code",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Welcome to WITHUS</h2>
        <p style="font-size: 16px; color: #555;">Please use the following verification code to complete your registration or login:</p>
        <div style="background-color: #f7f7f7; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000;">${code}</span>
        </div>
        <p style="font-size: 14px; color: #888;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="text-align: center; font-size: 12px; color: #aaa;">&copy; 2026 WITHUS. All rights reserved.</p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Error sending verification email:", error);
        return false;
    }
}
