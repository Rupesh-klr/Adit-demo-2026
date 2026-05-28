// Service layer for API calls
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function getCustomers({ page = 1, limit = 10, sort = 'name', order = 'asc', search = '', filterBy = 'global' } = {}) {
  const params = new URLSearchParams({ page, limit, sort, order, search, filterBy });
  const res = await fetch(`${API_URL}/customers?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function addCustomer(data) {
  const res = await fetch(`${API_URL}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  console.log('API Response:', res);
  if (!res.ok) {
    return res;
  }
  return res.json();
}

export async function deleteCustomer(id) {
  const res = await fetch(`${API_URL}/customers/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete');
  }
  return res.json();
}
