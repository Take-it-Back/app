import { Suspense } from "react";
import type { Metadata } from "next";
import { Logo } from "@/components/ui";
import LoginForm from "./LoginForm";
import { enabledProviders } from "@/lib/authProviders";

export const revalidate = 300;

export const metadata: Metadata = { title: "Sign in", description: "Sign in to Take it back to see your cases, letters and deadlines.", robots: { index: false, follow: true }, alternates: { canonical: "/login" } };

export default async function LoginPage() {
  const providers = await enabledProviders();
  return (
    <main id="main" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: "32px 24px" }}>
      <Logo />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
        <Suspense>
          <LoginForm providers={providers} />
        </Suspense>
      </div>
    </main>
  );
}
