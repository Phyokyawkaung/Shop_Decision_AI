const API_BASE = 'http://localhost:5000/api';

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.error || `Request failed with status ${response.status}`
    );
  }

  return data;
}

export async function searchProducts(query) {
  const keyword = (query || '').trim();

  return request(
    `${API_BASE}/products/search?q=${encodeURIComponent(keyword)}`
  );
}

export async function getProductById(productId) {
  return request(`${API_BASE}/products/${productId}`);
}

export async function analyzeProduct({
  product_id,
  quantity,
  selling_price_mmk,
  urgency,
}) {
  return request(`${API_BASE}/analyze`, {
    method: 'POST',
    body: JSON.stringify({
      product_id: Number(product_id),
      quantity: Number(quantity),
      selling_price_mmk: Number(selling_price_mmk),
      urgency: urgency || 'normal',
    }),
  });
}

export async function getInventoryStatus() {
  return request(`${API_BASE}/inventory`);
}

export const getInventoryData = getInventoryStatus;

export async function getDashboardData() {
  return request(`${API_BASE}/dashboard`);
}

export async function getAllProducts() {
  return request(`${API_BASE}/products`);
}