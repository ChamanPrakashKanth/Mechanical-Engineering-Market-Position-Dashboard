import { useState, useSyncExternalStore } from 'react';
import { tools } from './engineering.js';
const key = 'mechintel_saved_tools';
const empty = [];
let cached = empty;
let cachedRaw;
let memoryOnly = false;
function snapshot() {
  if (memoryOnly) return cached;
  try {
    const raw = localStorage.getItem(key) || '[]';
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      try {
        const value = JSON.parse(raw);
        cached = Array.isArray(value) ? [...new Set(value.filter(id => tools.some(t => t.id === id)))] : [];
      } catch { cached = []; }
    }
    return cached;
  } catch { return cached; }
}
function subscribe(update) {
  const sync = event => { if (event.key === key || event.key === null) update(); };
  window.addEventListener('storage', sync);
  window.addEventListener('mechintel-saved-change', update);
  return () => {
    window.removeEventListener('storage', sync);
    window.removeEventListener('mechintel-saved-change', update);
  };
}
const serverSnapshot = () => empty;
export default function useSavedTools() {
  const saved = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [status, setStatus] = useState('');
  function toggle(id) {
    const next = saved.includes(id) ? saved.filter(value => value !== id) : [...saved, id];
    try {
      localStorage.setItem(key, JSON.stringify(next));
      setStatus(next.includes(id) ? 'Saved on this device.' : 'Removed from saved tools.');
    } catch {
      memoryOnly = true;
      cached = next;
      setStatus('Browser storage is unavailable. Your selection lasts for this page only.');
    }
    window.dispatchEvent(new Event('mechintel-saved-change'));
  }
  return { saved, toggle, status };
}
