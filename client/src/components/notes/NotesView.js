import React, { useState } from "react";
import { deleteNote, duplicateNote } from "../../services/noteService";
import markdownIcon from "../../assets/markdownIcon.png";
import padlockIcon from "../../assets/padlockIcon.png";
import searchIcon from "../../assets/searchIcon.png";
import filterIcon from "../../assets/filterIcon.png";
import VisibilityFilter from "./NotesFilter";

const NotesView = ({ notes, setSelectedNote, refreshNotes }) => {
  const userID = localStorage.getItem("userID");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isSearchingCategory, setIsSearchingCategory] = useState(false);
  const [searchCategory, setSearchCategory] = useState("");

  const handleDelete = (noteID) => {
    deleteNote(noteID)
      .then(() => {
        refreshNotes();
        setSelectedNote((current) => (current?._id === noteID ? null : current));
      })
      .catch(console.error);
  };

  const handleDuplicate = (noteID) => {
    duplicateNote(noteID, userID).then(refreshNotes).catch(console.error);
  };

  const isMarkdown = (content) => /[#*_~`-]/.test(content);

  const filterNotesByVisibility = (note) => {
    if (visibilityFilter === "all") return true;
    if (visibilityFilter === "public" && note.visibility === "open") return true;
    if (visibilityFilter === "restricted" && note.visibility === "restricted")
      return true;
    if (
      visibilityFilter === "private" &&
      note.userID === userID &&
      note.visibility === "private"
    )
      return true;
    return false;
  };

  const filterNotesByCategory = (note) => {
    if (!searchCategory) return true;
    return note.categories.includes(searchCategory);
  };

  return (
    <div className="notes-container">
      <div className="notes-header">
        <h1 className="notes-title">Lista Note</h1>
        <div className="icons-container">
          <img
            src={filterIcon}
            alt="Filter icon"
            className="filter-icon"
            onClick={() => setIsFilterMenuOpen((prev) => !prev)}
          />
          {isSearchingCategory ? (
            <input
              type="text"
              placeholder="Inserisci categoria"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsSearchingCategory(false);
                }
              }}
              className="category-input"
            />
          ) : (
            <img
              src={searchIcon}
              alt="Search icon"
              className="search-icon"
              onClick={() => setIsSearchingCategory(true)}
            />
          )}
        </div>
      </div>


      {isFilterMenuOpen && (
        <div className="filter-menu">
          <VisibilityFilter
            visibilityFilter={visibilityFilter}
            setVisibilityFilter={setVisibilityFilter}
          />
        </div>
      )}


      <div className="notes-list">
        {notes
          .filter(filterNotesByVisibility)
          .filter(filterNotesByCategory)
          .map((note) => (
            <div key={note._id} className="note-card">
              <div className="note-header">
                <h3>{note.title}</h3>
                {isMarkdown(note.content) && (
                  <img
                    src={markdownIcon}
                    alt="Markdown icon"
                    className="markdown-icon"
                  />
                )}
                {note.visibility === "private" && (
                  <img
                    src={padlockIcon}
                    alt="Padlock icon"
                    className="padlock-icon"
                  />
                )}
              </div>
              <p>Categoria: {note.categories.join(", ")}</p>
              <p>{note.content.slice(0, 200)}...</p>
              <p>Visibilità: {note.visibility}</p>
              <div className="note-actions">
                <button
                  className="primary"
                  onClick={() => setSelectedNote(note)}
                >
                  Apri
                </button>
                <button
                  className="secondary"
                  onClick={() => handleDuplicate(note._id)}
                >
                  Duplica
                </button>
                {note.userID === userID && (
                  <button
                    className="danger"
                    onClick={() => handleDelete(note._id)}
                  >
                    Elimina
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );

};

export default NotesView;