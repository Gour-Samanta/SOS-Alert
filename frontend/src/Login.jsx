import { useState } from "react";
import axios from "axios";
import "./Login.css";
import {NavLink, useNavigate} from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';

const API_URL = import.meta.env.VITE_BACKEND_URL + "/api/auth/login";
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login({ onSuccess }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const err = {};
    if (!emailRe.test(form.email)) err.email = "Enter a valid email address.";
    if (!form.password) err.password = "Enter your password.";
    return err;
  };

  const handleSubmit = async () => {
    const err = validate();
    setErrors(err);
    setStatus({ type: "", message: "" });
    if (Object.keys(err).length) return;

    setLoading(true);
    try {
      const { data } = await axios.post(API_URL, form);

      setStatus({ type: "success", message: "Logged in." });
      if (onSuccess) onSuccess(data); // e.g. save token, redirect
      navigate("/"); // Redirect to home page after successful login
      
    } catch (e) {
      setStatus({
        type: "error",
        message: e.response?.data?.message || "Login failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <main className="lg-page">
      <CloseIcon className="su-close" onClick={() => navigate("/")} />
      <div className="lg-card">
        <header className="lg-header">
          <h1>Log in</h1>
          <p>Use the email and password you signed up with.</p>
        </header>

        <label className={`lg-field ${errors.email ? "has-error" : ""}`}>
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            autoComplete="email"
          />
          {errors.email && <small className="lg-error">{errors.email}</small>}
        </label>

        <label className={`lg-field ${errors.password ? "has-error" : ""}`}>
          <span>Password</span>
          <div className="lg-password">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="lg-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <small className="lg-error">{errors.password}</small>
          )}
        </label>

        {status.message && (
          <p className={`lg-status lg-status-${status.type}`} role="status">
            {status.message}
          </p>
        )}

        <button className="lg-submit" onClick={handleSubmit} disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
        </button>

        <p className="lg-footer">
          New here? <NavLink to='/signup'>Create an account</NavLink>
        </p>
      </div>
    </main>
  );
}