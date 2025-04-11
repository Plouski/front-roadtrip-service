const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "https://api.example.com"

export const AuthService = {

    // Connexion
    async login(email, password) {
        try {
            const response = await fetch(`${API_GATEWAY_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || "Échec de connexion";
                throw new Error(errorMessage);
            }
    
            const data = await response.json();
            
            // Stockage du token
            if (data.tokens && data.tokens.accessToken) {
                localStorage.setItem("auth_token", data.tokens.accessToken);
            } else if (data.token) {
                localStorage.setItem("auth_token", data.token);
            }
            
            return data;
        } catch (error) {
            console.error("Erreur pendant la connexion:", error);
            throw error;
        }
    },    

    // Inscription
    async register(email, password, firstName, lastName) {
        try {
            const response = await fetch(`${API_GATEWAY_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, firstName, lastName }),
            })

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || "Échec d'inscription";
                throw new Error(errorMessage);
            }

            return await response.json()
        } catch (error) {
            console.error("Erreur d'inscription:", error)
            throw error
        }
    },

    // Authentification
    async checkAuthentication() {
        const token = localStorage.getItem("auth_token");
        if (!token) return false;

        try {
            // Vérifier le token avec le backend
            const response = await fetch(`${API_GATEWAY_URL}/auth/verify-token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token })
            });
            
            // Si la réponse n'est pas OK, supprimer le token et retourner false
            if (!response.ok) {
                console.warn("Token invalide ou expiré, suppression...");
                localStorage.removeItem("auth_token");
                return false;
            }
            
            // Vérifier que la réponse contient bien un utilisateur valide
            const data = await response.json();
            if (!data || !data.valid || !data.user) {
                console.warn("Données utilisateur invalides, suppression du token...");
                localStorage.removeItem("auth_token");
                return false;
            }
            
            return true;
        } catch (error) {
            console.warn("Échec de vérification du token:", error);
            localStorage.removeItem("auth_token"); // Supprimer le token en cas d'erreur
            return false;
        }
    },

    // Obtention du token d'authentification
    getAuthToken() {
        return localStorage.getItem("auth_token")
    },

    // Deconnexion
    async logout() {
        try {
            const token = this.getAuthToken();
            
            // Informer le serveur de la déconnexion (optionnel)
            if (token) {
                await fetch(`${API_GATEWAY_URL}/auth/logout`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }).catch(err => console.warn("Erreur lors de la déconnexion du serveur:", err));
            }
        } catch (error) {
            console.error("Erreur pendant la déconnexion:", error);
        } finally {
            // Toujours supprimer le token localement
            localStorage.removeItem("auth_token");
            console.log("Token supprimé, déconnexion réussie");
        }
    },

    // Nettoyage d'urgence des tokens - utile pour déboguer les problèmes d'authentification
    clearAuthData() {
        localStorage.removeItem("auth_token");
        console.log("Données d'authentification supprimées, rafraîchissement de la page...");
        window.location.reload();
    },

    // Méthode pour l'authentification avec des fournisseurs OAuth (redirection directe)
    socialLogin(provider) {
        try {
            // Déterminer l'URL en fonction du fournisseur
            let url;
            switch(provider.toLowerCase()) {
                case 'google':
                    url = `${API_GATEWAY_URL}/auth/oauth/google`;
                    break;
                case 'facebook':
                    url = `${API_GATEWAY_URL}/auth/oauth/facebook`;
                    break;
                case 'github':
                    url = `${API_GATEWAY_URL}/auth/oauth/github`;
                    break;
                default:
                    throw new Error(`Fournisseur d'authentification non supporté: ${provider}`);
            }
            
            // Redirection directe vers le service d'authentification OAuth
            window.location.href = url;
            
            // Retourner une promesse qui ne sera jamais résolue puisqu'on est redirigé
            return new Promise(() => {});
        } catch (error) {
            console.error(`Erreur lors de l'authentification ${provider}:`, error);
            return Promise.reject(error);
        }
    }
}