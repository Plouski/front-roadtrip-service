// Point d'entrée pour l'URL du service d'authentification
const API_GATEWAY_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "https://api.example.com";

export const AuthService = {
    /**
     * Connexion de l'utilisateur
     */
    async login(email, password) {
        try {
            const response = await fetch(`${API_GATEWAY_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Échec de connexion");
            }

            const data = await response.json();

            // Stockage du token
            const token = data.tokens?.accessToken || data.token;
            if (token) localStorage.setItem("auth_token", token);

            return data;
        } catch (error) {
            console.error("Erreur pendant la connexion:", error);
            throw error;
        }
    },

    /**
     * Inscription d'un nouvel utilisateur
     */
    async register(email, password, firstName, lastName) {
        try {
            const response = await fetch(`${API_GATEWAY_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, firstName, lastName }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Échec d'inscription");
            }

            return await response.json();
        } catch (error) {
            console.error("Erreur d'inscription:", error);
            throw error;
        }
    },

    /**
     * Vérifie la validité du token JWT
     */
    async checkAuthentication() {
        const token = localStorage.getItem("auth_token");
        if (!token) return false;

        try {
            const response = await fetch(`${API_GATEWAY_URL}/auth/verify-token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });

            if (!response.ok) {
                console.warn("Token invalide ou expiré, suppression...");
                localStorage.removeItem("auth_token");
                return false;
            }

            const data = await response.json();
            if (!data?.valid || !data?.user) {
                console.warn("Données utilisateur invalides, suppression du token...");
                localStorage.removeItem("auth_token");
                return false;
            }

            return true;
        } catch (error) {
            console.warn("Échec de vérification du token:", error);
            localStorage.removeItem("auth_token");
            return false;
        }
    },

    /**
     * Déconnexion de l'utilisateur
     */
    async logout() {
        try {
            const token = this.getAuthToken();

            if (token) {
                await fetch(`${API_GATEWAY_URL}/auth/logout`, {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${token}` },
                }).catch(err => console.warn("Erreur lors de la déconnexion du serveur:", err));
            }
        } catch (error) {
            console.error("Erreur pendant la déconnexion:", error);
        } finally {
            localStorage.removeItem("auth_token");
            console.log("Token supprimé, déconnexion réussie");
        }
    },

    /**
     * Authentification via un fournisseur OAuth
     */
    socialLogin(provider) {
        try {
            let url;
            switch (provider.toLowerCase()) {
                case 'google':
                    url = `${API_GATEWAY_URL}/auth/oauth/google`;
                    break;
                case 'facebook':
                    url = `${API_GATEWAY_URL}/auth/oauth/facebook/callback`;
                    break;
                case 'github':
                    url = `${API_GATEWAY_URL}/auth/oauth/github`;
                    break;
                default:
                    throw new Error(`Fournisseur d'authentification non supporté: ${provider}`);
            }

            // Redirection vers le fournisseur OAuth
            window.location.href = url;

            // La promesse ne se résout jamais à cause de la redirection
            return new Promise(() => { });
        } catch (error) {
            console.error(`Erreur lors de l'authentification ${provider}:`, error);
            return Promise.reject(error);
        }
    },

    /**
     * Récupération du profil utilisateur
     */
    async getProfile() {
        try {
            const token = this.getAuthToken();
            if (!token) throw new Error("Non authentifié");

            const response = await fetch(`${API_GATEWAY_URL}/auth/profile`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` },
            });

            if (!response.ok) {
                if (response.status === 401) throw new Error("Session expirée, veuillez vous reconnecter");

                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de la récupération du profil");
            }

            const data = await response.json();
            return data.user;
        } catch (error) {
            console.error("Erreur lors de la récupération du profil:", error);
            throw error;
        }
    },

    /**
     * Mise à jour du profil utilisateur
     */
    async updateProfile(profileData) {
        try {
            const token = this.getAuthToken();
            if (!token) throw new Error("Non authentifié");

            const response = await fetch(`${API_GATEWAY_URL}/auth/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(profileData),
            });

            if (!response.ok) {
                if (response.status === 401) throw new Error("Session expirée, veuillez vous reconnecter");

                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de la mise à jour du profil");
            }

            const data = await response.json();
            return data.user;
        } catch (error) {
            console.error("Erreur lors de la mise à jour du profil:", error);
            throw error;
        }
    },

    /**
     * Changement de mot de passe
     */
    async changePassword(currentPassword, newPassword) {
        try {
            const token = this.getAuthToken();
            if (!token) throw new Error("Non authentifié");

            const response = await fetch(`${API_GATEWAY_URL}/auth/change-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors du changement de mot de passe");
            }

            const data = await response.json();
            return data.message;
        } catch (error) {
            console.error("Erreur lors du changement de mot de passe:", error);
            throw error;
        }
    },

    /**
     * Récupère le token stocké en local
     */
    getAuthToken() {
        return localStorage.getItem("auth_token");
    },

    async isAdmin() {
        const user = await this.getProfile()
        return user?.role === 'admin'
    },

    async getAuthHeaders() {
        const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

        return {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    }

};
