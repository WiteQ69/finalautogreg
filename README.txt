PATCH: statyczna reklama na karcie auta

Zawartość:
- app/samochod/[id]/page.tsx  (sekcja reklamy jako tło z /REKLAMA.JPG)
- public/REKLAMA.JPG          (placeholder – podmień na własną grafikę)
- README.txt

Instrukcja:
1) Rozpakuj ZIP w katalogu głównym projektu (tam gdzie jest package.json).
2) Zgódź się na nadpisanie app/samochod/[id]/page.tsx.
3) Zostanie utworzony folder public/ z plikiem REKLAMA.JPG.
   Podmień ten plik na swój (zachowaj nazwę lub zmień ścieżkę w page.tsx).
4) Uruchom projekt: npm run dev

Uwaga: jeżeli używasz basePath w next.config.js, rozważ zmianę ścieżki z '/REKLAMA.JPG' na 'REKLAMA.JPG'.
