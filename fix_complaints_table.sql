-- ============================================================
-- JALANKAN SQL INI DI SUPABASE SQL EDITOR
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- ====================================================================
-- TABEL COMPLAINTS (PENGADUAN PELANGGAN)
-- ====================================================================
create table if not exists public.complaints (
  id text primary key,
  customer_name text not null,
  phone text,
  complaint_type text not null,
  order_id text,
  description text not null,
  photo_urls jsonb default '[]'::jsonb,
  status text not null default 'Menunggu Ditinjau',
  admin_reply text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Aktifkan RLS
alter table public.complaints enable row level security;

-- Hapus policy lama
drop policy if exists "Public can insert complaints" on public.complaints;
drop policy if exists "Public can read own complaints" on public.complaints;
drop policy if exists "Authenticated can read all complaints" on public.complaints;
drop policy if exists "Authenticated can update complaints" on public.complaints;

-- Siapa saja boleh memasukkan komplain (pelanggan tanpa login pun bisa)
create policy "Public can insert complaints"
  on public.complaints
  for insert
  to anon, authenticated
  with check (true);

-- Siapa saja boleh membaca komplain (untuk tracking status)
create policy "Public can read own complaints"
  on public.complaints
  for select
  to anon, authenticated
  using (true);

-- Admin boleh update status / reply komplain
create policy "Authenticated can update complaints"
  on public.complaints
  for update
  to authenticated
  using (true)
  with check (true);

-- Trigger updated_at otomatis
create or replace function public.handle_complaint_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists on_complaint_updated on public.complaints;
create trigger on_complaint_updated
  before update on public.complaints
  for each row execute procedure public.handle_complaint_updated_at();

-- Selesai! Tabel complaints siap digunakan.
