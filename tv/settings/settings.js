/**
 * TV Display Settings — admin interface for finance & tax config.
 * Reads/writes to Supabase tv_display_settings table.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
};

let originalValues = {};

/** Fetch all settings rows from Supabase */
async function loadSettings() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/tv_display_settings?select=*&order=setting_key`,
    { headers: HEADERS }
  );
  if (!res.ok) throw new Error(`Failed to load settings: ${res.status}`);
  return res.json();
}

/** Update a single setting row by key */
async function updateSetting(key, value) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/tv_display_settings?setting_key=eq.${key}`,
    {
      method: 'PATCH',
      headers: HEADERS,
      body: JSON.stringify({ setting_value: value, updated_at: new Date().toISOString() }),
    }
  );
  if (!res.ok) throw new Error(`Failed to update ${key}: ${res.status}`);
  return res.json();
}

/** Build the form fields from settings rows */
function renderFields(settings) {
  const container = document.getElementById('settingsFields');
  container.innerHTML = '';
  container.classList.remove('d-none');
  container.classList.add('d-flex', 'flex-column', 'gap-3');

  for (const row of settings) {
    const div = document.createElement('div');
    div.className = 'tv-panel p-3';
    div.innerHTML = `
      <label for="field-${row.setting_key}" class="form-label fw-semibold">
        ${row.label}
      </label>
      <input
        type="number"
        class="form-control setting-input"
        id="field-${row.setting_key}"
        data-key="${row.setting_key}"
        value="${row.setting_value}"
        step="any"
      />
      <div class="form-text text-secondary">${row.description || ''}</div>
    `;
    container.appendChild(div);
    originalValues[row.setting_key] = Number(row.setting_value);
  }

  // Show action buttons
  document.getElementById('settingsActions').classList.remove('d-none');
  document.getElementById('settingsActions').classList.add('d-flex');

  // Listen for input changes to enable save/reset
  container.querySelectorAll('.setting-input').forEach((input) => {
    input.addEventListener('input', checkForChanges);
  });
}

/** Enable or disable save/reset buttons based on dirty state */
function checkForChanges() {
  const inputs = document.querySelectorAll('.setting-input');
  let hasChanges = false;
  for (const input of inputs) {
    if (Number(input.value) !== originalValues[input.dataset.key]) {
      hasChanges = true;
      break;
    }
  }
  document.getElementById('saveBtn').disabled = !hasChanges;
  document.getElementById('resetBtn').disabled = !hasChanges;
}

/** Save all changed settings to Supabase */
async function saveSettings() {
  const btn = document.getElementById('saveBtn');
  const status = document.getElementById('saveStatus');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Saving...';

  try {
    const inputs = document.querySelectorAll('.setting-input');
    const updates = [];
    for (const input of inputs) {
      const newVal = Number(input.value);
      if (newVal !== originalValues[input.dataset.key]) {
        updates.push(updateSetting(input.dataset.key, newVal));
      }
    }
    await Promise.all(updates);

    // Update original values
    for (const input of inputs) {
      originalValues[input.dataset.key] = Number(input.value);
    }

    status.innerHTML = '<div class="alert alert-success py-2 small"><i class="bi bi-check-circle me-1"></i> Settings saved. Changes take effect on next TV display load.</div>';
    setTimeout(() => { status.innerHTML = ''; }, 4000);
  } catch (e) {
    status.innerHTML = `<div class="alert alert-danger py-2 small"><i class="bi bi-exclamation-triangle me-1"></i> ${e.message}</div>`;
  } finally {
    btn.innerHTML = '<i class="bi bi-check-lg me-1"></i> Save Changes';
    checkForChanges();
  }
}

/** Reset all fields to their last-saved values */
function resetFields() {
  const inputs = document.querySelectorAll('.setting-input');
  for (const input of inputs) {
    input.value = originalValues[input.dataset.key];
  }
  checkForChanges();
  document.getElementById('saveStatus').innerHTML = '';
}

/** Initialize the settings page */
async function init() {
  try {
    const settings = await loadSettings();
    document.getElementById('settingsLoader').remove();
    renderFields(settings);

    document.getElementById('saveBtn').addEventListener('click', saveSettings);
    document.getElementById('resetBtn').addEventListener('click', resetFields);
  } catch (e) {
    document.getElementById('settingsLoader').innerHTML =
      `<div class="alert alert-danger">${e.message}</div>`;
  }
}

init();
