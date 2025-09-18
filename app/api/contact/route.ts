import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  name: string;
  phone?: string;
  message: string;
};

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function sendWithResend(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  // ↓↓↓ zamiast niezweryfikowanej domeny
  const from = process.env.MAIL_FROM || "onboarding@resend.dev";
  if (!key) throw new Error("Brak RESEND_API_KEY");

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });

  if (!resp.ok) throw new Error(`Resend error: ${await resp.text()}`);
}

// GET → żeby nie było błędu 405 jak wejdziesz w /api/contact w przeglądarce
export async function GET() {
  return NextResponse.json({ ok: true, info: "Użyj POST, aby wysłać wiadomość." });
}

// OPTIONS → dla preflight (CORS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// POST → właściwa obsługa formularza
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    if (!body?.name || !body?.message) {
      return NextResponse.json({ ok: false, error: "Brak wymaganych pól" }, { status: 400 });
    }

    // domyślny odbiorca – Twój adres
    const to = process.env.MAIL_TO || "wiktorobslugapaczynskipl@gmail.com";

    const subject = `Nowa wiadomość z formularza: ${body.name}`;
    const html = `
      <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial;line-height:1.5">
        <h2>Wiadomość z formularza kontaktowego</h2>
        <p><b>Imię i nazwisko:</b> ${escapeHtml(body.name)}</p>
        ${body.phone ? `<p><b>Telefon:</b> ${escapeHtml(body.phone)}</p>` : ""}
        <p><b>Wiadomość:</b></p>
        <div style="white-space:pre-wrap;border:1px solid #e5e7eb;padding:12px;border-radius:8px">
          ${escapeHtml(body.message)}
        </div>
      </div>
    `;

    await sendWithResend(to, subject, html);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("CONTACT_API_ERROR:", e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
