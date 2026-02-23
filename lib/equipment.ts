// lib/equipment.ts
export type EquipId =
  | "abs" | "esp" | "asr"
  | "climate_auto" | "climate_manual"
  | "parking_sensors" | "rear_camera" | "camera360"
  | "nav" | "led" | "xenon" | "fog"
  | "alloy_wheels" | "roof_rails" | "towbar" | "sunroof" | "glass_roof"
  | "heated_seats" | "heated_wheel" | "leather" | "multisteering" | "isofix"
  | "apple_carplay" | "android_auto" | "cruise" | "adaptive_cruise"
  | "blind_spot" | "lane_assist" | "keyless" | "start_stop"
  | "el_windows" | "el_mirrors"
  | "electric_seats" | "ventilated_seats" | "heated_windscreen" | "tinted_windows"
  | "velour_upholstery" | "rain_sensor" | "driver_fatigue_detection" | "sos_system"
  | "airbags" | "curtain_airbags" | "rear_parking_sensor" | "park_assist" | "speed_limiter"
  | "hill_descent_control" | "cornering_assist" | "adaptive_lighting" | "dusk_sensor"
  | "daytime_running_lights" | "tpms" | "power_steering" | "heated_mirrors"
  | "distance_control" | "brake_assist" | "hill_start_assist" | "traffic_sign_recognition"
  | "cornering_lights" | "follow_me_home" | "bluetooth" | "handsfree" | "audio_system"
  | "touchscreen" | "usb";

export const EQUIP_LABELS: Record<EquipId, string> = {
  abs: "ABS",
  esp: "ESP",
  asr: "ASR",
  climate_auto: "Klimatyzacja automatyczna",
  climate_manual: "Klimatyzacja manualna",
  parking_sensors: "Czujniki parkowania",
  rear_camera: "Kamera cofania",
  camera360: "Kamera 360°",
  nav: "Nawigacja",
  led: "Światła LED",
  xenon: "Światła ksenonowe",
  fog: "Światła przeciwmgielne",
  alloy_wheels: "Alufelgi",
  roof_rails: "Relingi dachowe",
  towbar: "Hak holowniczy",
  sunroof: "Szyberdach",
  glass_roof: "Szklany dach",
  heated_seats: "Podgrzewane fotele",
  heated_wheel: "Podgrzewana kierownica",
  leather: "Skórzana tapicerka",
  multisteering: "Wielofunkcyjna kierownica",
  isofix: "ISOFIX",
  apple_carplay: "Apple CarPlay",
  android_auto: "Android Auto",
  cruise: "Tempomat",
  adaptive_cruise: "Tempomat adaptacyjny",
  blind_spot: "Martwe pole",
  lane_assist: "Asystent pasa ruchu",
  keyless: "Keyless",
  start_stop: "Start/Stop",
  el_windows: "Elektryczne szyby",
  el_mirrors: "Elektryczne lusterka",

  // NOWE (Twoja lista)
  electric_seats: "Elektryczne fotele",
  ventilated_seats: "Wentylowane fotele",
  heated_windscreen: "Podgrzewana przednia szyba",
  tinted_windows: "Przyciemniane szyby",
  velour_upholstery: "Tapicerka welurowa",
  rain_sensor: "Czujnik deszczu",
  driver_fatigue_detection: "System wykrywania zmęczenia kierowcy",
  sos_system: "System SOS",
  airbags: "Poduszki powietrzne",
  curtain_airbags: "Kurtyny powietrzne",
  rear_parking_sensor: "Czujnik parkowania tył",
  park_assist: "Asystent parkowania",
  speed_limiter: "Ogranicznik prędkości",
  hill_descent_control: "Automatyczna kontrola zjazdu ze stoku",
  cornering_assist: "Asystent pokonywania zakrętów",
  adaptive_lighting: "Oświetlenie adaptacyjne",
  dusk_sensor: "Czujnik zmierzchu",
  daytime_running_lights: "Światła do jazdy dziennej",
  tpms: "Elektroniczna kontrola ciśnienia w oponach",
  power_steering: "Wspomaganie kierownicy",
  heated_mirrors: "Podgrzewane lusterka",
  distance_control: "Kontrola odległości od pojazdu",
  brake_assist: "Asystent hamowania",
  hill_start_assist: "Wspomaganie ruszania pod górę",
  traffic_sign_recognition: "System rozpoznawania znaków drogowych",
  cornering_lights: "Doświetlanie zakrętów",
  follow_me_home: "Oświetlanie drogi do domu",
  bluetooth: "Bluetooth",
  handsfree: "Zestaw głośnomówiący",
  audio_system: "System nagłośnienia",
  touchscreen: "Ekran dotykowy",
  usb: "Gniazdo USB",
};

export function getAllEquipment() {
  return (Object.keys(EQUIP_LABELS) as EquipId[]).map((id) => ({
    id,
    label: EQUIP_LABELS[id],
  }));
}
