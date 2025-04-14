// services/subscription-service.js

import { AuthService } from "./auth-service";

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_DB_SERVICE_URL || "https://api.example.com";
const SUBSCRIPTION_API_URL = `${API_GATEWAY_URL}/subscriptions`;

export const SubscriptionService = {
  /**
   * Récupère les informations de l'abonnement actuel de l'utilisateur
   * @returns {Promise<Object|null>} Les informations de l'abonnement ou null si aucun abonnement
   */
  async getCurrentSubscription() {
    try {
      const token = AuthService.getAuthToken();
      
      if (!token) {
        return null; // Non authentifié
      }
      
      const response = await fetch(`${SUBSCRIPTION_API_URL}/current`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.status === 404) {
        return null; // Aucun abonnement trouvé
      }
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expirée, veuillez vous reconnecter");
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la récupération de l'abonnement");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération de l'abonnement:", error);
      return null;
    }
  },
  
  /**
   * Vérifie si l'utilisateur a un abonnement premium
   * @returns {Promise<boolean>}
   */
  async isPremiumUser() {
    try {
      const token = AuthService.getAuthToken();
      const userId = AuthService.getUserId();
      
      if (!token || !userId) {
        return false; // Non authentifié, donc pas premium
      }
      
      const response = await fetch(`${SUBSCRIPTION_API_URL}/status/${userId}`, {
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
        throw new Error(errorData.message || "Erreur lors de la vérification de l'abonnement");
      }
      
      const data = await response.json();
      return data.isPremium === true;
    } catch (error) {
      console.error("Erreur lors de la vérification de l'abonnement:", error);
      return false; // Par défaut, l'utilisateur n'est pas premium en cas d'erreur
    }
  },
  
  /**
   * Vérifie si l'utilisateur peut accéder au contenu premium (admin ou premium)
   * @returns {Promise<boolean>}
   */
  async canAccessPremiumContent() {
    try {
      const userRole = AuthService.getUserRole(); // Récupérer le rôle de l'utilisateur
      
      // Les admins ont toujours accès au contenu premium
      if (userRole === 'admin') {
        return true;
      }
      
      // Les utilisateurs avec le rôle 'premium' ont également accès
      if (userRole === 'premium') {
        return true;
      }
      
      // Vérification supplémentaire via l'API pour être sûr (au cas où le rôle ne serait pas à jour)
      const isPremium = await this.isPremiumUser();
      return isPremium;
    } catch (error) {
      console.error("Erreur lors de la vérification des accès premium:", error);
      return false;
    }
  },
  
  /**
   * Met à jour l'abonnement de l'utilisateur
   * @param {Object} subscriptionData - Les données de l'abonnement à mettre à jour
   * @returns {Promise<Object>}
   */
  async updateSubscription(subscriptionData) {
    try {
      const token = AuthService.getAuthToken();
      
      if (!token) {
        throw new Error("Non authentifié");
      }
      
      const response = await fetch(`${SUBSCRIPTION_API_URL}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(subscriptionData)
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expirée, veuillez vous reconnecter");
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour de l'abonnement");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'abonnement:", error);
      throw error;
    }
  },
  
  /**
   * Annule l'abonnement de l'utilisateur
   * @returns {Promise<boolean>}
   */
  async cancelSubscription() {
    try {
      const token = AuthService.getAuthToken();
      
      if (!token) {
        throw new Error("Non authentifié");
      }
      
      const response = await fetch(`${API_GATEWAY_URL}/subscriptions`, {
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
        throw new Error(errorData.message || "Erreur lors de l'annulation de l'abonnement");
      }
      
      return true;
    } catch (error) {
      console.error("Erreur lors de l'annulation de l'abonnement:", error);
      throw error;
    }
  },
  
  /**
   * Récupère l'historique des abonnements
   * @param {Object} options - Options de pagination
   * @returns {Promise<Object>}
   */
  async getSubscriptionHistory(options = {}) {
    try {
      const token = AuthService.getAuthToken();
      
      if (!token) {
        throw new Error("Non authentifié");
      }
      
      const queryParams = new URLSearchParams({
        limit: options.limit || 10,
        page: options.page || 1,
        ...(options.status ? { status: options.status } : {})
      }).toString();
      
      const response = await fetch(`${SUBSCRIPTION_API_URL}/history?${queryParams}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expirée, veuillez vous reconnecter");
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la récupération de l'historique des abonnements");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique des abonnements:", error);
      throw error;
    }
  },
  
  /**
   * Vérifie les fonctionnalités disponibles pour l'utilisateur en fonction de son abonnement
   * @returns {Promise<Object>}
   */
  async checkAvailableFeatures() {
    try {
      const token = AuthService.getAuthToken();
      
      if (!token) {
        throw new Error("Non authentifié");
      }
      
      const response = await fetch(`${SUBSCRIPTION_API_URL}/features`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expirée, veuillez vous reconnecter");
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la vérification des fonctionnalités");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la vérification des fonctionnalités:", error);
      throw error;
    }
  }
};