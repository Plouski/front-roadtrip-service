// services/roadtrip-service.js

import { AuthService } from "./auth-service";

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_DB_SERVICE_URL || "https://api.example.com";

export const RoadtripService = {
  /**
   * Récupère tous les roadtrips, avec possibilité de filtrage
   */
  async getRoadtrips(filters = {}) {
    try {
      // Créer les paramètres de requête à partir des filtres
      const queryParams = new URLSearchParams();

      if (filters.search) queryParams.set('search', filters.search);
      if (filters.country) queryParams.set('country', filters.country);
      if (filters.duration) queryParams.set('duration', filters.duration);
      if (filters.tags && filters.tags.length) queryParams.set('tags', filters.tags.join(','));
      if (filters.budget) queryParams.set('budget', filters.budget);
      if (filters.bestSeason) queryParams.set('bestSeason', filters.bestSeason);
      if (filters.onlyPremium !== undefined) queryParams.set('onlyPremium', filters.onlyPremium);

      // Pagination
      if (filters.page) queryParams.set('page', filters.page);
      if (filters.limit) queryParams.set('limit', filters.limit);

      const queryString = queryParams.toString();
      const url = `${API_GATEWAY_URL}/roadtrips${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des roadtrips");
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des roadtrips:", error);
      throw error;
    }
  },

  /**
   * Récupère un roadtrip spécifique par son ID
   */
  async getRoadtripById(id) {
    try {
      const token = AuthService.getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`${API_GATEWAY_URL}/roadtrips/${id}`, { headers });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Erreur lors de la récupération du roadtrip");
      }

      return result.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du roadtrip ${id}:`, error);
      throw error;
    }
  },

  /**
   * Récupère les roadtrips créés par l'utilisateur connecté
   */
  async getUserRoadtrips() {
    try {
      const token = AuthService.getAuthToken();

      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à vos roadtrips");
      }

      const response = await fetch(`${API_GATEWAY_URL}/user/roadtrips`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de vos roadtrips");
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des roadtrips de l'utilisateur:", error);
      throw error;
    }
  },

  /**
   * Ajoute ou retire un roadtrip des favoris
   */
  async toggleFavorite(id) {
    try {
      const token = AuthService.getAuthToken();

      if (!token) {
        throw new Error("Vous devez être connecté pour gérer vos favoris");
      }

      const response = await fetch(`${API_GATEWAY_URL}/roadtrips/${id}/favorite`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la gestion des favoris");
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de la gestion des favoris pour le roadtrip ${id}:`, error);
      throw error;
    }
  },

  /**
   * Récupère les roadtrips favoris de l'utilisateur
   */
  async getFavoriteRoadtrips() {
    try {
      const token = AuthService.getAuthToken();

      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à vos favoris");
      }

      const response = await fetch(`${API_GATEWAY_URL}/roadtrips/user/favorites`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de vos roadtrips favoris");
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des roadtrips favoris:", error);
      throw error;
    }
  },

  /**
   * Publier ou dépublier un roadtrip
   */
  async updatePublishStatus(roadtripId, isPublished) {
    try {
      const token = AuthService.getAuthToken();

      if (!token) {
        throw new Error("Vous devez être connecté pour modifier le statut de publication");
      }

      const response = await fetch(`${API_GATEWAY_URL}/roadtrips/${roadtripId}/publish`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ isPublished })
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Vous n'avez pas les droits pour modifier ce roadtrip");
        }
        throw new Error("Erreur lors de la modification du statut de publication");
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de la modification du statut de publication du roadtrip ${roadtripId}:`, error);
      throw error;
    }
  },

  /**
 * Incrémente le compteur de vues d’un roadtrip
 */
  async incrementViewCount(id: string) {
    return await fetch(`${API_GATEWAY_URL}/roadtrips/${id}/view`, {
      method: "POST"
    })
  },

  async getPublicRoadtrips() {
    const res = await fetch(`${API_GATEWAY_URL}/roadtrips`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (!res.ok) {
      throw new Error("Erreur lors de la récupération des roadtrips publics")
    }

    const data = await res.json()
    return data.trips // 👈 récupère bien la liste à l'intérieur de `trips`
  },

  async getPopularRoadtrips() {
    const res = await fetch(`${API_GATEWAY_URL}/roadtrips/popular`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (!res.ok) {
      throw new Error("Erreur lors de la récupération des roadtrips populaires")
    }

    const data = await res.json()
    return data.trips
  },

};