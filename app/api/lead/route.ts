import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type YesNo = "" | "TAK" | "NIE";

type LeadPayload = {
  source?: string;
  honeypot?: string;
  form?: Record<string, unknown>;
  consents?: Record<string, unknown>;
};

const FIELD_LABELS: Record<string, string> = {
  // podstawowe
  firstName: "Imię",
  lastName: "Nazwisko",
  phone: "Telefon",
  email: "E-mail",
  consent: "Zgoda",
  honeypot: "Honeypot",

  // dane klienta
  clientType: "Typ klienta",
  secondName: "Drugie imię",
  mothersMaidenName: "Nazwisko rodowe matki",
  pesel: "PESEL",
  birthDate: "Data urodzenia",
  maritalStatus: "Stan cywilny",
  propertySeparation: "Rozdzielność majątkowa",
  citizenship: "Obywatelstwo",
  countryOfBirth: "Państwo urodzenia",
  childrenCount: "Liczba dzieci",

  // dokument tożsamości
  idDocType: "Typ dokumentu tożsamości",
  idDocNumber: "Numer dokumentu",
  idDocIssuer: "Organ wydający dokument",
  idDocIssueDate: "Data wydania dokumentu",
  idDocExpiryDate: "Data ważności dokumentu",
  idDocNoExpiry: "Dokument bezterminowy",

  // prawo jazdy
  drivingLicenseNumber: "Numer prawa jazdy",
  noDrivingLicense: "Brak prawa jazdy",

  // adres zameldowania
  registeredPostalCode: "Kod pocztowy zameldowania",
  registeredCity: "Miejscowość zameldowania",
  registeredStreetAndNo: "Ulica i numer zameldowania",

  // adres zamieszkania
  addressPostalCode: "Kod pocztowy zamieszkania",
  addressCity: "Miejscowość zamieszkania",
  addressStreetAndNo: "Ulica i numer zamieszkania",

  // warunki mieszkaniowe
  housingType: "Typ nieruchomości",
  housingOwnershipForm: "Forma własności",
  housingOwnershipOther: "Inna forma własności",
  housingOwnershipFinal: "Forma własności (końcowa)",
  housingIsMortgagedOrCeded: "Czy nieruchomość jest obciążona hipoteką / cesją",

  // dochód
  employmentType: "Forma zatrudnienia",
  employmentTypeOther: "Inna forma zatrudnienia",
  employmentTypeFinal: "Forma zatrudnienia (końcowa)",
  netIncome6mAvg: "Dochód netto (średnia z ostatnich 3 miesięcy)",

  // miejsce osiągania dochodu
  employerName: "Nazwa pracodawcy / firmy",
  employerNip: "NIP pracodawcy / firmy",
  employerPhone: "Telefon pracodawcy / firmy",
  employerPostalCode: "Kod pocztowy pracodawcy / firmy",
  employerCity: "Miejscowość pracodawcy / firmy",
  employerStreetAndNo: "Ulica i numer pracodawcy / firmy",
  position: "Stanowisko",
  employmentStartDate: "Data zatrudnienia",

  // obciążenia
  monthlyObligations: "Miesięczne łączne obciążenia finansowe",
  dependentsCount: "Liczba osób na utrzymaniu",
  accountLimitsSum: "Czy są rozpoczęte transakcje z odroczoną płatnością",
  cardLimitsSum: "Liczba transakcji z odroczoną płatnością",

  // pojazd
  vehicleType: "Typ pojazdu",
  vehicleBrandModel: "Marka i model pojazdu",
  vehicleYear: "Rok produkcji pojazdu",
  vehiclePriceBrutto: "Cena pojazdu brutto",

  // kredyt
  loanAmount: "Kwota kredytu",
  downPayment: "Wpłata własna",
  months: "Liczba rat",
  wantsInsurance: "Czy chce ubezpieczenie",
  insuranceOption: "Wybrana ochrona ubezpieczeniowa",

  // spłata
  paymentMethod: "Forma spłaty",
  paymentDay: "Dzień spłaty",

  // zgody ogólne
  rodo: "Akceptacja klauzuli RODO",
  contactOffer: "Zgoda na kontakt w sprawie oferty",
  acceptRegulations: "Akceptacja regulaminu i obowiązków informacyjnych",

  // zgody Cofidis
  marketingPhone: "Zgoda na marketing telefoniczny",
  marketingEmail: "Zgoda na marketing e-mail",
  marketingSms: "Zgoda na marketing SMS/MMS",
  marketingProfiling: "Zgoda na marketing i profilowanie",
  marketingPartners: "Zgoda na marketing partnerów współpracujących",
  bigDataTransfer: "Zgoda na przekazywanie danych do BIG",
  bigQuery: "Zgoda na zapytania o dane w BIG",
  bigLast12Months: "Zgoda na pobranie informacji o zapytaniach BIG z ostatnich 12 miesięcy",
  bikQuery: "Zgoda na weryfikację w BIK",
  bikDuringContract: "Zgoda na przekazywanie danych do BIK w trakcie umowy",
  bikAfterContract: "Zgoda na przekazywanie danych do BIK po wygaśnięciu umowy",
  aisConsent: "Zgoda AIS",

  // meta
  source: "Źródło",
  serverDate: "Data (serwer)",
};

const SECTION_MAP: Array<{
  title: string;
  keys: string[];
}> = [
  {
    title: "Meta",
    keys: ["source", "serverDate"],
  },
  {
    title: "Dane podstawowe",
    keys: ["firstName", "lastName", "phone", "email"],
  },
  {
    title: "Dane klienta",
    keys: [
      "clientType",
      "secondName",
      "mothersMaidenName",
      "pesel",
      "birthDate",
      "maritalStatus",
      "propertySeparation",
      "citizenship",
      "countryOfBirth",
      "childrenCount",
    ],
  },
  {
    title: "Dokument tożsamości",
    keys: [
      "idDocType",
      "idDocNumber",
      "idDocIssuer",
      "idDocIssueDate",
      "idDocExpiryDate",
      "idDocNoExpiry",
    ],
  },
  {
    title: "Prawo jazdy",
    keys: ["drivingLicenseNumber", "noDrivingLicense"],
  },
  {
    title: "Adres zameldowania",
    keys: ["registeredPostalCode", "registeredCity", "registeredStreetAndNo"],
  },
  {
    title: "Adres zamieszkania",
    keys: ["addressPostalCode", "addressCity", "addressStreetAndNo"],
  },
  {
    title: "Warunki mieszkaniowe",
    keys: [
      "housingType",
      "housingOwnershipForm",
      "housingOwnershipOther",
      "housingOwnershipFinal",
      "housingIsMortgagedOrCeded",
    ],
  },
  {
    title: "Źródło dochodu",
    keys: ["employmentType", "employmentTypeOther", "employmentTypeFinal", "netIncome6mAvg"],
  },
  {
    title: "Miejsce osiągania dochodu",
    keys: [
      "employerName",
      "employerNip",
      "employerPhone",
      "employerPostalCode",
      "employerCity",
      "employerStreetAndNo",
      "position",
      "employmentStartDate",
    ],
  },
  {
    title: "Obciążenia / limity",
    keys: ["monthlyObligations", "dependentsCount", "accountLimitsSum", "cardLimitsSum"],
  },
  {
    title: "Pojazd",
    keys: ["vehicleType", "vehicleBrandModel", "vehicleYear", "vehiclePriceBrutto"],
  },
  {
    title: "Kredyt",
    keys: ["loanAmount", "downPayment", "months", "wantsInsurance", "insuranceOption"],
  },
  {
    title: "Spłata kredytu",
    keys: ["paymentMethod", "paymentDay"],
  },
  {
    title: "Zgody Cofidis",
    keys: [
      "marketingPhone",
      "marketingEmail",
      "marketingSms",
      "marketingProfiling",
      "marketingPartners",
      "bigDataTransfer",
      "bigQuery",
      "bigLast12Months",
      "bikQuery",
      "bikDuringContract",
      "bikAfterContract",
      "aisConsent",
    ],
  },
  {
    title: "Zgody ogólne",
    keys: ["rodo", "contactOffer", "acceptRegulations"],
  },
];

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "brak";
  if (typeof value === "boolean") return value ? "TAK" : "NIE";

  const stringValue = String(value).trim();

  if (!stringValue) return "brak";

  if (stringValue === "private") return "Osoba prywatna";
  if (stringValue === "jdg") return "Jednoosobowa działalność gospodarcza";

  if (stringValue === "auto") return "Automatyczne obciążenie rachunku";
  if (stringValue === "transfer") return "Samodzielny przelew bankowy";

  if (stringValue === "NONE") return "Brak ochrony ubezpieczeniowej";
  if (stringValue === "LIFE") return "LIFE - pewna spłata w razie śmierci";
  if (stringValue === "EXTRA_LIFE") return "EXTRA LIFE - śmierć + niezdolność do pracy";
  if (stringValue === "TP") return "TP - utrata dochodu + niezdolność do pracy";
  if (stringValue === "LIFE_TP") return "LIFE + TP";
  if (stringValue === "EXTRA_LIFE_TP") return "EXTRA LIFE + TP";

  return stringValue;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildRows(data: Record<string, unknown>, keys: string[]) {
  return keys
    .map((key) => {
      const label = FIELD_LABELS[key] ?? key;
      const value = formatValue(data[key]);
      return `
        <tr>
          <td style="padding:10px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600;width:280px;">
            ${escapeHtml(label)}
          </td>
          <td style="padding:10px 12px;border:1px solid #e5e7eb;">
            ${escapeHtml(value)}
          </td>
        </tr>
      `;
    })
    .join("");
}

function buildHtmlEmail(allData: Record<string, unknown>) {
  const sections = SECTION_MAP.map((section) => {
    const rows = buildRows(allData, section.keys);

    return `
      <div style="margin:0 0 24px 0;">
        <h2 style="margin:0 0 10px 0;font-size:20px;line-height:1.3;color:#111827;">
          ${escapeHtml(section.title)}
        </h2>
        <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px;color:#111827;">
          ${rows}
        </table>
      </div>
    `;
  }).join("");

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#f3f4f6;padding:24px;">
      <div style="max-width:1100px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:24px;">
        <h1 style="margin:0 0 24px 0;font-size:30px;line-height:1.2;color:#111827;">
          LEAD ZE STRONY PACZYŃSKI.PL
        </h1>
        ${sections}
      </div>
    </div>
  `;
}

function buildTextEmail(allData: Record<string, unknown>) {
  const parts: string[] = ["LEAD ZE STRONY PACZYŃSKI.PL", ""];

  for (const section of SECTION_MAP) {
    parts.push(section.title);
    parts.push("-".repeat(section.title.length));

    for (const key of section.keys) {
      const label = FIELD_LABELS[key] ?? key;
      const value = formatValue(allData[key]);
      parts.push(`${label}: ${value}`);
    }

    parts.push("");
  }

  return parts.join("\n");
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LeadPayload;

    if (body?.honeypot) {
      return NextResponse.json({ ok: true });
    }

    const form = body.form ?? {};
    const consents = body.consents ?? {};

    const firstName = String(form.firstName ?? "").trim();
    const lastName = String(form.lastName ?? "").trim();
    const phone = String(form.phone ?? "").trim();

    if (!firstName || !lastName || !phone) {
      return NextResponse.json(
        { ok: false, error: "Brakuje wymaganych pól: imię, nazwisko lub telefon." },
        { status: 400 }
      );
    }

    const mergedData: Record<string, unknown> = {
      source: body.source || "leadform_full",
      serverDate: new Date().toISOString(),
      ...form,
      ...consents,
    };

    delete mergedData.honeypot;
    delete mergedData.veloBankQuery;
    delete mergedData.bigKrdQuery;
    delete mergedData.erifBigQuery;
    delete mergedData.verifyBusinessInfo;
    delete mergedData.verifyPesel;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || "false") === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const targetEmail = process.env.LEAD_TARGET_EMAIL || process.env.SMTP_USER;
    const fromEmail = process.env.LEAD_FROM_EMAIL || process.env.SMTP_USER;

    if (!targetEmail || !fromEmail) {
      return NextResponse.json(
        { ok: false, error: "Brakuje konfiguracji e-mail w zmiennych środowiskowych." },
        { status: 500 }
      );
    }

    const html = buildHtmlEmail(mergedData);
    const text = buildTextEmail(mergedData);

    await transporter.sendMail({
      from: `"Paczynski.pl" <${fromEmail}>`,
      to: targetEmail,
      replyTo: mergedData.email ? String(mergedData.email) : undefined,
      subject: "LEAD ZE STRONY PACZYŃSKI.PL",
      text,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Błąd podczas wysyłki leada:", error);

    return NextResponse.json(
      { ok: false, error: "Nie udało się wysłać formularza." },
      { status: 500 }
    );
  }
}