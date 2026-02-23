"use client";

import { useEffect, useState } from "react";

export type CarStatus = "available" | "sold";

const KEY = "car-statuses-v1";

type Map = Record<string, CarStatus>;

function read(): Map {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Map) : {};
  } catch {
    return {};
  }
}

function write(data: Map) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
}

export function useCarStatus(id: string, defaultStatus: CarStatus = "available") {
  const [status, setStatus] = useState<CarStatus>(defaultStatus);

  useEffect(() => {
    const all = read();
    if (all[id]) setStatus(all[id]);
  }, [id]);

  useEffect(() => {
    const all = read();
    all[id] = status;
    write(all);
  }, [id, status]);

  const toggle = () => setStatus((s) => (s === "sold" ? "available" : "sold"));

  return { status, setStatus, toggle };
}