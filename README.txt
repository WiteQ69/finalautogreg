
# Sold Badge — HOTFIX

To minimum, żeby overlay działał od razu.
Wgrywasz i podmieniasz *tylko* te pliki.

## Co jest w ZIPie
- components/SoldOverlay.tsx
- components/CarImage.tsx
- components/admin/SoldBadgeToggle.tsx   (PUT /api/cars/:id)
- components/ui/simple-car-card.tsx      (używa CarImage i (car as any).sold_badge)
- public/stamps/sold.png                  (placeholder — możesz podmienić)

## Wymagania
1) W bazie musi istnieć kolumna:
```sql
alter table public.cars
add column if not exists sold_badge boolean not null default false;
```
2) Endpoint `/api/cars` powinien zwracać pole `sold_badge` w JSON (większość select * je zwróci).

## Integracja
1) Skopiuj pliki z ZIP nadpisując istniejące.
2) W /admin na stronie edycji masz już import:
```tsx
import SoldBadgeToggle from '@/components/admin/SoldBadgeToggle';
```
– komponent wysyła `PUT /api/cars/:id` z `{ sold_badge: true|false }`.
3) Lista `/auta` pobiera `/api/cars` i `SimpleCarCard` nakłada stempel, gdy `sold_badge = true`.
4) Jeśli chcesz zmniejszyć stempel — edytuj rozmiar w `components/SoldOverlay.tsx` (klasy `w-1/2 max-w-[360px]`).

## Debug
- Nie nakłada się? Sprawdź w Network → `/api/cars` czy JSON ma `"sold_badge": true` dla danego auta.
- Jeśli obraz ma 0 wysokości, upewnij się, że rodzic ma `aspect-video`, a `CarImage` ma `containerClassName="h-full"` (tak jest w pliku z ZIPa).
