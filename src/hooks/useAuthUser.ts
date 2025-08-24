"use client";

import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { onUserChange } from "@/services/auth";

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = onUserChange((u) => {
      setUser(u);
      setInitializing(false);
    });
    return () => unsub();
  }, []);

  return { user, initializing };
}
