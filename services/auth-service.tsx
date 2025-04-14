const API_GATEWAY_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "https://api.example.com"

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
            switch (provider.toLowerCase()) {
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
            return new Promise(() => { });
        } catch (error) {
            console.error(`Erreur lors de l'authentification ${provider}:`, error);
            return Promise.reject(error);
        }
    },

    // Méthode pour récupérer les données de l'utilisateur
    async getUserData() {
        const token = this.getAuthToken();
        if (!token) return null;

        try {
            // Tenter de décoder le token JWT pour obtenir les informations utilisateur
            // Note: Ceci est une solution simple, mais pas la plus sécurisée
            // Idéalement, vous devriez vérifier ces informations côté serveur
            const userData = this.parseJwt(token);

            // Si le décryptage du token fonctionne et contient un rôle
            if (userData && userData.role) {
                return userData;
            }

            // Sinon, récupérer les informations depuis l'API
            const response = await fetch(`${API_GATEWAY_URL}/auth/profile`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Impossible de récupérer les données utilisateur");
            }

            const data = await response.json();
            return data.user;
        } catch (error) {
            console.warn("Erreur lors de la récupération des données utilisateur:", error);
            return null;
        }
    },

    // Fonction helper pour décoder un token JWT
    parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join(''));

            const data = JSON.parse(jsonPayload);

            // Vérifie que le token n’est pas expiré
            if (data.exp && Date.now() >= data.exp * 1000) {
                console.warn("Le token est expiré");
                return null;
            }

            return data;
        } catch (error) {
            console.warn("Erreur lors du décodage du token JWT:", error);
            return null;
        }
    },


    // Vérifie si l'utilisateur est admin
    async isAdmin() {
        try {
            const userData = await this.getUserData();
            return userData?.role === 'admin';
        } catch (error) {
            console.warn("Erreur lors de la vérification du rôle admin:", error);
            return false;
        }
    },

    
    // Vérifie si l'utilisateur a l abonnement premium
    async isPremium() {
        try {
            const userData = await this.getUserData();
            return userData?.role === 'premium';
        } catch (error) {
            console.warn("Erreur lors de la vérification du rôle premium:", error);
            return false;
        }
    }
}