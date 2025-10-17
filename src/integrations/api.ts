// --- Servicios para entidades ---

// Productos
export async function getProductos() {
  return apiFetch("/productos");
}
export async function getProducto(id: number) {
  return apiFetch(`/productos/${id}`);
}
export async function createProducto(data: any) {
  return apiFetch("/productos", { method: "POST", body: JSON.stringify(data) });
}
export async function updateProducto(id: number, data: any) {
  return apiFetch(`/productos/${id}`, { method: "PUT", body: JSON.stringify(data) });
}
export async function deleteProducto(id: number) {
  return apiFetch(`/productos/${id}`, { method: "DELETE" });
}

// Proveedores
export async function getProveedores() {
  return apiFetch("/proveedores");
}
export async function getProveedor(id: number) {
  return apiFetch(`/proveedores/${id}`);
}
export async function createProveedor(data: any) {
  return apiFetch("/proveedores", { method: "POST", body: JSON.stringify(data) });
}
export async function updateProveedor(id: number, data: any) {
  return apiFetch(`/proveedores/${id}`, { method: "PUT", body: JSON.stringify(data) });
}
export async function deleteProveedor(id: number) {
  return apiFetch(`/proveedores/${id}`, { method: "DELETE" });
}

// Almacenes
export async function getAlmacenes() {
  return apiFetch("/almacenes");
}
export async function getAlmacen(id: number) {
  return apiFetch(`/almacenes/${id}`);
}
export async function createAlmacen(data: any) {
  return apiFetch("/almacenes", { method: "POST", body: JSON.stringify(data) });
}
export async function updateAlmacen(id: number, data: any) {
  return apiFetch(`/almacenes/${id}`, { method: "PUT", body: JSON.stringify(data) });
}
export async function deleteAlmacen(id: number) {
  return apiFetch(`/almacenes/${id}`, { method: "DELETE" });
}

// Bancos
export async function getBancos() {
  return apiFetch("/bancos");
}
export async function createBanco(data: any) {
  return apiFetch("/bancos", { method: "POST", body: JSON.stringify(data) });
}

// Formas de pago
export async function getFormasPago() {
  return apiFetch("/formas-pago");
}
export async function createFormaPago(data: any) {
  return apiFetch("/formas-pago", { method: "POST", body: JSON.stringify(data) });
}

// Cliente-Bancos
export async function getClienteBancos() {
  return apiFetch("/cliente-bancos");
}
export async function createClienteBanco(data: any) {
  return apiFetch("/cliente-bancos", { method: "POST", body: JSON.stringify(data) });
}

// Pagos
export async function getPagos() {
  return apiFetch("/pagos");
}
export async function createPago(data: any) {
  return apiFetch("/pagos", { method: "POST", body: JSON.stringify(data) });
}
// src/integrations/api.ts

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem("jwt_token");
}

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export { apiFetch, API_URL, getToken };
export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  if (data.token) {
    localStorage.setItem("jwt_token", data.token);
  }
  return data;
}