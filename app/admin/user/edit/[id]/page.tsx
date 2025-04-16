"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AdminService } from "@/services/admin-service"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import { AlertMessage } from "@/components/ui/alert-message"

export default function EditUserPage() {
  const router = useRouter()
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [alert, setAlert] = useState({ message: "", type: "" })

  useEffect(() => {
    if (id) fetchUser()
  }, [id])

  const fetchUser = async () => {
    try {
      const data = await AdminService.getUserById(id)
      setUser(data)
    } catch (error) {
      setAlert({ message: "Impossible de charger l'utilisateur", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await AdminService.updateUser(id, user)
      setAlert({ message: "Utilisateur mis à jour", type: "success" })
      setTimeout(() => router.push("/admin/dashboard"), 2000)
    } catch (error) {
      setAlert({ message: "Échec de la mise à jour", type: "error" })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="container py-10 max-w-3xl space-y-6">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Modifier l'utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          {alert.message && (
            <AlertMessage message={alert.message} type={alert.type} className="mb-4" />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="firstName">Prénom</Label>
              <Input id="firstName" name="firstName" value={user.firstName || ""} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="lastName">Nom</Label>
              <Input id="lastName" name="lastName" value={user.lastName || ""} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={user.email || ""} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="role">Rôle</Label>
              <select
                id="role"
                name="role"
                value={user.role || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>


            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                "Enregistrer les modifications"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
