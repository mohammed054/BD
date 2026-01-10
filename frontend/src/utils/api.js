const API_BASE = 'https://bd-backend.up.railway.app/api';

export async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export const api = {
  categories: {
    getAll: () => fetchAPI('/categories'),
    add: (data) => fetchAPI('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => fetchAPI(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => fetchAPI(`/categories/${id}`, {
      method: 'DELETE',
    }),
  },
  items: {
    getByCategory: (categoryId) => fetchAPI(`/items/category/${categoryId}`),
    add: (data) => fetchAPI('/items', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    claim: (id, claimed, claimedBy) => fetchAPI(`/items/${id}/claim`, {
      method: 'PUT',
      body: JSON.stringify({ claimed, claimed_by: claimedBy }),
    }),
    delete: (id) => fetchAPI(`/items/${id}`, {
      method: 'DELETE',
    }),
  },
  guests: {
    getAll: () => fetchAPI('/guests'),
    add: (name) => fetchAPI('/guests', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
  },
  import: {
    data: (categories) => fetchAPI('/import', {
      method: 'POST',
      body: JSON.stringify({ categories }),
    }),
  },
};