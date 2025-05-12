import React from "react";
import "../../styles/Form.css"

const EditProfileForm = ({ formData, handleInputChange, handleFileChange, handleFormSubmit, onCancel }) => {
  return (
    <form className="form-container" onSubmit={handleFormSubmit}>
      <div>
        <label className="form-label">Nome:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData?.name || ""}
          onChange={handleInputChange}
          placeholder="Name"
          className="form-input"
        />
      </div>
      <div>
        <label className="form-label">Foto profilo:</label>
        <input
          type="file"
          id="profilePicture"
          name="profilePicture"
          onChange={handleFileChange}
          className="form-input"
        />
      </div>
      <div>
        <label className="form-label">Bio:</label>
        <input
          type="text"
          id="bio"
          name="bio"
          value={formData?.bio || ""}
          onChange={handleInputChange}
          placeholder="Bio"
          className="form-input"
        />
      </div>
      <div>
        <label className="form-label">Compleanno:</label>
        <input
          type="date"
          id="birthday"
          name="birthday"
          value={formData?.birthday ? formData.birthday.split("T")[0] : ""}
          onChange={handleInputChange}
          className="form-input"
        />
      </div>
      <div>
        <label className="form-label">Sesso:</label>
        <select
          id="sex"
          name="sex"
          value={formData?.sex || "prefer not to say"}
          onChange={handleInputChange}
          className="form-input"
        >
          <option value="male">Uomo</option>
          <option value="female">Donna</option>
          <option value="prefer not to say">Preferisco non specificare</option>
        </select>
      </div>
      <button type="submit" className="primary">Salva</button>
      <button type="button" className="danger" onClick={onCancel}>
        Cancella
      </button>
    </form>
  );
};

export default EditProfileForm;
