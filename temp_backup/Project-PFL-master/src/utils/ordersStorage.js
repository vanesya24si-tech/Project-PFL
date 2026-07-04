import { supabase } from "./supabaseClient";

// ====================================================================
// ORDERS STORAGE — sumber data tunggal untuk order & live tracking.
// Semua fungsi di sini nembak ke Supabase (tabel "orders"), BUKAN
// localStorage lagi, supaya:
//   1. Admin update status di /tracking -> langsung nyambung ke DB.
//   2. Pelanggan yang scan barcode/QR ke /track/:orderId -> baca DB yg sama.
//   3. Perubahan admin ter-broadcast REALTIME ke halaman pelanggan
//      (dan sebaliknya, ke semua sesi admin lain yang sedang buka /tracking).
// ====================================================================

const TABLE = "orders";

// Urutan status resmi (dipakai admin & customer view, biar konsisten)
export const STATUS_LABELS = ["Antre di Rak", "Lagi Dicuci", "Tahap Setrika", "Bisa Diambil"];

export const STEP_THEME = [
  { label: "Antre", color: "bg-slate-500", text: "text-slate-600" },
  { label: "Cuci", color: "bg-blue-500", text: "text-blue-600" },
  { label: "Setrika", color: "bg-amber-500", text: "text-amber-600" },
  { label: "Ready", color: "bg-green-600", text: "text-green-600" },
];

function generateOrderId() {
  return `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
}

// Bikin URL publik untuk QR / barcode. Dipakai di AddOrder.jsx.
export function buildTrackingUrl(orderId) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/track/${orderId}`;
}

/**
 * Membuat order baru sekaligus menyimpannya ke Supabase.
 * Mengembalikan { data, error } supaya pemanggil bisa handle gagal insert
 * (misalnya kalau Supabase belum dikonfigurasi / RLS menolak).
 */
export async function createOrder({
  customerName,
  phone = "",
  service = "",
  weight = "",
  price = 0,
  isPaid = false,
  detail = "Pesanan baru masuk, menunggu giliran diproses.",
  eta = "",
}) {
  let id = generateOrderId();

  const payload = {
    id,
    customer_name: customerName,
    phone,
    service,
    weight: weight?.toString() ?? "",
    price: Number(price) || 0,
    is_paid: !!isPaid,
    current_step: 0,
    status: STATUS_LABELS[0],
    detail,
    eta,
  };

  const { data, error } = await supabase.from(TABLE).insert(payload).select().single();
  return { data: data ? mapOrderRow(data) : null, error };
}

/**
 * Ambil satu order (dipakai halaman publik /track/:orderId saat load pertama).
 */
export async function getOrderById(orderId) {
  const { data, error } = await supabase.from(TABLE).select("*").eq("id", orderId).maybeSingle();
  return { data: data ? mapOrderRow(data) : null, error };
}

/**
 * Ambil semua order (dipakai halaman admin /tracking).
 */
export async function getAllOrders() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });
  return { data: (data || []).map(mapOrderRow), error };
}

/**
 * Update ke tahap berikutnya (dipakai tombol "Lanjut Tahap" di admin).
 * Perubahan ini yang men-trigger event realtime ke semua subscriber.
 */
export async function advanceOrderStep(orderId, nextStep) {
  const nextStatus = STATUS_LABELS[nextStep] ?? STATUS_LABELS[STATUS_LABELS.length - 1];
  const patch = {
    current_step: nextStep,
    status: nextStatus,
    ...(nextStep === 3 ? { eta: "Selesai" } : {}),
  };
  const { data, error } = await supabase.from(TABLE).update(patch).eq("id", orderId).select().single();
  return { data: data ? mapOrderRow(data) : null, error };
}

/**
 * Update status pembayaran (lunas / belum).
 */
export async function markOrderPaid(orderId, isPaid) {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ is_paid: isPaid })
    .eq("id", orderId)
    .select()
    .single();
  return { data: data ? mapOrderRow(data) : null, error };
}

/**
 * Subscribe REALTIME untuk satu order spesifik.
 * Dipakai di halaman publik /track/:orderId supaya progress bar bergerak
 * otomatis begitu admin update status, tanpa perlu refresh.
 *
 * Return: fungsi unsubscribe (panggil di cleanup useEffect).
 */
export function subscribeToOrder(orderId, onChange) {
  const channel = supabase
    .channel(`order-${orderId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: TABLE, filter: `id=eq.${orderId}` },
      (payload) => {
        if (payload.new) onChange(mapOrderRow(payload.new));
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Subscribe REALTIME untuk semua order sekaligus.
 * Dipakai di halaman admin /tracking supaya list ter-update live kalau ada
 * order baru masuk atau status berubah dari sesi admin lain.
 */
export function subscribeToAllOrders({ onInsert, onUpdate, onDelete }) {
  const channel = supabase
    .channel("orders-all")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: TABLE }, (payload) => {
      onInsert?.(mapOrderRow(payload.new));
    })
    .on("postgres_changes", { event: "UPDATE", schema: "public", table: TABLE }, (payload) => {
      onUpdate?.(mapOrderRow(payload.new));
    })
    .on("postgres_changes", { event: "DELETE", schema: "public", table: TABLE }, (payload) => {
      onDelete?.(payload.old?.id);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// Ubah nama kolom snake_case dari Supabase -> camelCase yang dipakai komponen UI
function mapOrderRow(row) {
  if (!row) return row;
  return {
    id: row.id,
    user: row.customer_name,
    phone: row.phone,
    service: row.service,
    weight: row.weight,
    price: row.price,
    isPaid: row.is_paid,
    currentStep: row.current_step,
    status: row.status,
    detail: row.detail,
    eta: row.eta,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
