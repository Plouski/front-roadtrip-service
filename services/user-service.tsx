// services/user-service.js

import { AuthService } from "./auth-service";

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "https://api.example.com";

export const UserService = {
  /**
   * Récupère le profil de l'utilisateur connecté
   */
  async getProfile() {
    try {
      const token = AuthService.getAuthToken();
      
      if (!token) {
        throw new Error("Non authentifié");
      }
      
      const response = await fetch(`${API_GATEWAY_URL}/auth/profile`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expirée, veuillez vous reconnecter");
        }
        
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
   * Met à jour le profil de l'utilisateur
   */
  async updateProfile(profileData) {
    try {
      const token = AuthService.getAuthToken();
      
      if (!token) {
        throw new Error("Non authentifié");
      }
      
      const response = await fetch(`${API_GATEWAY_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expirée, veuillez vous reconnecter");
        }
        
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
   * Change le mot de passe de l'utilisateur
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const token = AuthService.getAuthToken();
      
      if (!token) {
        throw new Error("Non authentifié");
      }
      
      const response = await fetch(`${API_GATEWAY_URL}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Mot de passe actuel incorrect");
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors du changement de mot de passe");
      }
      
      return true;
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error);
      throw error;
    }
  },
  
  /**
   * Supprime le compte de l'utilisateur
   */
  async deleteAccount() {
    try {
      const token = AuthService.getAuthToken();
      
      if (!token) {
        throw new Error("Non authentifié");
      }
      
      const response = await fetch(`${API_GATEWAY_URL}/auth/account`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expirée, veuillez vous reconnecter");
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la suppression du compte");
      }
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du compte:", error);
      throw error;
    }
  },
  
  /**
   * Initialise une réinitialisation de mot de passe
   */
  async initiatePasswordReset(email) {
    try {
      const response = await fetch(`${API_GATEWAY_URL}/auth/initiate-password-reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });
      
      // Même si l'email n'existe pas, on retourne toujours une réponse positive pour des raisons de sécurité
      if (!response.ok && response.status !== 404) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de l'envoi des instructions de réinitialisation");
      }
      
      return true;
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la réinitialisation de mot de passe:", error);
      throw error;
    }
  },
  
  /**
   * Réinitialise le mot de passe avec un code de réinitialisation
   */
  async resetPassword(email, resetCode, newPassword) {
    try {
      const response = await fetch(`${API_GATEWAY_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          resetCode,
          newPassword
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la réinitialisation du mot de passe");
      }
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", error);
      throw error;
    }
  }
};