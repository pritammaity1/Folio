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

  const isBusy = submitting || googleSubmitting;

  async function handleEmailLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await configureAuthPersistence(rememberMe);

      await signInWithEmail(email.trim(), password);

      navigate("/dashboard", {
        replace: true,
      });
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

      navigate("/dashboard", {
        replace: true,
      });
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
    <div className="min-h-dvh w-full overflow-hidden bg-[var(--color-background)] text-[var(--color-on-surface)]">
      <main className="h-dvh w-full overflow-hidden max-[899px]:h-auto max-[899px]:min-h-dvh max-[899px]:overflow-visible">
        <section className="grid h-dvh w-full grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] overflow-hidden bg-[var(--color-surface)] max-[899px]:h-auto max-[899px]:grid-cols-1 max-[899px]:overflow-visible">
          <aside className="relative h-dvh min-w-0 overflow-hidden max-[899px]:h-[48dvh] max-[899px]:min-h-[380px]">
            <img
              src={login_image}
              alt="Warm editorial desk with books, manuscripts, plants, and writing tools"
              className="absolute inset-0 h-full w-full object-cover object-center"
              loading="eager"
              decoding="async"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(14,12,10,0.29)_0%,rgba(14,12,10,0.12)_42%,rgba(14,12,10,0.025)_76%,rgba(14,12,10,0)_100%),linear-gradient(180deg,rgba(15,12,10,0.13)_0%,rgba(15,12,10,0)_30%,rgba(15,12,10,0.025)_70%,rgba(15,12,10,0.19)_100%)]"
            />

            <button
              type="button"
              aria-label="Go to Folio home"
              onClick={() => navigate("/")}
              className="group absolute left-9 top-8 z-10 inline-flex items-center gap-3 max-[1100px]:left-7 max-[640px]:left-5 max-[640px]:top-5"
            >
              <span className="flex h-[42px] w-[42px] items-center justify-center rounded-[6px] !bg-[var(--color-primary)] !text-[var(--color-on-primary)] shadow-[var(--shadow-sm)] transition-transform duration-[var(--motion-fast)] ease-[var(--ease-emphasized)] group-hover:-translate-y-px">
                <span className="font-display text-[23px] font-semibold leading-none">
                  F
                </span>
              </span>

              <span className="font-display text-[26px] font-semibold tracking-[-0.02em] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.18)]">
                Folio
              </span>
            </button>

            <div className="absolute inset-x-0 bottom-0 z-10 px-[42px] pb-[98px] max-[1100px]:px-7 max-[640px]:px-5 max-[640px]:pb-[74px]">
              <div className="w-full max-w-[440px] -translate-y-10 max-[899px]:translate-y-0">
                <p className="mb-[13px] font-body text-[9px] font-bold uppercase leading-none tracking-[0.16em] text-white/90">
                  The Folio Journal
                </p>

                <blockquote className="max-w-[410px] font-display text-[clamp(30px,2.75vw,42px)] font-medium leading-[1.07] tracking-[-0.035em] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.2)]">
                  Good publishing gives every idea a{" "}
                  <em className="font-display italic text-[#d8a06f] drop-shadow-[0_2px_14px_rgba(0,0,0,0.16)]">
                    longer tomorrow.
                  </em>
                </blockquote>

                <div className="mt-[19px] flex items-start gap-[11px]">
                  <span
                    aria-hidden="true"
                    className="mt-[6px] h-px w-7 shrink-0 bg-[var(--color-primary)]"
                  />

                  <div>
                    <p className="font-body text-[11px] font-bold leading-[1.2] text-white">
                      Clara Whitmore
                    </p>

                    <p className="mt-[3px] font-body text-[9px] leading-[1.2] text-white/70">
                      Editor-in-Chief,{" "}
                      <span className="italic text-[#d8a06f]">
                        The Northern Chronicle
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-[26px] left-[38px] z-10 flex items-center gap-[9px] font-body text-[9px] leading-none text-white/75 drop-shadow-[0_1px_8px_rgba(0,0,0,0.16)] max-[1100px]:left-7 max-[640px]:bottom-[18px] max-[640px]:left-5 max-[640px]:gap-2 max-[640px]:text-[8px]">
              <span>Curate ideas</span>
              <span aria-hidden="true">|</span>
              <span>Craft narratives</span>
              <span aria-hidden="true">|</span>
              <span>Build what lasts</span>
            </div>
          </aside>

          <section className="flex h-dvh min-w-0 flex-col bg-[var(--color-surface)] px-[clamp(30px,4vw,64px)] pb-[18px] pt-7 max-[899px]:h-auto max-[899px]:min-h-[52dvh] max-[640px]:px-[18px] max-[640px]:pb-[18px] max-[640px]:pt-5">
            <div className="flex shrink-0 items-center justify-between gap-4">
              <span className="font-body text-[10px] font-bold uppercase leading-none tracking-[0.14em] text-[var(--color-primary)]">
                Member access
              </span>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-[7px] !bg-transparent font-body text-[12px] font-medium text-[var(--color-on-surface-variant)] transition-colors duration-[var(--motion-fast)] hover:!bg-transparent hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)]"
              >
                <Icon name="arrow-left" size={15} />
                Back to site
              </button>
            </div>

            <div className="mx-auto flex min-h-0 w-full max-w-[540px] flex-1 flex-col justify-center -translate-y-7 max-[1100px]:-translate-y-5 max-[899px]:my-6 max-[899px]:translate-y-0">
              <div>
                <h1 className="font-display text-[clamp(34px,3vw,45px)] font-medium leading-[1.02] tracking-[-0.04em] text-[var(--color-on-surface)]">
                  Welcome back
                </h1>

                <p className="mt-[7px] max-w-[500px] font-body text-[13px] leading-[1.45] text-[var(--color-on-surface-variant)]">
                  Sign in to return to your editorial workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isBusy}
                className="mt-[15px] flex h-[44px] min-h-[44px] w-full shrink-0 items-center justify-center gap-[11px] !rounded-[6px] !border-0 !bg-[var(--color-primary)] px-4 font-body text-[13px] font-semibold !text-[var(--color-on-primary)] shadow-[var(--shadow-sm)] transition-[background-color,transform,opacity] duration-[var(--motion-fast)] ease-[var(--ease-emphasized)] hover:!bg-[var(--color-primary-container)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
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

              <div className="my-[13px] flex items-center gap-3">
                <span className="h-px flex-1 bg-[var(--color-outline-variant)]" />

                <span className="shrink-0 font-body text-[9px] font-medium uppercase leading-none tracking-[0.09em] text-[var(--color-on-surface-variant)]">
                  or use email
                </span>

                <span className="h-px flex-1 bg-[var(--color-outline-variant)]" />
              </div>

              <form
                onSubmit={handleEmailLogin}
                noValidate
                className="flex flex-col gap-[10px]"
              >
                <div className="min-w-0">
                  <label
                    htmlFor="login-email"
                    className="mb-[5px] block font-body text-[11px] font-bold leading-[1.2] text-[var(--color-on-surface)]"
                  >
                    Email
                  </label>

                  <div className="group relative z-[1] origin-center transition-transform duration-200 ease-[var(--ease-emphasized)] focus-within:z-[3] focus-within:scale-[1.022]">
                    <Icon
                      name="mail"
                      size={17}
                      className="pointer-events-none absolute left-3 top-1/2 z-[2] -translate-y-1/2 text-[var(--color-on-surface-variant)] transition-colors duration-200 group-focus-within:text-[var(--color-primary)]"
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
                      className="block h-[42px] w-full rounded-[6px] border border-[var(--color-outline-variant)] !bg-[var(--color-surface)] pl-[39px] pr-3 font-body text-[13px] leading-none !text-[var(--color-on-surface)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:!text-[var(--color-outline)] focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_11%,transparent)]"
                    />
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="mb-[5px] flex items-center justify-between gap-3">
                    <label
                      htmlFor="login-password"
                      className="font-body text-[11px] font-bold leading-[1.2] text-[var(--color-on-surface)]"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={handlePasswordReset}
                      disabled={resetSending}
                      className="!bg-transparent p-0 font-body text-[11px] font-medium !text-[var(--color-primary)] transition-colors duration-[var(--motion-fast)] hover:!bg-transparent hover:!text-[var(--color-primary-container)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {resetSending ? "Sending…" : "Forgot password?"}
                    </button>
                  </div>

                  <div className="group relative z-[1] origin-center transition-transform duration-200 ease-[var(--ease-emphasized)] focus-within:z-[3] focus-within:scale-[1.022]">
                    <Icon
                      name="lock"
                      size={17}
                      className="pointer-events-none absolute left-3 top-1/2 z-[2] -translate-y-1/2 text-[var(--color-on-surface-variant)] transition-colors duration-200 group-focus-within:text-[var(--color-primary)]"
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
                      className="block h-[42px] w-full rounded-[6px] border border-[var(--color-outline-variant)] !bg-[var(--color-surface)] pl-[39px] pr-[40px] font-body text-[13px] leading-none !text-[var(--color-on-surface)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:!text-[var(--color-outline)] focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_11%,transparent)]"
                    />

                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      title={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-[10px] top-1/2 z-[4] flex h-5 w-5 -translate-y-1/2 items-center justify-center !bg-transparent p-0 !text-[var(--color-on-surface-variant)] transition-colors duration-[var(--motion-fast)] hover:!bg-transparent hover:!text-[var(--color-primary)] focus-visible:!text-[var(--color-primary)]"
                    >
                      <Icon name={showPassword ? "eye-off" : "eye"} size={17} />
                    </button>
                  </div>
                </div>

                <label className="flex cursor-pointer items-start gap-[9px] font-body text-[10px] leading-[1.45] text-[var(--color-on-surface-variant)]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="mt-px h-[15px] w-[15px] shrink-0 accent-[var(--color-primary)]"
                  />

                  <span>Keep me signed in on this device.</span>
                </label>

                {error && (
                  <div
                    role="alert"
                    className="rounded-[6px] border border-[color-mix(in_srgb,var(--color-primary)_28%,transparent)] bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] px-[10px] py-2 font-body text-[10px] leading-[1.45] text-[var(--color-primary)]"
                  >
                    {error}
                  </div>
                )}

                {success && (
                  <div
                    role="status"
                    className="rounded-[6px] border border-[color-mix(in_srgb,var(--color-primary)_24%,transparent)] bg-[color-mix(in_srgb,var(--color-primary)_7%,transparent)] px-[10px] py-2 font-body text-[10px] leading-[1.45] text-[var(--color-on-surface)]"
                  >
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isBusy}
                  className="mt-1 flex h-[44px] min-h-[44px] w-full shrink-0 items-center justify-center gap-2 rounded-[6px] !border-0 !bg-[var(--color-primary)] px-5 font-body text-[13px] font-semibold leading-none !text-[var(--color-on-primary)] shadow-[var(--shadow-sm)] transition-[background-color,transform,opacity] duration-[var(--motion-fast)] ease-[var(--ease-emphasized)] hover:!bg-[var(--color-primary-container)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>{submitting ? "Signing in…" : "Sign in"}</span>

                  {!submitting && <Icon name="arrow-right" size={16} />}
                </button>
              </form>

              <p className="!mt-[20px] text-center font-body text-[12px] leading-[1.4] text-[var(--color-on-surface-variant)]">
                New to Folio?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="!bg-transparent p-0 font-medium !text-[var(--color-primary)] underline decoration-1 underline-offset-2 transition-colors duration-[var(--motion-fast)] hover:!bg-transparent hover:!text-[var(--color-primary-container)]"
                >
                  Create an account
                </button>
              </p>
            </div>

            <div className="flex shrink-0 items-center justify-between gap-4 border-t border-[var(--color-outline-variant)] pt-[10px] font-body text-[9px] leading-none text-[var(--color-on-surface-variant)] max-[640px]:flex-col max-[640px]:items-start">
              <div className="inline-flex items-center gap-[7px]">
                <Icon name="lock" size={12} />

                <span>Your connection is encrypted</span>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="!bg-transparent p-0 transition-colors duration-[var(--motion-fast)] hover:!bg-transparent hover:text-[var(--color-primary)]"
                >
                  Privacy
                </button>

                <button
                  type="button"
                  className="!bg-transparent p-0 transition-colors duration-[var(--motion-fast)] hover:!bg-transparent hover:text-[var(--color-primary)]"
                >
                  Terms
                </button>

                <button
                  type="button"
                  className="!bg-transparent p-0 transition-colors duration-[var(--motion-fast)] hover:!bg-transparent hover:text-[var(--color-primary)]"
                >
                  Security
                </button>
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default Login;
