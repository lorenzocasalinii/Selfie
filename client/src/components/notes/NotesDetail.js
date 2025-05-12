import React, { useState, useEffect, useContext } from "react";
import { updateNote } from "../../services/noteService";
import { getAllUsersBasicInfo } from "../../services/userService"; 
import { marked } from "marked";


const NotesDetail = ({ note, onClose, refreshNotes }) => {
  const userID = localStorage.getItem("userID");
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(note?.content || "");
  const [editedTitle, setEditedTitle] = useState(note?.title || "");
  const [editedCategories, setEditedCategories] = useState(
    note?.categories.join(", ") || ""
  );
  const [visibility, setVisibility] = useState(note?.visibility || "open");
  const [userList, setUserList] = useState([]); 
  const [selectedUsers, setSelectedUsers] = useState(note?.accessList || []); 
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  const [markdownPreview, setMarkdownPreview] = useState("");

  useEffect(() => {
    if (note) {
      setEditMode(false);
      setEditedTitle(note.title);
      setEditedContent(note.content);
      setEditedCategories(note.categories.join(", "));
      setMarkdownPreview(marked(note.content || ""));
      setVisibility(note.visibility);
      setSelectedUsers(note.accessList || []);
    }
  }, [note]);

  useEffect(() => {
    if (editMode) {
      setMarkdownPreview(marked(editedContent));
    } else if (note) {
      setMarkdownPreview(marked(note.content || ""));
    }
  }, [editedContent, editMode]);


  useEffect(() => {
    if (visibility === "restricted") {
      getAllUsersBasicInfo() 
        .then(setUserList)
        .catch(console.error);
    }
  }, [visibility]);

  const handleSave = () => {
    if (!note) return;

    const updatedNote = {
      title: editedTitle,
      content: editedContent,
      categories: editedCategories.split(",").map((cat) => cat.trim()),
      visibility,
      accessList: visibility === "restricted" ? selectedUsers : [],
    };

    updateNote(note._id, updatedNote)
      .then(() => {
        refreshNotes(); 
        setEditMode(false); 
        onClose(); 
      })
      .catch(console.error);
  };

  const handleUserSelection = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const toggleMarkdownPreview = () => {
    setShowMarkdownPreview((prevState) => !prevState);
  };

  if (!note) return null;

  return (
    <div className="note-detail-container">
      {editMode ? (
        <React.Fragment>
          <div className="edit-note-card">
            <h2>Modifica Nota</h2>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Modifica Titolo"
              required
            />
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Modifica Contenuto"
              required
            />
            <input
              type="text"
              value={editedCategories}
              onChange={(e) => setEditedCategories(e.target.value)}
              placeholder="Modifica Categorie (separate da virgola)"
              required
            />
  
            {note.userID === userID && (  
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
            )}
  
            {visibility === "restricted" && note.userID === userID && (  
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
  
            <div className="note-actions">
              <button className="primary" onClick={handleSave}>
                Salva e Chiudi
              </button>
              <button
                className="secondary"
                onClick={() => setEditMode(false)}
              >
                Annulla
              </button>
              <button
                className="tertiary"
                onClick={toggleMarkdownPreview}
              >
                {showMarkdownPreview ? "Nascondi Anteprima" : "Mostra Anteprima"}
              </button>
            </div>
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
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="note-view-card">
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            <p>
              <strong>Categorie:</strong> {note.categories.join(", ")}
            </p>
            <p>
              <strong>Visibilità:</strong> {note.visibility}
            </p>
            <div className="note-actions">
              <button
                className="primary"
                onClick={() => setEditMode(true)}
              >
                Modifica
              </button>
              <button className="secondary" onClick={onClose}>
                Chiudi
              </button>
            </div>
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
        </React.Fragment>
      )}
    </div>
  );
  
};

export default NotesDetail;
