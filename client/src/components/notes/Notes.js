import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { createNote, getNotes } from "../../services/noteService";
import { getAllUsersBasicInfo } from "../../services/userService";
import NotesView from "./NotesView";
import NotesDetail from "./NotesDetail";
import SortNotes from "./SortNotes";
import MarkdownLegend from "./MarkdownLegend";
import "../../styles/Notes.css";
import "../../styles/Global.css";
import { marked } from "marked";

const Notes = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const userID = localStorage.getItem("userID");
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  const [showMarkdownLegend, setShowMarkdownLegend] = useState(false);

  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    categories: [],
  });

  const [markdownPreview, setMarkdownPreview] = useState("");
  const [visibility, setVisibility] = useState("open"); 
  const [userList, setUserList] = useState([]); 
  const [selectedUsers, setSelectedUsers] = useState([]); 

  useEffect(() => {
    if (isAuthenticated) {
      getNotes(userID)
        .then((data) => setNotes(data))
        .catch((err) => setError(err.message));
    }
  }, [isAuthenticated, userID]);

  useEffect(() => {
    setMarkdownPreview(marked(newNote.content || ""));
  }, [newNote.content]);

  useEffect(() => {
    if (visibility === "restricted") {
      getAllUsersBasicInfo()
        .then(setUserList) 
        .catch((err) => setError(err.message));
    }
  }, [visibility]);

  const handleUserSelection = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const handleCreateNote = (e) => {
    e.preventDefault();

    if (!newNote.title || !newNote.categories.length) {
      setError("Titolo e categorie sono obbligatori");
      return;
    }

    if (!newNote.content.trim()) {
      setError("Il contenuto non può essere vuoto");
      return;
    }

    const noteData = {
      ...newNote,
      userID,
      visibility,
      accessList: visibility === "restricted" ? selectedUsers : [],
    };

    createNote(noteData)
      .then((createdNote) => {
        setNotes((prev) => [...prev, createdNote]);
        setNewNote({ title: "", content: "", categories: [] });
        setMarkdownPreview("");
        setError(null);
        setIsCreating(false);
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="notes-container">
      <div className="note-header">
        <button className="primary" onClick={() => setIsCreating(true)}>
          Nuova Nota
        </button>
        <SortNotes notes={notes} setNotes={setNotes} />
        <button
          className="primary"
          onClick={() => setShowMarkdownLegend(true)}
        >
          Legenda Markdown
        </button>
      </div>
      {isCreating && (
        <div className="new-note-section">
          <div className="new-note-card">
            <h2>Nuova Nota</h2>
            <form onSubmit={handleCreateNote}>
              <input
                type="text"
                placeholder="Titolo"
                value={newNote.title}
                onChange={(e) =>
                  setNewNote({ ...newNote, title: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Contenuto (Markdown supportato)"
                value={newNote.content}
                onChange={(e) =>
                  setNewNote({ ...newNote, content: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Categoria"
                value={newNote.categories.join(", ")}
                onChange={(e) =>
                  setNewNote({
                    ...newNote,
                    categories: e.target.value.split(","),
                  })
                }
                required
              />
  
              <div className="visibility-options">
                <label>
                  <input
                    type="radio"
                    value="open"
                    checked={visibility === "open"}
                    onChange={() => setVisibility("open")}
                  />
                  Pubblica
                </label>
                <label>
                  <input
                    type="radio"
                    value="private"
                    checked={visibility === "private"}
                    onChange={() => setVisibility("private")}
                  />
                  Privata
                </label>
                <label>
                  <input
                    type="radio"
                    value="restricted"
                    checked={visibility === "restricted"}
                    onChange={() => setVisibility("restricted")}
                  />
                  Ristretta
                </label>
              </div>
  
              {visibility === "restricted" && (
                <div className="user-selection">
                  <h3>Seleziona gli utenti:</h3>
                  <ul>
                    {userList.map((user) => (
                      <li key={user._id}>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => handleUserSelection(user._id)}
                          />
                          {`${user.name} (${user.email})`} 
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
  
              <button className="primary" type="submit">
                Crea Nota
              </button>
              <button
                className="secondary"
                onClick={() => setIsCreating(false)}
              >
                Annulla
              </button>
            </form>
            <button
              className="tertiary"
              onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
            >
              {showMarkdownPreview ? "Nascondi Anteprima" : "Mostra Anteprima"}
            </button>
          </div>
  
          {showMarkdownPreview && (
            <div className="markdown-preview">
              <h2>Anteprima Markdown</h2>
              <div
                className="preview-content"
                dangerouslySetInnerHTML={{ __html: markdownPreview }}
              ></div>
            </div>
          )}
        </div>
      )}
  
      {showMarkdownLegend && (
        <MarkdownLegend onClose={() => setShowMarkdownLegend(false)} />
      )}
  
      <NotesDetail
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
        refreshNotes={() => getNotes(userID).then(setNotes)}
      />
      <NotesView
        notes={notes}
        setSelectedNote={setSelectedNote}
        refreshNotes={() => getNotes(userID).then(setNotes)}
      />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
  
};

export default Notes;
