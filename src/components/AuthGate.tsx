"use client";

import { ReactNode, useEffect } from "react";
import { useAuthUser } from "@/hooks/useAuthUser";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGate({
  children,
  redirectTo = "/",
}: {
  children: ReactNode;
  redirectTo?: string;
}) {
  const { user, initializing } = useAuthUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!initializing && !user) {
      const next = encodeURIComponent(pathname || "/dashboard");
      router.replace(`${redirectTo}?next=${next}`);
    }
  }, [initializing, user, pathname, router, redirectTo]);

  if (initializing) return <div className="p-6 text-sm text-gray-500">Checking session…</div>;
  if (!user) return null;
  return <>{children}</>;
}
