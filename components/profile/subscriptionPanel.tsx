"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface Subscription {
  id: string;
  plan?: string;
  status?: string;
  startDate?: string;
}

interface SubscriptionPanelProps {
  subscription: Subscription | null;
  onCancelSubscription: () => Promise<void>;
  onTabChange: (tab: string) => void;
  router: AppRouterInstance;
}

export default function SubscriptionPanel({ 
  subscription, 
  onCancelSubscription, 
  onTabChange,
  router 
}: SubscriptionPanelProps) {
  const handleCancel = async (): Promise<void> => {
    await onCancelSubscription();
    onTabChange("profile");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mon abonnement Premium</CardTitle>
        <CardDescription>
          Gérez votre abonnement, accédez aux options de mise à niveau
          ou annulez votre abonnement à tout moment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Type de plan : <strong>{subscription?.plan || "N/A"}</strong>
        </p>
        <p>
          Status :{" "}
          <strong
            className={
              subscription?.status === "active"
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {subscription?.status || "Inconnu"}
          </strong>
        </p>
        <p>
          Début :{" "}
          <strong>
            {subscription?.startDate
              ? new Date(subscription.startDate).toLocaleDateString()
              : "N/A"}
          </strong>
        </p>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button
          variant="secondary"
          onClick={() => router.push("/premium")}
        >
          Changer de plan
        </Button>
        <Button onClick={handleCancel}>
          Annuler mon abonnement
        </Button>
      </CardFooter>
    </Card>
  );
}