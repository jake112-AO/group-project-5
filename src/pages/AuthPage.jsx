import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

function AuthPage() {
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState("form");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  function resetMessages() {
    setError("");
    setNotice("");
  }

  async function onSubmit(event) {
    event.preventDefault();
    resetMessages();
    setBusy(true);
    try {
      if (mode === "login") {
        await login(email, password);
        navigate("/cases");
      } else {
        const result = await register(username, email, password);
        setNotice(result.message || "Verification code sent.");
        setStep("verify");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(event) {
    event.preventDefault();
    resetMessages();
    setBusy(true);
    try {
      const result = await api("/auth/verify-code", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      });
      setNotice(result.message || "Email verified. You can log in now.");
      setMode("login");
      setStep("form");
      setCode("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function resendVerification() {
    if (!email.trim()) {
      setError("Enter your email first.");
      return;
    }

    setBusy(true);
    resetMessages();
    try {
      const result = await api("/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setNotice(result.message || "Verification code sent.");
      if (mode === "register") setStep("verify");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel auth-panel">
      <p className="eyebrow">Secure Access</p>
      <h2>{mode === "login" ? "Login" : step === "verify" ? "Enter Verification Code" : "Create Account"}</h2>
      <p className="supporting-copy">
        {mode === "login"
          ? "Sign in with your verified account."
          : step === "verify"
            ? "We emailed you a 6-digit code. Enter it below to finish registration."
            : "Create your account first, then confirm the 6-digit code we send by email."}
      </p>

      {mode === "register" && step === "verify" ? (
        <form onSubmit={verifyCode}>
          <label>
            Email
            <input type="email" value={email} readOnly />
          </label>
          <label>
            Verification Code
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
              inputMode="numeric"
              required
            />
          </label>
          {error ? <p className="error">{error}</p> : null}
          {notice ? <p className="notice">{notice}</p> : null}
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? "Please wait..." : "Verify Code"}
          </button>
        </form>
      ) : (
        <form onSubmit={onSubmit}>
          {mode === "register" ? (
            <label>
              Username
              <input value={username} onChange={(e) => setUsername(e.target.value)} required />
            </label>
          ) : null}
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </label>
          {error ? <p className="error">{error}</p> : null}
          {notice ? <p className="notice">{notice}</p> : null}
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? "Please wait..." : mode === "login" ? "Login" : "Send Verification Code"}
          </button>
        </form>
      )}

      <div className="auth-actions">
        <button
          className="link-button"
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setStep("form");
            setCode("");
            resetMessages();
          }}
        >
          {mode === "login" ? "Need an account? Register" : "Already have an account? Login"}
        </button>

        {mode === "register" ? (
          <button className="link-button" type="button" onClick={resendVerification} disabled={busy}>
            Resend verification code
          </button>
        ) : null}
      </div>
    </section>
  );
}

export default AuthPage;
