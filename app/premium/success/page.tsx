'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthService } from "@/services/auth-service"
import { SubscriptionService } from "@/services/subscription-service"
import { Loader2 } from "lucide-react"

export default function PremiumSuccessPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await AuthService.getProfile()
        const sub = await SubscriptionService.getCurrentSubscription()

        setUser(userData)
        setSubscription(sub)
      } catch (error) {
        console.error("Erreur lors du chargement des données", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Chargement de votre abonnement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-6">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
        <h1 className="text-2xl font-bold">Bienvenue dans Premium 🚀</h1>
        <p className="text-muted-foreground">
          Merci {user?.firstName} pour votre abonnement <strong>{user?.subscription?.plan === 'annual' ? 'annuel' : 'mensuel'}</strong> !
        </p>

        <div className="rounded-lg bg-gray-50 p-4 text-left text-sm">
          <p><span className="font-medium">Statut :</span> {user?.subscription?.status}</p>
          <p><span className="font-medium">Début :</span> {new Date(user?.subscription?.startDate).toLocaleDateString()}</p>
          {subscription?.endDate && (
            <p><span className="font-medium">Fin :</span> {new Date(user?.subscription?.endDate).toLocaleDateString()}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button onClick={() => router.push("/profile")}>Voir mon profil</Button>
          <Button variant="secondary" onClick={() => router.push("/explorer")}>Explorer les roadtrips</Button>
        </div>
      </div>
    </div>
  )
}
