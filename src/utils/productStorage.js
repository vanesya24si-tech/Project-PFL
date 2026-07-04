import { supabase } from "./supabaseClient";
import initialProducts from "../data/laundryProducts.json"; // Opsional: Untuk fallback atau seeder

const TABLE = "products";

export async function loadProducts() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal memuat produk dari Supabase:", error);
    return [];
  }
  
  // Jika database masih kosong, kita bisa fallback ke data awal,
  // namun umumnya untuk Supabase sebaiknya di-seed sekali.
  // Untuk transisi halus, kembalikan json lokal jika tabel benar-benar kosong:
  if (!data || data.length === 0) {
    return initialProducts;
  }
  
  return data;
}

export async function createProduct(payload) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([{
      title: payload.title,
      code: payload.code,
      category: payload.category,
      brand: payload.brand,
      price: Number(payload.price) || 0,
      stock: Number(payload.stock) || 0,
      icon: payload.icon || "HiCube",
      color: payload.color || "blue",
      badges: payload.badges || [],
      features: payload.features || [],
    }])
    .select()
    .single();

  if (error) {
    console.error("Gagal membuat produk:", error);
    throw error;
  }
  return data;
}

export async function updateProduct(productId, payload) {
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      title: payload.title,
      code: payload.code,
      category: payload.category,
      brand: payload.brand,
      price: Number(payload.price) || 0,
      stock: Number(payload.stock) || 0,
      icon: payload.icon,
      color: payload.color,
      badges: payload.badges,
      features: payload.features,
    })
    .eq("id", productId)
    .select()
    .single();

  if (error) {
    console.error("Gagal update produk:", error);
    throw error;
  }
  return data;
}

export async function deleteProduct(productId) {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", productId);

  if (error) {
    console.error("Gagal hapus produk:", error);
    throw error;
  }
}

export async function getProductById(productId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", productId)
    .single();

  if (error) {
    console.error("Gagal memuat detail produk:", error);
    // Coba fallback ke lokal jika id-nya format string biasa
    const local = initialProducts.find(p => p.id === productId);
    return local || null;
  }
  return data;
}
