import { configDotenv } from 'dotenv';
import { createTransport, Transporter } from 'nodemailer';

configDotenv({
  path: '../../.env',
});
const OTP_HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification - CoverGenius</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #e2e8f0;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            min-height: 100vh;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(15, 23, 42, 0.95);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(71, 85, 105, 0.3);
        }
        
        .header {
            background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
            animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .logo {
            font-size: 28px;
            font-weight: 700;
            color: white;
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
        }
        
        .tagline {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.9);
            position: relative;
            z-index: 1;
        }
        
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        
        .title {
            font-size: 24px;
            font-weight: 700;
            color: #f8fafc;
            margin-bottom: 16px;
        }
        
        .description {
            font-size: 16px;
            color: #cbd5e1;
            margin-bottom: 32px;
            line-height: 1.6;
        }
        
        .otp-container {
            background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
            border: 2px solid rgba(124, 58, 237, 0.3);
            border-radius: 12px;
            padding: 24px;
            margin: 32px 0;
            position: relative;
        }
        
        .otp-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
            border-radius: 10px;
            z-index: 0;
        }
        
        .otp-label {
            font-size: 14px;
            color: #94a3b8;
            margin-bottom: 12px;
            position: relative;
            z-index: 1;
        }
        
        .otp-code {
            font-size: 32px;
            font-weight: 700;
            color: #f8fafc;
            letter-spacing: 8px;
            background: linear-gradient(135deg, #a855f7 0%, #3b82f6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            position: relative;
            z-index: 1;
        }
        
        .info-box {
            background: rgba(51, 65, 85, 0.3);
            border: 1px solid rgba(71, 85, 105, 0.5);
            border-radius: 8px;
            padding: 16px;
            margin: 24px 0;
            text-align: left;
        }
        
        .info-title {
            font-size: 14px;
            font-weight: 600;
            color: #e2e8f0;
            margin-bottom: 8px;
        }
        
        .info-text {
            font-size: 14px;
            color: #94a3b8;
            line-height: 1.5;
        }
        
        .footer {
            background: rgba(15, 23, 42, 0.8);
            padding: 24px 30px;
            text-align: center;
            border-top: 1px solid rgba(71, 85, 105, 0.3);
        }
        
        .footer-text {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 16px;
        }
        
        .social-links {
            display: flex;
            justify-content: center;
            gap: 16px;
            margin-top: 16px;
        }
        
        .social-link {
            color: #64748b;
            text-decoration: none;
            font-size: 14px;
            transition: color 0.2s ease;
        }
        
        .social-link:hover {
            color: #a855f7;
        }
        
        .expiry-notice {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 8px;
            padding: 12px;
            margin: 16px 0;
            text-align: center;
        }
        
        .expiry-text {
            font-size: 13px;
            color: #fca5a5;
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }
            
            .header, .content, .footer {
                padding: 24px 20px;
            }
            
            .otp-code {
                font-size: 28px;
                letter-spacing: 6px;
            }
            
            .title {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">CoverGenius</div>
            <div class="tagline">AI-Powered Cover Letter Generator</div>
        </div>
        
        <div class="content">
            <h1 class="title">Verify Your Email Address</h1>
            <p class="description">
                Thanks for signing up! To complete your registration and start creating amazing cover letters, please verify your email address using the code below.
            </p>
            
            <div class="otp-container">
                <div class="otp-label">Your verification code:</div>
                <div class="otp-code">{{text}}</div>
            </div>
            
            <div class="expiry-notice">
                <div class="expiry-text">⚠️ This code will expire in {{remainingTimeInMinutes}} minutes for security reasons</div>
            </div>
            
            <div class="info-box">
                <div class="info-title">💡 What happens next?</div>
                <div class="info-text">
                    Once verified, you'll have access to our AI-powered cover letter generator. Create professional, personalized cover letters in seconds and stand out from the competition.
                </div>
            </div>
            
            <div class="info-box">
                <div class="info-title">🔒 Security Notice</div>
                <div class="info-text">
                    If you didn't request this verification code, please ignore this email. Your account security is important to us.
                </div>
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-text">
                This email was sent to you as part of your CoverGenius account verification process.
            </div>
            <div class="footer-text">
                © {{year}} CoverGenius. All rights reserved.
            </div>
            <div class="social-links">
                <a href="https://cl-writer.vercel.app/privacy-policy" class="social-link">Privacy Policy</a>
                <a href="https://cl-writer.vercel.app/terms-of-service" class="social-link">Terms of Service</a>
                <a href="https://cl-writer.vercel.app/contact-us" class="social-link">Contact Support</a>
            </div>
        </div>
    </div>
</body>
</html>
`;

let transporter: Transporter;
try {
  transporter = createTransport({
    host: process.env.BREVO_SMTP_HOST as string,
    port: process.env.BREVO_SMTP_PORT as unknown as number,
    secure: false,
    auth: {
      user: process.env.BREVO_SMTP_USER as string,
      pass: process.env.BREVO_SMTP_KEY as string,
    },
  });
} catch (e) {
  console.log(process.env.BREVO_SMTP_HOST, process.env.BREVO_SMTP_PORT, process.env.BREVO_SMTP_USER, process.env.BREVO_SMTP_KEY);
  console.error(e);
}

export async function sendMail(to: string, subject: string, otp: number, remainingTimeInMinutes: number): Promise<void> {
  if (!transporter) {
    throw new Error('Transporter not initialized');
  }
  transporter
    .sendMail({
      from: '"Cover Genius" <covergenius.web@gmail.com>',
      to,
      subject,
      html: OTP_HTML_TEMPLATE.replace('{{text}}', otp.toString())
        .replace('{{year}}', new Date().getFullYear().toString())
        .replace('{{remainingTimeInMinutes}}', remainingTimeInMinutes.toString()),
    })
    .catch(console.error);
}
