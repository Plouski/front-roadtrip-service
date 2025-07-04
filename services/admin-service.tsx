import { AuthService } from "./auth-service";

const API_GATEWAY_URL =
  process.env.NEXT_PUBLIC_DB_SERVICE_URL || "https://api.example.com";

export const AdminService = {
  /**
   * Vérifie si l'utilisateur actuel est administrateur
   */
  async isAdmin() {
    try {
      const user = await AuthService.getProfile();
      if (user && user.role && user.role.toLowerCase() === "admin") {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur dans isAdmin:", error);
      return false;
    }
  },

  /**
   * Récupère les statistiques générales du système
   */
  async getStats() {
    const headers = await AuthService.getAuthHeaders();

    const res = await fetch(`${API_GATEWAY_URL}/api/admin/stats`, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || "Impossible de récupérer les statistiques"
      );
    }

    return res.json();
  },

  async getRecentUsers() {
    const headers = await AuthService.getAuthHeaders();

    const res = await fetch(`${API_GATEWAY_URL}/api/admin/users/recent`, {
      method: "GET",
      headers,
    });

    if (!res.ok)
      throw new Error("Impossible de récupérer les derniers utilisateurs");
    return res.json();
  },

  async getRecentRoadtrips() {
    const headers = await AuthService.getAuthHeaders();

    const res = await fetch(`${API_GATEWAY_URL}/api/admin/roadtrips/recent`, {
      method: "GET",
      headers,
    });

    if (!res.ok)
      throw new Error("Impossible de récupérer les derniers roadtrips");
    return res.json();
  },

  /**
   * Récupère la liste des utilisateurs avec pagination et recherche
   */
  async getUsers(page = 1, limit = 10, search = "") {
    const headers = await AuthService.getAuthHeaders();

    const url = `${API_GATEWAY_URL}/api/admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(
      search
    )}`;

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || "Impossible de charger la liste des utilisateurs"
      );
    }

    return await response.json();
  },

  /**
   * Met à jour le statut d'un utilisateur (actif/inactif)
   */
  async updateUserStatus(userId: string, isVerified: boolean) {
    try {
      const headers = await AuthService.getAuthHeaders();

      const response = await fetch(
        `${API_GATEWAY_URL}/api/admin/users/status/${userId}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({ isVerified }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expirée, veuillez vous reconnecter");
        } else if (response.status === 403) {
          throw new Error("Vous n'avez pas les autorisations nécessaires");
        }

        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            "Erreur lors de la mise à jour du statut de l'utilisateur"
        );
      }

      return await response.json();
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du statut de l'utilisateur:",
        error
      );
      throw error;
    }
  },

  /**
   * Récupérer un utilisateur par ID
   */
  async getUserById(userId: string) {
    const headers = await AuthService.getAuthHeaders();

    const response = await fetch(
      `${API_GATEWAY_URL}/api/admin/users/${userId}`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la récupération de l'utilisateur"
      );
    }

    return await response.json();
  },

  /**
   * Mettre à jour un utilisateur
   */
  async updateUser(userId: string, userData: any) {
    const headers = await AuthService.getAuthHeaders();

    const response = await fetch(
      `${API_GATEWAY_URL}/api/admin/users/${userId}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify(userData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la mise à jour de l'utilisateur"
      );
    }

    return await response.json();
  },

  /**
   * Supprime un utilisateur
   */
  async deleteUser(userId: string) {
    const headers = await AuthService.getAuthHeaders();

    const response = await fetch(
      `${API_GATEWAY_URL}/api/admin/users/${userId}`,
      {
        method: "DELETE",
        headers,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la suppression de l'utilisateur"
      );
    }

    return await response.json();
  },

  /**
   * Récupère la liste des roadtrips avec pagination et recherche
   */
  async getRoadtrips(page = 1, limit = 10, search = "") {
    const headers = await AuthService.getAuthHeaders();

    const url = `${API_GATEWAY_URL}/api/admin/roadtrips?page=${page}&limit=${limit}&search=${encodeURIComponent(
      search
    )}`;

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || "Impossible de charger la liste des roadtrips"
      );
    }

    return await response.json();
  },

  /**
   * Crée un nouveau roadtrip
   */
  async createRoadtrip(roadtripData) {
    try {
      const token = AuthService.getAuthToken();
      if (!token)
        throw new Error("Vous devez être connecté pour créer un roadtrip");

      const user = await AuthService.getProfile();
      if (!user || user.role !== "admin") {
        throw new Error(
          "Vous devez être administrateur pour créer un roadtrip"
        );
      }

      const dataToSend = {
        ...roadtripData,
        userId: user.id || user.userId,
      };

      const response = await fetch(`${API_GATEWAY_URL}/api/admin/roadtrips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la création du roadtrip"
        );
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
      if (!token)
        throw new Error("Vous devez être connecté pour créer un roadtrip");

      const user = await AuthService.getProfile();
      if (!user || user.role !== "admin") {
        throw new Error(
          "Vous devez être administrateur pour créer un roadtrip"
        );
      }

      const dataToSend = {
        ...roadtripData,
        userId: user.id || user.userId,
      };

      const response = await fetch(
        `${API_GATEWAY_URL}/api/admin/roadtrips/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(
            "Vous n'avez pas les droits pour mettre à jour ce roadtrip"
          );
        }
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la mise à jour du roadtrip"
        );
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
      if (!token)
        throw new Error("Vous devez être connecté pour créer un roadtrip");

      const user = await AuthService.getProfile();
      if (!user || user.role !== "admin") {
        throw new Error(
          "Vous devez être administrateur pour créer un roadtrip"
        );
      }

      const response = await fetch(
        `${API_GATEWAY_URL}/api/admin/roadtrips/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(
            "Vous n'avez pas les droits pour supprimer ce roadtrip"
          );
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
  async updateRoadtripStatus(id, isPublished) {
    try {
      const token = AuthService.getAuthToken();

      if (!token) {
        throw new Error("Non authentifié");
      }

      const response = await fetch(
        `${API_GATEWAY_URL}/api/admin/roadtrips/status/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isPublished }),
        }
      );

      console.log(
        "CALL:",
        `${API_GATEWAY_URL}/api/admin/roadtrips/status/${id}`,
        { isPublished }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expirée, veuillez vous reconnecter");
        } else if (response.status === 403) {
          throw new Error("Vous n'avez pas les autorisations nécessaires");
        }

        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            "Erreur lors de la mise à jour du statut du roadtrip"
        );
      }

      return await response.json();
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du statut du roadtrip:",
        error
      );
      return { success: true };
    }
  },
};
