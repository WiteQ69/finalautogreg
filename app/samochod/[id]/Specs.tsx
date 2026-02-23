'use client';

import {
  Fuel,
  Gauge,
  Cog,
  Calendar,
  Workflow,
  Bolt,
  Palette,
  CarFront,
  Binary,
  Users,
  ShieldCheck,
  Globe2,
  FileText,
  BadgeCheck,
} from 'lucide-react';

type SpecRowProps = {
  label: string;
  value?: string | number | boolean;
  icon?: React.ReactNode;
  suffix?: string;
};

function Spec({ label, value, icon, suffix }: SpecRowProps) {
  if (value === undefined || value === null || value === '') return null;
  const v =
    typeof value === 'boolean' ? (value ? 'Tak' : 'Nie') : String(value);
  return (
    <div className="rounded-xl border p-4 flex items-center gap-3">
      <div className="flex-none flex items-center justify-center w-9 h-9 rounded-lg bg-zinc-100">
        {icon}
      </div>
      <div>
        <div className="text-sm text-zinc-500">{label}</div>
        <div className="font-medium tracking-tight">
          {v} {suffix ?? ''}
        </div>
      </div>
    </div>
  );
}

export default function Specs({ car }: { car: any }) {
  const mileage =
    typeof car.mileage === 'number'
      ? car.mileage.toLocaleString('pl-PL')
      : car.mileage;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Spec label="Rok produkcji" value={car.year} icon={<Calendar className="h-5 w-5" />} />
        <Spec label="Przebieg" value={mileage} suffix="km" icon={<Gauge className="h-5 w-5" />} />
        <Spec label="Pojemność" value={car.engineCapacityCcm} suffix="ccm" icon={<Cog className="h-5 w-5" />} />
        <Spec label="Moc" value={car.powerKw} suffix="kW" icon={<Bolt className="h-5 w-5" />} />
        <Spec label="Paliwo" value={car.fuelType?.replace('_', ' + ')} icon={<Fuel className="h-5 w-5" />} />
        <Spec label="Skrzynia" value={car.transmission} icon={<Workflow className="h-5 w-5" />} />
        <Spec label="Napęd" value={car.drivetrain} icon={<CarFront className="h-5 w-5" />} />
        <Spec label="Nadwozie" value={car.bodyType?.toUpperCase()} icon={<Binary className="h-5 w-5" />} />
        <Spec label="Kolor" value={car.color} icon={<Palette className="h-5 w-5" />} />
        <Spec label="Drzwi" value={car.doors} icon={<CarFront className="h-5 w-5" />} />
        <Spec label="Miejsca" value={car.seats} icon={<Users className="h-5 w-5" />} />
        <Spec label="Stan" value={car.condition} icon={<ShieldCheck className="h-5 w-5" />} />
        <Spec label="Pochodzenie" value={car.origin} icon={<Globe2 className="h-5 w-5" />} />
        <Spec label="Zarejestrowany" value={car.registeredIn} icon={<BadgeCheck className="h-5 w-5" />} />
        <Spec
          label="Dokument sprzedaży"
          value={
            car.saleDocument === 'umowa'
              ? 'Umowa kupna-sprzedaży'
              : car.saleDocument === 'vat_marza'
              ? 'Faktura VAT marża'
              : car.saleDocument === 'vat23'
              ? 'Faktura VAT 23%'
              : undefined
          }
          icon={<FileText className="h-5 w-5" />}
        />
      </div>
    </div>
  );
}
