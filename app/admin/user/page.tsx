"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminService } from "@/services/admin-service"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { AlertMessage } from "@/components/ui/alert-message"
import {
  Loader2,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  Search,
  Plus,
} from "lucide-react"

export default function UsersListPage() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState(null)

  useEffect(() => {
    loadUsers()
  }, [page, search])

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const res = await AdminService.getUsers(page, 10, search)
      setUsers(res.users)
      setTotalUsers(res.total)
    } catch (error) {
      showAlert("Erreur lors du chargement des utilisateurs", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleStatus = async (userId, currentStatus) => {
    try {
      setIsProcessing(true)
      await AdminService.updateUserStatus(userId, !currentStatus)
      setUsers(prev =>
        prev.map(u => (u._id === userId ? { ...u, isVerified: !currentStatus } : u))
      )
      showAlert("Statut mis à jour", "success")
    } catch (error) {
      showAlert("Échec de mise à jour du statut", "error")
    } finally {
      setIsProcessing(false)
    }
  }

  const deleteUser = async (userId) => {
    try {
      setIsProcessing(true)
      await AdminService.deleteUser(userId)

      await loadUsers()

      showAlert("Utilisateur supprimé", "success")
    } catch (error) {
      showAlert("Erreur lors de la suppression", "error")
    } finally {
      setIsProcessing(false)
    }
  }

  const showAlert = (message, type) => {
    setAlertMessage(message)
    setAlertType(type)
    setTimeout(() => {
      setAlertMessage("")
      setAlertType(null)
    }, 4000)
  }

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
      </div>

      {alertMessage &&
        <div className="mb-6">
          <AlertMessage message={alertMessage} type={alertType} />
        </div>
      }

      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Rechercher par nom ou email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs</CardTitle>
          <CardDescription>Liste des utilisateurs enregistrés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto rounded border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      Aucun utilisateur trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map(user => (
                    <TableRow key={user._id || user.id}>
                      <TableCell>{user.firstName} {user.lastName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "default" : "outline"}>
                          {user.role === "admin" ? "Admin" : "Utilisateur"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isVerified ? "success" : "secondary"}>
                          {user.isVerified ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/admin/user/${user._id}`)}>
                              <Eye className="mr-2 h-4 w-4" /> Voir
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/user/edit/${user._id}`)}>
                              <Edit className="mr-2 h-4 w-4" /> Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleStatus(user._id, user.isVerified)} disabled={isProcessing}>
                              {user.isVerified ? (
                                <>
                                  <X className="mr-2 h-4 w-4" /> Désactiver
                                </>
                              ) : (
                                <>
                                  <Check className="mr-2 h-4 w-4" /> Activer
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => deleteUser(user._id)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: Math.ceil(totalUsers / 10) }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={page === i + 1}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage(p => p + 1)}
                    className={page >= Math.ceil(totalUsers / 10) ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
