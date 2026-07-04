-- ====================================================================
-- SUPABASE AUTH SCHEMA & PROFILE TRIGGER CONFIGURATION
-- ====================================================================
--
-- CARA PENGGUNAAN:
-- 1. Masuk ke Dashboard Supabase Anda (https://supabase.com).
-- 2. Buka menu "SQL Editor" dari sidebar kiri.
-- 3. Buat query baru (New Query), salin seluruh isi file ini, lalu tekan tombol "Run".
-- ====================================================================

-- 1. Buat Tabel Profil Pelanggan/Admin di skema public jika belum ada
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Pastikan kolom role ada (karena "create table if not exists" tidak memperbarui tabel yang sudah ada sebelumnya)
alter table public.profiles 
  add column if not exists role text not null check (role in ('admin', 'customer')) default 'customer';

-- 2. Aktifkan Row Level Security (RLS) pada tabel profiles demi keamanan
alter table public.profiles enable row level security;

-- 3. Kebijakan Keamanan (RLS Policies)
-- Hapus policy lama jika ada agar query bersifat idempotent (bebas error saat dijalankan ulang)
drop policy if exists "Allow authenticated users to read profiles" on public.profiles;
drop policy if exists "Allow users to update their own profile" on public.profiles;

-- Kebijakan A: Izinkan pengguna untuk membaca profil mereka sendiri atau profil lain (opsional)
create policy "Allow authenticated users to read profiles"
  on public.profiles
  for select
  to authenticated
  using (true);

-- Kebijakan B: Izinkan pengguna untuk memperbarui profil mereka sendiri saja
create policy "Allow users to update their own profile"
  on public.profiles
  for update
  to authenticated
  using ( (select auth.uid()) = id )
  with check ( (select auth.uid()) = id );

-- 4. Fungsi trigger untuk otomatis menyalin user baru dari auth.users ke public.profiles
create or replace function public.handle_new_user()
returns trigger
security definer set search_path = public
language plpgsql
as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  );
  return new;
end;
$$;

-- 5. Trigger yang memicu fungsi di atas setelah user baru terdaftar di auth.users
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ====================================================================
-- 6. TABEL ORDERS (LIVE TRACKING LAUNDRY VIA BARCODE/QR)
-- ====================================================================
-- Tabel ini menjadi satu-satunya sumber data order & status tracking.
-- Dipakai bersama oleh: (a) halaman admin /tracking, dan
-- (b) halaman publik /track/:orderId yang dibuka lewat scan barcode/QR.

create table if not exists public.orders (
  id text primary key,                         -- contoh: "ORD-4821"
  customer_name text not null,
  phone text,
  service text,
  weight text,
  price numeric default 0,
  is_paid boolean default false,
  current_step smallint not null default 0,    -- 0 Antre, 1 Cuci, 2 Setrika, 3 Ready
  status text not null default 'Antre di Rak',
  detail text,
  eta text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Aktifkan RLS
alter table public.orders enable row level security;

-- Hapus policy lama biar idempotent
drop policy if exists "Public can read orders for tracking" on public.orders;
drop policy if exists "Authenticated can insert orders" on public.orders;
drop policy if exists "Authenticated can update orders" on public.orders;

-- Kebijakan A: SIAPA SAJA (termasuk pelanggan yang scan barcode tanpa login)
-- boleh membaca data order. Ini WAJIB supaya halaman publik /track/:orderId jalan.
create policy "Public can read orders for tracking"
  on public.orders
  for select
  to anon, authenticated
  using (true);

-- Kebijakan B: hanya admin (user login) yang boleh membuat order baru
create policy "Authenticated can insert orders"
  on public.orders
  for insert
  to authenticated
  with check (true);

-- Kebijakan C: hanya admin (user login) yang boleh update status/progress order
create policy "Authenticated can update orders"
  on public.orders
  for update
  to authenticated
  using (true)
  with check (true);

-- Trigger otomatis update kolom updated_at setiap kali baris order diubah
create or replace function public.handle_order_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists on_order_updated on public.orders;
create or replace trigger on_order_updated
  before update on public.orders
  for each row execute procedure public.handle_order_updated_at();

-- Aktifkan Realtime (WAJIB) supaya update admin langsung nyampe ke halaman
-- tracking pelanggan tanpa refresh. Jalankan baris ini kalau publication
-- "supabase_realtime" belum meng-cover tabel orders.
alter publication supabase_realtime add table public.orders;
