import React, { useState } from "react";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/ui/Icon/Icon";
import {
  configureAuthPersistence,
  sendPasswordReset,
  signInWithEmail,
  signInWithGoogle,
} from "../../../services/firebase/auth";
import login_image from "../../../assets/images/login_image.png";

function getLoginErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "The email or password is incorrect.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/too-many-requests":
        return "Too many attempts. Please wait a moment and try again.";
      case "auth/popup-closed-by-user":
        return "The Google sign-in window was closed before completion.";
      case "auth/popup-blocked":
        return "Your browser blocked the Google sign-in window. Please allow popups and try again.";
      case "auth/user-disabled":
        return "This account has been disabled.";
      default:
        return "Unable to sign you in. Please try again.";
    }
  }

  return "Unable to sign you in. Please try again.";
}

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetSending, setResetSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  async function handleEmailLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await configureAuthPersistence(rememberMe);
      await signInWithEmail(email.trim(), password);

      navigate("/dashboard", { replace: true });
    } catch (loginError) {
      setError(getLoginErrorMessage(loginError));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setSuccess("");
    setGoogleSubmitting(true);

    try {
      await configureAuthPersistence(rememberMe);
      await signInWithGoogle();

      navigate("/dashboard", { replace: true });
    } catch (loginError) {
      setError(getLoginErrorMessage(loginError));
    } finally {
      setGoogleSubmitting(false);
    }
  }

  async function handlePasswordReset() {
    setError("");
    setSuccess("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Enter your email address first, then try again.");
      return;
    }

    setResetSending(true);

    try {
      await sendPasswordReset(trimmedEmail);

      setSuccess(
        "If an account exists for that email, a password-reset link has been sent.",
      );
    } catch (resetError) {
      setError(getLoginErrorMessage(resetError));
    } finally {
      setResetSending(false);
    }
  }

  return (
    <div className="min-h-dvh bg-[var(--color-background)] text-[var(--color-on-surface)]">
      <main className="flex min-h-dvh items-center justify-center p-3 sm:p-5 lg:p-8">
        <section className="grid w-full max-w-[1220px] overflow-hidden rounded-[14px] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)] lg:h-[calc(100dvh-64px)] lg:max-h-[900px] lg:min-h-[700px] lg:grid-cols-[0.9fr_1fr]">
          <aside className="relative min-h-[640px] overflow-hidden lg:min-h-0">
            <div className="relative h-full">
              <img
                src={login_image}
                alt="Warm editorial desk with books, manuscripts, plants, and writing tools"
                className="absolute inset-0 h-full w-full object-cover object-top"
                loading="eager"
              />

              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(20,18,16,0.08)_0%,transparent_34%,rgba(250,248,243,0.04)_58%,rgba(250,248,243,0.24)_75%,rgba(250,248,243,0.78)_89%,var(--color-surface)_100%)]" />

              <button
                type="button"
                aria-label="Go to Folio home"
                onClick={() => navigate("/")}
                className="absolute left-6 top-6 z-10 inline-flex items-center gap-3 sm:left-8 sm:top-8 lg:left-9 lg:top-9"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-[6px] !bg-[var(--color-primary)] !text-[var(--color-on-primary)] shadow-[var(--shadow-sm)]">
                  <span className="font-display text-[23px] font-semibold leading-none">
                    F
                  </span>
                </span>

                <span className="font-display text-[25px] font-semibold tracking-tight text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.18)]">
                  Folio
                </span>
              </button>

              <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-7 sm:px-8 sm:pb-8 lg:px-9 lg:pb-8">
                <div className="max-w-[500px]">
                  <div className="font-display text-[32px] leading-none text-[var(--color-on-surface)]">
                    “
                  </div>

                  <blockquote className="mt-1 font-display text-[25px] leading-[1.16] tracking-tight text-[var(--color-on-surface)] sm:text-[29px]">
                    Good publishing gives every idea a longer tomorrow.
                  </blockquote>

                  <div className="mt-4 flex items-start gap-3">
                    <div
                      className="mt-2 h-px w-9 shrink-0 bg-[var(--color-primary)]"
                      aria-hidden="true"
                    />

                    <div>
                      <p className="font-body text-[12px] font-semibold text-[var(--color-on-surface)]">
                        Clara Whitmore
                      </p>

                      <p className="mt-0.5 font-body text-[10px] text-[var(--color-on-surface-variant)]">
                        Editor-in-Chief,{" "}
                        <span className="italic text-[var(--color-primary)]">
                          The Northern Chronicle
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5">
                    {[
                      "Curate ideas",
                      "Craft narratives",
                      "Build what lasts",
                    ].map((item) => (
                      <span
                        key={item}
                        className="font-body text-[10px] font-medium text-[var(--color-on-surface-variant)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="flex min-h-0 flex-col bg-[var(--color-surface)] px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-8">
            <div className="flex items-center justify-between gap-4">
              <span className="font-body text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--color-primary)]">
                Member access
              </span>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex items-center gap-1.5 font-body text-[12px] font-medium text-[var(--color-on-surface-variant)] transition-colors duration-[var(--motion-fast)] hover:text-[var(--color-primary)]"
              >
                <Icon name="arrow-left" size={15} />
                Back to site
              </button>
            </div>

            <div className="mx-auto flex min-h-0 w-full max-w-[500px] flex-1 flex-col justify-center">
              <div>
                <h1 className="font-display text-[36px] leading-[1.06] tracking-tight text-[var(--color-on-surface)] sm:text-[42px]">
                  Welcome back
                </h1>

                <p className="mt-3 max-w-[450px] font-body text-[14px] leading-6 text-[var(--color-on-surface-variant)]">
                  Sign in to return to your editorial workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleSubmitting || submitting}
                className="mt-7 flex h-11 w-full items-center justify-center gap-3 rounded-[6px] !bg-[var(--color-primary)] px-4 font-body text-[13px] font-semibold !text-[var(--color-on-primary)] shadow-[var(--shadow-sm)] transition-[background-color,transform,opacity] duration-[var(--motion-fast)] hover:!bg-[var(--color-primary-container)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="#4285F4"
                    d="M21.35 12.2c0-.72-.06-1.42-.18-2.08H12v3.94h5.24a4.48 4.48 0 0 1-1.95 2.94v2.44h3.15c1.84-1.7 2.91-4.2 2.91-7.24Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.15-2.44c-.87.58-1.98.93-3.3.93-2.53 0-4.67-1.71-5.44-4.01H3.3v2.51A9.74 9.74 0 0 0 12 21.5Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M6.56 13.62A5.85 5.85 0 0 1 6.25 12c0-.56.1-1.1.31-1.62V7.87H3.3A9.5 9.5 0 0 0 2.5 12c0 1.53.37 2.97.8 4.13l3.26-2.51Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 6.37c1.44 0 2.73.49 3.74 1.44l2.8-2.8C16.84 3.47 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.37l3.26 2.51c.77-2.3 2.91-4.01 5.44-4.01Z"
                  />
                </svg>

                {googleSubmitting
                  ? "Signing in with Google…"
                  : "Continue with Google Workspace"}
              </button>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-[var(--color-outline-variant)]" />

                <span className="font-body text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--color-on-surface-variant)]">
                  or use email
                </span>

                <div className="h-px flex-1 bg-[var(--color-outline-variant)]" />
              </div>

              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="login-email"
                    className="mb-1.5 block font-body text-[12px] font-semibold text-[var(--color-on-surface)]"
                  >
                    Email
                  </label>

                  <div className="relative">
                    <Icon
                      name="mail"
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]"
                    />

                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="editorial@themonocle.org"
                      required
                      className="h-11 w-full rounded-[6px] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] pl-10 pr-3 font-body text-[13px] text-[var(--color-on-surface)] outline-none placeholder:text-[var(--color-outline)] transition-[border-color,box-shadow] duration-[var(--motion-fast)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between gap-4">
                    <label
                      htmlFor="login-password"
                      className="font-body text-[12px] font-semibold text-[var(--color-on-surface)]"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={handlePasswordReset}
                      disabled={resetSending}
                      className="font-body text-[11px] font-medium text-[var(--color-primary)] transition-colors duration-[var(--motion-fast)] hover:text-[var(--color-primary-container)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {resetSending ? "Sending…" : "Forgot password?"}
                    </button>
                  </div>

                  <div className="relative">
                    <Icon
                      name="lock"
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]"
                    />

                    <input
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      required
                      className="h-11 w-full rounded-[6px] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] pl-10 pr-11 font-body text-[13px] text-[var(--color-on-surface)] outline-none placeholder:text-[var(--color-outline)] transition-[border-color,box-shadow] duration-[var(--motion-fast)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
                    />

                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      title={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-[var(--color-on-surface-variant)] transition-colors duration-[var(--motion-fast)] hover:text-[var(--color-on-surface)]"
                    >
                      <Icon name={showPassword ? "eye-off" : "eye"} size={17} />
                    </button>
                  </div>
                </div>

                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 shrink-0 accent-[var(--color-primary)]"
                  />

                  <span className="font-body text-[12px] text-[var(--color-on-surface-variant)]">
                    Keep me signed in on this device.
                  </span>
                </label>

                {error && (
                  <div
                    role="alert"
                    className="rounded-[6px] border border-[color-mix(in_srgb,var(--color-primary)_28%,transparent)] bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] px-3 py-2.5 font-body text-[11px] leading-5 text-[var(--color-primary)]"
                  >
                    {error}
                  </div>
                )}

                {success && (
                  <div
                    role="status"
                    className="rounded-[6px] border border-[color-mix(in_srgb,var(--color-primary)_24%,transparent)] bg-[color-mix(in_srgb,var(--color-primary)_7%,transparent)] px-3 py-2.5 font-body text-[11px] leading-5 text-[var(--color-on-surface)]"
                  >
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || googleSubmitting}
                  className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-[6px] !bg-[var(--color-primary)] px-5 font-body text-[14px] font-semibold !text-[var(--color-on-primary)] shadow-[var(--shadow-sm)] transition-[background-color,transform,opacity] duration-[var(--motion-fast)] hover:!bg-[var(--color-primary-container)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Signing in…" : "Sign in"}

                  {!submitting && <Icon name="arrow-right" size={16} />}
                </button>
              </form>

              <div className="mt-7 pt-1">
                <p className="m-0 text-center font-body text-[12px] text-[var(--color-on-surface-variant)]">
                  New to Folio?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className="font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-container)]"
                  >
                    Create an account
                  </button>
                </p>
              </div>

              <div className="mt-7 border-t border-[var(--color-outline-variant)] pt-4">
                <div className="flex flex-col gap-3 text-[10px] sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 font-body text-[var(--color-on-surface-variant)]">
                    <Icon name="lock" size={12} />
                    Your connection is encrypted
                  </div>

                  <div className="flex items-center gap-4 font-body text-[var(--color-on-surface-variant)]">
                    <button
                      type="button"
                      className="transition-colors hover:text-[var(--color-primary)]"
                    >
                      Privacy
                    </button>

                    <button
                      type="button"
                      className="transition-colors hover:text-[var(--color-primary)]"
                    >
                      Terms
                    </button>

                    <button
                      type="button"
                      className="transition-colors hover:text-[var(--color-primary)]"
                    >
                      Security
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default Login;
