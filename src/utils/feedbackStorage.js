import { supabase } from "./supabaseClient";

const TABLE = "feedback";

// ====================================================================
// FEEDBACK STORAGE — Menyimpan & mengambil ulasan pelanggan dari Supabase
// ====================================================================

/**
 * Simpan feedback baru dari pelanggan
 */
export async function submitFeedback({ customerName, phone, rating, comment, service }) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      customer_name: customerName,
      phone: phone || "",
      rating: Number(rating) || 5,
      comment: comment || "",
      service: service || "",
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Gagal menyimpan feedback:", error);
    throw error;
  }
  return data;
}

/**
 * Ambil semua feedback (untuk halaman admin /feedback)
 */
export async function loadFeedback() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal memuat feedback:", error);
    throw error;
  }
  return (data || []).map((row) => ({
    id: row.id,
    user: row.customer_name,
    phone: row.phone,
    rate: row.rating,
    comment: row.comment,
    service: row.service,
    reply: row.reply || "",
    date: new Date(row.created_at).toLocaleDateString("id-ID", {
      day: "numeric", month: "short", year: "numeric"
    }),
    avatar: (row.customer_name || "?")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join(""),
    tag: row.rating >= 4 ? "Puas" : row.rating === 3 ? "Netral" : "Keluhan",
  }));
}

/**
 * Simpan balasan admin untuk feedback tertentu
 */
export async function saveFeedbackReply(feedbackId, reply) {
  const { error } = await supabase
    .from(TABLE)
    .update({ reply })
    .eq("id", feedbackId);

  if (error) {
    console.error("Gagal menyimpan balasan:", error);
    throw error;
  }
}

// Legacy localStorage helpers (backward compat - tidak dipakai lagi)
export function loadFeedbackReplies() { return {}; }
export function clearFeedbackReply() {}
