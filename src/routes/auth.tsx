import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Truck } from "lucide-react";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/" });
  }, [session, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to verify.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Logged in");
        navigate({ to: "/" });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) toast.error("Google sign-in failed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Tripsheet Portal</h1>
            <p className="text-xs text-muted-foreground">Vehicle Verification System</p>
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-4">
          {mode === "login" ? "Sign in to your account" : "Create an account"}
        </h2>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} required onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} required minLength={6} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Please wait..." : mode === "login" ? "Login" : "Sign up"}
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
          <span className="relative bg-card px-2 text-xs text-muted-foreground left-1/2 -translate-x-1/2">OR</span>
        </div>

        <Button variant="outline" className="w-full" onClick={google}>
          Continue with Google
        </Button>

        <p className="text-sm text-center mt-6 text-muted-foreground">
          {mode === "login" ? "No account?" : "Have an account?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-primary font-medium hover:underline"
          >
            {mode === "login" ? "Sign up" : "Login"}
          </button>
        </p>
      </Card>
    </div>
  );
}
