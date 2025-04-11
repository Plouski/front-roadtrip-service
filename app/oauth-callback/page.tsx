"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function OAuthCallback() {
  const router = useRouter();
  
  useEffect(() => {
    // Fonction pour traiter les paramètres d'URL
    const handleCallback = () => {
      try {
        // Récupérer le token et la redirection depuis l'URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const redirect = params.get('redirect') || '/';
        
        if (!token) {
          console.error("Token d'authentification manquant");
          router.push('/login?error=Token+manquant');
          return;
        }
        
        // Stocker le token dans localStorage
        localStorage.setItem('auth_token', token);
        
        // Rediriger immédiatement vers le dashboard sans afficher de page intermédiaire
        router.push(redirect);
      } catch (error) {
        console.error("Erreur lors du traitement du callback OAuth:", error);
        router.push('/login?error=Erreur+lors+de+l%27authentification');
      }
    };
    
    handleCallback();
  }, [router]);

  // Composant vide - ne sera jamais affiché car on redirige immédiatement
  return null;
}