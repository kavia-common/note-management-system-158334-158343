import React from 'react';

// PUBLIC_INTERFACE
export default function Navbar({ onCreateNote }) {
  /** Top navigation bar displaying the app name and a "New Note" action button. */
  return (
    <header className="navbar" role="banner">
      <div className="brand" aria-label="App brand">
        <div className="logo" aria-hidden="true" />
        <div className="title" aria-label="App name">Note Manager</div>
      </div>
      <div className="nav-actions">
        <button
          className="btn"
          onClick={onCreateNote}
          aria-label="Create a new note"
          title="Create a new note"
        >
          ➕ New Note
        </button>
      </div>
    </header>
  );
}
