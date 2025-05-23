import { AuthService } from "./auth-service";

// Configuration de l'URL du service IA
const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:5003";

/**
 * Service pour interagir avec l'API de l'assistant IA
 * Gère toutes les communications avec le backend d'intelligence artificielle
 */
export const AssistantService = {
  /**
   * Envoie une question à l'assistant IA et récupère la réponse
   * @param query - La question/prompt à envoyer à l'IA
   * @param params - Paramètres additionnels pour la requête
   * @returns La réponse de l'IA
   */
  async askAssistant(query: string, params: any = {}): Promise<any> {
    try {
      const token = AuthService.getAuthToken();
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${AI_SERVICE_URL}/api/ai/ask`, {
        method: "POST",
        headers,
        body: JSON.stringify({ prompt: query, ...params }),
      });

      // Vérification des erreurs HTTP
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur AssistantService.askAssistant:", error);
      throw error;
    }
  },

  /**
   * Récupère un itinéraire détaillé basé sur les options fournies
   * @param options - Options pour générer l'itinéraire (destination, durée, budget, etc.)
   * @returns L'itinéraire détaillé généré par l'IA
   */
  async getDetailedItinerary(options: any): Promise<any> {
    try {
      const token = AuthService.getAuthToken();
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${AI_SERVICE_URL}/api/ai/itinerary`, {
        method: "POST",
        headers,
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur AssistantService.getDetailedItinerary:", error);
      throw error;
    }
  },

  /**
   * Sauvegarde un message dans une conversation
   * @param role - Le rôle de l'auteur du message ("user" ou "assistant")
   * @param content - Le contenu du message
   * @param conversationId - L'ID de la conversation
   * @returns La confirmation de sauvegarde
   */
  async saveMessage(role: string, content: string, conversationId: string): Promise<any> {
    try {
      const token = AuthService.getAuthToken();

      const response = await fetch(`${AI_SERVICE_URL}/api/ai/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ role, content, conversationId }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur AssistantService.saveMessage:", error);
      throw error;
    }
  },

  /**
   * Récupère l'historique des conversations de l'utilisateur
   * @returns L'historique des conversations groupées par ID de conversation
   */
  async getHistory(): Promise<any> {
    try {
      const token = AuthService.getAuthToken();

      const response = await fetch(`${AI_SERVICE_URL}/api/ai/history`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur AssistantService.getHistory:", error);
      throw error;
    }
  },

  /**
   * Récupère une conversation spécifique par son ID
   * @param conversationId - L'ID de la conversation à récupérer
   * @returns Les messages de la conversation
   */
  async getConversationById(conversationId: string): Promise<any> {
    try {
      const token = AuthService.getAuthToken();

      const response = await fetch(`${AI_SERVICE_URL}/api/ai/conversation/${conversationId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur AssistantService.getConversationById:", error);
      throw error;
    }
  },

  /**
   * Supprime une conversation spécifique
   * @param conversationId - L'ID de la conversation à supprimer
   * @returns Confirmation de suppression
   */
  async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      const token = AuthService.getAuthToken();

      const response = await fetch(`${AI_SERVICE_URL}/api/ai/conversation/${conversationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error("Erreur AssistantService.deleteConversation:", error);
      throw error;
    }
  },

  /**
   * Vérifie la santé du service IA
   * @returns Le statut du service
   */
  async checkServiceHealth(): Promise<any> {
    try {
      const response = await fetch(`${AI_SERVICE_URL}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Service IA indisponible: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur AssistantService.checkServiceHealth:", error);
      throw error;
    }
  },
};