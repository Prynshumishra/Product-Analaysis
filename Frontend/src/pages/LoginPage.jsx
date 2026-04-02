import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, UserPlus, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { loginRequest, registerRequest } from "../services/authService.js";

const initialState = {
  username: "",
  password: "",
  age: "",
  gender: "Male"
};

const formatApiError = (error) => {
  const response = error?.response?.data;

  if (response?.errors && typeof response.errors === "object") {
    const entries = Object.entries(response.errors).filter(
      ([, messages]) => Array.isArray(messages) && messages.length > 0
    );

    if (entries.length > 0) {
      const [field, messages] = entries[0];
      return `${field}: ${messages[0]}`;
    }
  }

  return response?.message || "Unable to authenticate. Please try again.";
};

function LoginPage() {
  const [mode, setMode] = useState("login");
  const [formState, setFormState] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleFieldChange = (field, value) => {
    setFormState((previous) => ({
      ...previous,
      [field]: value
    }));
  };

  const submitLabel = mode === "login" ? "Sign In" : "Create Account";
  const SubmitIcon = mode === "login" ? LogIn : UserPlus;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const normalizedUsername = formState.username.trim();

      if (mode === "register") {
        const parsedAge = Number(formState.age);

        if (!Number.isInteger(parsedAge) || parsedAge < 1 || parsedAge > 120) {
          setErrorMessage("age: Please enter a valid age between 1 and 120.");
          return;
        }
      }

      const payload =
        mode === "login"
          ? {
              username: normalizedUsername,
              password: formState.password
            }
          : {
              username: normalizedUsername,
              password: formState.password,
              age: Number(formState.age),
              gender: formState.gender
            };

      const response =
        mode === "login" ? await loginRequest(payload) : await registerRequest(payload);

      login(response);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(formatApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-10">
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute left-1/4 top-10 -z-10 h-44 w-96 rounded-full bg-cyan-400/20 blur-[100px] dark:bg-cyan-700/15" />
      <div className="pointer-events-none absolute bottom-16 right-1/4 -z-10 h-40 w-80 rounded-full bg-indigo-400/25 blur-[100px] dark:bg-indigo-700/15" />
      <div className="pointer-events-none absolute bottom-1/3 left-10 -z-10 h-32 w-32 rounded-full bg-fuchsia-400/20 blur-[80px] dark:bg-fuchsia-700/10" />

      <section className="glass-card fade-up w-full max-w-md p-7 md:p-9">
        {/* Header */}
        <div className="mb-7 space-y-3">
          <span className="chip">
            <Sparkles size={12} className="pulse-glow" />
            Product Analytics
          </span>

          <h1 className="fintech-title text-3xl md:text-4xl">
            <span className="text-gradient">
              {mode === "login" ? "Welcome Back" : "Get Started"}
            </span>
          </h1>

          <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {mode === "login"
              ? "Sign in to unlock interactive product insights and monitor user behaviors in real time."
              : "Create your account to start capturing and visualizing powerful behavioral analytics."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="filter-field">
            <label className="field-label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className="field"
              type="text"
              placeholder="Enter your username"
              value={formState.username}
              onChange={(event) => handleFieldChange("username", event.target.value)}
              minLength={3}
              maxLength={40}
              required
            />
          </div>

          <div className="filter-field">
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                className="field pr-10"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formState.password}
                onChange={(event) => handleFieldChange("password", event.target.value)}
                minLength={6}
                maxLength={100}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {mode === "register" ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="filter-field">
                <label className="field-label" htmlFor="age">
                  Age
                </label>
                <input
                  id="age"
                  className="field"
                  type="number"
                  placeholder="25"
                  min="1"
                  max="120"
                  value={formState.age}
                  onChange={(event) => handleFieldChange("age", event.target.value)}
                  required
                />
              </div>
              <div className="filter-field">
                <label className="field-label" htmlFor="gender">
                  Gender
                </label>
                <select
                  id="gender"
                  className="field"
                  value={formState.gender}
                  onChange={(event) => handleFieldChange("gender", event.target.value)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          ) : null}

          {errorMessage ? (
            <div className="scale-in rounded-xl border border-rose-300/40 bg-rose-500/[0.08] px-4 py-3">
              <p className="text-sm font-medium text-rose-700 dark:text-rose-200">{errorMessage}</p>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary group w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <SubmitIcon size={16} />
                {submitLabel}
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            )}
          </button>
        </form>

        {/* Mode toggle */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setMode((previous) => (previous === "login" ? "register" : "login"));
              setErrorMessage("");
            }}
            className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-100"
          >
            {mode === "login" ? "Need an account? Register →" : "Already have an account? Sign In →"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;