import React from 'react';
import { formatRelativeDate } from '../utils/format';

// PUBLIC_INTERFACE
export default function NotesList({
  notes,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
  onCreateNote,
  allNotesCount
}) {
  /** Renders the left panel with search and a list of notes.
   * Props:
   * - notes: Note[] filtered by search
   * - selectedId: currently selected note id
   * - onSelect(id): select callback
   * - searchQuery: string
   * - onSearchChange(q): sets search
   * - onCreateNote(): create a new note
   * - allNotesCount: total count of notes prior to filtering
   */
  return (
    <div className="notes-list-wrap" aria-label="Notes list panel">
      <div className="search-wrap">
        <input
          className="input"
          type="text"
          placeholder="Search notes..."
          aria-label="Search notes"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="helper-text">
            {notes.length} / {allNotesCount} shown
          </div>
          <button className="btn secondary" onClick={onCreateNote} aria-label="Create new note from list">
            New
          </button>
        </div>
      </div>
      <div className="notes-list" role="list" aria-label="Notes">
        {notes.length === 0 && (
          <div className="empty-card" style={{ margin: '12px' }}>
            <div className="empty-title">No notes found</div>
            <div className="empty-desc">Try a different search or create a new note.</div>
            <button className="btn" onClick={onCreateNote}>Create note</button>
          </div>
        )}
        {notes.map((n) => (
          <button
            key={n.id}
            role="listitem"
            className={`note-item ${n.id === selectedId ? 'active' : ''}`}
            onClick={() => onSelect(n.id)}
            aria-pressed={n.id === selectedId}
            aria-label={`Open note: ${n.title || 'Untitled'}`}
          >
            <h3 className="note-title">{n.title?.trim() || 'Untitled'}</h3>
            <p className="note-excerpt">
              {(n.content || '').trim() || 'No content yet.'}
            </p>
            <div className="note-meta">
              <span>Last edited</span>
              <strong>{formatRelativeDate(n.updatedAt)}</strong>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
