"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import SoldBadge from "./SoldBadge";
import { useCarStatus, CarStatus } from "@/lib/useCarStatus";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type Car = {
  id: string;
  title: string;
  coverUrl: string;
  defaultStatus?: CarStatus;
};

export default function CarCard({ id, title, coverUrl, defaultStatus = "available" }: Car) {
  const router = useRouter();
  const { status, toggle } = useCarStatus(id, defaultStatus);

  const handleToggle = () => {
    const next = status === "sold" ? "available" : "sold";
    // After toggling, optionally navigate
    if (next === "sold") {
      toggle();
      router.push("/sprzedane");
    } else {
      toggle();
      router.push("/auta");
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow">
          <Image
            src={coverUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
          {status === "sold" && <SoldBadge />}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className={`text-sm font-medium ${status === "sold" ? "text-red-600" : "text-emerald-600"}`}>
            {status === "sold" ? "SPRZEDANY" : "DOSTĘPNY"}
          </span>
          <Button variant="secondary" onClick={handleToggle}>
            {status === "sold" ? "Przywróć do dostępnych" : "Oznacz jako sprzedany"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}