import { AuthService } from "./auth-service";
import { redirect } from "next/navigation";

const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:5003";

/**
 * 🔒 fetch sécurisé avec gestion automatique du token
 */
async function secureFetch(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
  try {
    const token = AuthService.getAuthToken();

    if (!token) {
      console.warn("🔐 Aucun token trouvé, redirection vers /auth");
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      } else {
        redirect("/auth");
      }
      throw new Error("Redirection forcée vers /auth - Aucun token présent");
    }

    // Ajoute automatiquement le token Authorization si manquant
    init.headers = {
      ...(init.headers || {}),
      Authorization: `Bearer ${token}`,
    };

    const res = await fetch(input, init);

    if (res.status === 401) {
      console.warn("🔐 Token invalide ou expiré, redirection vers /auth");
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      } else {
        redirect("/auth");
      }
      throw new Error("Redirection forcée vers /auth - Token invalide");
    }

    return res;
  } catch (error) {
    console.error("❌ Erreur dans secureFetch :", error);
    throw error;
  }
}

/**
 * 📚 Service assistant IA
 */
export const AssistantService = {
  /**
   * Demande de réponse à l'assistant
   */
  async askAssistant(prompt: string, params: Record<string, any> = {}) {
    try {
      const response = await secureFetch(`${AI_SERVICE_URL}/api/ai/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, ...params }),
      });
      return await response.json();
    } catch (error) {
      console.error("❌ Erreur AssistantService.askAssistant :", error);
      throw error;
    }
  },

  /**
   * Sauvegarder un message de conversation
   */
  async saveMessage(role: string, content: string, conversationId: string) {
    try {
      const response = await secureFetch(`${AI_SERVICE_URL}/api/ai/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, content, conversationId }),
      });
      return await response.json();
    } catch (error) {
      console.error("❌ Erreur AssistantService.saveMessage :", error);
      throw error;
    }
  },

  /**
   * Récupérer l'historique de l'utilisateur
   */
  async getHistory(): Promise<{ id: string; role: string; content: string }[]> {
    try {
      const response = await secureFetch(`${AI_SERVICE_URL}/api/ai/history`, {
        headers: { "Content-Type": "application/json" },
      });
      return await response.json();
    } catch (error) {
      console.error("❌ Erreur AssistantService.getHistory :", error);
      throw error;
    }
  },

  /**
   * Récupérer une conversation spécifique par ID
   */
  async getConversationById(conversationId: string) {
    try {
      const response = await secureFetch(`${AI_SERVICE_URL}/api/ai/conversation/${conversationId}`, {
        headers: { "Content-Type": "application/json" },
      });
      return await response.json();
    } catch (error) {
      console.error("❌ Erreur AssistantService.getConversationById :", error);
      throw error;
    }
  },

  /**
   * Supprimer une conversation spécifique par ID
   */
  async deleteConversation(conversationId: string) {
    try {
      await secureFetch(`${AI_SERVICE_URL}/api/ai/conversation/${conversationId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      return true;
    } catch (error) {
      console.error("❌ Erreur AssistantService.deleteConversation :", error);
      throw error;
    }
  },
};
