const nodemailer = require("nodemailer");

/**
 * Creates Nodemailer transporter for Gmail SMTP
 */
const createTransporter = () => {
  const user = process.env.EMAIL_USER?.trim();
  // Strip spaces from App Password (e.g., "hxqc qcco vibd nowr" -> "hxqcqccovibdnowr")
  const pass = process.env.EMAIL_PASS?.trim().replace(/\s+/g, "");

  if (user && pass) {
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user,
        pass,
      },
    });
  }
  return null;
};

/**
 * Send OTP Email to user
 */
const sendOTPEmail = async (email, otp, title = "Verification Code") => {
  console.log(`\n==========================================`);
  console.log(`[OTP GENERATED] To: ${email} | Purpose: ${title} | Code: ${otp}`);
  console.log(`==========================================\n`);

  const transporter = createTransporter();
  if (!transporter) {
    console.log("[EMAIL SERVICE] SMTP credentials not set. Falling back to console OTP.");
    return { success: true, simulated: true };
  }

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; background-color: #0f172a; color: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #1e293b;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #60a5fa; margin: 0;">ChatCraft</h2>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">${title}</p>
      </div>
      <div style="background-color: #1e293b; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 20px;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #38bdf8;">${otp}</span>
      </div>
      <p style="color: #94a3b8; font-size: 13px; text-align: center;">This code will expire in <strong>30 seconds</strong>. Do not share this code with anyone.</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'ChatCraft'}" <${process.env.EMAIL_USER?.trim()}>`,
      to: email,
      subject: `${title} - ChatCraft`,
      html: htmlContent,
    });

    console.log(`[NODEMAILER SUCCESS] Real email delivered to ${email}! MessageId: ${info.messageId}`);
    return { success: true, simulated: false };
  } catch (err) {
    console.error(`[NODEMAILER ERROR] Failed to send email to ${email}:`, err.message);
    throw new Error(`Email delivery failed: ${err.message}`);
  }
};

module.exports = {
  sendOTPEmail,
};
