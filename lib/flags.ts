// lib/flags.ts

// Mapowanie różnych nazw krajów -> dwuliterowe kody ISO (do emoji flag)
export const COUNTRY_ALIASES: Record<string, string> = {
  polska: "PL",
  poland: "PL",

  deutschland: "DE",
  niemcy: "DE",
  germany: "DE",

  france: "FR",
  francja: "FR",

  italy: "IT",
  italia: "IT",
  "włochy": "IT",

  czechy: "CZ",
  czechia: "CZ",

  slovakia: "SK",
  "słowacja": "SK",

  spain: "ES",
  hiszpania: "ES",

  netherlands: "NL",
  holandia: "NL",

  belgium: "BE",
  belgia: "BE",

  sweden: "SE",
  szwecja: "SE",

  norway: "NO",
  norwegia: "NO",

  uk: "GB",
  "wielka brytania": "GB",
  england: "GB",

  usa: "US",
  "united states": "US",
  "stany zjednoczone": "US",

  austria: "AT",

  switzerland: "CH",
  szwajcaria: "CH",

  denmark: "DK",
  dania: "DK",
};

export function normalizeCountry(input?: string): string | undefined {
  if (!input) return;
  const key = input.trim().toLowerCase();
  if (COUNTRY_ALIASES[key]) return COUNTRY_ALIASES[key];

  // jeśli ktoś poda od razu dwuliterowy kod
  if (/^[A-Za-z]{2}$/.test(input)) return input.toUpperCase();

  // spróbuj wziąć pierwsze słowo przed nawiasami/przecinkami itd.
  const first = key.split(/[()\-,/]/)[0].trim();
  if (COUNTRY_ALIASES[first]) return COUNTRY_ALIASES[first];

  return undefined;
}

export function codeToFlagEmoji(code?: string): string | undefined {
  if (!code) return;
  const cc = code.toUpperCase();
  if (!/^[A-Z]{2}$/.test(cc)) return;
  const OFFSET = 127397; // Unicode regional indicator symbols offset
  return (
    String.fromCodePoint(cc.charCodeAt(0) + OFFSET) +
    String.fromCodePoint(cc.charCodeAt(1) + OFFSET)
  );
}