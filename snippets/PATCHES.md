# Patches (wklejki)

## A) app/samochod/[id]/page.tsx – nakładka nad galerią + grid wyposażenia
Dodaj importy:
```tsx
import StatusStamp from "@/components/StatusStamp";
import { EquipmentGrid } from "@/components/EquipTile";
import type { EquipId } from "@/lib/equipment";
```

Owiń `Gallery`:
```tsx
<div className="relative">
  <Gallery images={images} videoUrl={videoUrl} />
  {(car.status === "reserved" || (car as any).reserved_badge) && (
    <StatusStamp status="reserved" variant="full" />
  )}
  {(car.status === "sold" || (car as any).sold_badge) && (
    <StatusStamp status="sold" variant="full" />
  )}
</div>
```

Wyposażenie (zamiast ręcznego mapowania):
```tsx
{Array.isArray(equipment) && equipment.length > 0 && (
  <section className="mt-8">
    <h2 className="text-xl font-semibold text-zinc-900 mb-4">Wyposażenie</h2>
    <EquipmentGrid items={(equipment as EquipId[])} />
  </section>
)}
```

## B) admin – formularz nowego/edycji: użyj komponentu EquipmentField
Import:
```tsx
import EquipmentField from "@/components/admin/EquipmentField";
```
W miejscu sekcji wyposażenia:
```tsx
<EquipmentField />
```

## C) Lista aut – AutaPage już działa z SimpleCarCard.
Upewnij się, że przekazujesz cały `car` do `SimpleCarCard` (co już robisz).
Stempel REZERWACJA/SOLD renderuje `SimpleCarCard` na 1. zdjęciu.
