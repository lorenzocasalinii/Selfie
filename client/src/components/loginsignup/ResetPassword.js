import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import "../../styles/Auth.css";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const response = await resetPassword(token, password);
      setMessage(response.message);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Resetta Password</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="data">
            <label>Nuova Password</label>
            <input
              type="password"
              placeholder="Inserisci la nuova password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="auth-btn">
            <button type="submit">Aggiorna Password</button>
          </div>
        </form>
        {message && <p className="auth-message">{message}</p>}
        {error && <p className="auth-error">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
