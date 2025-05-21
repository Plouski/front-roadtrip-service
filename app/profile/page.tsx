"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth-service";
import { SubscriptionService } from "@/services/subscription-service";
import { AlertMessage } from "@/components/ui/alert-message";
import Loading from "@/components/ui/loading";
import ProfileSidebar from "@/components/profile/profileSidebar";
import ProfileTabs from "@/components/profile/profileTabs";

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  role: string;
  authProvider?: string;
  createdAt: string;
}

interface Subscription {
  id: string;
  plan: string;
  status: string;
  startDate: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  
  // Messages d'alerte
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        const token = AuthService.getAuthToken();
        if (!token) {
          router.push("/auth");
          return;
        }

        const userData = await AuthService.getProfile();
        const currentSub = await SubscriptionService.getCurrentSubscription();

        setUser(userData);
        setSubscription(currentSub);
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
        setAlertMessage(
          "Impossible de charger votre profil. Veuillez vous reconnecter."
        );
        setAlertType("error");
        setTimeout(() => {
          AuthService.logout();
          router.push("/auth");
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleAlert = (message: string, type: "success" | "error") => {
    setAlertMessage(message);
    setAlertType(type);
  };

  // Gestionnaire de suppression de compte
  const handleDeleteAccount = async (): Promise<void> => {
    try {
      await AuthService.deleteAccount();
      handleAlert("Votre compte a été supprimé", "success");
      
      // Déconnexion et redirection après un délai
      setTimeout(() => {
        AuthService.logout();
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de la suppression du compte:", error);
      handleAlert(
        error instanceof Error ? error.message : "Erreur lors de la suppression du compte",
        "error"
      );
    }
  };

  // Gestionnaire d'annulation d'abonnement
  const handleCancelSubscription = async (): Promise<void> => {
    try {
      await SubscriptionService.cancelSubscription();
      handleAlert("Votre abonnement a été annulé.", "success");
      setUser(user ? { ...user, role: "user" } : null);
    } catch (error) {
      console.error("Erreur lors de l'annulation de l'abonnement:", error);
      handleAlert("Une erreur est survenue lors de l'annulation.", "error");
    }
  };

  // Gestionnaire de mise à jour du profil
  const handleUpdateUser = (updatedUser: User): void => {
    setUser(updatedUser);
  };

  if (isLoading) {
    return <Loading text="Chargement de votre profil..." />;
  }

  return (
    <div className="container py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-5">Mon Profil</h1>

      {alertMessage && (
        <div className="mb-6">
          <AlertMessage message={alertMessage} type={alertType} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-6">
        {/* Sidebar avec avatar et informations de base */}
        <ProfileSidebar 
          user={user} 
          onDeleteAccount={handleDeleteAccount}
        />

        {/* Sections principales */}
        <ProfileTabs 
          user={user}
          subscription={subscription}
          onAlert={handleAlert}
          onUpdateUser={handleUpdateUser}
          onCancelSubscription={handleCancelSubscription}
          router={router}
        />
      </div>
    </div>
  );
}