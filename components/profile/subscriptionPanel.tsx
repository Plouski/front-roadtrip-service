"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubscriptionService } from "@/services/subscription-service";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Calendar, CreditCard, Clock, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

interface Subscription {
  _id: string;
  plan: 'free' | 'monthly' | 'annual' | 'premium';
  status: 'active' | 'canceled' | 'suspended' | 'trialing' | 'incomplete';
  isActive: boolean;
  startDate: string;
  endDate?: string;
  paymentMethod?: string;
  cancelationType?: 'immediate' | 'end_of_period';
  daysRemaining?: number;
}

interface SubscriptionPanelProps {
  subscription: Subscription | null;
  subscriptionLoading: boolean;
  onCancelSubscription: (immediate?: boolean) => Promise<void>;
  onReactivateSubscription: () => Promise<void>;
  onChangePlan?: (newPlan: 'monthly' | 'annual') => Promise<void>;
  onGoToPremium: () => void;
  onViewPaymentHistory?: () => void;
  onTabChange: (tab: string) => void;
  router: AppRouterInstance;
}

export default function SubscriptionPanel({ 
  subscription, 
  subscriptionLoading,
  onCancelSubscription, 
  onReactivateSubscription,
  onChangePlan,
  onGoToPremium,
  onViewPaymentHistory,
  onTabChange,
}: SubscriptionPanelProps) {
  const [planChangeLoading, setPlanChangeLoading] = useState(false);

  const isExpired = subscription?.status === 'canceled' && !subscription?.isActive;
  const isCanceledButActive = subscription?.status === 'canceled' && 
                              subscription?.isActive && 
                              subscription?.cancelationType === 'end_of_period';
  const isFullyActive = subscription?.status === 'active' && 
                        subscription?.isActive && 
                        !subscription?.cancelationType;

  console.log('🔍 État détecté:', {
    isExpired,
    isCanceledButActive,
    isFullyActive,
    hasSubscription: !!subscription
  });

  // Si pas d'abonnement
  if (!subscription) {
    console.log('🔍 Affichage: NoSubscriptionCard');
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aucun abonnement actif</CardTitle>
          <CardDescription>
            Découvrez nos plans premium pour accéder à toutes les fonctionnalités.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={onGoToPremium} className="w-full">
            Voir les plans Premium
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // ABONNEMENT EXPIRÉ
  if (isExpired) {
    console.log('🔍 Affichage: ExpiredSubscriptionCard');
    return (
      <Card>
        <CardHeader>
          <CardTitle>Abonnement expiré</CardTitle>
          <CardDescription>
            Votre abonnement Premium a expiré. Renouvelez-le pour retrouver l'accès à toutes les fonctionnalités.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Ancien plan : {SubscriptionService.formatPlanName(subscription.plan)}
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                🔒 L'accès aux fonctionnalités premium est suspendu
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={onGoToPremium} className="flex-1">
            Renouveler l'abonnement
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // ABONNEMENT ANNULÉ MAIS ENCORE ACTIF
  if (isCanceledButActive) {
    console.log('🔍 Affichage: CanceledButActiveCard');
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                Abonnement annulé
                <Badge variant="secondary">
                  Expire bientôt
                </Badge>
              </CardTitle>
              <CardDescription>
                Votre abonnement a été annulé mais reste actif jusqu'à expiration.
              </CardDescription>
            </div>
            <Clock className="h-5 w-5 text-orange-500" />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-orange-800">
              <span className="font-medium">
                {subscription.daysRemaining !== undefined && subscription.daysRemaining > 0
                  ? `${subscription.daysRemaining} jour${subscription.daysRemaining > 1 ? 's' : ''} restant${subscription.daysRemaining > 1 ? 's' : ''}`
                  : subscription.endDate
                  ? `Expire le ${new Date(subscription.endDate).toLocaleDateString('fr-FR')}`
                  : 'Expire bientôt'
                }
              </span>
            </div>
            <p className="text-sm text-orange-700 mt-1">
              Vous gardez tous vos avantages premium jusqu'à la date d'expiration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Plan actuel</span>
              </div>
              <p className="text-lg font-bold">
                {SubscriptionService.formatPlanName(subscription.plan)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Date d'expiration</span>
              </div>
              <p className="text-lg">
                {subscription.endDate
                  ? new Date(subscription.endDate).toLocaleDateString('fr-FR')
                  : "Non renseigné"}
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            onClick={onReactivateSubscription}
            disabled={subscriptionLoading}
            className="w-full"
          >
            {subscriptionLoading ? "Réactivation..." : "Réactiver l'abonnement"}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // ABONNEMENT PLEINEMENT ACTIF
  if (isFullyActive) {
    console.log('🔍 Affichage: ActiveSubscriptionCard');
    const otherPlan = subscription.plan === 'monthly' ? 'annual' : 'monthly';

    const handleCancel = async (immediate: boolean = false): Promise<void> => {
      await onCancelSubscription(immediate);
      onTabChange("profile");
    };

    const handleChangePlan = async (newPlan: 'monthly' | 'annual'): Promise<void> => {
      if (!onChangePlan) return;
      setPlanChangeLoading(true);
      try {
        await onChangePlan(newPlan);
      } finally {
        setPlanChangeLoading(false);
      }
    };

    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                Mon abonnement Premium
                <Badge variant="default">
                  Actif
                </Badge>
              </CardTitle>
              <CardDescription>
                Gérez votre abonnement, changez de plan ou annulez à tout moment.
              </CardDescription>
            </div>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Informations du plan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Plan actuel</span>
              </div>
              <p className="text-lg font-bold">
                {SubscriptionService.formatPlanName(subscription.plan)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Prochain renouvellement</span>
              </div>
              <p className="text-lg">
                {subscription.endDate
                  ? new Date(subscription.endDate).toLocaleDateString('fr-FR')
                  : "Non renseigné"}
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          {/* Actions principales */}
          <div className="flex flex-wrap gap-2 w-full">
            {/* Changement de plan */}
            {onChangePlan && (
              <Button
                variant="outline"
                onClick={() => handleChangePlan(otherPlan)}
                disabled={subscriptionLoading || planChangeLoading}
                className="flex-1"
              >
                {planChangeLoading ? "Changement..." : 
                  `Passer au plan ${SubscriptionService.formatPlanName(otherPlan)}`
                }
              </Button>
            )}

            {/* Annulations */}
            <div className="flex gap-2 flex-1">
              <Button
                onClick={() => handleCancel()}
                disabled={subscriptionLoading}
                className="flex-1"
              >
                {subscriptionLoading ? "Annulation..." : "Annuler l'abonnement"}
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    );
  }

  // 🔥 ÉTAT INATTENDU
  console.log('🔍 Affichage: UnexpectedStateCard');
  return (
    <Card className="border-yellow-500">
      <CardHeader>
        <CardTitle className="text-yellow-700">⚠️ État inattendu</CardTitle>
        <CardDescription>
          L'abonnement est dans un état non reconnu.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <p className="text-sm text-yellow-800 mb-2">Détails de debug :</p>
          <pre className="text-xs text-yellow-700 whitespace-pre-wrap">
            {JSON.stringify({
              status: subscription?.status,
              isActive: subscription?.isActive,
              cancelationType: subscription?.cancelationType,
              endDate: subscription?.endDate,
              plan: subscription?.plan
            }, null, 2)}
          </pre>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => window.location.reload()} className="w-full">
          Actualiser la page
        </Button>
      </CardFooter>
    </Card>
  );
}