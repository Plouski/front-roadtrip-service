"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AdminService } from "@/services/admin-service"
import { SubscriptionService } from "@/services/subscription-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Edit, Trash2, ArrowLeft } from "lucide-react"
import { AlertMessage } from "@/components/ui/alert-message"

export default function UserDetailsPage() {
    const { id } = useParams()
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [subscription, setSubscription] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [alert, setAlert] = useState({ message: "", type: "" })
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        if (id) fetchUser()
    }, [id])

    const fetchUser = async () => {
        try {
            setIsLoading(true)
            const userData = await AdminService.getUserById(id)
            const sub = await SubscriptionService.getUserSubscription(id)
            setUser(userData)
            setSubscription(sub)
        } catch (error) {
            setAlert({ message: "Erreur lors du chargement de l'utilisateur", type: "error" })
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm("Supprimer cet utilisateur ?")) return
        setIsDeleting(true)
        try {
            await AdminService.deleteUser(id)
            router.push("/admin/dashboard")
        } catch (error) {
            setAlert({ message: "Erreur lors de la suppression", type: "error" })
        } finally {
            setIsDeleting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!user) return null

    return (
        <div className="container py-10 max-w-3xl space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Retour
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push(`/admin/user/edit/${id}`)}>
                        <Edit className="mr-2 h-4 w-4" /> Modifier
                    </Button>
                    <Button onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Suppression...
                            </>
                        ) : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {alert.message && <AlertMessage message={alert.message} type={alert.type} />}

            {/* Section infos utilisateur */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">👤 Informations de l'utilisateur</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <Info label="ID" value={user._id} />
                    <Info label="Nom complet" value={`${user.firstName} ${user.lastName}`} />
                    <Info label="Email" value={user.email} />
                    <Info
                        label="Rôle"
                        value={
                            <Badge
                                variant={
                                    user.role === "admin"
                                        ? "default"
                                        : user.role === "premium"
                                            ? "success"
                                            : "outline"
                                }
                            >
                                {user.role === "admin"
                                    ? "Admin"
                                    : user.role === "premium"
                                        ? "Premium"
                                        : "Utilisateur"}
                            </Badge>
                        }
                    />
                    <Info
                        label="Statut"
                        value={
                            <Badge variant={user.isVerified ? "success" : "secondary"}>
                                {user.isVerified ? "Actif" : "Inactif"}
                            </Badge>
                        }
                    />
                </CardContent>
            </Card>

            {/* Section abonnement */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">💳 Abonnement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    {subscription ? (
                        <>
                            <Info label="Plan" value={subscription.plan} />
                            <Info label="Statut" value={subscription.status} />
                            <Info label="Début" value={new Date(subscription.startDate).toLocaleDateString()} />
                            <Info label="Fin" value={new Date(subscription.endDate).toLocaleDateString()} />
                            <Info label="Méthode de paiement" value={subscription.paymentMethod} />
                            <Info label="Stripe Customer ID" value={subscription.stripeCustomerId} />
                            <Info label="Stripe Subscription ID" value={subscription.stripeSubscriptionId} />
                        </>
                    ) : (
                        <div className="text-muted-foreground italic">Aucun abonnement actif</div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

// 🔧 Petit composant utilitaire pour garder les infos jolies
const Info = ({ label, value }) => (
    <div className="flex justify-between border-b pb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
    </div>
)
