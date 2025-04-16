"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AdminService } from "@/services/admin-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Edit, Trash2, ArrowLeft } from "lucide-react"
import { AlertMessage } from "@/components/ui/alert-message"

export default function UserDetailsPage() {
    const { id } = useParams()
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [alert, setAlert] = useState({ message: "", type: "" })
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        if (id) fetchUser()
    }, [id])

    const fetchUser = async () => {
        try {
            const data = await AdminService.getUserById(id)
            setUser(data)
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

            <Card>
                <CardHeader>
                    <CardTitle>Informations utilisateur</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div>
                        <strong>ID :</strong> {user._id}
                    </div>
                    <div>
                        <strong>Nom complet :</strong> {user.firstName} {user.lastName}
                    </div>
                    <div>
                        <strong>Email :</strong> {user.email}
                    </div>
                    <div>
                        <strong>Rôle :</strong>{" "}
                        <Badge variant={user.role === "admin" ? "default" : "outline"}>
                            {user.role === "admin" ? "Admin" : "Utilisateur"}
                        </Badge>
                    </div>
                    <div>
                        <strong>Statut :</strong>{" "}
                        <Badge variant={user.isVerified ? "success" : "secondary"}>
                            {user.isVerified ? "Actif" : "Inactif"}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
