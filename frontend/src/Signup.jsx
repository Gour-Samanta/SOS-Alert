import { useState } from "react";
import axios from "axios";
import "./Signup.css";
import { NavLink,useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`;
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const EMERGENCY_COUNT = 5;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^\d{10}$/;

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    bloodgrp: "",
  });
  const [contacts, setContacts] = useState(Array(EMERGENCY_COUNT).fill(""));
  const [emails, setEmails] = useState(Array(EMERGENCY_COUNT).fill(""));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const updateAt = (setter, list, index, value) => {
    const next = [...list];
    next[index] = value;
    setter(next);
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Enter your full name.";
    if (!emailRe.test(form.email)) err.email = "Enter a valid email address.";
    if (form.password.length < 6) err.password = "Use at least 6 characters.";
    if (!phoneRe.test(form.mobile))
      err.mobile = "Enter a 10-digit mobile number.";
    if (!form.bloodgrp) err.bloodgrp = "Select your blood group.";

    // Emergency details: at least one number and one email, up to five each
    const filledContacts = contacts.filter((c) => c);
    const filledEmails = emails.filter((m) => m);

    if (filledContacts.length === 0)
      err.contactsMin = "Add at least one emergency number.";
    if (filledEmails.length === 0)
      err.emailsMin = "Add at least one emergency email.";

    // Format is checked only on boxes that are filled
    contacts.forEach((c, i) => {
      if (c && !phoneRe.test(c)) err[`contact${i}`] = "Enter a 10-digit number.";
    });
    emails.forEach((m, i) => {
      if (m && !emailRe.test(m)) err[`email${i}`] = "Enter a valid email.";
    });

    if (new Set(filledContacts).size !== filledContacts.length)
      err.contactsDup = "Each emergency number must be different.";
    if (new Set(filledEmails).size !== filledEmails.length)
      err.emailsDup = "Each emergency email must be different.";

    return err;
  };

  const handleSubmit = async () => {
    const err = validate();
    setErrors(err);
    setStatus({ type: "", message: "" });
    if (Object.keys(err).length) return;

    setLoading(true);
    try {
      const { data } = await axios.post(API_URL, {
        ...form,
        emergencyContacts: contacts.filter((c) => c).join(", "),
        emergencyEmails: emails.filter((m) => m).join(", "),
      },{
        withCredentials: true
      });
      setStatus({
        type: "success",
        message: data.message || "Account created.",
      });
      navigate("/");
    } catch (e) {
      setStatus({
        type: "error",
        message: e.response?.data?.message || "Signup failed. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="su-page">
      <CloseIcon className="su-close" onClick={() => navigate("/")} />
      <div className="su-card">
        <header className="su-header">
          <h1>Create your account</h1>
          <p>Tell us who to reach if you ever need help.</p>
        </header>

        <section className="su-section">
          <h2>About you</h2>
          <div className="su-grid">
            <Field label="Full name" error={errors.name}>
              <input name="name" value={form.name} onChange={handleChange} autoComplete="name" />
            </Field>
            <Field label="Email" error={errors.email}>
              <input type="email" name="email" value={form.email} onChange={handleChange} autoComplete="email" />
            </Field>
            <Field label="Password" error={errors.password}>
              <input type="password" name="password" value={form.password} onChange={handleChange} autoComplete="new-password" />
            </Field>
            <Field label="Mobile number" error={errors.mobile}>
              <input
                type="tel"
                name="mobile"
                inputMode="numeric"
                maxLength={10}
                value={form.mobile}
                onChange={(e) =>
                  setForm({ ...form, mobile: e.target.value.replace(/\D/g, "") })
                }
                autoComplete="tel"
              />
            </Field>
            <Field label="Blood group" error={errors.bloodgrp}>
              <select name="bloodgrp" value={form.bloodgrp} onChange={handleChange}>
                <option value="">Select</option>
                {BLOOD_GROUPS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </Field>
          </div>
        </section>

        <section className="su-section su-emergency">
          <h2>Emergency contacts</h2>
          <p className="su-hint">
            Add at least one number and one email. You can add up to five.
          </p>
          {errors.contactsMin && <p className="su-error">{errors.contactsMin}</p>}
          {errors.emailsMin && <p className="su-error">{errors.emailsMin}</p>}
          {errors.contactsDup && <p className="su-error">{errors.contactsDup}</p>}
          {errors.emailsDup && <p className="su-error">{errors.emailsDup}</p>}

          {Array.from({ length: EMERGENCY_COUNT }, (_, i) => (
            <div className="su-contact" key={i}>
              <span className="su-contact-index">{i + 1}</span>
              <div className="su-grid su-grid-2">
                <Field label={`Contact ${i + 1} number`} error={errors[`contact${i}`]}>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={contacts[i]}
                    onChange={(e) =>
                      updateAt(setContacts, contacts, i, e.target.value.replace(/\D/g, ""))
                    }
                  />
                </Field>
                <Field label={`Contact ${i + 1} email`} error={errors[`email${i}`]}>
                  <input
                    type="email"
                    value={emails[i]}
                    onChange={(e) =>
                      updateAt(setEmails, emails, i, e.target.value.trim().toLowerCase())
                    }
                  />
                </Field>
              </div>
            </div>
          ))}
        </section>

        {status.message && (
          <p className={`su-status su-status-${status.type}`} role="status">
            {status.message}
          </p>
        )}

        <button className="su-submit" onClick={handleSubmit} disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </button>
         <p className="lg-footer">
          Already have an account? <NavLink to='/login'>Log in</NavLink>
        </p>
      </div>
      
    </main>
  );
}

function Field({ label, error, children }) {
  return (
    <label className={`su-field ${error ? "has-error" : ""}`}>
      <span>{label}</span>
      {children}
      {error && <small className="su-error">{error}</small>}
    </label>
  );
}