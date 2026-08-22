import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS?.replace(/\s+/g, ''),
  },
});

export async function sendPasswordResetEmail(to: string, resetUrl: string, firstName: string) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Reset your GlobeTrotter password',
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#F1F5F9;">
          <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
            <div style="background:linear-gradient(135deg,#0284C7,#0f3551);padding:40px;text-align:center;">
              <h1 style="margin:0;color:white;font-size:26px;letter-spacing:-1px;">✈ GlobeTrotter</h1>
            </div>
            <div style="padding:40px;">
              <h2 style="color:#1E293B;margin:0 0 12px;font-size:22px;">Hi ${firstName},</h2>
              <p style="color:#64748B;font-size:15px;line-height:1.6;margin:0 0 28px;">
                We received a request to reset your password. Click the button below to set a new password.
                This link will expire in <strong>1 hour</strong>.
              </p>
              <a href="${resetUrl}" 
                 style="display:inline-block;background:#F97316;color:white;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px;">
                Reset Password
              </a>
              <p style="color:#94A3B8;font-size:12px;margin:28px 0 0;line-height:1.6;">
                If you didn't request a password reset, you can safely ignore this email.<br/>
                This link expires in 1 hour.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}
