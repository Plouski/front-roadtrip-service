"use client";

import { useState } from "react";
import { User, Key, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileInfoForm from "./profileInfoForm";
import PasswordChangeForm from "./passwordChangeForm";
import SubscriptionPanel from "./subscriptionPanel";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  authProvider?: string;
}

interface Subscription {
  id: string;
  plan: string;
  status: string;
  startDate: string;
}

interface ProfileTabsProps {
  user: User | null;
  subscription: Subscription | null;
  onAlert: (message: string, type: "success" | "error") => void;
  onUpdateUser: (user: User) => void;
  onCancelSubscription: () => Promise<void>;
  router: AppRouterInstance;
}

export default function ProfileTabs({ 
  user, 
  subscription, 
  onAlert, 
  onUpdateUser,
  onCancelSubscription,
  router
}: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<string>("profile");
  
  const isOAuthUser = user?.authProvider && user.authProvider !== "local";
  
  // Callback pour changer d'onglet (utilisé après annulation d'abonnement)
  const handleTabChange = (value: string): void => {
    setActiveTab(value);
  };
  
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="mb-6">
        <TabsTrigger value="profile" className="flex items-center">
          <User className="mr-2 h-4 w-4" />
          Informations personnelles
        </TabsTrigger>
        {!isOAuthUser && (
          <TabsTrigger value="password" className="flex items-center">
            <Key className="mr-2 h-4 w-4" />
            Changer de mot de passe
          </TabsTrigger>
        )}
        {user?.role === "premium" && (
          <TabsTrigger value="subscription" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Mon abonnement
          </TabsTrigger>
        )}
      </TabsList>

      {/* Onglet informations personnelles */}
      <TabsContent value="profile">
        <ProfileInfoForm 
          user={user} 
          onAlert={onAlert}
          onUpdateUser={onUpdateUser}
        />
      </TabsContent>

      {/* Onglet changement de mot de passe */}
      {!isOAuthUser && (
        <TabsContent value="password">
          <PasswordChangeForm onAlert={onAlert} />
        </TabsContent>
      )}
      
      {/* Onglet abonnement */}
      {user?.role === "premium" && (
        <TabsContent value="subscription">
          <SubscriptionPanel 
            subscription={subscription}
            onCancelSubscription={onCancelSubscription}
            onTabChange={handleTabChange}
            router={router}
          />
        </TabsContent>
      )}
    </Tabs>
  );
}