// components/EquipTile.tsx
"use client";

import React from "react";
import {
  GaugeCircle, Snowflake, Fan, ParkingCircle, Camera, Map as MapIcon, Sun, Moon,
  Smartphone, MonitorSmartphone, Gauge, Crosshair, Eye, Route, KeyRound, Power,
  CarFront, Baby, Lamp, Anchor, ScanLine, Armchair, GlassWater, Phone, Radio,
  Monitor, Usb, PanelsTopLeft, Mountain, Move3D, Siren, Shield, AirVent, Ruler,
  ShieldAlert, MoveUpRight, ScanEye, Home, Bluetooth as BluetoothIcon, Wind, CloudDrizzle, Coffee, Timer
} from "lucide-react";
import { EQUIP_LABELS, type EquipId } from "@/lib/equipment";

export const EQUIP_ICONS: Record<EquipId, React.ComponentType<{ className?: string }>> = {
  abs: GaugeCircle,
  esp: GaugeCircle,
  asr: GaugeCircle,
  climate_auto: Snowflake,
  climate_manual: Fan,
  parking_sensors: ParkingCircle,
  rear_camera: Camera,
  nav: MapIcon,
  led: Sun,
  xenon: Moon,
  alloy_wheels: GaugeCircle,
  heated_seats: Fan,
  heated_wheel: Fan,
  apple_carplay: Smartphone,
  android_auto: MonitorSmartphone,
  cruise: Gauge,
  adaptive_cruise: Crosshair,
  blind_spot: Eye,
  lane_assist: Route,
  keyless: KeyRound,
  start_stop: Power,
  el_windows: GaugeCircle,
  el_mirrors: GaugeCircle,
  multisteering: CarFront,
  isofix: Baby,
  fog: Lamp,
  roof_rails: Anchor,
  towbar: Anchor,
  sunroof: Sun,
  leather: Armchair,
  camera360: ScanLine,
  electric_seats: GaugeCircle,
  ventilated_seats: Fan,
  heated_windscreen: Wind,
  tinted_windows: Eye,
  velour_upholstery: Armchair,
  rain_sensor: CloudDrizzle,
  driver_fatigue_detection: Coffee,
  sos_system: Siren,
  airbags: Shield,
  curtain_airbags: AirVent,
  rear_parking_sensor: ParkingCircle,
  park_assist: ParkingCircle,
  speed_limiter: Timer,
  hill_descent_control: Mountain,
  cornering_assist: Move3D,
  adaptive_lighting: Sun,
  dusk_sensor: Moon,
  daytime_running_lights: Sun,
  tpms: Gauge,
  power_steering: CarFront,
  heated_mirrors: GlassWater,
  distance_control: Ruler,
  brake_assist: ShieldAlert,
  hill_start_assist: MoveUpRight,
  traffic_sign_recognition: ScanEye,
  cornering_lights: Lamp,
  follow_me_home: Home,
  bluetooth: BluetoothIcon,
  handsfree: Phone,
  audio_system: Radio,
  touchscreen: Monitor,
  usb: Usb,
  glass_roof: PanelsTopLeft,
};

export function EquipTile({ id }: { id: EquipId }) {
  const Icon = EQUIP_ICONS[id];
  const label = EQUIP_LABELS[id] ?? id;
  if (!Icon) return null;
  return (
    <div className="rounded-xl border border-zinc-200 p-3 flex items-center gap-2">
      <Icon className="h-5 w-5 shrink-0" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function EquipmentGrid({ items }: { items: EquipId[] }) {
  const filtered = (items ?? [])
    .filter(Boolean)
    .filter((id): id is EquipId => !!EQUIP_LABELS[id as EquipId]);

  if (filtered.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {filtered.map((id) => (
        <EquipTile key={id} id={id} />
      ))}
    </div>
  );
}
