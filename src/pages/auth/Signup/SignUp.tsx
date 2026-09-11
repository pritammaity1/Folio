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

  return Math.min(score, 5);
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

    case 4:
      return "Strong";

    default:
      return "Excellent";
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

  const [emailTouched, setEmailTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const passwordScore = useMemo(() => getPasswordScore(password), [password]);

  const passwordLabel = getPasswordLabel(passwordScore);

  const emailIsValid =
    email.trim().length === 0 ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const showEmailError =
    emailTouched && email.trim().length > 0 && !emailIsValid;

  const showPasswordMismatch =
    confirmPasswordTouched &&
    confirmPassword.length > 0 &&
    password !== confirmPassword;

  const canSubmit =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    emailIsValid &&
    password.length >= 8 &&
    passwordScore >= 3 &&
    password === confirmPassword &&
    acceptedTerms;

  async function handleEmailSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    setEmailTouched(true);
    setConfirmPasswordTouched(true);

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

      navigate("/dashboard", {
        replace: true,
      });
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

      navigate("/dashboard", {
        replace: true,
      });
    } catch (googleError) {
      setError(getSignupErrorMessage(googleError));
    } finally {
      setGoogleSubmitting(false);
    }
  }

  return (
    <div className="signup-page">
      <main className="signup-page__main">
        <section className="signup-layout">
          <aside className="signup-editorial-panel">
            <img
              src={signup_image}
              alt="Warm editorial desk with books, flowers, coffee, and writing materials"
              className="signup-editorial-image"
              loading="eager"
              decoding="async"
            />

            <div className="signup-editorial-overlay" aria-hidden="true" />

            <div className="signup-editorial-logo">
              <button
                type="button"
                aria-label="Go to Folio home"
                onClick={() => navigate("/")}
                className="signup-brand group"
              >
                <span className="signup-brand__mark">
                  <span className="font-display text-[23px] font-semibold leading-none">
                    F
                  </span>
                </span>

                <span className="signup-brand__name">Folio</span>
              </button>
            </div>

            <div className="signup-editorial-copy">
              <div className="signup-editorial-copy__inner">
                <p className="signup-editorial-copy__eyebrow">
                  The Folio Journal
                </p>

                <h2 className="signup-editorial-copy__title">
                  A better tomorrow begins with{" "}
                  <em>someone who writes today.</em>
                </h2>

                <div className="signup-editorial-copy__author">
                  <span
                    className="signup-editorial-copy__line"
                    aria-hidden="true"
                  />

                  <div>
                    <p className="signup-editorial-copy__author-name">
                      Marcus Ellison
                    </p>

                    <p className="signup-editorial-copy__author-role">
                      Author &amp; Educator
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="signup-editorial-footer">
              <span>Write freely</span>
              <span aria-hidden="true">|</span>
              <span>Grow your ideas</span>
              <span aria-hidden="true">|</span>
              <span>Share with the world</span>
            </div>
          </aside>

          <section className="signup-form-panel">
            <div className="signup-topbar">
              <span className="signup-topbar__eyebrow">Join Folio</span>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="signup-back-button"
              >
                <Icon name="arrow-left" size={15} />
                Back to site
              </button>
            </div>

            <div className="signup-form-shell">
              <div className="signup-heading">
                <h1 className="signup-heading__title">Create your account</h1>

                <p className="signup-heading__description">
                  Build your editorial workspace and turn ideas into published
                  work.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={googleSubmitting || submitting}
                className="signup-google-button"
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

              <div className="signup-divider">
                <span />
                <p>or continue with email</p>
                <span />
              </div>

              <form
                onSubmit={handleEmailSignup}
                className="signup-form"
                noValidate
              >
                <div
                  className="group relative z-0 transition-transform
                    duration-[var(--motion-fast)]
                    ease-[var(--ease-emphasized)]
                    focus-within:z-10
                    focus-within:scale-[1.022]"
                >
                  <label htmlFor="signup-name">Full name</label>

                  <div className="signup-input-wrapper">
                    <Icon name="user" size={17} className="signup-input-icon" />

                    <input
                      id="signup-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Alex Rivers"
                      required
                    />
                  </div>
                </div>

                <div
                  className="signup-field group relative z-0
                    transition-transform
                    duration-[var(--motion-fast)]
                    ease-[var(--ease-emphasized)]
                    focus-within:z-10
                    focus-within:scale-[1.022]"
                >
                  <label htmlFor="signup-email">Email</label>

                  <div
                    className={[
                      "signup-input-wrapper",
                      showEmailError ? "signup-input-wrapper--invalid" : "",
                    ].join(" ")}
                  >
                    <Icon name="mail" size={17} className="signup-input-icon" />

                    <input
                      id="signup-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      onBlur={() => setEmailTouched(true)}
                      placeholder="you@yourdomain.com"
                      required
                      aria-invalid={showEmailError}
                      aria-describedby={
                        showEmailError ? "signup-email-error" : undefined
                      }
                    />
                  </div>

                  {showEmailError && (
                    <p id="signup-email-error" className="signup-field-error">
                      Enter a valid email address.
                    </p>
                  )}
                </div>

                <div
                  className="signup-password-grid group relative z-0
                      transition-transform
                      duration-[var(--motion-fast)]
                      ease-[var(--ease-emphasized)]
                      focus-within:z-10
                      focus-within:scale-[1.022]"
                >
                  <div className="signup-field">
                    <label htmlFor="signup-password">Password</label>

                    <div className="signup-input-wrapper">
                      <Icon
                        name="lock"
                        size={17}
                        className="signup-input-icon"
                      />

                      <input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Create a password"
                        minLength={8}
                        required
                      />

                      <button
                        type="button"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        title={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((value) => !value)}
                        className="signup-password-toggle"
                      >
                        <Icon
                          name={showPassword ? "eye-off" : "eye"}
                          size={17}
                        />
                      </button>
                    </div>
                  </div>

                  <div
                    className="signup-field group relative z-0
                          transition-transform
                          duration-[var(--motion-fast)]
                          ease-[var(--ease-emphasized)]
                          focus-within:z-10
                          focus-within:scale-[1.022]"
                  >
                    <label htmlFor="signup-confirm-password">
                      Confirm password
                    </label>

                    <div
                      className={[
                        "signup-input-wrapper",
                        showPasswordMismatch
                          ? "signup-input-wrapper--invalid"
                          : "",
                      ].join(" ")}
                    >
                      <Icon
                        name="lock"
                        size={17}
                        className="signup-input-icon"
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
                        onBlur={() => setConfirmPasswordTouched(true)}
                        placeholder="Confirm your password"
                        required
                        aria-invalid={showPasswordMismatch}
                        aria-describedby={
                          showPasswordMismatch
                            ? "signup-password-match-error"
                            : undefined
                        }
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
                        className="signup-password-toggle"
                      >
                        <Icon
                          name={showConfirmPassword ? "eye-off" : "eye"}
                          size={17}
                        />
                      </button>
                    </div>

                    {showPasswordMismatch && (
                      <p
                        id="signup-password-match-error"
                        className="signup-field-error"
                      >
                        Passwords do not match.
                      </p>
                    )}
                  </div>
                </div>

                <div className="signup-password-health">
                  <div className="signup-password-health__header">
                    <span>Password health</span>
                    <strong>{passwordLabel}</strong>
                  </div>

                  <div className="signup-password-health__bars">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <span
                        key={level}
                        className={level <= passwordScore ? "is-active" : ""}
                      />
                    ))}
                  </div>

                  <p>
                    Use 8+ characters with upper, lower, number, and symbol.
                  </p>
                </div>

                <label className="signup-terms">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(event) => setAcceptedTerms(event.target.checked)}
                  />

                  <span>
                    I agree to the{" "}
                    <button type="button" className="signup-inline-link">
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button type="button" className="signup-inline-link">
                      Privacy Policy
                    </button>
                    .
                  </span>
                </label>

                {error && (
                  <div role="alert" className="signup-error">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit || submitting || googleSubmitting}
                  className="signup-submit-button"
                >
                  <span>
                    {submitting ? "Creating account…" : "Create account"}
                  </span>

                  {!submitting && <Icon name="arrow-right" size={16} />}
                </button>
              </form>

              <p className="!mt-[14px] text-center font-body text-[12px] leading-[1.4] text-[var(--color-on-surface-variant)]">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="!bg-transparent p-0 font-medium !text-[var(--color-primary)] underline decoration-1 underline-offset-2 transition-colors duration-[var(--motion-fast)] hover:!bg-transparent hover:!text-[var(--color-primary-container)]"
                >
                  Sign in
                </button>
              </p>
            </div>

            <div className="signup-form-footer">
              <div className="signup-form-footer__security">
                <Icon name="lock" size={12} />
                <span>Your connection is encrypted</span>
              </div>

              <div className="signup-form-footer__links">
                <button type="button">Privacy</button>
                <button type="button">Terms</button>
                <button type="button">Security</button>
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default SignUp;
