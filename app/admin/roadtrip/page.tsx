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

export default function RoadtripsListPage() {
  const router = useRouter()
  const [roadtrips, setRoadtrips] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [alert, setAlert] = useState({ message: "", type: null })

  useEffect(() => {
    loadRoadtrips()
  }, [page, search])

  const loadRoadtrips = async () => {
    setLoading(true)
    try {
      const res = await AdminService.getRoadtrips(page, 10, search)
      setRoadtrips(res.trips)
      setTotal(res.total)
    } catch {
      showAlert("Erreur lors du chargement", "error")
    } finally {
      setLoading(false)
    }
  }

  const showAlert = (message, type) => {
    setAlert({ message, type })
    setTimeout(() => setAlert({ message: "", type: null }), 4000)
  }

  const toggleStatus = async (id, current) => {
    try {
      setProcessing(true)
      await AdminService.updateRoadtripStatus(id, !current)
      setRoadtrips(rt => rt.map(r => r._id === id ? { ...r, isPublished: !current } : r))
      showAlert("Statut mis à jour", "success")
    } catch {
      showAlert("Échec de mise à jour", "error")
    } finally {
      setProcessing(false)
    }
  }

  const deleteRoadtrip = async (id) => {
    try {
      setProcessing(true)
      await AdminService.deleteRoadtrip(id)
      await loadRoadtrips()
      showAlert("Supprimé avec succès", "success")
    } catch {
      showAlert("Erreur lors de la suppression", "error")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des roadtrips</h1>
        <Button onClick={() => router.push("/admin/roadtrip/create")}>
          <Plus className="mr-2 h-4 w-4" /> Nouveau
        </Button>
      </div>

      {alert.message && (
        <div className="mb-4">
          <AlertMessage message={alert.message} type={alert.type} />
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Rechercher un titre, pays ou tag"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Roadtrips</CardTitle>
          <CardDescription>Liste des roadtrips enregistrés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto rounded border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Pays</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : roadtrips.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      Aucun roadtrip trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  roadtrips.map(rt => (
                    <TableRow key={rt._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {rt.isPremium && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                              Premium
                            </Badge>
                          )}
                          {rt.title}
                        </div>
                      </TableCell>
                      <TableCell>{rt.country}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {rt.tags?.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {rt.tags?.length > 3 && (
                            <Badge variant="secondary" className="text-xs">+{rt.tags.length - 3}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={rt.isPublished ? "success" : "secondary"}>
                          {rt.isPublished ? "Publié" : "Brouillon"}
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
                            <DropdownMenuItem onClick={() => router.push(`/roadtrip/${rt._id}`)}>
                              <Eye className="mr-2 h-4 w-4" /> Voir
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/roadtrip/update/${rt._id}`)}>
                              <Edit className="mr-2 h-4 w-4" /> Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleStatus(rt._id, rt.isPublished)} disabled={processing}>
                              {rt.isPublished ? (
                                <>
                                  <X className="mr-2 h-4 w-4" /> Dépublier
                                </>
                              ) : (
                                <>
                                  <Check className="mr-2 h-4 w-4" /> Publier
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => deleteRoadtrip(rt._id)} className="text-red-600">
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
                {Array.from({ length: Math.ceil(total / 10) }, (_, i) => (
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
                    className={page >= Math.ceil(total / 10) ? "pointer-events-none opacity-50" : ""}
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