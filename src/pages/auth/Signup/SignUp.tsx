import { useMemo, useState } from "react";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import signup_image from "../../../assets/images/signup_image.png";
import { Icon } from "../../../components/ui/Icon/Icon";
import { ensureUserProfile } from "../../../features/auth/services/userServices";
import {
  configureAuthPersistence,
  signInWithGoogle,
  signUpWithEmail,
} from "../../../services/firebase/auth";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    setError("");

    if (!canSubmit) {
      setError(
        "Please complete all required fields and make sure your password is strong enough.",
      );
      return;
    }

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
      await configureAuthPersistence(true);

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
      <main className="flex min-h-dvh items-center justify-center p-3 sm:p-5 lg:p-6">
        <section className="grid w-full max-w-[1240px] overflow-hidden rounded-[14px] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)] lg:h-[calc(100dvh-40px)] lg:max-h-[940px] lg:min-h-[760px] lg:grid-cols-[0.9fr_1fr]">
          <aside className="relative min-h-[650px] overflow-hidden lg:min-h-0">
            <div className="relative h-full">
              <img
                src={signup_image}
                alt="Warm editorial desk with books, flowers, coffee, and writing materials"
                className="absolute inset-0 h-full w-full object-cover object-center"
                loading="eager"
              />

              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(22,18,14,0.08)_0%,transparent_34%,rgba(250,248,243,0.02)_54%,rgba(250,248,243,0.18)_69%,rgba(250,248,243,0.68)_87%,var(--color-surface)_100%)]" />

              <div className="absolute left-6 top-6 z-10 sm:left-8 sm:top-8 lg:left-9 lg:top-9">
                <button
                  type="button"
                  aria-label="Go to Folio home"
                  onClick={() => navigate("/")}
                  className="group inline-flex items-center gap-3"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-[6px] !bg-[var(--color-primary)] !text-[var(--color-on-primary)] shadow-[var(--shadow-sm)] transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5">
                    <span className="font-display text-[23px] font-semibold leading-none">
                      F
                    </span>
                  </span>

                  <span className="font-display text-[25px] font-semibold tracking-tight text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.18)]">
                    Folio
                  </span>
                </button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-7 sm:px-8 sm:pb-8 lg:px-9 lg:pb-9">
                <div className="max-w-[500px]">
                  <div className="font-display text-[31px] leading-none text-[var(--color-on-surface)]">
                    “
                  </div>

                  <blockquote className="mt-1 max-w-[485px] font-display text-[25px] leading-[1.17] tracking-tight text-[var(--color-on-surface)] sm:text-[29px]">
                    A better tomorrow begins with someone who writes today.
                  </blockquote>

                  <div className="mt-4 flex items-start gap-3">
                    <div
                      className="mt-2 h-px w-9 shrink-0 bg-[var(--color-primary)]"
                      aria-hidden="true"
                    />

                    <div>
                      <p className="font-body text-[12px] font-semibold text-[var(--color-on-surface)]">
                        Marcus Ellison
                      </p>

                      <p className="mt-0.5 font-body text-[10px] text-[var(--color-on-surface-variant)]">
                        Author &amp; Educator
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5">
                    {[
                      "Write freely",
                      "Grow your ideas",
                      "Share with the world",
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

          <section className="flex min-h-0 flex-col bg-[var(--color-surface)] px-6 py-6 sm:px-8 sm:py-7 lg:px-10 lg:py-7">
            <div className="flex items-center justify-between gap-4">
              <span className="font-body text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--color-primary)]">
                Join Folio
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

            <div className="mx-auto flex min-h-0 w-full max-w-[530px] flex-1 flex-col justify-center">
              <div>
                <h1 className="font-display text-[38px] leading-[1.06] tracking-tight text-[var(--color-on-surface)] sm:text-[44px]">
                  Create your account
                </h1>

                <p className="mt-3 max-w-[485px] font-body text-[14px] leading-6 text-[var(--color-on-surface-variant)]">
                  Build your editorial workspace and turn ideas into published
                  work.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignup}
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
                  ? "Connecting to Google…"
                  : "Continue with Google Workspace"}
              </button>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-[var(--color-outline-variant)]" />

                <span className="font-body text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--color-on-surface-variant)]">
                  or continue with email
                </span>

                <div className="h-px flex-1 bg-[var(--color-outline-variant)]" />
              </div>

              <form onSubmit={handleEmailSignup} className="space-y-3.5">
                <div>
                  <label
                    htmlFor="signup-name"
                    className="mb-1.5 block font-body text-[12px] font-semibold text-[var(--color-on-surface)]"
                  >
                    Full name
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
                      placeholder="Alex Rivers"
                      required
                      className="h-11 w-full rounded-[6px] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] pl-10 pr-3 font-body text-[13px] text-[var(--color-on-surface)] outline-none placeholder:text-[var(--color-outline)] transition-[border-color,box-shadow] duration-[var(--motion-fast)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="signup-email"
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
                      id="signup-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@yourdomain.com"
                      required
                      className="h-11 w-full rounded-[6px] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] pl-10 pr-3 font-body text-[13px] text-[var(--color-on-surface)] outline-none placeholder:text-[var(--color-outline)] transition-[border-color,box-shadow] duration-[var(--motion-fast)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="signup-password"
                      className="mb-1.5 block font-body text-[12px] font-semibold text-[var(--color-on-surface)]"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <Icon
                        name="lock"
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]"
                      />

                      <input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Create a password"
                        required
                        minLength={8}
                        className="h-11 w-full rounded-[6px] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] pl-10 pr-10 font-body text-[13px] text-[var(--color-on-surface)] outline-none placeholder:text-[var(--color-outline)] transition-[border-color,box-shadow] duration-[var(--motion-fast)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
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
                        <Icon
                          name={showPassword ? "eye-off" : "eye"}
                          size={17}
                        />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="signup-confirm-password"
                      className="mb-1.5 block font-body text-[12px] font-semibold text-[var(--color-on-surface)]"
                    >
                      Confirm password
                    </label>

                    <div className="relative">
                      <Icon
                        name="lock"
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]"
                      />

                      <input
                        id="signup-confirm-password"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        placeholder="Confirm your password"
                        required
                        className="h-11 w-full rounded-[6px] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] pl-10 pr-10 font-body text-[13px] text-[var(--color-on-surface)] outline-none placeholder:text-[var(--color-outline)] transition-[border-color,box-shadow] duration-[var(--motion-fast)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
                      />

                      <button
                        type="button"
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        title={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        onClick={() =>
                          setShowConfirmPassword((value) => !value)
                        }
                        className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-[var(--color-on-surface-variant)] transition-colors duration-[var(--motion-fast)] hover:text-[var(--color-on-surface)]"
                      >
                        <Icon
                          name={showConfirmPassword ? "eye-off" : "eye"}
                          size={17}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-[6px] bg-[var(--color-surface-container-low)] px-3 py-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-body text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-on-surface-variant)]">
                      Password health
                    </span>

                    <span className="font-body text-[10px] font-semibold text-[var(--color-primary)]">
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

                  <p className="mt-1.5 font-body text-[10px] leading-4 text-[var(--color-on-surface-variant)]">
                    Use 8+ characters with upper, lower, number, and symbol.
                  </p>
                </div>

                {!passwordsMatch && (
                  <p className="font-body text-[11px] text-[var(--color-primary)]">
                    Passwords do not match.
                  </p>
                )}

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(event) => setAcceptedTerms(event.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-primary)]"
                  />

                  <span className="font-body text-[11px] leading-5 text-[var(--color-on-surface-variant)]">
                    I agree to the{" "}
                    <button
                      type="button"
                      className="text-[var(--color-primary)] underline underline-offset-2"
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      className="text-[var(--color-primary)] underline underline-offset-2"
                    >
                      Privacy Policy
                    </button>
                    .
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

                <button
                  type="submit"
                  disabled={!canSubmit || submitting || googleSubmitting}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-[6px] !bg-[var(--color-primary)] px-5 font-body text-[14px] font-semibold !text-[var(--color-on-primary)] shadow-[var(--shadow-sm)] transition-[background-color,transform,opacity] duration-[var(--motion-fast)] hover:!bg-[var(--color-primary-container)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Creating account…" : "Create account"}

                  {!submitting && <Icon name="arrow-right" size={16} />}
                </button>
              </form>

              <div className="mt-3 pt-1">
                <p className="mt-7 text-center font-body text-[12px] text-[var(--color-on-surface-variant)]">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="font-medium text-[var(--color-primary)] underline underline-offset-2 transition-colors hover:text-[var(--color-primary-container)]"
                  >
                    Sign in
                  </button>
                </p>
              </div>

              <div className="mt-6 border-t border-[var(--color-outline-variant)] pt-4">
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

export default SignUp;
