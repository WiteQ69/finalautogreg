# Deployment guide (Vercel)

Ostatnia aktualizacja: 2025-09-18

## Najczęstsze powody: działa lokalnie, nie działa na Vercel

1. **Brak zmiennych środowiskowych na Vercel**  
   Skopiuj wartości z `.env` i ustaw je w Vercel → *Settings → Environment Variables*.  
   - `NEXT_PUBLIC_SUPABASE_URL` (Public)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Public)
   - `SUPABASE_URL` (Server)
   - `SUPABASE_SERVICE_ROLE_KEY` (Server) — **nie dodawaj z prefixem `NEXT_PUBLIC_`**
   - `GOOGLE_PLACES_API_KEY` (Server)
   - `GOOGLE_PLACE_ID` (Server)
   - `SECRET_KEY` (Server)
   - `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` (Server)
   - `UPLOAD_FOLDER` = `public/uploads` (Server)
   - `NEXTAUTH_URL` (Server) — ustaw na URL z Vercel (np. `https://twoja-domena.vercel.app`)

   Po dodaniu zmiennych **zrób redeploy**.

2. **Błędy przy opinii Google**  
   Komponent `GoogleReviewsCarousel` ma teraz fallback – jeśli brakuje kluczy, wyświetli informację zamiast pustki.  
   API: `app/api/google-reviews/route.ts` korzysta z `GOOGLE_PLACES_API_KEY` i `GOOGLE_PLACE_ID`.

3. **Reklama na kartach / stronie auta**  
   Obrazek reklamy używa ścieżki: `/REKLAMA.jpg` (w katalogu `public/REKLAMA.jpg`).  
   Upewnij się, że plik jest w repo (nie w `.gitignore`). Na Vercel pliki z `public/` są serwowane automatycznie.

4. **Różnice SSR/CSR**  
   Unikaj używania `window` po stronie serwera. Jeśli musisz, owiń w `if (typeof window !== 'undefined') { ... }`.

5. **Zewnętrzne obrazki**  
   Jeśli używasz `next/image` z zewnętrznymi URL-ami, dodaj domeny do `next.config.js` → `images.domains`.

## Szybki checklist przed deployem
- [ ] Zmienna `NEXTAUTH_URL` wskazuje na produkcyjny adres.
- [ ] Wszystkie **server-only** sekrety nie mają prefixu `NEXT_PUBLIC_`.
- [ ] Plik `public/REKLAMA.jpg` istnieje.
- [ ] Tabela `cars` w Supabase ma rekordy (środowisko prod).
- [ ] Po zmianach wykonaj **Redeploy** na Vercel.

