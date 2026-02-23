// lib/mailer.ts
import nodemailer from 'nodemailer';

type Mailer = ReturnType<typeof nodemailer.createTransport>;

let cached: Mailer | null = null;

function getTransport(): Mailer {
  if (cached) return cached;

  cached = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT || 465),
    secure: true,
    auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
  });

  return cached;
}

/**
 * Wysyła email do wskazanych odbiorców.
 * Domyślnie nie nadpisuje adresów. Ustaw MAIL_OVERRIDE_TO, jeśli chcesz na czas DEV
 * wysyłać tylko na jeden adres.
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  const transporter = getTransport();

  const override = process.env.MAIL_OVERRIDE_TO?.trim();
  const recipients = override ? [override] : Array.isArray(to) ? to : [to];

  for (const rcpt of recipients) {
    await transporter.sendMail({
      from: `"AutoPaczyński" <${process.env.SMTP_USER}>`,
      to: rcpt,
      subject,
      html,
    });
  }
}
