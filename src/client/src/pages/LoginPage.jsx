import { useState } from "react";
import { Wallet, Mail, Lock } from "lucide-react";
import { api } from "../lib/api.js";

export default function LoginPage({ onLoggedIn }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (mode === "login") {
        await api.login(email, password);
      } else {
        await api.signup(email, password);
      }
      onLoggedIn();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Wallet size={28} className="text-ink" />
          <span className="font-display font-extrabold text-2xl tracking-tight">PennyPilot</span>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-mist rounded-2xl shadow-soft p-6 space-y-4"
        >
          <div className="flex rounded-lg border border-mist p-1 text-sm">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className={`flex-1 rounded-md py-1.5 font-medium transition ${
                mode === "login" ? "bg-coral text-white" : "text-ink/60"
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError(null);
              }}
              className={`flex-1 rounded-md py-1.5 font-medium transition ${
                mode === "signup" ? "bg-coral text-white" : "text-ink/60"
              }`}
            >
              Sign up
            </button>
          </div>

          <div>
            <label className="text-sm text-ink/70 flex items-center gap-1.5 mb-1.5">
              <Mail size={14} /> Email
            </label>
            <input
              type="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-mist px-3 py-2.5 text-sm focus:outline-coral"
              required
            />
          </div>
          <div>
            <label className="text-sm text-ink/70 flex items-center gap-1.5 mb-1.5">
              <Lock size={14} /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-mist px-3 py-2.5 text-sm focus:outline-coral"
              required
              minLength={mode === "signup" ? 6 : undefined}
            />
          </div>
          {mode === "signup" && (
            <p className="text-xs text-ink/50">
              This creates a brand-new, empty household — your own private space, separate from
              anyone else's data.
            </p>
          )}
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-coral text-white font-medium px-4 py-2.5 text-sm hover:bg-coral/90 disabled:opacity-50"
          >
            {submitting ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
