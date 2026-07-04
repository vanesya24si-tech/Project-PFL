import customersJson from "../data/customers.json";

const STORAGE_KEY = "nettoLaundry_customers";

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

function parseNumber(value) {
  if (value === undefined || value === null) return 0;
  const numeric = value.toString().replace(/[^0-9.-]+/g, "");
  const parsed = Number(numeric);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeCustomer(raw) {
  if (!raw || typeof raw !== "object") return raw;

  const id = raw.id ?? raw.customerId ?? raw.customer_id ?? raw["ID Pelanggan"];
  const name = raw.name ?? raw.customerName ?? raw.customer_name ?? raw["Nama Lengkap"];
  const phone = raw.phone ?? raw.mobile ?? raw["Nomor HP / WhatsApp"];
  const email = raw.email ?? raw.emailAddress ?? raw["Email"];
  const address = raw.address ?? raw.customerAddress ?? raw["Alamat"];
  const status = raw.status ?? raw.activeStatus ?? raw.customerStatus ?? raw["Status Keaktifan"];
  const segment = raw.segment ?? raw.customerSegment ?? raw["Segmen Pelanggan"];
  const joinDate = raw.joinDate ?? raw.join_date ?? raw["Tanggal Bergabung"];
  const lastTransaction = raw.lastTransaction ?? raw.last_transaction ?? raw["Tanggal Transaksi Terakhir"];
  const totalTransactions = parseNumber(raw.totalTransactions ?? raw.total_transactions ?? raw["Jumlah Transaksi"] ?? raw.orders);
  const points = parseNumber(raw.points ?? raw["Poin Loyalitas"]);
  const totalSpent = parseNumber(raw.totalSpent ?? raw["Total Pengeluaran"]);
  const customerType = raw.customerType ?? raw.customer_type ?? raw["Jenis Pelanggan"];
  const favoriteService = raw.favoriteService ?? raw.service ?? (customerType === "Premium" ? "Paket Cuci Premium" : "Paket Cuci Reguler");

  return {
    ...raw,
    id,
    name,
    phone,
    email,
    address,
    status,
    segment,
    joinDate,
    lastTransaction,
    totalTransactions,
    points,
    totalSpent,
    customerType,
    favoriteService,
    orders: raw.orders ?? totalTransactions,
    activeStatus: raw.activeStatus ?? status,
    avatar: raw.avatar || (name ? name.split(" ").slice(0, 2).map((part) => part[0].toUpperCase()).join("") : undefined),
  };
}

function normalizeCustomers(customers) {
  if (!Array.isArray(customers)) return [];
  return customers.map(normalizeCustomer);
}

export function loadCustomers() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return normalizeCustomers(customersJson);
  const parsed = safeParse(stored);
  return Array.isArray(parsed) ? normalizeCustomers(parsed) : normalizeCustomers(customersJson);
}

export function saveCustomers(customers) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
}

export function getCustomerById(id) {
  const customers = loadCustomers();
  return customers.find((item) => item.id?.toString() === id?.toString());
}

export function deleteCustomer(id) {
  const customers = loadCustomers();
  const filtered = customers.filter((item) => item.id?.toString() !== id?.toString());
  saveCustomers(filtered);
  return filtered;
}

function extractNumericId(id) {
  if (id === undefined || id === null) return 0;
  const numeric = id.toString().replace(/[^0-9]/g, "");
  const parsed = Number(numeric);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function buildCustomerData(form, existingCustomer = null) {
  const customers = loadCustomers();
  const nextId = existingCustomer?.id ?? (() => {
    const maxId = customers.reduce((max, customer) => {
      return Math.max(max, extractNumericId(customer.id));
    }, 0);
    return maxId + 1;
  })();

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

export function getAllTransactions() {
  const customers = loadCustomers();
  const transactions = [];

  customers.forEach((customer) => {
    const custTx = customer.transactions || customer.orders_list || [];
    if (Array.isArray(custTx) && custTx.length > 0) {
      custTx.forEach((tx) => {
        transactions.push({
          id: tx.id ?? tx.txId ?? `ORD-${customer.id}-${(tx.id || Math.random()).toString().slice(-4)}`,
          user: customer.name,
          status: tx.status ?? tx.state ?? "Antre",
          detail: tx.details ?? tx.detail ?? tx.note ?? "",
          currentStep: typeof tx.step === 'number' ? tx.step : (tx.status === 'Selesai' ? 3 : tx.status === 'Tahap Setrika' ? 2 : tx.status === 'Lagi Dicuci' ? 1 : 0),
          eta: tx.eta ?? tx.date ?? tx.due ?? "",
          weight: tx.weight ?? tx.berat ?? tx.kg ?? "-",
          service: tx.service ?? tx.layanan ?? customer.favoriteService ?? "Reguler",
          price: parseNumber(tx.total ?? tx.price ?? tx.amount ?? 0),
          isPaid: tx.isPaid ?? tx.paid ?? true,
        });
      });
    }
  });

  return transactions;
}

export function getTopMembers(limit = 5, by = 'points', customersOverride = null) {
  const customers = customersOverride ?? loadCustomers();
  const sorted = [...customers].sort((a, b) => {
    if (by === 'points') return (b.points || 0) - (a.points || 0);
    if (by === 'spent') return (b.totalSpent || 0) - (a.totalSpent || 0);
    return (b.orders || 0) - (a.orders || 0);
  });
  return sorted.slice(0, limit);
}
