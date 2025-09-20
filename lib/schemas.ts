// lib/schemas.ts
import { z } from "zod";

/** Listy pomocnicze (selecty) */
export const FUEL_TYPES = [
  "Benzyna",
  "Diesel",
  "Benzyna_LPG",
  "Hybryda",
  "Hybryda_PHEV",
  "Elektryczny",
] as const;

export const TRANSMISSIONS = [
  "Manualna",
  "Automatyczna",
  "Półautomatyczna",
] as const;

export const DRIVETRAINS = ["FWD", "RWD", "AWD", "4x4"] as const;

export const BODY_TYPES = [
  "sedan",
  "hatchback",
  "kombi",
  "suv",
  "coupe",
  "kabriolet",
  "minivan",
  "pickup",
] as const;

export const CONDITIONS = [
  "bardzo dobry",
  "dobry",
  "do naprawy",
  "uszkodzony",
  "nowy",
  "używany",
] as const;

/** Kraj pochodzenia i status rejestracji */
export const ORIGINS = [
  "Polska",
  "Niemcy",
  "Francja",
  "Włochy",
  "Hiszpania",
  "Holandia",
  "Belgia",
  "Szwecja",
  "Norwegia",
  "Wielka Brytania",
  "USA",
  "Szwajcaria",
  "Austria",
  "Czechy",
  "Słowacja",
] as const;

export const REGISTERED_IN = ["Nie", "Polska", "UE", "Po opłatach"] as const;

export const SALE_DOCS = ["umowa", "vat_marza", "vat23"] as const;

/** Wyposażenie */
export type EquipmentEntry = { key: string; label: string };

export const EQUIPMENT_LIST: EquipmentEntry[] = [
  // bezpieczeństwo/podstawowe
  { key: "abs", label: "ABS" },
  { key: "esp", label: "ESP" },
  { key: "asr", label: "ASR" },
  { key: "poduszki_powietrzne", label: "Poduszki powietrzne" },
  { key: "kurtyny_powietrzne", label: "Kurtyny powietrzne" },
  { key: "system_sos", label: "System SOS" },
  { key: "system_wykrywania_zmeczenia", label: "System wykrywania zmęczenia kierowcy" },

  // komfort/klima
  { key: "klimatyzacja_automatyczna", label: "Klimatyzacja automatyczna" },
  { key: "klimatyzacja_manualna", label: "Klimatyzacja manualna" },
  { key: "podgrzewane_fotele", label: "Podgrzewane fotele" },
  { key: "wentylowane_fotele", label: "Wentylowane fotele" },
  { key: "elektryczne_fotele", label: "Elektryczne fotele" },
  { key: "podgrzewana_kierownica", label: "Podgrzewana kierownica" },
  { key: "kierownica_wielofunkcyjna", label: "Kierownica wielofunkcyjna" }, // alias multikierownica
  { key: "multikierownica", label: "Multikierownica" },
  { key: "tapicerka_skorzana", label: "Skórzana tapicerka" },
  { key: "tapicerka_welurowa", label: "Tapicerka welurowa" },
  { key: "elektryczne_szyby", label: "Elektryczne szyby" },
  { key: "elektryczne_lusterka", label: "Elektryczne lusterka" },
  { key: "podgrzewane_lusterka", label: "Podgrzewane lusterka" },
  { key: "przyciemniane_szyby", label: "Przyciemniane szyby" },
  { key: "szyberdach", label: "Szyberdach" },
  { key: "szklany_dach", label: "Szklany dach" },

  // multimedia
  { key: "apple_carplay", label: "Apple CarPlay" },
  { key: "android_auto", label: "Android Auto" },
  { key: "bluetooth", label: "Bluetooth" },
  { key: "zestaw_glosnomowiacy", label: "Zestaw głośnomówiący" },
  { key: "system_naglosnienia", label: "System nagłośnienia" },
  { key: "ekran_dotykowy", label: "Ekran dotykowy" },
  { key: "gniazdo_usb", label: "Gniazdo USB" },
  { key: "nawigacja", label: "Nawigacja" },

  // asystenci jazdy
  { key: "tempomat", label: "Tempomat" },
  { key: "tempomat_aktywny", label: "Tempomat aktywny" },
  { key: "asystent_pasa_ruchu", label: "Asystent pasa ruchu" },
  { key: "asystent_zmiany_pasa_ruchu", label: "Asystent zmiany pasa ruchu" },
  { key: "monitoring_martwego_pola", label: "Monitoring martwego pola" },
  { key: "asystent_parkowania", label: "Asystent parkowania" },
  { key: "czujniki_parkowania", label: "Czujniki parkowania" },
  { key: "czujniki_parkowania_przod", label: "Czujniki parkowania przód" },
  { key: "czujniki_parkowania_tyl", label: "Czujniki parkowania tył" },
  { key: "kamera_cofania", label: "Kamera cofania" },
  { key: "kamera_360", label: "Kamera 360°" },
  { key: "kamera_panoramiczna_360", label: "Kamera panoramiczna 360°" },
  { key: "asystent_hamowania", label: "Asystent hamowania" },
  { key: "kontrola_odleglosci", label: "Kontrola odległości od pojazdu" },
  { key: "ogranicznik_predkosci", label: "Ogranicznik prędkości" },
  { key: "zjazd_ze_stoku", label: "Automatyczna kontrola zjazdu ze stoku" },
  { key: "pokonywanie_zakretow", label: "Asystent pokonywania zakrętów" },
  { key: "wspomaganie_ruszania_pod_gore", label: "Wspomaganie ruszania pod górę" },
  { key: "rozpoznawanie_znakow", label: "System rozpoznawania znaków drogowych" },

  // oświetlenie
  { key: "swiatla_led", label: "Światła LED" },
  { key: "swiatla_ksenonowe", label: "Światła ksenonowe" },
  { key: "oswietlenie_adaptacyjne", label: "Oświetlenie adaptacyjne" },
  { key: "czujnik_zmierzchu", label: "Czujnik zmierzchu" },
  { key: "swiatla_do_jazdy_dziennej", label: "Światła do jazdy dziennej" },
  { key: "lampy_przeciwmgielne", label: "Lampy przeciwmgielne (Halogeny)" },
  { key: "doswietlanie_zakretow", label: "Doświetlanie zakrętów" },
  { key: "oswietlenie_drogi_do_domu", label: "Oświetlenie drogi do domu" },
  { key: "halogeny", label: "Halogeny" }, // alias krótszy

  // inne/napęd/koła
  { key: "alufelgi", label: "Alufelgi" },
  { key: "relingi_dachowe", label: "Relingi dachowe" },
  { key: "isofix", label: "Isofix" },
  { key: "hak", label: "Hak" },

  // dostęp/elektronika
  { key: "bezkluczykowy_dostep", label: "Bezkluczykowy dostęp" },
  { key: "start_stop", label: "Start/Stop" },
  { key: "tpms", label: "Elektroniczna kontrola ciśnienia w oponach (TPMS)" },

  // czujniki
  { key: "czujnik_deszczu", label: "Czujnik deszczu" },
];

/** Schemat formularza dodawania/edycji auta */
export const carFormSchema = z.object({
  title: z.string().min(2, "Podaj tytuł"),
  brand: z.string().optional(),
  model: z.string().optional(),

  year: z.coerce.number().int().min(1950).max(2050),
  mileage: z.coerce.number().int().min(0),
  engine: z.string().min(2),

  engineCapacityCcm: z.coerce.number().int().positive().optional(),
  powerKw: z.coerce.number().int().positive().optional(),

  fuelType: z.enum(FUEL_TYPES).optional(),
  transmission: z.enum(TRANSMISSIONS).optional(),
  drivetrain: z.enum(DRIVETRAINS).optional(),
  bodyType: z.enum(BODY_TYPES).optional(),
  color: z.string().optional(),
  doors: z.coerce.number().int().min(2).max(6).optional(),
  seats: z.coerce.number().int().min(2).max(9).optional(),
  condition: z.enum(CONDITIONS).optional(),

  origin: z.string().optional(),
  registeredIn: z.string().optional(),
  saleDocument: z.enum(SALE_DOCS).optional(),

  price_text: z.string().optional(),
  description: z.string().optional(),          // ⬅️ DODANE

  firstOwner: z.boolean().optional(),

  // zostawiamy elastycznie
  equipment: z.array(z.string()).optional(),
});

export type CarFormData = z.infer<typeof carFormSchema>;