import { supabase } from "./supabaseClient";
import { updateCustomer } from "./customerStorage";

const TABLE = "reward_redemptions";

export async function redeemReward(customerId, currentPoints, reward) {
  if (currentPoints < reward.points) {
    throw new Error("Poin tidak cukup");
  }

  // Kurangi poin
  const newPoints = currentPoints - reward.points;
  await updateCustomer(customerId, { points: newPoints });

  // Simpan riwayat klaim reward
  const { data, error } = await supabase
    .from(TABLE)
    .insert([{
      customer_id: customerId,
      reward_id: reward.id,
      reward_name: reward.name,
      points_cost: reward.points,
      status: "pending", // admin akan validasi
    }])
    .select()
    .single();

  if (error) {
    console.error("Gagal menyimpan riwayat klaim:", error);
    throw error;
  }

  return { data, newPoints };
}

export async function loadRedemptions() {
  // Ambil riwayat klaim dan gabungkan dengan nama pelanggan
  const { data, error } = await supabase
    .from(TABLE)
    .select(`
      *,
      customers ( name, phone )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal memuat data penukaran reward:", error);
    return [];
  }
  return data;
}

export async function validateRedemption(id, status) {
  const { error } = await supabase
    .from(TABLE)
    .update({ status })
    .eq("id", id);
    
  if (error) {
    console.error("Gagal mengubah status reward:", error);
    throw error;
  }
}
