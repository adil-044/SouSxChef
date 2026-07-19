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

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
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
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (err) throw err;
      }
      const store = loadDemoStore();
      store.session = { email: email || "owner@maison.demo", name: name || "Owner" };
      store.profile.onboardingComplete = false;
      saveDemoStore(store);
      router.push("/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--ink)]">
      <Navbar entranceComplete />
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-28">
        <div className="mb-8 flex flex-col items-center text-center">
          <SynapseXLogo className="h-6 w-6 text-[var(--ember)]" />
          <SectionHeader
            eyebrow="Get started"
            title="Create your kitchen account"
            description="Set up owners first. Staff will talk through Telegram."
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
              label="Your name"
              placeholder="Adil"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@restaurant.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={configured ? 8 : undefined}
              required={configured}
            />
            {error && <p className="text-[13px] text-red-300">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating…" : "Create account"}
            </Button>
          </form>
          <p className="mt-6 text-center text-[13px] text-white/45">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--ember)] hover:underline">
              Log in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
