-- Dodaje kolumnę przełącznika stempla
alter table public.cars
add column if not exists sold_badge boolean not null default false;