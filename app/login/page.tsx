import { Suspense } from "react";
import type { Metadata } from "next";
import { Logo } from "@/components/ui";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Sign in", description: "Sign in to Take it back to see your cases, letters and deadlines.", robots: { index: false, follow: true }, alternates: { canonical: "/login" } };

export default function LoginPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: "32px 24px" }}>
      <Logo />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
