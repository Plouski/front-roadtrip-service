import { AuthService } from "./auth-service";

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL || "https://api.example.com";
const SUBSCRIPTION_API_URL = `${API_GATEWAY_URL}/subscription`;
const CHECKOUT_API_URL = `${SUBSCRIPTION_API_URL}/checkout`;

export const SubscriptionService = {
  async getCurrentSubscription() {
    try {
      const token = AuthService.getAuthToken();
      if (!token) return null;

      const response = await fetch(`${SUBSCRIPTION_API_URL}/current`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status === 404) return null;
      if (!response.ok) throw new Error(await response.text());

      return await response.json();
    } catch (error) {
      console.error("Erreur getCurrentSubscription:", error);
      return null;
    }
  },

  async getUserSubscription(userId) {
    try {
      const token = AuthService.getAuthToken();
      if (!token || !userId) throw new Error("Non authentifié");
  
      const response = await fetch(`${SUBSCRIPTION_API_URL}/user/${userId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
  
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(await response.text());
  
      return await response.json();
    } catch (error) {
      console.error("Erreur getUserSubscription:", error);
      return null;
    }
  },  

  async isPremiumUser() {
    try {
      const token = AuthService.getAuthToken();
      const userId = AuthService.getUserId();
      if (!token || !userId) return false;

      const response = await fetch(`${SUBSCRIPTION_API_URL}/status/${userId}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();
      return data.isPremium === true;
    } catch (error) {
      console.error("Erreur isPremiumUser:", error);
      return false;
    }
  },

  async canAccessPremiumContent() {
    try {
      const userRole = AuthService.getUserRole();
      if (userRole === 'admin' || userRole === 'premium') return true;
      return await this.isPremiumUser();
    } catch (error) {
      console.error("Erreur canAccessPremiumContent:", error);
      return false;
    }
  },

  async updateSubscription(subscriptionData) {
    try {
      const token = AuthService.getAuthToken();
      if (!token) throw new Error("Non authentifié");

      const response = await fetch(`${SUBSCRIPTION_API_URL}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(subscriptionData)
      });

      if (!response.ok) throw new Error(await response.text());

      return await response.json();
    } catch (error) {
      console.error("Erreur updateSubscription:", error);
      throw error;
    }
  },

  async cancelSubscription() {
    try {
      const token = AuthService.getAuthToken();
      if (!token) throw new Error("Non authentifié");

      const response = await fetch(`${SUBSCRIPTION_API_URL}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(await response.text());

      return true;
    } catch (error) {
      console.error("Erreur cancelSubscription:", error);
      throw error;
    }
  },

  async getSubscriptionHistory(options = {}) {
    try {
      const token = AuthService.getAuthToken();
      if (!token) throw new Error("Non authentifié");

      const queryParams = new URLSearchParams({
        limit: options.limit || 10,
        page: options.page || 1,
        ...(options.status ? { status: options.status } : {})
      }).toString();

      const response = await fetch(`${SUBSCRIPTION_API_URL}/history?${queryParams}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(await response.text());

      return await response.json();
    } catch (error) {
      console.error("Erreur getSubscriptionHistory:", error);
      throw error;
    }
  },

  async checkAvailableFeatures() {
    try {
      const token = AuthService.getAuthToken();
      if (!token) throw new Error("Non authentifié");

      const response = await fetch(`${SUBSCRIPTION_API_URL}/features`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(await response.text());

      return await response.json();
    } catch (error) {
      console.error("Erreur checkAvailableFeatures:", error);
      throw error;
    }
  },

  /**
   * 🔥 Lance la session de paiement Stripe
   * @param {"monthly"|"annual"} plan
   * @returns {Promise<string>} URL de redirection vers Stripe Checkout
   */
  async startCheckoutSession(plan = "monthly") {
    console.log('SUBSCRIPTION_API_URL', SUBSCRIPTION_API_URL)
    console.log('CHECKOUT_API_URL', CHECKOUT_API_URL)
    try {
      const token = AuthService.getAuthToken();
      if (!token) throw new Error("Non authentifié");

      const response = await fetch(CHECKOUT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ plan })
      });

      if (!response.ok) throw new Error(await response.text());

      const { url } = await response.json();
      return url;
    } catch (error) {
      console.error("Erreur startCheckoutSession:", error);
      throw error;
    }
  }
};