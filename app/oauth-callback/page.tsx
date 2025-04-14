"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleOAuthRedirect = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const redirect = params.get("redirect") || "/";

        if (!token) {
          console.error("Token d'authentification manquant.");
          router.push("/login?error=Token+manquant");
          return;
        }

        localStorage.setItem("auth_token", token);
        router.push(redirect);
      } catch (error) {
        console.error("Erreur lors du traitement du callback OAuth :", error);
        router.push("/login?error=Erreur+lors+de+l%27authentification");
      }
    };

    handleOAuthRedirect();
  }, [router]);

  // Petit retour visuel pendant la redirection
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-500 mx-auto mb-4"></div>
        <p className="text-gray-700">Connexion en cours...</p>
      </div>
    </div>
  );
}
