"use client";

import { useEffect, useState } from "react";
import CarCard, { Car } from "@/components/CarCard";
import { useRouter } from "next/navigation";

const cars: Car[] = [
  { id: "toyota-chr-2018", title: "Toyota C-HR 2018 Hybrid", coverUrl: "/demo/ch-r.jpg" },
  { id: "audi-q5-2014", title: "Audi Q5 2014 2.0 TDI", coverUrl: "/demo/q5.jpg" },
  { id: "example-3", title: "Przykładowy samochód 3", coverUrl: "/demo/q5.jpg" },
];

export default function SoldPage() {
  const [soldIds, setSoldIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("car-statuses-v1");
      const map = raw ? JSON.parse(raw) as Record<string, string> : {};
      const ids = Object.entries(map).filter(([,v]) => v === "sold").map(([k]) => k);
      setSoldIds(ids);
    } catch {}
  }, []);

  const soldCars = cars.filter(c => soldIds.includes(c.id));

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Sprzedane</h1>
      {soldCars.length === 0 ? (
        <p className="text-zinc-600">Brak sprzedanych samochodów.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {soldCars.map((c) => (
            <CarCard key={c.id} {...c} defaultStatus="sold" />
          ))}
        </div>
      )}
    </div>
  );
}