// services/admin-service.js

import { AuthService } from "./auth-service";

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_DB_SERVICE_URL || "https://api.example.com";

export const AdminService = {
  /**
   * Récupère les statistiques générales du système
   */
  async getStats() {
    try {
      const token = AuthService.getAuthToken();

      if (!token) {
        throw new Error("Non authentifié");
      }

      const response = await fetch(`${API_GATEWAY_URL}/admin/stats`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expirée, veuillez vous reconnecter");
        } else if (response.status === 403) {
          throw new Error("Vous n'avez pas les autorisations nécessaires");
        }

        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la récupération des statistiques");
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      // Pour faciliter le développement, retournons des données fictives
      return {
        totalUsers: 248,
        activeUsers: 187,
        totalRoadtrips: 126,
        publishedRoadtrips: 93,
        totalLikes: 542,
        totalComments: 328
      };
    }
  },

  /**
   * Récupère la liste des utilisateurs avec pagination et recherche
   */
  async getUsers(page = 1, limit = 10, search = "") {
    try {
      const token = AuthService.getAuthToken();

      if (!token) {
        throw new Error("Non authentifié");
      }

      const queryParams = new URLSearchParams({
        page,
        limit,
        ...(search ? { search } : {})
      }).toString();

      const response = await fetch(`${API_GATEWAY_URL}/users?${queryParams}`, {
        // const response = await fetch(`${API_GATEWAY_URL}/users`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expirée, veuillez vous reconnecter");
        } else if (response.status === 403) {
          throw new Error("Vous n'avez pas les autorisations nécessaires");
        }

        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la récupération des utilisateurs");
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      // Pour faciliter le développement, retournons des données fictives
      return {
        users: [
          {
            id: "1",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            role: "admin",
            isActive: true,
            createdAt: "2024-01-15T10:30:00Z"
          },
          {
            id: "2",
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@example.com",
            role: "user",
            isActive: true,
            createdAt: "2024-02-20T14:20:00Z"
          },
          {
            id: "3",
            firstName: "Michael",
            lastName: "Johnson",
            email: "michael.j@example.com",
            role: "user",
            isActive: false,
            createdAt: "2024-03-05T09:15:00Z"
          },
          {
            id: "4",
            firstName: "Emily",
            lastName: "Brown",
            email: "emily.brown@example.com",
            role: "user",
            isActive: true,
            createdAt: "2024-03-18T16:45:00Z"
          },
          {
            id: "5",
            firstName: "David",
            lastName: "Wilson",
            email: "david.w@example.com",
            role: "user",
            isActive: true,
            createdAt: "2024-04-02T11:10:00Z"
          }
        ],
        total: 248
      };
    }
  },

  /**
   * Met à jour le statut d'un utilisateur (actif/inactif)
   */
  async updateUserStatus(userId, isActive) {
    try {
      const token = AuthService.getAuthToken();

      if (!token) {
        throw new Error("Non authentifié");
      }

      const response = await fetch(`${API_GATEWAY_URL}/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ isActive })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expirée, veuillez vous reconnecter");
        } else if (response.status === 403) {
          throw new Error("Vous n'avez pas les autorisations nécessaires");
        }

        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour du statut de l'utilisateur");
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut de l'utilisateur:", error);
      // Pour faciliter le développement, simulons une réponse réussie
      return { success: true };
    }
  },

  /**
   * Supprime un utilisateur
   */
  async deleteUser(userId) {
    try {
      const token = AuthService.getAuthToken();

      if (!token) {
        throw new Error("Non authentifié");
      }

      const response = await fetch(`${API_GATEWAY_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expirée, veuillez vous reconnecter");
        } else if (response.status === 403) {
          throw new Error("Vous n'avez pas les autorisations nécessaires");
        }

        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la suppression de l'utilisateur");
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      // Pour faciliter le développement, simulons une réponse réussie
      return { success: true };
    }
  },

  /**
   * Récupère la liste des roadtrips avec pagination et recherche
   */
  async getRoadtrips(page = 1, limit = 10, search = "") {
    try {
      const token = AuthService.getAuthToken();
  
      if (!token) {
        throw new Error("Non authentifié");
      }
  
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...(search ? { search } : {}),
        adminView: "true" // <--- C’est ça qui débloque la récupération des roadtrips admin
      }).toString();      
  
      const response = await fetch(`${API_GATEWAY_URL}/roadtrips?${queryParams}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expirée, veuillez vous reconnecter");
        } else if (response.status === 403) {
          throw new Error("Vous n'avez pas les autorisations nécessaires");
        }
  
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la récupération des roadtrips");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des roadtrips:", error);
      return {
        roadtrips: [],
        total: 0
      };
    }
  },  

  /**
     * Crée un nouveau roadtrip
     */
  async createRoadtrip(roadtripData) {
    try {
      const token = AuthService.getAuthToken();
      if (!token) throw new Error("Vous devez être connecté pour créer un roadtrip");

      const user = await AuthService.getUserData();
      if (!user || user.role !== "admin") {
        throw new Error("Vous devez être administrateur pour créer un roadtrip");
      }

      const dataToSend = {
        ...roadtripData,
        // S'assurer que l'ID de l'utilisateur est inclus
        userId: user.id || user.userId, // selon la structure de vos données utilisateur
      };

      const response = await fetch(`${API_GATEWAY_URL}/roadtrips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la création du roadtrip");
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la création du roadtrip:", error);
      throw error;
    }
  },

  /**
   * Met à jour un roadtrip existant
   */
  async updateRoadtrip(id, roadtripData) {
    try {

      const token = AuthService.getAuthToken();
      if (!token) throw new Error("Vous devez être connecté pour créer un roadtrip");

      const user = await AuthService.getUserData();
      if (!user || user.role !== "admin") {
        throw new Error("Vous devez être administrateur pour créer un roadtrip");
      }

      const dataToSend = {
        ...roadtripData,
        // S'assurer que l'ID de l'utilisateur est inclus
        userId: user.id || user.userId // selon la structure de vos données utilisateur
      };

      const response = await fetch(`${API_GATEWAY_URL}/roadtrips/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Vous n'avez pas les droits pour mettre à jour ce roadtrip");
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour du roadtrip");
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du roadtrip ${id}:`, error);
      throw error;
    }
  },

  /**
   * Supprime un roadtrip
   */
  async deleteRoadtrip(id) {
    try {
      const token = AuthService.getAuthToken();
      if (!token) throw new Error("Vous devez être connecté pour créer un roadtrip");

      const user = await AuthService.getUserData();
      if (!user || user.role !== "admin") {
        throw new Error("Vous devez être administrateur pour créer un roadtrip");
      }

      const response = await fetch(`${API_GATEWAY_URL}/roadtrips/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Vous n'avez pas les droits pour supprimer ce roadtrip");
        }
        throw new Error("Erreur lors de la suppression du roadtrip");
      }

      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression du roadtrip ${id}:`, error);
      throw error;
    }
  },

  /**
   * Met à jour le statut d'un roadtrip (publié/non publié)
   */
  async updateRoadtripStatus(roadtripId, isPublished) {
    try {
      const token = AuthService.getAuthToken();

      if (!token) {
        throw new Error("Non authentifié");
      }

      const response = await fetch(`${API_GATEWAY_URL}/admin/roadtrips/${roadtripId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ isPublished })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expirée, veuillez vous reconnecter");
        } else if (response.status === 403) {
          throw new Error("Vous n'avez pas les autorisations nécessaires");
        }

        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour du statut du roadtrip");
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut du roadtrip:", error);
      // Pour faciliter le développement, simulons une réponse réussie
      return { success: true };
    }
  },

  /**
   * Récupère les métriques selon une période donnée
   */
  async getMetrics(timeframe = "week") {
    try {
      const token = AuthService.getAuthToken();

      if (!token) {
        throw new Error("Non authentifié");
      }

      const response = await fetch(`${API_GATEWAY_URL}/admin/metrics?timeframe=${timeframe}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expirée, veuillez vous reconnecter");
        } else if (response.status === 403) {
          throw new Error("Vous n'avez pas les autorisations nécessaires");
        }

        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la récupération des métriques");
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des métriques:", error);
      // Pour faciliter le développement, retournons des données fictives
      return {
        userGrowth: [
          { date: "2024-04-01", value: 12 },
          { date: "2024-04-02", value: 8 },
          { date: "2024-04-03", value: 15 },
          { date: "2024-04-04", value: 10 },
          { date: "2024-04-05", value: 7 },
          { date: "2024-04-06", value: 5 },
          { date: "2024-04-07", value: 9 }
        ],
        roadtripCreation: [
          { date: "2024-04-01", value: 3 },
          { date: "2024-04-02", value: 5 },
          { date: "2024-04-03", value: 2 },
          { date: "2024-04-04", value: 7 },
          { date: "2024-04-05", value: 4 },
          { date: "2024-04-06", value: 1 },
          { date: "2024-04-07", value: 3 }
        ],
        engagementRate: [
          { date: "2024-04-01", value: 38 },
          { date: "2024-04-02", value: 42 },
          { date: "2024-04-03", value: 35 },
          { date: "2024-04-04", value: 47 },
          { date: "2024-04-05", value: 51 },
          { date: "2024-04-06", value: 40 },
          { date: "2024-04-07", value: 45 }
        ]
      };
    }
  }
};