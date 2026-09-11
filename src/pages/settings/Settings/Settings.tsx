import { useEffect, useState } from "react";
import { updateProfile, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import { Icon } from "../../../components/ui/Icon/Icon";
import { auth, sendPasswordReset } from "../../../services/firebase/auth";
import { db } from "../../../services/firebase/firestore";

type UserRole = "admin" | "editor" | "author";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "F";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 1).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatRole(role: UserRole | null) {
  switch (role) {
    case "admin":
      return "Administrator";

    case "editor":
      return "Editor";

    case "author":
      return "Author";

    default:
      return "User";
  }
}

export default function Settings() {
  const currentUser = auth.currentUser;

  const [displayName, setDisplayName] = useState(
    currentUser?.displayName?.trim() || currentUser?.email?.split("@")[0] || "",
  );

  const [email, setEmail] = useState(currentUser?.email ?? "");

  const [role, setRole] = useState<UserRole | null>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [sendingReset, setSendingReset] = useState(false);

  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const user = auth.currentUser;

      if (!user) {
        if (active) {
          setLoading(false);
        }

        return;
      }

      try {
        const profileSnapshot = await getDoc(doc(db, "users", user.uid));

        if (!active) {
          return;
        }

        if (profileSnapshot.exists()) {
          const data = profileSnapshot.data();

          if (
            data.role === "admin" ||
            data.role === "editor" ||
            data.role === "author"
          ) {
            setRole(data.role);
          }

          if (typeof data.name === "string" && data.name.trim()) {
            setDisplayName(data.name.trim());
          }

          if (typeof data.email === "string" && data.email.trim()) {
            setEmail(data.email.trim());
          }
        }
      } catch (profileError) {
        console.error("Failed to load user profile.", profileError);

        toast.error(
          profileError instanceof Error
            ? profileError.message
            : "Unable to load your profile.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  async function handleSaveProfile() {
    const user = auth.currentUser;

    if (!user) {
      toast.error("You must be signed in to update your profile.");
      return;
    }

    const trimmedName = displayName.trim();

    if (!trimmedName) {
      toast.error("Display name cannot be empty.");
      return;
    }

    setSaving(true);

    try {
      await updateProfile(user, {
        displayName: trimmedName,
      });

      await updateDoc(doc(db, "users", user.uid), {
        name: trimmedName,
      });

      await updateDoc(doc(db, "publicAuthors", user.uid), {
        name: trimmedName,
      });

      setDisplayName(trimmedName);

      toast.success("Profile updated successfully.");
    } catch (saveError) {
      console.error("Failed to update profile.", saveError);

      toast.error(
        saveError instanceof Error
          ? saveError.message
          : "Unable to update your profile.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordReset() {
    const user = auth.currentUser;

    if (!user?.email) {
      toast.error("Your account does not have a usable email address.");
      return;
    }

    setSendingReset(true);

    try {
      await sendPasswordReset(user.email);

      toast.success(
        "A password-reset link has been sent to your email address.",
      );
    } catch (resetError) {
      console.error("Failed to send password reset email.", resetError);

      toast.error(
        resetError instanceof Error
          ? resetError.message
          : "Unable to send the password-reset email.",
      );
    } finally {
      setSendingReset(false);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);

    try {
      await signOut(auth);
    } catch (signOutError) {
      console.error("Failed to sign out.", signOutError);

      toast.error(
        signOutError instanceof Error
          ? signOutError.message
          : "Unable to sign out.",
      );

      setSigningOut(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-full">
        <div className="w-full px-5 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="h-3 w-20 animate-pulse rounded bg-[var(--color-surface-container-low)]" />

          <div className="mt-4 h-11 w-52 animate-pulse rounded bg-[var(--color-surface-container-low)]" />

          <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-[var(--color-surface-container-low)]" />

          <div className="mt-10 space-y-10">
            <div className="h-72 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface-container-low)]" />

            <div className="h-44 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface-container-low)]" />
          </div>
        </div>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main className="min-h-full">
        <div className="flex min-h-[65vh] w-full items-center justify-center px-5 sm:px-8 lg:px-10">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)]">
              <Icon name="lock" size={19} />
            </div>

            <p className="mt-5 font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
              Settings
            </p>

            <h1 className="mt-2 font-display text-[30px] tracking-[-0.03em] text-[var(--color-on-surface)]">
              Sign in required
            </h1>

            <p className="mt-3 font-body text-[12px] leading-5 text-[var(--color-on-surface-variant)]">
              Sign in to manage your Folio account settings.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const initials = getInitials(displayName || email);

  return (
    <main className="min-h-full">
      <div className="w-full px-5 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <div className="w-full max-w-[1180px]">
          <header className="border-b border-[var(--color-outline-variant)] pb-8">
            <p className="font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
              Workspace
            </p>

            <h1 className="mt-2 font-display text-[40px] leading-none tracking-[-0.04em] text-[var(--color-on-surface)] sm:text-[46px]">
              Settings
            </h1>

            <p className="mt-3 max-w-xl font-body text-[13px] leading-6 text-[var(--color-on-surface-variant)]">
              Manage your account and workspace details.
            </p>
          </header>

          <section className="mt-8">
            <div className="border-b border-[var(--color-outline-variant)] pb-5">
              <p className="font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
                Account
              </p>

              <h2 className="mt-1 font-display text-[28px] tracking-[-0.025em] text-[var(--color-on-surface)]">
                Profile
              </h2>
            </div>

            <div className="py-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[8px] bg-[var(--color-primary)] text-[var(--color-on-primary)]">
                  <span className="font-display text-[23px] font-semibold">
                    {initials}
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="font-body text-[16px] font-semibold text-[var(--color-on-surface)]">
                    {displayName || "Folio user"}
                  </p>

                  <p className="mt-1 truncate font-body text-[12px] text-[var(--color-on-surface-variant)]">
                    {email}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-on-surface-variant)]">
                    Display name
                  </span>

                  <input
                    type="text"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    maxLength={80}
                    className="mt-2 h-10 w-full rounded-[7px] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-3.5 font-body text-[13px] text-[var(--color-on-surface)] outline-none transition-[border-color,box-shadow] duration-[var(--motion-fast)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color:var(--color-primary)/0.12]"
                  />
                </label>

                <div>
                  <span className="font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-on-surface-variant)]">
                    Email
                  </span>

                  <div className="mt-2 flex h-10 items-center rounded-[7px] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] px-3.5">
                    <span className="truncate font-body text-[13px] text-[var(--color-on-surface-variant)]">
                      {email}
                    </span>
                  </div>

                  <p className="mt-2 font-body text-[10px] leading-4 text-[var(--color-on-surface-variant)]">
                    Email changes require account re-authentication.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4 border-t border-[var(--color-outline-variant)] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-body text-[11px] leading-5 text-[var(--color-on-surface-variant)]">
                  Your display name is also used for your public author profile.
                </p>

                <button
                  type="button"
                  onClick={() => void handleSaveProfile()}
                  disabled={saving}
                  className={[
                    "inline-flex h-10 items-center justify-center gap-2",
                    "rounded-[7px]",
                    "!bg-[var(--color-primary)]",
                    "px-4",
                    "font-body text-[11px] font-semibold",
                    "!text-[var(--color-on-primary)]",
                    "shadow-[var(--shadow-sm)]",
                    "transition-[background-color,box-shadow,transform,opacity]",
                    "duration-[var(--motion-fast)]",
                    "hover:!bg-[var(--color-primary-container)]",
                    "hover:shadow-[var(--shadow-md)]",
                    "active:translate-y-px",
                    "disabled:cursor-not-allowed",
                    "disabled:opacity-50",
                    "sm:self-end",
                  ].join(" ")}
                >
                  <Icon
                    name="save"
                    size={14}
                    className="!text-[var(--color-on-primary)]"
                  />

                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </section>

          <section className="mt-8 border-t border-[var(--color-outline-variant)] pt-8">
            <div className="border-b border-[var(--color-outline-variant)] pb-5">
              <p className="font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
                Security
              </p>

              <h2 className="mt-1 font-display text-[28px] tracking-[-0.025em] text-[var(--color-on-surface)]">
                Account security
              </h2>
            </div>

            <div className="divide-y divide-[var(--color-outline-variant)]">
              <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[7px] bg-[var(--color-surface-container-low)] text-[var(--color-primary)]">
                    <Icon name="lock" size={17} />
                  </div>

                  <div>
                    <p className="font-body text-[13px] font-semibold text-[var(--color-on-surface)]">
                      Password
                    </p>

                    <p className="mt-1 max-w-lg font-body text-[11px] leading-5 text-[var(--color-on-surface-variant)]">
                      Send a secure password-reset link to your account email.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => void handlePasswordReset()}
                  disabled={sendingReset}
                  className={[
                    "inline-flex h-9 shrink-0 items-center justify-center",
                    "rounded-[7px]",
                    "border border-[color:var(--color-primary)/0.32]",
                    "!bg-[var(--color-surface)]",
                    "px-3.5",
                    "font-body text-[11px] font-semibold",
                    "!text-[var(--color-primary)]",
                    "transition-[background-color,border-color,color,box-shadow,transform]",
                    "duration-[var(--motion-fast)]",
                    "hover:!border-[var(--color-primary)]",
                    "hover:!bg-[var(--color-primary)]",
                    "hover:!text-[var(--color-on-primary)]",
                    "hover:shadow-[var(--shadow-sm)]",
                    "active:translate-y-px",
                    "disabled:cursor-not-allowed",
                    "disabled:opacity-50",
                  ].join(" ")}
                >
                  {sendingReset ? "Sending..." : "Reset password"}
                </button>
              </div>

              <div className="flex items-start gap-4 py-6">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[7px] bg-[var(--color-surface-container-low)] text-[var(--color-primary)]">
                  <Icon name="check-circle" size={17} />
                </div>

                <div>
                  <p className="font-body text-[13px] font-semibold text-[var(--color-on-surface)]">
                    Current session
                  </p>

                  <p className="mt-1 font-body text-[11px] leading-5 text-[var(--color-on-surface-variant)]">
                    Signed in as{" "}
                    <span className="font-medium text-[var(--color-on-surface)]">
                      {email}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 border-t border-[var(--color-outline-variant)] pt-8">
            <div className="border-b border-[var(--color-outline-variant)] pb-5">
              <p className="font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
                Workspace
              </p>

              <h2 className="mt-1 font-display text-[28px] tracking-[-0.025em] text-[var(--color-on-surface)]">
                Folio Studio
              </h2>
            </div>

            <div className="divide-y divide-[var(--color-outline-variant)]">
              <div className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-body text-[13px] font-semibold text-[var(--color-on-surface)]">
                    Workspace
                  </p>

                  <p className="mt-1 font-body text-[11px] text-[var(--color-on-surface-variant)]">
                    Your editorial publishing workspace
                  </p>
                </div>

                <span className="font-body text-[12px] font-semibold text-[var(--color-on-surface)]">
                  Folio Studio
                </span>
              </div>

              <div className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-body text-[13px] font-semibold text-[var(--color-on-surface)]">
                    Role
                  </p>

                  <p className="mt-1 font-body text-[11px] text-[var(--color-on-surface-variant)]">
                    Your current access level
                  </p>
                </div>

                <span className="font-body text-[12px] font-semibold text-[var(--color-primary)]">
                  {formatRole(role)}
                </span>
              </div>
            </div>
          </section>

          <section className="mt-8 border-t border-[var(--color-outline-variant)] pt-8 pb-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-body text-[13px] font-semibold text-[var(--color-on-surface)]">
                  Sign out
                </p>

                <p className="mt-1 font-body text-[11px] text-[var(--color-on-surface-variant)]">
                  End your current Folio session on this device.
                </p>
              </div>

              <button
                type="button"
                onClick={() => void handleSignOut()}
                disabled={signingOut}
                className={[
                  "inline-flex h-9 items-center justify-center gap-2",
                  "rounded-[7px]",
                  "border border-red-200",
                  "!bg-[var(--color-surface)]",
                  "px-3.5",
                  "font-body text-[11px] font-semibold",
                  "!text-red-600",
                  "transition-[background-color,border-color,color,box-shadow,transform]",
                  "duration-[var(--motion-fast)]",
                  "hover:!border-red-600",
                  "hover:!bg-red-600",
                  "hover:!text-white",
                  "hover:shadow-[0_4px_12px_rgba(220,38,38,0.16)]",
                  "active:translate-y-px",
                  "disabled:cursor-not-allowed",
                  "disabled:opacity-50",
                ].join(" ")}
              >
                <Icon name="logout" size={14} />

                {signingOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
