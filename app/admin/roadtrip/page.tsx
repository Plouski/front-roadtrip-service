"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/services/auth-service"
import { AdminService } from "@/services/admin-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertMessage } from "@/components/ui/alert-message"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
  PaginationEllipsis,
} from "@/components/ui/pagination"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Loader2, 
  MoreVertical, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Download,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Tag,
  Globe,
  Map,
  Plus
} from "lucide-react"
import { formatDate } from "@/lib/utils"

export default function RoadtripsListPage() {
  const router = useRouter()
  
  // États de chargement et d'authentification
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  
  // États pour la liste des roadtrips et la pagination
  const [roadtrips, setRoadtrips] = useState([])
  const [totalRoadtrips, setTotalRoadtrips] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  
  // États pour la recherche et le filtrage
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [filter, setFilter] = useState("all") // all, published, draft, premium
  
  // États pour les actions sur les roadtrips
  const [roadtripToDelete, setRoadtripToDelete] = useState(null)
  const [roadtripToView, setRoadtripToView] = useState(null)
  const [isProcessingAction, setIsProcessingAction] = useState(false)
  
  // États pour les alertes
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState(null)
  
  // Vérifier l'authentification et les droits d'administrateur
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const userData = await AuthService.getUserData()
        const isAdminUser = userData?.role === "admin"
        
        setIsAdmin(isAdminUser)
        
        if (!isAdminUser) {
          router.push("/")
          return
        }
      } catch (error) {
        console.error("Erreur lors de la vérification des droits admin:", error)
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAdminAccess()
  }, [router])
  
  // Charger la liste des roadtrips
  useEffect(() => {
    if (isAdmin) {
      loadRoadtrips()
    }
  }, [isAdmin, currentPage, pageSize, filter])
  
  // Fonction pour charger les roadtrips avec pagination et recherche
  const loadRoadtrips = async (page = currentPage, size = pageSize, search = searchQuery) => {
    setIsLoading(true)
    
    try {
      // Dans une implémentation réelle, cette fonction devrait prendre en compte le filtre
      const response = await AdminService.getRoadtrips(page, size, search)
      
      // Appliquer les filtres côté client si nécessaire (cas où l'API ne le gère pas)
      let filteredRoadtrips = Array.isArray(response.trips) ? response.trips : []
      
      if (filter !== "all") {
        filteredRoadtrips = filteredRoadtrips.filter(roadtrip => {
          if (filter === "published") return roadtrip.isPublished
          if (filter === "draft") return !roadtrip.isPublished
          if (filter === "premium") return roadtrip.isPremium
          return true
        })
      }      
      
      setRoadtrips(filteredRoadtrips)
      setTotalRoadtrips(response.total)
      setTotalPages(Math.ceil(response.total / size))
      setCurrentPage(page)
    } catch (error) {
      console.error("Erreur lors du chargement des roadtrips:", error)
      showAlert("Impossible de charger la liste des roadtrips", "error")
    } finally {
      setIsLoading(false)
      setIsSearching(false)
    }
  }
  
  // Gestionnaire de recherche
  const handleSearch = () => {
    setIsSearching(true)
    setCurrentPage(1)
    loadRoadtrips(1, pageSize, searchQuery)
  }
  
  // Gestionnaire de pagination
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }
  
  // Gestionnaire de filtre
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    setCurrentPage(1)
  }
  
  // Afficher une alerte
  const showAlert = (message, type) => {
    setAlertMessage(message)
    setAlertType(type)
    
    // Effacer l'alerte après 5 secondes
    setTimeout(() => {
      setAlertMessage("")
      setAlertType(null)
    }, 5000)
  }
  
  // Changer le statut d'un roadtrip (publié/brouillon)
  const toggleRoadtripStatus = async (roadtripId, isPublished) => {
    try {
      setIsProcessingAction(true)
      await AdminService.updateRoadtripStatus(roadtripId, !isPublished)
      
      // Mettre à jour localement sans refetch complet
      setRoadtrips(roadtrips.map(roadtrip => 
        roadtrip._id === roadtripId ? { ...roadtrip, isPublished: !isPublished } : roadtrip
      ))
      
      showAlert(`Roadtrip ${!isPublished ? 'publié' : 'dépublié'} avec succès`, "success")
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut du roadtrip:", error)
      showAlert("Impossible de mettre à jour le statut du roadtrip", "error")
    } finally {
      setIsProcessingAction(false)
    }
  }
  
  // Changer le statut premium d'un roadtrip
  const toggleRoadtripPremium = async (roadtripId, isPremium) => {
    try {
      setIsProcessingAction(true)
      
      // Dans une implémentation réelle, vous devriez avoir une API pour cela
      const response = await fetch(`/api/roadtrips/${roadtripId}/premium`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AuthService.getAuthToken()}`
        },
        body: JSON.stringify({ isPremium: !isPremium })
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du statut premium");
      }
      
      // Mettre à jour localement sans refetch complet
      setRoadtrips(roadtrips.map(roadtrip => 
        roadtrip._id === roadtripId ? { ...roadtrip, isPremium: !isPremium } : roadtrip
      ))
      
      showAlert(`Roadtrip marqué comme ${!isPremium ? 'premium' : 'standard'} avec succès`, "success")
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut premium:", error)
      showAlert("Impossible de mettre à jour le statut premium", "error")
    } finally {
      setIsProcessingAction(false)
    }
  }
  
  // Supprimer un roadtrip
  const deleteRoadtrip = async () => {
    if (!roadtripToDelete) return
    
    try {
      setIsProcessingAction(true)
      await AdminService.deleteRoadtrip(roadtripToDelete._id)
      
      // Mettre à jour la liste de roadtrips
      setRoadtrips(roadtrips.filter(roadtrip => roadtrip._id !== roadtripToDelete._id))
      setTotalRoadtrips(prev => prev - 1)
      
      showAlert("Roadtrip supprimé avec succès", "success")
    } catch (error) {
      console.error("Erreur lors de la suppression du roadtrip:", error)
      showAlert("Impossible de supprimer le roadtrip", "error")
    } finally {
      setRoadtripToDelete(null)
      setIsProcessingAction(false)
    }
  }
  
  // Éditer un roadtrip
  const handleEditRoadtrip = (roadtrip) => {
    router.push(`/admin/roadtrip/update/${roadtrip._id}`)
  }
  
  // Formatter le montant du budget
  const formatBudget = (budget) => {
    if (!budget) return "Non défini"
  
    const amount = typeof budget === "object" ? budget.amount : budget
    const currency = typeof budget === "object" ? budget.currency : "EUR"
  
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
  

  // Obtenir l'ID utilisateur
  const getUserId = (roadtrip) => {
    if (roadtrip.user?._id) return roadtrip.user._id;
    if (roadtrip.userId) {
      return typeof roadtrip.userId === 'object' ? roadtrip.userId.$oid || roadtrip.userId : roadtrip.userId;
    }
    return 'Inconnu';
  }
  
  if (isLoading && roadtrips.length === 0) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold">Chargement des roadtrips...</h2>
        </div>
      </div>
    )
  }
  
  return (
    <div>
      <div className="space-y-6">
        
        {alertMessage && (
          <AlertMessage message={alertMessage} type={alertType} />
        )}
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Liste des roadtrips</CardTitle>
                <CardDescription>
                  {totalRoadtrips} roadtrips enregistrés au total
                </CardDescription>
              </div>
              
              <Button onClick={() => router.push('/admin/roadtrip/create')}>
              <Plus className="mr-2 h-4 w-4" /> Créer un roadtrip
            </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher par titre, pays..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Rechercher
                </Button>
                
                {searchQuery && (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      loadRoadtrips(1, pageSize, "")
                    }}
                  >
                    Réinitialiser
                  </Button>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filtrer
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filtrer par statut</DropdownMenuLabel>
                    <DropdownMenuItem 
                      className={filter === "all" ? "bg-accent text-accent-foreground" : ""}
                      onClick={() => handleFilterChange("all")}
                    >
                      Tous les roadtrips
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className={filter === "published" ? "bg-accent text-accent-foreground" : ""}
                      onClick={() => handleFilterChange("published")}
                    >
                      Roadtrips publiés
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className={filter === "draft" ? "bg-accent text-accent-foreground" : ""}
                      onClick={() => handleFilterChange("draft")}
                    >
                      Roadtrips brouillons
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className={filter === "premium" ? "bg-accent text-accent-foreground" : ""}
                      onClick={() => handleFilterChange("premium")}
                    >
                      Roadtrips premium
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Filtres appliqués et compteur de résultats */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {filter !== "all" && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    {filter === "published" && "Roadtrips publiés"}
                    {filter === "draft" && "Roadtrips brouillons"}
                    {filter === "premium" && "Roadtrips premium"}
                    <button 
                      className="ml-1 hover:bg-accent p-1 rounded-full"
                      onClick={() => handleFilterChange("all")}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Recherche: {searchQuery}
                    <button 
                      className="ml-1 hover:bg-accent p-1 rounded-full"
                      onClick={() => {
                        setSearchQuery("")
                        loadRoadtrips(1, pageSize, "")
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground">
                Affichage de {roadtrips?.length} roadtrips sur {totalRoadtrips}
              </div>
            </div>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Pays</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : roadtrips?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Map className="h-12 w-12 mb-3 text-muted-foreground/60" />
                          <p className="font-medium">Aucun roadtrip trouvé</p>
                          <p className="text-sm mt-1">Essayez de modifier vos critères de recherche</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    roadtrips?.map((roadtrip) => (
                      <TableRow key={roadtrip._id} className="group">
                        <TableCell>
                          <div className="font-medium">
                            {roadtrip.isPremium && (
                              <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                            )}
                            {roadtrip.title}
                          </div>
                          {roadtrip.tags && roadtrip.tags.length > 0 && (
                            <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-1">
                              {roadtrip.tags.slice(0, 3).map((tag, i) => (
                                <span key={i} className="bg-muted px-1.5 py-0.5 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                              {roadtrip.tags.length > 3 && (
                                <span className="text-muted-foreground">+{roadtrip.tags.length - 3}</span>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Globe className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                            <div>
                              <div>{roadtrip.country}</div>
                              {roadtrip.region && (
                                <div className="text-xs text-muted-foreground">{roadtrip.region}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            ID: {getUserId(roadtrip)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1.5">
                            <Badge variant={roadtrip.isPublished ? "success" : "secondary"}>
                              {roadtrip.isPublished ? 'Publié' : 'Brouillon'}
                            </Badge>
                            {roadtrip.isPremium && (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                Premium
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatBudget(roadtrip.budget)}
                          <div className="text-xs text-muted-foreground">
                            {roadtrip.duration} jour{roadtrip.duration > 1 ? 's' : ''}
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatDate(roadtrip.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => router.push(`/roadtrip/${roadtrip._id}`)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Voir</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditRoadtrip(roadtrip)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Modifier</span>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Plus d'options</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => router.push(`/roadtrip/${roadtrip._id}`)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Voir le roadtrip
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditRoadtrip(roadtrip)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => toggleRoadtripStatus(roadtrip._id, roadtrip.isPublished)}>
                                  {roadtrip.isPublished ? (
                                    <>
                                      <X className="mr-2 h-4 w-4" />
                                      Dépublier
                                    </>
                                  ) : (
                                    <>
                                      <Check className="mr-2 h-4 w-4" />
                                      Publier
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toggleRoadtripPremium(roadtrip._id, roadtrip.isPremium)}>
                                  {!roadtrip.isPremium ? (
                                    <>
                                      <Tag className="mr-2 h-4 w-4" />
                                      Marquer Premium
                                    </>
                                  ) : (
                                    <>
                                      <Tag className="mr-2 h-4 w-4" />
                                      Retirer Premium
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => setRoadtripToDelete(roadtrip)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div>Lignes par page:</div>
                <select 
                  className="border rounded px-2 py-1"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    // Logique pour afficher les pages autour de la page actuelle
                    let pageNum;
                    
                    if (totalPages <= 5) {
                      // Moins de 5 pages, on les affiche toutes
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      // Début de pagination
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      // Fin de pagination
                      pageNum = totalPages - 4 + i;
                    } else {
                      // Milieu de pagination, centré sur la page actuelle
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => handlePageChange(pageNum)}
                          isActive={currentPage === pageNum}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  
                  {totalPages > 5 && currentPage < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Boîte de dialogue de confirmation pour la suppression d'un roadtrip */}
      <Dialog open={!!roadtripToDelete} onOpenChange={() => !isProcessingAction && setRoadtripToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le roadtrip <span className="font-semibold">{roadtripToDelete?.title}</span> ? 
              Cette action est irréversible et supprimera également toutes les données associées.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRoadtripToDelete(null)}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={deleteRoadtrip}
              disabled={isProcessingAction}
            >
              {isProcessingAction ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                "Supprimer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Boîte de dialogue pour la visualisation d'un roadtrip */}
      <Dialog open={!!roadtripToView} onOpenChange={() => setRoadtripToView(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails du roadtrip</DialogTitle>
            <DialogDescription>
              Informations complètes sur le roadtrip
            </DialogDescription>
          </DialogHeader>
          {roadtripToView && (
            <div className="mt-4 space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="aspect-video w-full rounded-xl overflow-hidden border">
                    <img 
                      src={roadtripToView.image || "/placeholder.svg"} 
                      alt={roadtripToView.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-2/3 space-y-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{roadtripToView.title}</h3>
                      {roadtripToView.isPremium && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          Premium
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-1">{roadtripToView.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Destination</p>
                        <p>{roadtripToView.country}{roadtripToView.region ? `, ${roadtripToView.region}` : ""}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Meilleure saison</p>
                        <p>{roadtripToView.bestSeason || "Non spécifié"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Durée</p>
                        <p>{roadtripToView.duration} jour{roadtripToView.duration > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <DollarSign className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Budget</p>
                        <p>{formatBudget(roadtripToView.budget)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {roadtripToView.tags && roadtripToView.tags.length > 0 ? (
                        roadtripToView.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">{tag}</Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">Aucun tag</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Points d'intérêt */}
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Points d'intérêt ({roadtripToView.pointsOfInterest?.length || 0})</h4>
                
                {roadtripToView.pointsOfInterest && roadtripToView.pointsOfInterest.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roadtripToView.pointsOfInterest.map((poi, index) => (
                      <div key={index} className="border rounded-lg overflow-hidden">
                        <div className="aspect-[4/3] w-full overflow-hidden">
                          <img 
                            src={poi.image || "/placeholder.svg"} 
                            alt={poi.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h5 className="font-medium">{poi.name}</h5>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{poi.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Aucun point d'intérêt</p>
                )}
              </div>
              
              {/* Itinéraire */}
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Itinéraire ({roadtripToView.itinerary?.length || 0} étape{roadtripToView.itinerary?.length !== 1 ? 's' : ''})</h4>
                
                {roadtripToView.itinerary && roadtripToView.itinerary.length > 0 ? (
                  <div className="space-y-3">
                    {roadtripToView.itinerary.map((step, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium">
                            Jour {step.day}: {step.title}
                          </h5>
                          {step.overnight && (
                            <Badge variant="outline" className="text-xs">
                              Nuit sur place
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                        
                        {roadtripToView.isPremium && (
                          <div className="mt-3 pt-3 border-t border-dashed grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                            {step.drivingTime && (
                              <div>
                                <span className="font-medium">Temps de conduite:</span> {step.drivingTime}
                              </div>
                            )}
                            {step.distance && (
                              <div>
                                <span className="font-medium">Distance:</span> {step.distance} km
                              </div>
                            )}
                            {step.accommodation && (
                              <div>
                                <span className="font-medium">Hébergement:</span> {step.accommodation}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {step.tips && (
                          <div className="mt-2 bg-muted p-2 rounded-md text-xs">
                            <span className="font-medium">Conseils:</span> {step.tips}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Aucune étape d'itinéraire</p>
                )}
              </div>
              
              {/* Informations de création */}
              <div className="pt-4 border-t text-sm text-muted-foreground">
                <p>
                  <span className="font-medium">Créé le:</span> {formatDate(roadtripToView.createdAt)}
                </p>
                {roadtripToView.updatedAt && roadtripToView.updatedAt !== roadtripToView.createdAt && (
                  <p>
                    <span className="font-medium">Dernière modification:</span> {formatDate(roadtripToView.updatedAt)}
                  </p>
                )}
                <p>
                  <span className="font-medium">ID:</span> {roadtripToView._id}
                </p>
                <p>
                  <span className="font-medium">ID Utilisateur:</span> {getUserId(roadtripToView)}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoadtripToView(null)}>
              Fermer
            </Button>
            <Button onClick={() => {
              handleEditRoadtrip(roadtripToView);
              setRoadtripToView(null);
            }}>
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}