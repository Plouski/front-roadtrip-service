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

  // Annuler l'abonnement
  async cancelSubscription() {
    try {
      const token = AuthService.getAuthToken();
      if (!token) throw new Error("Non authentifié");

      const response = await fetch(`${SUBSCRIPTION_API_URL}/cancel`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur cancelSubscription:", error);
      throw error;
    }
  },

  // Réactiver l'abonnement
  async reactivateSubscription() {
    try {
      const token = AuthService.getAuthToken();
      if (!token) throw new Error("Non authentifié");

      console.log('🔄 Service: Envoi requête de réactivation...');

      const response = await fetch(`${SUBSCRIPTION_API_URL}/reactivate`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      console.log('🔄 Service: Réponse reçue:', {
        status: response.status,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Service: Erreur réponse:', errorText);
        throw new Error(errorText);
      }

      const result = await response.json();
      console.log('Service: Réactivation réussie:', result);
      return result;
      
    } catch (error) {
      console.error("Service: Erreur reactivateSubscription:", error);
      throw error;
    }
  },
  
  // Changer de plan
  async changePlan(newPlan) {
    try {
      const token = AuthService.getAuthToken();
      if (!token) throw new Error("Non authentifié");

      if (!["monthly", "annual"].includes(newPlan)) {
        throw new Error("Plan invalide. Utilisez 'monthly' ou 'annual'");
      }

      console.log('Service: Envoi requête changement de plan vers', newPlan);

      const response = await fetch(`${SUBSCRIPTION_API_URL}/change-plan`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ newPlan })
      });

      console.log('🔄 Service: Réponse changement plan reçue:', {
        status: response.status,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Service: Erreur changement plan:', errorText);
        throw new Error(errorText);
      }

      const result = await response.json();
      console.log('Service: Changement plan réussi:', result);
      return result;
      
    } catch (error) {
      console.error("Service: Erreur changePlan:", error);
      throw error;
    }
  },
  
  // Lancer la session de paiement Stripe
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
  },

  formatPlanName(plan) {
    const planNames = {
      'free': 'Gratuit',
      'monthly': 'Mensuel',
      'annual': 'Annuel',
      'premium': 'Premium'
    };
    return planNames[plan] || plan || 'Inconnu';
  },

  formatSubscriptionStatus(subscription) {
    if (!subscription) return "Aucun abonnement";
    
    if (subscription.status === 'active' && subscription.isActive) {
      return "Actif";
    }
    
    if (subscription.status === 'canceled' && subscription.isActive) {
      const daysRemaining = subscription.daysRemaining;
      return `Annulé (expire ${daysRemaining && daysRemaining > 0 ? `dans ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''}` : 'bientôt'})`;
    }
    
    if (subscription.status === 'canceled' && !subscription.isActive) {
      return "Expiré";
    }
    
    return subscription.status;
  }
};