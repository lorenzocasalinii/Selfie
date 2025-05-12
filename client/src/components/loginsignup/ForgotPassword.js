import React, { useState } from "react";
import { forgotPassword } from "../../services/authService";
import "../../styles/Auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const response = await forgotPassword(email);
      setMessage(response.message);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Recupera Password</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="data">
            <label>Email</label>
            <input
              type="email"
              placeholder="Inserisci la tua email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-btn">
            <button type="submit">Invia Email</button>
          </div>
        </form>
        {message && <p className="auth-message">{message}</p>}
        {error && <p className="auth-error">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
