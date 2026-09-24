import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { demoRoles } from '$lib/data/mockData.js';

const STORAGE_KEY = 'febx_auth_user';

function getInitialUser() {
  if (!browser) return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Failed to read auth state from localStorage', err);
  }
  return null;
}

export const currentUser = writable(getInitialUser());

export function loginUser(roleOrData) {
  let roleData = roleOrData;
  if (typeof roleOrData === 'string') {
    roleData = demoRoles.find((r) => r.id === roleOrData) || {
      id: roleOrData,
      name: roleOrData,
      roleTitle: 'Pengguna Terverifikasi',
      badge: roleOrData.toUpperCase()
    };
  }

  currentUser.set(roleData);
  if (browser) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(roleData));
    } catch (err) {
      console.error('Failed to save auth state to localStorage', err);
    }
  }
}

export function logoutUser() {
  currentUser.set(null);
  if (browser) {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to remove auth state from localStorage', err);
    }
  }
}
