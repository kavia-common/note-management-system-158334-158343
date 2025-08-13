const STORAGE_KEY = 'notes_app_notes_v1';

// PUBLIC_INTERFACE
export function loadNotes() {
  /** Load notes and UI state from localStorage; returns { notes, selectedId }. Seeds with an example if empty. */
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Basic validation to avoid corrupted data rendering
      const notes = Array.isArray(parsed.notes) ? parsed.notes : [];
      const selectedId = typeof parsed.selectedId === 'string' || parsed.selectedId === null ? parsed.selectedId : null;
      return { notes: normalizeNotes(notes), selectedId };
    }
  } catch {
    // fallthrough to seeding
  }
  const first = seedExampleNote();
  return { notes: [first], selectedId: first.id };
}

// PUBLIC_INTERFACE
export function saveNotes(notes, selectedId) {
  /** Save notes and UI state to localStorage. */
  try {
    const payload = JSON.stringify({
      notes: normalizeNotes(notes),
      selectedId: selectedId || null
    });
    localStorage.setItem(STORAGE_KEY, payload);
  } catch {
    // Ignore write errors
  }
}

// PUBLIC_INTERFACE
export function createEmptyNote() {
  /** Create a new empty note with default fields and unique id. */
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title: 'Untitled',
    content: '',
    updatedAt: now,
    createdAt: now
  };
}

function seedExampleNote() {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title: 'Welcome to Note Manager',
    content:
      'This is your first note. Use the left panel to browse and search notes.\n\n' +
      'Tips:\n' +
      '- Click "New Note" to create a note.\n' +
      '- Edit the title and content on the right.\n' +
      '- Your notes are saved automatically in your browser.\n',
    updatedAt: now,
    createdAt: now
  };
}

function normalizeNotes(notes) {
  // Ensure minimal shape for each note
  return notes
    .filter(Boolean)
    .map(n => ({
      id: String(n.id || generateId()),
      title: typeof n.title === 'string' ? n.title : 'Untitled',
      content: typeof n.content === 'string' ? n.content : '',
      updatedAt: n.updatedAt || new Date().toISOString(),
      createdAt: n.createdAt || n.updatedAt || new Date().toISOString()
    }))
    // Sort newest edited first
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

function generateId() {
  // Simple unique id using timestamp and random
  return `n_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
