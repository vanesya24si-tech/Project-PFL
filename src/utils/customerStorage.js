import customersJson from "../data/customers.json";

const STORAGE_KEY = "nettoLaundry_customers";

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

export function loadCustomers() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return customersJson;
  const parsed = safeParse(stored);
  return Array.isArray(parsed) ? parsed : customersJson;
}

export function saveCustomers(customers) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
}

export function getCustomerById(id) {
  const customers = loadCustomers();
  return customers.find((item) => item.id.toString() === id.toString());
}

export function deleteCustomer(id) {
  const customers = loadCustomers();
  const filtered = customers.filter((item) => item.id.toString() !== id.toString());
  saveCustomers(filtered);
  return filtered;
}

export function buildCustomerData(form, existingCustomer = null) {
  const customers = loadCustomers();
  const nextId = existingCustomer?.id ?? customers.reduce((maxId, customer) => Math.max(maxId, Number(customer.id)), 0) + 1;
  const initials = form.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  const monthYear = new Date().toLocaleString("id-ID", {
    month: "short",
    year: "numeric",
  });

  return {
    id: nextId,
    name: form.name,
    phone: form.phone,
    email: form.email || `${form.name.toLowerCase().replace(/\s+/g, ".").replace(/[^a-z.]/g, "")}@mail.com`,
    address: form.address || "-",
    status: existingCustomer?.status ?? "Baru",
    activeStatus: existingCustomer?.activeStatus ?? "Aktif",
    segment: existingCustomer?.segment ?? "Baru",
    points: existingCustomer?.points ?? 0,
    totalTransactions: existingCustomer?.totalTransactions ?? existingCustomer?.orders ?? 0,
    totalSpent: existingCustomer?.totalSpent ?? 0,
    lastTransaction: existingCustomer?.lastTransaction ?? "Belum ada",
    joinDate: existingCustomer?.joinDate ?? new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }),
    orders: existingCustomer?.orders ?? 0,
    memberSince: existingCustomer?.memberSince ?? monthYear,
    favoriteService: form.type === "Premium" ? "Paket Cuci Premium" : form.type === "Corporate" ? "Layanan Korporat" : "Paket Cuci Reguler",
    avatar: (existingCustomer?.avatar ?? initials) || "PN",
    notes: form.notes || existingCustomer?.notes || "",
  };
}
