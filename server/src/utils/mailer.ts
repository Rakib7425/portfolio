import nodemailer from 'nodemailer';
import { config } from '../config';

// Create a reusable transporter using SMTP
const createTransporter = () => {
  if (config.smtp.host && config.smtp.user && config.smtp.pass) {
    return nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port ? parseInt(config.smtp.port) : 587,
      secure: config.smtp.port === '465', // true for 465, false for other ports
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });
  }

  // Fallback for development if no SMTP is configured
  console.warn('⚠️ SMTP not configured. Emails will be logged to console (Mocked).');
  return {
    sendMail: async (mailOptions: any) => {
      console.log('\n✉️ --- Mock Email Sent ---');
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);
      console.log('Text:', mailOptions.text);
      console.log('-------------------------\n');
      return { messageId: 'mock-id' };
    }
  } as unknown as nodemailer.Transporter;
};

const transporter = createTransporter();

/**
 * Sends a welcome email to a new newsletter subscriber.
 * @param email The subscriber's email address
 */
export const sendWelcomeEmail = async (email: string) => {
  const mailOptions = {
    from: `"Rakibul Islam" <${config.smtp.from}>`,
    to: email,
    subject: 'Welcome to Rakib.Dev Newsletter! 🎉',
    text: `Hi there!\n\nThank you for subscribing to my newsletter. I'm excited to share my latest projects, tech articles, and insights with you.\n\nStay tuned!\n\nBest regards,\nRakibul Islam`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #0f172a; margin-top: 0;">Welcome to Rakib.Dev Newsletter! 🎉</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">Hi there!</p>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">Thank you for subscribing to my newsletter. I'm excited to share my latest projects, tech articles, and insights with you directly to your inbox!</p>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">Stay tuned for more updates.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <p style="color: #64748b; font-size: 14px; margin-bottom: 0;">Best regards,<br><strong style="color: #0f172a;">Rakibul Islam</strong></p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Welcome email sent to ${email} (Message ID: ${info.messageId})`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send welcome email to ${email}:`, error);
    return false;
  }
};
