import nodemailer from 'nodemailer';

const EMAIL_USER = process.env.EMAIL_USER || "job.hireon@gmail.com";
const EMAIL_PASS = process.env.EMAIL_PASS || "kmuv hrhb pjgx ztvc";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const sendOTPEmail = async (email: string, otp: string, type: 'registration' | 'password-reset') => {
  const subject = type === 'registration' 
    ? 'Verify your Meetly account' 
    : 'Reset your Meetly password';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 20px;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Meetly</h1>
        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Video Conferencing App</p>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border-radius: 15px; border: 1px solid #e2e8f0;">
        <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px;">
          ${type === 'registration' ? 'Welcome to Meetly!' : 'Password Reset Request'}
        </h2>
        
        <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
          ${type === 'registration' 
            ? 'Thank you for registering with Meetly. To complete your account setup, please verify your email address using the OTP below.'
            : 'We received a request to reset your password. Use the OTP below to verify your identity and reset your password.'
          }
        </p>
        
        <div style="background: white; border: 2px solid #6366f1; border-radius: 10px; padding: 20px; margin: 25px 0; text-align: center;">
          <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">Your verification code:</p>
          <h1 style="color: #6366f1; margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 5px;">${otp}</h1>
        </div>
        
        <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0;">
          <strong>Important:</strong> This code will expire in 10 minutes. If you didn't request this ${type === 'registration' ? 'verification' : 'password reset'}, please ignore this email.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
          © 2024 Meetly. All rights reserved.
        </p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `Meetly <${EMAIL_USER}>`,
    to: email,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: 'Failed to send email' };
  }
};

export default transporter;
