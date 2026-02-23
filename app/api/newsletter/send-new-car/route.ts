// app/api/newsletter/send-new-car/route.ts
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function emailHtml({
  title, /* priceText, */ imageUrl, link, unsubscribeToken,
}: {
  title: string;
  // priceText?: string; // celowo niewykorzystywane
  imageUrl?: string;
  link: string;
  unsubscribeToken?: string;
}) {
  // cena wyłączona
  const price = ''; // zostawiam zmienną, ale pusta
  const img = imageUrl
    ? `
      <tr>
        <td align="center" style="padding: 8px 0 16px 0;">
          <img src="${imageUrl}" alt="${title}" width="480"
               style="max-width: 100%; width: 480px; height: auto; border-radius: 14px;
                      display: block; box-shadow: 0 4px 16px rgba(0,0,0,0.12);" />
        </td>
      </tr>`
    : '';

  const unsub = unsubscribeToken
    ? `<p style="font-size:12px;color:#6b7280;margin:14px 0 0 0;">
         Jeśli nie chcesz otrzymywać wiadomości, możesz się wypisać:
         <a href="${(process.env.NEXT_PUBLIC_SITE_URL ?? '')}/api/newsletter/unsubscribe?token=${unsubscribeToken}"
            style="color:#0a0a0a;text-decoration:underline">wypisz mnie</a>.
       </p>`
    : '';

  return `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
         style="background:#f8fafc;padding:0;margin:0">
    <tr>
      <td align="center" style="padding:24px">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
               style="max-width: 560px; background:#ffffff; border-radius:16px;
                      overflow:hidden; border:1px solid #e5e7eb;">
          <tr>
            <td style="padding: 22px 22px 0 22px; font-family: system-ui,Segoe UI,Roboto,Arial,sans-serif; color:#0a0a0a;">
              <h1 style="font-size:22px; margin:0 0 8px 0;">🚗 Cześć!</h1>
              <p style="margin:0 0 6px 0;">Mamy świetną wiadomość — nasza oferta właśnie powiększyła się o
                 <strong>NOWY SAMOCHÓD</strong>! 🎉</p>
              <p style="margin:0 0 14px 0;">Wejdź na naszą stronę i zapoznaj się z aktualną ofertą:</p>
              <h2 style="font-size:18px; margin:0 0 10px 0;">${title}${price}</h2>
            </td>
          </tr>

          ${img}

          <tr>
            <td style="padding: 0 22px 6px 22px; font-family: system-ui,Segoe UI,Roboto,Arial,sans-serif;">
              <ul style="padding-left:18px; margin:8px 0 14px 0; line-height:1.55;">
                <li>🔎 Pewne pochodzenie i pełna historia serwisowa</li>
                <li>✨ Świetne wyposażenie i idealny stan techniczny</li>
                <li>💸 Atrakcyjna cena i możliwość wykupienia gwarancji</li>
                <li>🕒 Dostępne od ręki w naszym komisie</li>
              </ul>

              <p style="margin:0 0 16px 0;">
                Jeśli szukasz sprawdzonego samochodu, który posłuży Ci przez lata — koniecznie zobacz tę nowość! 💪
              </p>

              <div style="text-align:center; margin: 8px 0 18px 0;">
                <a href="${link}"
                   style="display:inline-block; padding:12px 20px; border-radius:12px;
                          background:#0a0a0a; color:#ffffff; text-decoration:none;
                          font-weight:700;">
                  👉 Zobacz ofertę
                </a>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 12px 22px 18px 22px; font-family: system-ui,Segoe UI,Roboto,Arial,sans-serif;
                       border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 4px 0;"><strong>AUTO-GREG GRZEGORZ PACZYŃSKI</strong></p>
              <p style="margin:0;">📍 Wadowice • 📞 +48 693 632 068 • 🌐
                <a href="https://www.paczynski.pl" style="color:#0a0a0a;text-decoration:none;">www.paczynski.pl</a>
              </p>
              ${unsub}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

export async function POST(req: Request) {
  try {
    // autoryzacja – musi odpowiadać temu co wysyła /announce
    const secret = req.headers.get('x-cron-secret');
    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { title, /* price_text, */ imageUrl, link } = await req.json();

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      return NextResponse.json({ ok: false, message: 'Brak env Supabase' }, { status: 500 });
    }

    // pobierz aktywnych subów przez REST
    const res = await fetch(`${url}/rest/v1/subscribers?select=email,unsubscribe_token&active=is.true`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Accept: 'application/json',
      },
    });

    const subs: Array<{ email: string; unsubscribe_token: string }> = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, message: (subs as any)?.message || 'Błąd Supabase REST' },
        { status: res.status }
      );
    }
    if (!subs?.length) return NextResponse.json({ ok: true, sent: 0, message: 'Brak subskrybentów' });

    // Temat BEZ ceny
    const subject = `Nowość: ${title}`;

    for (const s of subs) {
      const html = emailHtml({
        title,
        // priceText: undefined, // nie wysyłamy ceny
        imageUrl: imageUrl || undefined,
        link,
        unsubscribeToken: s.unsubscribe_token,
      });
      await sendEmail({ to: s.email, subject, html });
    }

    return NextResponse.json({ ok: true, sent: subs.length });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || 'Błąd serwera' }, { status: 500 });
  }
}