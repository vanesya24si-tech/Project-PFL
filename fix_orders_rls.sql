-- ============================================================
-- JALANKAN SQL INI DI SUPABASE SQL EDITOR
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- 1. Pastikan RLS aktif di tabel orders
alter table public.orders enable row level security;

-- 2. Hapus semua policy lama di tabel orders
drop policy if exists "Public can read orders for tracking" on public.orders;
drop policy if exists "Authenticated can insert orders" on public.orders;
drop policy if exists "Authenticated can update orders" on public.orders;
drop policy if exists "Allow public read orders" on public.orders;
drop policy if exists "Allow authenticated insert orders" on public.orders;
drop policy if exists "Allow authenticated update orders" on public.orders;

-- 3. BUAT ULANG POLICY PUBLIK (ini yang paling penting)
-- Siapa saja (termasuk yang tidak login / scan barcode) bisa BACA order
create policy "Public can read orders for tracking"
  on public.orders
  for select
  to anon, authenticated
  using (true);

-- Hanya user login (admin) yang bisa BUAT order baru
create policy "Authenticated can insert orders"
  on public.orders
  for insert
  to authenticated
  with check (true);

-- Hanya user login (admin) yang bisa UPDATE status order
create policy "Authenticated can update orders"
  on public.orders
  for update
  to authenticated
  using (true)
  with check (true);

-- 4. Pastikan realtime aktif untuk tabel orders
-- (agar status update admin langsung terlihat di HP pelanggan)
alter publication supabase_realtime add table public.orders;

-- Selesai! Sekarang QR code bisa diakses siapa saja tanpa login.
