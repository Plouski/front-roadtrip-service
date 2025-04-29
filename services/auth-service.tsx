// Point d'entrée pour l'URL du service d'authentification
const API_GATEWAY_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "https://api.example.com";

export const AuthService = {

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
     * Déconnexion de l'utilisateur avec nettoyage complet des données
     */
    async logout() {
        try {
            const token = this.getAuthToken();

            if (token) {
                // Appel à l'API de déconnexion si un token est présent
                await fetch(`${API_GATEWAY_URL}/auth/logout`, {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${token}` },
                }).catch(err => console.warn("Erreur lors de la déconnexion du serveur:", err));
            }
        } catch (error) {
            console.error("Erreur pendant la déconnexion:", error);
        } finally {
            // Supprimer TOUTES les données utilisateur du localStorage
            localStorage.removeItem("auth_token");
            localStorage.removeItem("userRole");
            localStorage.removeItem("userId");
            localStorage.removeItem("pushToken");

            console.log("Données utilisateur supprimées, déconnexion réussie");
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
            if (typeof window === "undefined") return null;

            const token = localStorage.getItem("auth_token");
            if (!token) return null;

            const res = await fetch(`${API_GATEWAY_URL}/auth/profile`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                localStorage.removeItem("auth_token");
                return null;
            }

            const data = await res.json();
            return data.user;
        } catch (e) {
            console.warn("Erreur getProfile:", e.message);
            return null;
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

    getUserId() {
        return localStorage.getItem("userId");
    },

    /**
     * Récupère le rôle de l'utilisateur (synchrone)
     * Utilise la valeur en cache dans localStorage
     */
    getUserRole() {
        const role = localStorage.getItem("userRole");

        if (role) {
            const normalizedRole = role.toLowerCase();
            if (normalizedRole === 'admin') return 'admin';
            if (normalizedRole === 'premium') return 'premium';
            return normalizedRole;
        }

        console.log('Aucun rôle trouvé dans localStorage');
        return null;
    },

    /**
     * Récupère le rôle de l'utilisateur de manière asynchrone
     * Si le rôle n'est pas en cache, fait un appel API pour l'obtenir
     */
    async getUserRoleAsync() {
        // 1. Essayer d'abord de récupérer le rôle du localStorage
        const cachedRole = this.getUserRole();
        if (cachedRole) return cachedRole;

        // 2. Si pas de rôle en cache, mais token présent, essayer de récupérer depuis l'API
        const token = this.getAuthToken();
        if (!token) return null;

        try {
            const userData = await this.getProfile();

            if (userData && userData.role) {
                // Stocker le rôle dans localStorage pour les prochains accès
                const role = userData.role.toLowerCase();
                localStorage.setItem("userRole", role);
                return role;
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du rôle:', error);
        }

        return null;
    },

    /**
     * Vérifie l'authentification et le rôle de l'utilisateur en une seule méthode
     * @returns {Promise<{isAuthenticated: boolean, role: string|null}>}
     */
    async checkAuthenticationAndRole() {
        try {
            const isAuthenticated = await this.checkAuthentication();

            if (!isAuthenticated) {
                return { isAuthenticated: false, role: null };
            }

            // Utilisateur authentifié, récupérer son rôle (d'abord depuis le cache, puis depuis l'API si nécessaire)
            const role = await this.getUserRoleAsync();

            return {
                isAuthenticated: true,
                role: role,
                // Fonction optionnelle pour utilisation ultérieure
                setup: () => {
                    if (typeof window !== "undefined" && role) {
                        localStorage.setItem("userRole", role);
                    }
                }
            };
        } catch (error) {
            console.error("Erreur lors de la vérification de l'authentification:", error);
            return { isAuthenticated: false, role: null };
        }
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
    },

    async initiatePasswordReset(email) {
        try {
            const response = await fetch(`${API_GATEWAY_URL}/auth/initiate-password-reset`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de la demande de réinitialisation");
            }

            return await response.json();
        } catch (error) {
            console.error("Erreur lors de la demande de réinitialisation:", error);
            throw error;
        }
    },

    async initiatePasswordResetBySMS(phoneNumber) {
        try {
            const response = await fetch(`${API_GATEWAY_URL}/auth/initiate-password-reset-sms`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phoneNumber }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de la demande de réinitialisation par SMS");
            }

            return await response.json();
        } catch (error) {
            console.error("Erreur lors de la demande de réinitialisation par SMS:", error);
            throw error;
        }
    },

    async resetPassword(email, resetCode, newPassword) {
        try {
            const response = await fetch(`${API_GATEWAY_URL}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, resetCode, newPassword }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de la réinitialisation du mot de passe");
            }

            return await response.json();
        } catch (error) {
            console.error("Erreur lors de la réinitialisation du mot de passe:", error);
            throw error;
        }
    }

};
