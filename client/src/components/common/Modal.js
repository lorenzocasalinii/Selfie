import React from "react";
import "../../styles/Modal.css";

const Modal = ({ isOpen, onClose, children, title, zIndex }) => {
  if (!isOpen) return null;

  return (
    <div className="modal" style={{ zIndex }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

