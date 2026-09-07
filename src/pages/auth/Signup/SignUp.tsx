import { useMemo, useState } from "react";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../../components/ui/Icon/Icon";
import {
  signInWithGoogle,
  signUpWithEmail,
} from "../../../services/firebase/auth";
import { ensureUserProfile } from "../../../features/auth/services/userServices";

function getSignupErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/weak-password":
        return "The password does not meet the required security policy.";
      case "auth/popup-closed-by-user":
        return "The Google sign-in window was closed before completion.";
      case "auth/popup-blocked":
        return "Your browser blocked the Google sign-in window. Please allow popups and try again.";
      default:
        return "Unable to create your account. Please try again.";
    }
  }

  return "Unable to create your account. Please try again.";
}

function getPasswordScore(password: string) {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  return Math.min(score, 4);
}

function getPasswordLabel(score: number) {
  switch (score) {
    case 0:
      return "Enter a password";
    case 1:
      return "Very weak";
    case 2:
      return "Needs improvement";
    case 3:
      return "Good";
    default:
      return "Strong";
  }
}

function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const passwordScore = useMemo(() => getPasswordScore(password), [password]);

  const passwordLabel = getPasswordLabel(passwordScore);

  const passwordsMatch =
    confirmPassword.length === 0 || password === confirmPassword;

  const canSubmit =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= 8 &&
    passwordScore >= 3 &&
    password === confirmPassword &&
    acceptedTerms;

  async function handleEmailSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      setError(
        "Please complete all required fields and make sure your password is strong enough.",
      );
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const credential = await signUpWithEmail(email.trim(), password);

      await ensureUserProfile(credential.user, {
        name: name.trim(),
      });

      navigate("/dashboard", { replace: true });
    } catch (signupError) {
      setError(getSignupErrorMessage(signupError));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSignup() {
    setError("");
    setGoogleSubmitting(true);

    try {
      const credential = await signInWithGoogle();

      await ensureUserProfile(credential.user);

      navigate("/dashboard", { replace: true });
    } catch (googleError) {
      setError(getSignupErrorMessage(googleError));
    } finally {
      setGoogleSubmitting(false);
    }
  }

  return (
    <div className="min-h-dvh bg-[var(--color-background)] text-[var(--color-on-surface)]">
      <header className="border-b border-[var(--color-outline-variant)] bg-[var(--color-background)]">
        <div className="mx-auto flex h-16 max-w-[var(--canvas-width)] items-center justify-between px-[var(--content-padding-mobile)] sm:px-[var(--content-padding-tablet)] lg:px-[var(--content-padding-desktop)]">
          <button
            type="button"
            aria-label="Go to Folio home"
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] !bg-[var(--color-primary)] !text-[var(--color-on-primary)]">
              <span className="font-body text-base font-bold">F</span>
            </span>

            <span className="font-display text-[23px] font-semibold tracking-tight">
              Folio
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 font-body text-[13px] font-medium text-[var(--color-on-surface)] transition-colors duration-[var(--motion-fast)] hover:text-[var(--color-primary)]"
          >
            <span aria-hidden="true">←</span>
            Back to site
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1272px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-24">
        <section className="overflow-hidden rounded-[10px] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] shadow-[var(--shadow-md)] lg:grid lg:grid-cols-[0.92fr_1.18fr]">
          <aside className="flex flex-col justify-between bg-[linear-gradient(135deg,var(--color-surface-container-high),var(--color-surface-container-low))] p-7 sm:p-10 lg:p-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-surface)] px-3 py-1.5 font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-on-surface-variant)] shadow-[var(--shadow-sm)]">
                <span
                  className="h-2 w-2 rounded-full bg-[var(--color-primary)]"
                  aria-hidden="true"
                />
                Editorial Suite v2.4
              </div>

              <h1 className="mt-7 max-w-[430px] font-display text-[40px] leading-[1.12] tracking-tight text-[var(--color-on-surface)] sm:text-[48px]">
                A dedicated space for the craft of prose.
              </h1>

              <p className="mt-6 max-w-[455px] font-body text-[16px] leading-7 text-[var(--color-on-surface-variant)]">
                Engineered for elite literary journals, independent cultural
                gazettes, and discerning publishing syndicates.
              </p>
            </div>

            <div className="mt-12">
              <div className="rounded-[6px] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
                <div className="font-display text-[32px] leading-none text-[var(--color-primary)]">
                  “
                </div>

                <p className="mt-2 font-display text-[20px] italic leading-8 text-[var(--color-on-surface)]">
                  Folio transformed our publication workflow into a tactile,
                  joyful craft. Zero noise, pure prose.
                </p>

                <div className="mt-7 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-container-high)] font-display text-[16px] font-semibold text-[var(--color-primary)]">
                    EV
                  </div>

                  <div>
                    <p className="font-body text-[14px] font-semibold text-[var(--color-on-surface)]">
                      Elena Vance
                    </p>

                    <p className="font-body text-[12px] text-[var(--color-on-surface-variant)]">
                      Editor-in-Chief,{" "}
                      <span className="italic text-[var(--color-primary)]">
                        The Northern Chronicle
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <p className="font-body text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
                  Guild standards
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    "Zero platform lock-in",
                    "14-day archival trial",
                    "Custom vanity domains",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-3 py-1.5 font-body text-[11px] font-medium text-[var(--color-on-surface-variant)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <section className="p-7 sm:p-10 lg:p-12">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-body text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-primary)]">
                  Member registration
                </p>

                <h2 className="mt-2 font-display text-[34px] leading-tight tracking-tight sm:text-[40px]">
                  Start writing today
                </h2>

                <p className="mt-3 max-w-[620px] font-body text-[15px] leading-6 text-[var(--color-on-surface-variant)]">
                  Set up your publication's workspace in under two minutes. No
                  credit card required.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={googleSubmitting || submitting}
                className="flex h-11 w-full items-center justify-center gap-3 rounded-[5px] !bg-[var(--color-primary)] px-4 font-body text-[14px] font-semibold !text-[var(--color-on-primary)] shadow-[var(--shadow-sm)] transition-[background-color,transform,opacity] duration-[var(--motion-fast)] hover:!bg-[var(--color-primary-container)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
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
                  ? "Connecting to Google…"
                  : "Continue with Google Workspace"}
              </button>
            </div>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--color-outline-variant)]" />
              <span className="font-body text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-on-surface-variant)]">
                or register with email
              </span>
              <div className="h-px flex-1 bg-[var(--color-outline-variant)]" />
            </div>

            <form onSubmit={handleEmailSignup} className="space-y-5">
              <div>
                <label
                  htmlFor="signup-name"
                  className="mb-2 block font-body text-[13px] font-medium text-[var(--color-on-surface)]"
                >
                  Full Name
                </label>

                <div className="relative">
                  <Icon
                    name="user"
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]"
                  />

                  <input
                    id="signup-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="e.g. Julian Hayes"
                    required
                    className="h-11 w-full rounded-[5px] bg-[var(--color-surface-container-low)] pl-10 pr-3 font-body text-[14px] text-[var(--color-on-surface)] outline-none placeholder:text-[var(--color-outline)] transition-[box-shadow] duration-[var(--motion-fast)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-email"
                  className="mb-2 block font-body text-[13px] font-medium text-[var(--color-on-surface)]"
                >
                  Publication Name or Email
                </label>

                <div className="relative">
                  <Icon
                    name="mail"
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]"
                  />

                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="editorial@themonocle.org"
                    required
                    className="h-11 w-full rounded-[5px] bg-[var(--color-surface-container-low)] pl-10 pr-3 font-body text-[14px] text-[var(--color-on-surface)] outline-none placeholder:text-[var(--color-outline)] transition-[box-shadow] duration-[var(--motion-fast)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="signup-password"
                    className="mb-2 block font-body text-[13px] font-medium text-[var(--color-on-surface)]"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <Icon
                      name="key"
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]"
                    />

                    <input
                      id="signup-password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      minLength={8}
                      className="h-11 w-full rounded-[5px] bg-[var(--color-surface-container-low)] pl-10 pr-3 font-body text-[14px] text-[var(--color-on-surface)] outline-none transition-[box-shadow] duration-[var(--motion-fast)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="signup-confirm-password"
                    className="mb-2 block font-body text-[13px] font-medium text-[var(--color-on-surface)]"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    <Icon
                      name="check-circle"
                      size={17}
                      className={[
                        "absolute left-3 top-1/2 -translate-y-1/2",
                        confirmPassword.length > 0 && passwordsMatch
                          ? "text-[var(--color-primary)]"
                          : "text-[var(--color-on-surface-variant)]",
                      ].join(" ")}
                    />

                    <input
                      id="signup-confirm-password"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      required
                      className="h-11 w-full rounded-[5px] bg-[var(--color-surface-container-low)] pl-10 pr-3 font-body text-[14px] text-[var(--color-on-surface)] outline-none transition-[box-shadow] duration-[var(--motion-fast)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
                    />
                  </div>

                  {!passwordsMatch && (
                    <p className="mt-1.5 font-body text-[11px] text-[var(--color-primary)]">
                      Passwords do not match.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-[5px] bg-[var(--color-surface-container-low)] p-3">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-on-surface-variant)]">
                    Password health
                  </p>

                  <span className="font-body text-[12px] font-semibold text-[var(--color-primary)]">
                    {passwordLabel}
                  </span>
                </div>

                <div className="mt-2 grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4].map((level) => (
                    <span
                      key={level}
                      className={[
                        "h-1 rounded-full transition-colors duration-[var(--motion-fast)]",
                        level <= passwordScore
                          ? "bg-[var(--color-primary)]"
                          : "bg-[var(--color-outline-variant)]",
                      ].join(" ")}
                    />
                  ))}
                </div>

                <div className="mt-2 flex items-center justify-between gap-4">
                  <p className="font-body text-[11px] text-[var(--color-on-surface-variant)]">
                    Use 8+ characters with upper, lower, number, and symbol.
                  </p>

                  <span className="shrink-0 font-mono text-[11px] text-[var(--color-on-surface-variant)]">
                    {passwordScore}/4
                  </span>
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-primary)]"
                />

                <span className="font-body text-[12px] leading-5 text-[var(--color-on-surface-variant)]">
                  I agree to the{" "}
                  <a
                    href="/"
                    onClick={(event) => event.preventDefault()}
                    className="underline underline-offset-2 transition-colors hover:text-[var(--color-primary)]"
                  >
                    Terms of Publication
                  </a>
                  , the{" "}
                  <a
                    href="/"
                    onClick={(event) => event.preventDefault()}
                    className="underline underline-offset-2 transition-colors hover:text-[var(--color-primary)]"
                  >
                    Archival Privacy Charter
                  </a>
                  , and acknowledge the 14-day evaluation window.
                </span>
              </label>

              {error && (
                <div
                  role="alert"
                  className="rounded-[5px] border border-[color-mix(in_srgb,var(--color-primary)_28%,transparent)] bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] px-3 py-2.5 font-body text-[12px] leading-5 text-[var(--color-primary)]"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit || submitting || googleSubmitting}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-[5px] !bg-[var(--color-primary)] px-5 font-body text-[15px] font-semibold !text-[var(--color-on-primary)] shadow-[var(--shadow-sm)] transition-[background-color,transform,opacity] duration-[var(--motion-fast)] hover:!bg-[var(--color-primary-container)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "Creating your account…"
                  : "Create Publication Account"}

                {!submitting && <span aria-hidden="true">→</span>}
              </button>
            </form>

            <div className="pt-5">
              <p className="pb-4 text-center font-body text-[13px] text-[var(--color-on-surface-variant)]">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-medium text-[var(--color-primary)] underline underline-offset-2"
                >
                  Sign in
                </button>
              </p>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default SignUp;
