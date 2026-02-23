'use client';

import {
  ShieldAlert,
  ShieldCheck,
  Snowflake,
  Fan,
  ParkingCircle,
  Camera,
  Map,
  Sun,
  Moon,
  GaugeCircle,
  Flame,
  Smartphone,
  MonitorSmartphone,
  // Cruise,    // USUŃ
  Crosshair,
  Eye,
  Route,
  KeyRound,
  Power,
  SquareGanttChart,
  SquareDashedMousePointer,
  Baby,
  Lamp,
  Anchor,
  // Sunroof,   // USUŃ
  Armchair,
  ScanLine,
  Disc,
  Gauge as Cruise, // ⟵ DODAJ
  Sun as Sunroof,  // ⟵ DODAJ
} from "lucide-react";


const ICONS: Record<string, any> = {
  abs: ShieldCheck,
  esp: ShieldAlert,
  asr: ShieldAlert,
  climate_auto: Snowflake,
  climate_manual: Fan,
  parking_sensors: ParkingCircle,
  rear_camera: Camera,
  nav: Map,
  led: Sun,
  xenon: Moon,
  alloy_wheels: GaugeCircle,
  heated_seats: Flame,
  heated_wheel: Flame,
  apple_carplay: Smartphone,
  android_auto: MonitorSmartphone,
  cruise: Cruise,
  adaptive_cruise: Crosshair,
  blind_spot: Eye,
  lane_assist: Route,
  keyless: KeyRound,
  start_stop: Power,
  el_windows: SquareGanttChart,
  el_mirrors: SquareDashedMousePointer,
  multisteering: SteeringIcon,
  isofix: Baby,
  fog: Lamp,
  roof_rails: Anchor,
  towbar: Anchor,
  sunroof: Sunroof,
  leather: Armchair,
  camera360: ScanLine,
};

// Prosta ikonka „kierownicy” (brak w lucide jako gotowiec)
function SteeringIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6 13a6 6 0 0 1 12 0" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 14v5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function FeaturePill({ code, label }: { code: string; label: string }) {
  const Icon = ICONS[code] ?? Disc;
  return (
    <div className="flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-sm">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
  );
}
