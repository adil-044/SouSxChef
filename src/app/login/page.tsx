"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Badge, Button, Card, Input, SectionHeader } from "@/components/ui/primitives";
import { SynapseXLogo } from "@/components/ui/SynapseXLogo";
import { loadDemoStore, saveDemoStore } from "@/lib/demo-store";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const configured = isSupabaseConfigured();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (configured) {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      } else {
        const store = loadDemoStore();
        store.session = { email: email || "owner@maison.demo", name: "Owner" };
        saveDemoStore(store);
      }
      const store = loadDemoStore();
      router.push(store.profile.onboardingComplete ? "/dashboard" : "/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const continueDemo = () => {
    const store = loadDemoStore();
    store.session = { email: "demo@sousxchef.local", name: "Demo Owner" };
    saveDemoStore(store);
    router.push(store.profile.onboardingComplete ? "/dashboard" : "/onboarding");
  };

  return (
    <div className="min-h-screen bg-[var(--ink)]">
      <Navbar entranceComplete />
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-28">
        <div className="mb-8 flex flex-col items-center text-center">
          <SynapseXLogo className="h-6 w-6 text-[var(--ember)]" />
          <SectionHeader
            eyebrow="Welcome back"
            title="Log in to your kitchen"
            description="Owners sign in to inventory, labor, chat, and forecast."
            align="center"
          />
          {!configured && (
            <div className="mt-4">
              <Badge tone="warn">Demo mode — Supabase keys not set</Badge>
            </div>
          )}
        </div>

        <Card>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@restaurant.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={configured}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={configured}
            />
            {error && <p className="text-[13px] text-red-300">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in…" : "Log in"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
              or
            </span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <Button variant="secondary" className="w-full" onClick={continueDemo}>
            Continue in demo mode
          </Button>

          <p className="mt-6 text-center text-[13px] text-white/45">
            New kitchen?{" "}
            <Link href="/signup" className="text-[var(--ember)] hover:underline">
              Create account
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
