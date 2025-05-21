"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/services/auth-service";
import { SubscriptionService } from "@/services/subscription-service";
import Loading from "@/components/ui/loading";

export default function PremiumSuccessPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await AuthService.getProfile();

        const sub = await SubscriptionService.getCurrentSubscription();

        setUser(userData);
        setSubscription(sub);
      } catch (error) {
        console.error("Erreur lors du chargement des données", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading text="Chargement de votre abonnement..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-6">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
        <h1 className="text-2xl font-bold">Bienvenue dans Premium 🚀</h1>
        <p className="text-gray-600 text-sm leading-relaxed sm:leading-relaxed">
          Merci {user?.firstName} pour votre abonnement{" "}
          <strong>
            {subscription?.plan === "annual" ? "annuel" : "mensuel"}
          </strong>{" "}
          !
        </p>

        <div className="rounded-lg bg-gray-50 p-4 text-left text-sm">
          <p>
            <span className="font-medium">Statut :</span> {subscription?.status}
          </p>
          <p>
            <span className="font-medium">Début :</span>{" "}
            {new Date(subscription?.startDate).toLocaleDateString()}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => router.push("/profile")}>
            Voir mon profil
          </Button>
          <Button variant="secondary" onClick={() => router.push("/explorer")}>
            Explorer les roadtrips
          </Button>
        </div>
      </div>
    </div>
  );
}
