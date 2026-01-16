import { useState, useEffect } from 'react';

const API_BASE = 'https://bd-backend.up.railway.app/api';

export function useConnectionStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(`${API_BASE}/health`);
        setIsConnected(response.ok);
        setLastChecked(new Date());
      } catch {
        setIsConnected(false);
        setLastChecked(new Date());
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  return { isConnected, lastChecked };
}

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
    getUncategorized: () => fetchAPI('/items/uncategorized'),
    add: (data) => fetchAPI('/items', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    duplicate: (id) => fetchAPI(`/items/${id}/duplicate`, {
      method: 'POST',
    }),
    updatePrice: (id, price) => fetchAPI(`/items/${id}/price`, {
      method: 'PUT',
      body: JSON.stringify({ price }),
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
    delete: (id) => fetchAPI(`/guests/${id}`, {
      method: 'DELETE',
    }),
    getTotal: (name) => fetchAPI(`/guests/${encodeURIComponent(name)}/total`),
    getSplitTotal: () => fetchAPI('/guests/split-total'),
    updateSplitInclusion: (id, included) => fetchAPI(`/guests/${id}/split-inclusion`, {
      method: 'PUT',
      body: JSON.stringify({ included_in_split: included }),
    }),
    claimAll: (category_id) => fetchAPI('/guests/claim-all', {
      method: 'POST',
      body: JSON.stringify({ category_id })
    }),
  },
import: {
    data: (payload) => fetchAPI('/import', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  },
};