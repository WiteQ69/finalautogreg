import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mailer';

export async function GET() {
  try {
    const to = process.env.MAIL_TO || process.env.SMTP_USER!;
    await sendEmail({
      to,
      subject: 'Test SMTP – AutoPaczyński',
      html: '<div style="font-family:sans-serif;padding:16px"><h2>Działa ✅</h2></div>',
    });
    return NextResponse.json({ ok: true, to });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || 'Send fail' }, { status: 500 });
  }
}
