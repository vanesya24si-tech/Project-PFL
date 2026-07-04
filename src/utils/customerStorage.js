import { supabase } from "./supabaseClient";

const TABLE = "customers";

// Helper to convert DB snake_case columns to Javascript camelCase properties
export function mapCustomerFromRow(row) {
  if (!row) return row;
  const name = row.name || "";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return {
    id: row.id,
    name: row.name,
    phone: row.phone || "",
    email: row.email || "",
    address: row.address || "",
    customerType: row.customer_type || "Regular",
    maritalStatus: row.marital_status || "Belum Menikah",
    joinDate: row.join_date || "",
    points: Number(row.points) || 0,
    totalTransactions: Number(row.total_transactions) || 0,
    totalSpent: Number(row.total_spent) || 0,
    segment: row.segment || "Regular",
    lastTransaction: row.last_transaction || null,
    lastOrder: row.last_transaction || "Belum ada",
    status: row.status || "Aktif",
    favoriteService: row.favorite_service || (row.customer_type === "Premium" ? "Paket Cuci Premium" : "Paket Cuci Reguler"),
    orders: Number(row.total_transactions) || 0,
    activeStatus: row.status || "Aktif",
    avatar: initials || "PN",
    notes: row.notes || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Helper to convert camelCase properties back to DB snake_case columns
export function mapCustomerToRow(c) {
  return {
    id: c.id,
    name: c.name,
    phone: c.phone || "",
    email: c.email || "",
    address: c.address || "",
    customer_type: c.customerType || "Regular",
    marital_status: c.maritalStatus || "Belum Menikah",
    join_date: c.joinDate || new Date().toISOString().split("T")[0],
    points: Number(c.points) || 0,
    total_transactions: Number(c.totalTransactions) || 0,
    total_spent: Number(c.totalSpent) || 0,
    segment: c.segment || "Regular",
    last_transaction: c.lastTransaction || null,
    status: c.status || "Aktif",
    favorite_service: c.favoriteService || (c.customerType === "Premium" ? "Paket Cuci Premium" : "Paket Cuci Reguler"),
    notes: c.notes || "",
  };
}

/**
 * Fetch all customers from Supabase
 */
export async function loadCustomers() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Gagal memuat pelanggan dari Supabase:", error);
    throw error;
  }
  return (data || []).map(mapCustomerFromRow);
}

/**
 * Fetch a single customer by ID
 */
export async function getCustomerById(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(`Gagal memuat pelanggan dengan ID ${id}:`, error);
    throw error;
  }
  return data ? mapCustomerFromRow(data) : null;
}

/**
 * Delete a customer by ID
 */
export async function deleteCustomer(id) {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Gagal menghapus pelanggan dengan ID ${id}:`, error);
    throw error;
  }
}

/**
 * Save a customer (INSERT if new, UPDATE if editing)
 */
export async function saveCustomer(customerData, isEdit = false) {
  const row = mapCustomerToRow(customerData);
  if (isEdit) {
    const { data, error } = await supabase
      .from(TABLE)
      .update(row)
      .eq("id", customerData.id)
      .select()
      .single();

    if (error) {
      console.error("Gagal memperbarui pelanggan di Supabase:", error);
      throw error;
    }
    return mapCustomerFromRow(data);
  } else {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error("Gagal menyimpan pelanggan baru di Supabase:", error);
      throw error;
    }
    return mapCustomerFromRow(data);
  }
}

/**
 * Partially update a customer record (e.g. points, status, segment)
 */
export async function updateCustomer(id, patch) {
  const dbPatch = {};
  if (patch.name !== undefined) dbPatch.name = patch.name;
  if (patch.phone !== undefined) dbPatch.phone = patch.phone;
  if (patch.email !== undefined) dbPatch.email = patch.email;
  if (patch.address !== undefined) dbPatch.address = patch.address;
  if (patch.customerType !== undefined) dbPatch.customer_type = patch.customerType;
  if (patch.maritalStatus !== undefined) dbPatch.marital_status = patch.maritalStatus;
  if (patch.joinDate !== undefined) dbPatch.join_date = patch.joinDate;
  if (patch.points !== undefined) dbPatch.points = Number(patch.points) || 0;
  if (patch.totalTransactions !== undefined) dbPatch.total_transactions = Number(patch.totalTransactions) || 0;
  if (patch.totalSpent !== undefined) dbPatch.total_spent = Number(patch.totalSpent) || 0;
  if (patch.segment !== undefined) dbPatch.segment = patch.segment;
  if (patch.lastTransaction !== undefined) dbPatch.last_transaction = patch.lastTransaction;
  if (patch.status !== undefined) dbPatch.status = patch.status;
  if (patch.favoriteService !== undefined) dbPatch.favorite_service = patch.favoriteService;
  if (patch.notes !== undefined) dbPatch.notes = patch.notes;

  const { data, error } = await supabase
    .from(TABLE)
    .update(dbPatch)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Gagal mengupdate parsial pelanggan ID ${id}:`, error);
    throw error;
  }
  return mapCustomerFromRow(data);
}

/**
 * Builds customer object locally from form data
 */
export function buildCustomerData(form, existingCustomer = null) {
  const nextId = existingCustomer?.id ?? `CUST-${Math.floor(10000 + Math.random() * 90000)}`;
  const initials = form.name
    ? form.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("")
    : "PN";

  return {
    id: nextId,
    name: form.name,
    phone: form.phone || "",
    email: form.email || `${form.name.toLowerCase().replace(/\s+/g, ".").replace(/[^a-z.]/g, "")}@mail.com`,
    address: form.address || "-",
    customerType: form.customerType || form.type || "Regular",
    maritalStatus: form.maritalStatus || "Belum Menikah",
    joinDate: existingCustomer?.joinDate || new Date().toISOString().split("T")[0],
    points: existingCustomer?.points ?? 0,
    totalTransactions: existingCustomer?.totalTransactions ?? 0,
    totalSpent: existingCustomer?.totalSpent ?? 0,
    segment: existingCustomer?.segment ?? "Baru",
    lastTransaction: existingCustomer?.lastTransaction ?? null,
    status: existingCustomer?.status ?? "Aktif",
    favoriteService: form.favoriteService || (form.customerType === "Premium" || form.type === "Premium" ? "Paket Cuci Premium" : "Paket Cuci Reguler"),
    avatar: existingCustomer?.avatar ?? initials,
    notes: form.notes || existingCustomer?.notes || "",
  };
}

/**
 * Sorts and slices top members (synchronous helper taking ready customer array)
 */
export function getTopMembers(limit = 5, by = "points", customers = []) {
  const sorted = [...customers].sort((a, b) => {
    if (by === "points") return (b.points || 0) - (a.points || 0);
    if (by === "spent") return (b.totalSpent || 0) - (a.totalSpent || 0);
    return (b.orders || 0) - (a.orders || 0);
  });
  return sorted.slice(0, limit);
}
