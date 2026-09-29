"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon, EyeIcon, EyeOffIcon } from "@/components/icons";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = mode === "signup" ? "/register" : "/login";
    const body =
      mode === "signup" ? { name, email, password } : { email, password };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue");
        return;
      }

      if (mode === "signup") {
        setMode("login");
        setError(null);
      } else {
        localStorage.setItem("token", data.token);
        router.push("/");
      }
    } catch {
      setError("Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-[560px] shrink-0 flex-col justify-between overflow-hidden bg-[oklch(0.24_0.07_276)] p-12 lg:flex">
        <div className="pointer-events-none absolute -left-40 -top-44 h-[520px] w-[520px] rounded-full bg-[oklch(0.32_0.09_290/0.55)] blur-md" />
        <div className="pointer-events-none absolute -bottom-40 -right-36 h-[420px] w-[420px] rounded-full bg-[oklch(0.4_0.1_250/0.35)] blur-md" />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-white/15">
            <CheckIcon className="text-white" size={19} />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">TaskFlow</span>
        </div>

        <div className="relative z-10">
          <div className="mb-8 w-[420px] rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
            <div className="mb-3.5 flex items-center gap-2.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success">
                <CheckIcon size={12} className="text-white" />
              </div>
              <span className="text-sm font-medium text-white/60 line-through">Maquettes de la page d&apos;accueil validées</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="h-5 w-5 shrink-0 rounded-full border-2 border-white/35" />
              <span className="text-sm font-medium text-white/90">Préparer la démo client de vendredi</span>
            </div>
          </div>

          <h1 className="mb-3 max-w-[440px] text-[30px] font-extrabold leading-tight tracking-tight text-white">
            Organisez le travail de votre équipe, ensemble.
          </h1>
          <p className="max-w-[400px] text-[15px] leading-relaxed text-white/80">
            Projets, tâches et échéances au même endroit. Simple à suivre, facile à partager.
          </p>
        </div>

        <p className="relative z-10 text-[13px] text-white/60">© 2026 TaskFlow</p>
      </div>

      <div className="flex flex-1 items-center justify-center p-8 sm:p-10">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 flex rounded-[10px] bg-surface-alt p-1">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 rounded-[7px] py-2.5 text-sm font-semibold ${
                mode === "login" ? "bg-white text-text shadow-sm" : "text-text-2"
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-[7px] py-2.5 text-sm font-semibold ${
                mode === "signup" ? "bg-white text-text shadow-sm" : "text-text-2"
              }`}
            >
              Inscription
            </button>
          </div>

          <h2 className="mb-1.5 text-[22px] font-bold tracking-tight">
            {mode === "signup" ? "Créer votre compte" : "Bon retour parmi nous"}
          </h2>
          <p className="mb-7 text-sm text-text-2">
            {mode === "signup"
              ? "Commencez à organiser vos projets en moins de deux minutes."
              : "Connectez-vous pour retrouver vos projets."}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="rounded-[9px] border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}
            {mode === "signup" && (
              <label className="flex flex-col gap-1.5">
                <span className="text-[13px] font-semibold text-text/85">Nom complet</span>
                <input
                  type="text"
                  required
                  placeholder="Aya N'Dri"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 rounded-[9px] border-[1.5px] border-border px-3.5 text-sm focus:border-accent focus:outline-none focus:ring-3 focus:ring-accent/15"
                />
              </label>
            )}
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-text/85">Adresse email</span>
              <input
                type="email"
                required
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-[9px] border-[1.5px] border-border px-3.5 text-sm focus:border-accent focus:outline-none focus:ring-3 focus:ring-accent/15"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-text/85">Mot de passe</span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-[9px] border-[1.5px] border-border px-3.5 pr-11 text-sm focus:border-accent focus:outline-none focus:ring-3 focus:ring-accent/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center text-text-2 hover:text-text"
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </label>

            {mode === "signup" && (
              <label className="mt-1 flex items-start gap-2.5">
                <input type="checkbox" required className="mt-1 h-[18px] w-[18px] shrink-0 accent-[oklch(0.56_0.19_276)]" />
                <span className="text-[13px] leading-relaxed text-text-2">
                  J&apos;accepte les <a className="text-accent hover:text-accent-hover">conditions d&apos;utilisation</a> et la{" "}
                  <a className="text-accent hover:text-accent-hover">politique de confidentialité</a>.
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-[46px] rounded-[9px] bg-accent text-[14.5px] font-bold text-white hover:bg-accent-hover disabled:opacity-60"
            >
              {loading
                ? "Veuillez patienter..."
                : mode === "signup"
                ? "Créer mon compte"
                : "Se connecter"}
            </button>
          </form>

          <p className="mt-6 text-center text-[13.5px] text-text-2">
            {mode === "signup" ? (
              <>
                Déjà inscrit ?{" "}
                <button onClick={() => setMode("login")} className="text-accent hover:text-accent-hover">
                  Connectez-vous
                </button>
              </>
            ) : (
              <>
                Pas encore de compte ?{" "}
                <button onClick={() => setMode("signup")} className="text-accent hover:text-accent-hover">
                  Inscrivez-vous
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
