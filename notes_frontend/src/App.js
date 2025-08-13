import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import { loadNotes, saveNotes, createEmptyNote } from './utils/storage';

// PUBLIC_INTERFACE
export default function App() {
  /** The root React component rendering the note management UI, including:
   * - Top navigation bar with app name and create note action
   * - Two-panel layout with notes list and note editor
   * - Local state management, search, persistence via localStorage
   */

  // Notes state
  const [notes, setNotes] = useState([]);
  // Selected note
  const [selectedId, setSelectedId] = useState(null);
  // Search query text
  const [searchQuery, setSearchQuery] = useState('');

  // Load notes from localStorage on initial mount
  useEffect(() => {
    const { notes: initialNotes, selectedId: savedSelectedId } = loadNotes();
    setNotes(initialNotes);
    setSelectedId(savedSelectedId || (initialNotes[0] ? initialNotes[0].id : null));
  }, []);

  // Persist notes and selection whenever they change
  useEffect(() => {
    saveNotes(notes, selectedId);
  }, [notes, selectedId]);

  // Derive filtered notes based on search
  const filteredNotes = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(n => {
      const title = (n.title || '').toLowerCase();
      const content = (n.content || '').toLowerCase();
      return title.includes(q) || content.includes(q);
    });
  }, [notes, searchQuery]);

  // Selected note object
  const selectedNote = useMemo(() => {
    return notes.find(n => n.id === selectedId) || null;
  }, [notes, selectedId]);

  // PUBLIC_INTERFACE
  const handleCreateNote = () => {
    /** Create a new note, insert at the top, and select it. */
    const newNote = createEmptyNote();
    setNotes(prev => [newNote, ...prev]);
    setSelectedId(newNote.id);
    setSearchQuery(''); // clear search to show new note in list
  };

  // PUBLIC_INTERFACE
  const handleSelectNote = (id) => {
    /** Select a note by id. */
    setSelectedId(id);
  };

  // PUBLIC_INTERFACE
  const handleUpdateNote = (patch) => {
    /** Update the selected note with the provided patch (partial fields). */
    if (!selectedNote) return;
    const updated = { ...selectedNote, ...patch, updatedAt: new Date().toISOString() };
    setNotes(prev => {
      const next = prev.map(n => (n.id === selectedNote.id ? updated : n));
      // Re-sort by updatedAt desc so recent edits float to top
      next.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      return next;
    });
    setSelectedId(updated.id);
  };

  // PUBLIC_INTERFACE
  const handleDeleteNote = () => {
    /** Delete the currently selected note and smartly select a neighbor. */
    if (!selectedNote) return;
    // eslint-disable-next-line no-restricted-globals
    const ok = window.confirm('Delete this note? This action cannot be undone.');
    if (!ok) return;

    setNotes(prev => {
      const idx = prev.findIndex(n => n.id === selectedNote.id);
      const next = prev.filter(n => n.id !== selectedNote.id);
      // Select neighbor: try the next item at same index, else previous
      let nextSelection = null;
      if (next.length > 0) {
        if (idx < next.length) {
          nextSelection = next[idx].id;
        } else {
          nextSelection = next[idx - 1]?.id || next[0].id;
        }
      }
      setSelectedId(nextSelection);
      return next;
    });
  };

  return (
    <div className="app-root">
      <Navbar onCreateNote={handleCreateNote} />
      <main className="main">
        <aside className="sidebar">
          <NotesList
            notes={filteredNotes}
            allNotesCount={notes.length}
            selectedId={selectedId}
            onSelect={handleSelectNote}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onCreateNote={handleCreateNote}
          />
        </aside>
        <section className="editor-section">
          <NoteEditor
            note={selectedNote}
            onChange={handleUpdateNote}
            onDelete={handleDeleteNote}
          />
        </section>
      </main>
    </div>
  );
}
