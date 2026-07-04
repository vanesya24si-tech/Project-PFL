import initialProducts from "../data/laundryProducts.json";

const PRODUCT_STORAGE_KEY = "laundry-products";

export function loadProducts() {
  if (typeof window === "undefined") {
    return [...initialProducts];
  }

  try {
    const stored = window.localStorage.getItem(PRODUCT_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Gagal memuat produk dari lokal:", error);
  }

  const seededProducts = [...initialProducts];
  saveProducts(seededProducts);
  return seededProducts;
}

export function saveProducts(products) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
}

export function createProduct(payload) {
  const product = {
    id: globalThis.crypto?.randomUUID?.() || Date.now().toString(),
    ...payload,
    price: Number(payload.price) || 0,
    stock: Number(payload.stock) || 0,
  };

  const updatedProducts = [product, ...loadProducts()];
  saveProducts(updatedProducts);
  return product;
}

export function updateProduct(productId, payload) {
  const updatedProducts = loadProducts().map((item) =>
    item.id === productId ? { ...item, ...payload, price: Number(payload.price) || 0, stock: Number(payload.stock) || 0 } : item
  );

  saveProducts(updatedProducts);
  return updatedProducts.find((item) => item.id === productId) || null;
}

export function deleteProduct(productId) {
  const updatedProducts = loadProducts().filter((item) => item.id !== productId);
  saveProducts(updatedProducts);
  return updatedProducts;
}

export function getProductById(productId) {
  return loadProducts().find((item) => item.id === productId) || null;
}
