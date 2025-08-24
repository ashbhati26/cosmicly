import { Suspense } from "react";
import { LoginClient }  from "@/components/LoginClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-neutral-400">Loading…</div>}>
      <LoginClient />
    </Suspense>
  );
}
