import { AuthService } from "./auth-service";
import { redirect } from "next/navigation";

const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:5003";

// Fonction fetch sécurisée avec redirection si token invalide ou accès refusé (non premium)
// Fonction fetch sécurisée avec vérification du rôle et récupération de celui-ci si manquant
async function secureFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  try {
    // Vérifier si un token est disponible
    const token = AuthService.getAuthToken();
    if (!token) {
      console.warn("🔐 Aucun token trouvé, redirection vers /auth");
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      } else {
        redirect("/auth");
      }
      throw new Error("Redirection vers /auth - Aucun token");
    }

    // Exécuter la requête
    const res = await fetch(input, init);

    // Gérer les erreurs d'authentification (token expiré ou invalide)
    if (res.status === 401) {
      console.warn("🔐 Token expiré ou invalide, redirection vers /auth");
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      } else {
        redirect("/auth");
      }
      throw new Error("Redirection vers /auth - Token invalide");
    }

    return res;
  } catch (error) {
    console.error("Erreur dans secureFetch:", error);
    throw error;
  }
}

export const AssistantService = {
  async askAssistant(query: string, params: any = {}) {
    try {
      //ensureAuthenticatedAndPremium();
      const token = AuthService.getAuthToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await secureFetch(`${AI_SERVICE_URL}/api/ai/ask`, {
        method: "POST",
        headers,
        body: JSON.stringify({ prompt: query, ...params }),
      });

      return await response.json();
    } catch (error) {
      console.error("Erreur AssistantService.askAssistant:", error);
      throw error;
    }
  },

  async getDetailedItinerary(options: any) {
    try {
      ////ensureAuthenticatedAndPremium();
      const token = AuthService.getAuthToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await secureFetch(`${AI_SERVICE_URL}/api/ai/itinerary`, {
        method: "POST",
        headers,
        body: JSON.stringify(options),
      });

      return await response.json();
    } catch (error) {
      console.error("Erreur AssistantService.getDetailedItinerary:", error);
      throw error;
    }
  },

  async saveMessage(role: string, content: string, conversationId: string) {
    try {
      ////ensureAuthenticatedAndPremium();
      const token = AuthService.getAuthToken();

      const res = await secureFetch(`${AI_SERVICE_URL}/api/ai/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role, content, conversationId }),
      });

      return await res.json();
    } catch (error) {
      console.error("Erreur AssistantService.saveMessage:", error);
      throw error;
    }
  },

  async getHistory(): Promise<{ id: string; role: string; content: string }[]> {
    try {
      ////ensureAuthenticatedAndPremium();
      const token = AuthService.getAuthToken();

      const response = await secureFetch(`${AI_SERVICE_URL}/api/ai/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return await response.json();
    } catch (error) {
      console.error("Erreur AssistantService.getHistory:", error);
      throw error;
    }
  },

  async getConversationById(conversationId: string) {
    try {
      ////ensureAuthenticatedAndPremium();
      const token = AuthService.getAuthToken();

      const response = await secureFetch(`${AI_SERVICE_URL}/api/ai/conversation/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return await response.json();
    } catch (error) {
      console.error("Erreur AssistantService.getConversationById:", error);
      throw error;
    }
  },

  async deleteConversation(conversationId: string) {
    try {
      ////ensureAuthenticatedAndPremium();
      const token = AuthService.getAuthToken();

      await secureFetch(`${AI_SERVICE_URL}/api/ai/conversation/${conversationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return true;
    } catch (error) {
      console.error("Erreur AssistantService.deleteConversation:", error);
      throw error;
    }
  },
};