import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.EMAIL_FROM || 'no-reply@example.com';

if (!host || !port || !user || !pass) {
  // Do not throw in module init; allow app to start in environments without mail config
  console.warn('Mailer not fully configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS to enable email sending.');
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465, // true for 465, false for other ports
  auth: user && pass ? { user, pass } : undefined,
});

export async function sendMail(opts: { to: string; subject: string; text?: string; html?: string; from?: string; }) {
  if (!host || !port || !user || !pass) {
    console.warn('Skipping sendMail because SMTP is not configured');
    return;
  }

  const mailOptions = {
    from: opts.from || from,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  };

  return transporter.sendMail(mailOptions);
}

export default sendMail;
