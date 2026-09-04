import { useState } from "react";

type AuthUser = {
  displayName: string | null;
  email: string | null;
};

export function useAuth() {
  const [user] = useState<AuthUser | null>({
    displayName: "Pritam",
    email: "pritam@example.com",
  });

  return {
    user,
    loading: false,
  };
}
