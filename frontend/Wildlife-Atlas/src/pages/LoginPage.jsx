import { useState } from "react";
import { z } from "zod";
import { GalleryVerticalEnd, Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth";





const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional().default(false),
});

export default function LoginPage({ apiUrl, onSuccess, onError, brand = "Wildlife Atlas" }) {
  return (
    <>
      
      <div className="grid min-h-svh lg:grid-cols-2">
        {/* Left column: brand + form */}
        <div className="flex flex-col gap-6 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            {brand}
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm apiUrl={apiUrl} onSuccess={onSuccess} onError={onError} />
              <Separator className="my-6" />
              <SocialRow />
            </CardContent>
          </Card>
        </div>

        <p className="text-balance text-center text-xs text-muted-foreground">
          By continuing, you agree to our <a className="underline underline-offset-4" href="#">Terms</a> and <a className="underline underline-offset-4" href="#">Privacy Policy</a>.
        </p>
      </div>

      {/* Right column: visual */}
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-lime-100 to-amber-100" />
        <div className="relative z-10 flex h-full items-center justify-center p-8">
          <div className="max-w-md text-center">
            <h2 className="text-3xl font-semibold tracking-tight">Explore. Learn. Protect.</h2>
            <p className="mt-3 text-muted-foreground">
              Log in to manage content, track favorites, and personalize your wildlife journey.
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

function LoginForm({ apiUrl = "http://localhost:5000", onSuccess, onError }) {
  const [values, setValues] = useState({ email: "", password: "", remember: false });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

async function handleSubmit(e) {
  e.preventDefault();
  setError("");

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message || "Invalid form";
    setError(first);
    onError?.(first);
    return;
  }

  try {
    setLoading(true);
    const token = await login({
      email: values.email,
      password: values.password,
      remember: values.remember,
    });
    onSuccess?.(token);
    // default navigate if parent didn't override
    if (!onSuccess) navigate("/");
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unexpected error";
    setError(msg);
    onError?.(msg);
  } finally {
    setLoading(false);
  }
}

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 opacity-60" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="pl-9"
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <a className="text-xs text-muted-foreground underline underline-offset-4" href="#">Forgot password?</a>
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 opacity-60" />
          <Input
            id="password"
            type={showPw ? "text" : "password"}
            placeholder="••••••••"
            className="pl-9 pr-10"
            value={values.password}
            onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
            required
            minLength={6}
          />
          <button
            type="button"
            aria-label={showPw ? "Hide password" : "Show password"}
            onClick={() => setShowPw((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="remember"
          checked={values.remember}
          onCheckedChange={(c) => setValues((v) => ({ ...v, remember: Boolean(c) }))}
        />
        <Label htmlFor="remember" className="text-sm text-muted-foreground">Remember me</Label>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <span className="inline-flex items-center gap-2"><Loader2 className="size-4 animate-spin" /> Signing in…</span>
        ) : (
          "Sign in"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        New here? <a className="underline underline-offset-4" href="#">Create an account</a>
      </p>
    </form>
  );
}

function SocialRow() {
  return (
    <div className="grid gap-3">
      <Button variant="outline" className="w-full">Continue with Google</Button>
      <Button variant="outline" className="w-full">Continue with Facebook</Button>
      <p className="text-center text-xs text-muted-foreground">
        Social logins are optional — they can be wired to your OAuth flow later.
      </p>
    </div>
  );
}

async function safeMessage(res) {
  try {
    const t = await res.text();
    const data = JSON.parse(t);
    return data?.message || data?.error || t || undefined;
  } catch {
    return undefined;
  }
}
