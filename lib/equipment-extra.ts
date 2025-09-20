// lib/equipment-extra.ts
// Dodatkowe opcje wyposażenia widoczne w panelu admina.
// Klucze są "slugami" (bez spacji), etykiety po polsku.

export type EquipmentItem = { key: string; label: string };

export const EQUIPMENT_LIST_EXTRA: EquipmentItem[] = [
  // Alias/nazwy z Twoich screenów (żółte/białe)
  { key: "multikierownica", label: "Multikierownica" },
  { key: "kamera_360", label: "Kamera 360°" },
  { key: "oswietlenie_adaptacyjne", label: "Oświetlenie adaptacyjne" },
  { key: "czujnik_zmierzchu", label: "Czujnik zmierzchu" },
  { key: "swiatla_do_jazdy_dziennej", label: "Światła do jazdy dziennej" },
  { key: "lampy_przeciwmgielne", label: "Lampy przeciwmgielne" }, // alias „Halogeny”
  { key: "tpms", label: "Elektroniczna kontrola ciśnienia w oponach (TPMS)" },
  { key: "wspomaganie_kierownicy", label: "Wspomaganie kierownicy" },
  { key: "asystent_zmiany_pasa_ruchu", label: "Asystent zmiany pasa ruchu" },
  { key: "kontrola_odleglosci", label: "Kontrola odległości od pojazdu" },
  { key: "asystent_hamowania", label: "Asystent hamowania" },
  { key: "ruszanie_pod_gore", label: "Wspomaganie ruszania pod górę" },
  { key: "rozpoznawanie_znakow", label: "System rozpoznawania znaków drogowych" },
  { key: "doswietlanie_zakretow", label: "Doświetlanie zakrętów" },
  { key: "oswietlenie_drogi_do_domu", label: "Oświetlenie drogi do domu" },
  { key: "bluetooth", label: "Bluetooth" },
  { key: "zestaw_glosnomowiacy", label: "Zestaw głośnomówiący" },
  { key: "system_naglosnienia", label: "System nagłośnienia" },
  { key: "ekran_dotykowy", label: "Ekran dotykowy" },
  { key: "gniazdo_usb", label: "Gniazdo USB" },
  { key: "szklany_dach", label: "Szklany dach" },

  // Kilka popularnych aliasów, żeby nie dublować istniejących:
  { key: "kierownica_wielofunkcyjna", label: "Kierownica wielofunkcyjna" }, // alias Multikierownica
  { key: "kamera_panoramiczna_360", label: "Kamera panoramiczna 360°" },   // alias Kamera 360
];