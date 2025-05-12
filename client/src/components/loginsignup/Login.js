import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login: authenticate } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      authenticate(response.token, response.userID);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

return (
  <div className="auth-container">
    <div className="auth-card">
      <h1>Login</h1>
      <form className="auth-form" onSubmit={handleLogin}>
        <div className="data">
          <label>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="data">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="auth-btn">
          <button type="submit" className="primary">Accedi</button>
        </div>
      </form>
      {error && <p className="auth-error">{error}</p>}
      <p className="auth-link">
        Non hai un account? <a href="/signup">Registrati</a>
      </p>
      <p className="auth-link">
        <a href="/forgot-password">Dimenticata Password ?</a>
      </p>
    </div>
  </div>
);

};

export default Login;
