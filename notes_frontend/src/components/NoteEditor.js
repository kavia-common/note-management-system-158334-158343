import React, { useCallback } from 'react';
import { formatRelativeDate } from '../utils/format';

// PUBLIC_INTERFACE
export default function NoteEditor({ note, onChange, onDelete }) {
  /** Right panel note editor. Shows fields for title and content.
   * Props:
   * - note: the currently selected note object or null
   * - onChange(patch): update note with partial fields
   * - onDelete(): delete selected note
   */
  const handleTitle = useCallback((e) => {
    onChange({ title: e.target.value });
  }, [onChange]);

  const handleContent = useCallback((e) => {
    onChange({ content: e.target.value });
  }, [onChange]);

  if (!note) {
    return (
      <div className="empty-state">
        <div className="empty-card">
          <div className="empty-title">No note selected</div>
          <div className="empty-desc">Select a note on the left or create a new one to start writing.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-wrap" aria-label="Note editor">
      <input
        className="title-input"
        type="text"
        value={note.title}
        onChange={handleTitle}
        placeholder="Note title"
        aria-label="Note title"
      />
      <textarea
        className="content-input"
        value={note.content}
        onChange={handleContent}
        placeholder="Start typing your note..."
        aria-label="Note content"
      />
      <div className="editor-footer">
        <div className="helper-text">
          Last edited {formatRelativeDate(note.updatedAt)}
        </div>
        <button className="btn secondary" onClick={onDelete} aria-label="Delete note">
          Delete
        </button>
      </div>
    </div>
  );
}
