import { supabase } from "./supabaseClient";

const TABLE = "complaints";

/**
 * Kirim komplain pelanggan ke Supabase
 */
export async function submitComplaint({ name, phone, type, orderId, description }) {
  const id = `KMP-${Date.now()}`;

  const { data, error } = await supabase
    .from(TABLE)
    .insert([{
      id,
      customer_name: name,
      phone: phone || "",
      complaint_type: type,
      order_id: orderId?.trim() || null,
      description: description.trim(),
      status: "Menunggu Ditinjau",
    }])
    .select()
    .single();

  if (error) {
    console.error("Gagal menyimpan komplain:", error);
    throw error;
  }
  return data;
}

/**
 * Ambil semua komplain (untuk admin)
 */
export async function loadComplaints() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal memuat komplain:", error);
    return [];
  }
  return data || [];
}

/**
 * Update status / reply komplain (oleh admin)
 */
export async function updateComplaint(id, patch) {
  const { error } = await supabase
    .from(TABLE)
    .update(patch)
    .eq("id", id);

  if (error) {
    console.error("Gagal update komplain:", error);
    throw error;
  }
}
