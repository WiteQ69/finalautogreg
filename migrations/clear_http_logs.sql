-- Ruch strony nie jest już zapisywany do tej tabeli przez middleware.
-- TRUNCATE odzyskuje miejsce szybciej niż DELETE przy setkach tysięcy rekordów.
truncate table public.http_logs restart identity;
