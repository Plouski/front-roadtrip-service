"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthService } from "@/services/auth-service"
import { AdminService } from "@/services/admin-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "@/components/ui/pagination"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Loader2,
  Users,
  Map,
  BarChart3,
  MoreVertical,
  Search,
  Check,
  X,
  Edit,
  Trash,
  Eye,
  UserX,
  AlertTriangle,
  Plus
} from "lucide-react"
import RoadtripsListPage from "../roadtrip/page"
import UsersListPage from "../user/page"

export default function AdminDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")

  // Statistiques globales
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRoadtrips: 0,
    publishedRoadtrips: 0,
    totalLikes: 0,
    totalComments: 0
  })

  // Utilisateurs
  const [users, setUsers] = useState([])
  const [usersPage, setUsersPage] = useState(1)
  const [usersTotal, setUsersTotal] = useState(0)
  const [usersSearch, setUsersSearch] = useState("")
  const [userToDelete, setUserToDelete] = useState(null)
  const [isProcessingUser, setIsProcessingUser] = useState(false)

  // Roadtrips
  const [roadtrips, setRoadtrips] = useState([])
  const [roadtripsPage, setRoadtripsPage] = useState(1)
  const [roadtripsTotal, setRoadtripsTotal] = useState(0)
  const [roadtripsSearch, setRoadtripsSearch] = useState("")
  const [roadtripToDelete, setRoadtripToDelete] = useState(null)
  const [isProcessingRoadtrip, setIsProcessingRoadtrip] = useState(false)

  // Métriques
  const [metricsTimeframe, setMetricsTimeframe] = useState("week")
  const [metricsData, setMetricsData] = useState({
    userGrowth: [],
    roadtripCreation: [],
    engagementRate: []
  })

  // Alertes et messages
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState(null)

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const isAdminUser = await AuthService.isAdmin()

        if (!isAdminUser) {
          // Rediriger si l'utilisateur n'est pas admin
          router.push("/")
          return
        }

        setIsAdmin(true)

        // Charger les statistiques
        fetchStats()

      } catch (error) {
        console.error("Erreur lors de la vérification des droits admin:", error)
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminAccess()
  }, [router])

  // Récupérer les données en fonction de l'onglet actif
  useEffect(() => {
    if (!isAdmin) return

    if (activeTab === "users") {
      fetchUsers()
    } else if (activeTab === "roadtrips") {
      fetchRoadtrips()
    } else if (activeTab === "metrics") {
      fetchMetrics()
    }
  }, [activeTab, usersPage, usersSearch, roadtripsPage, roadtripsSearch, metricsTimeframe, isAdmin])

  // Récupérer les statistiques globales
  const fetchStats = async () => {
    try {
      const data = await AdminService.getStats()
      setStats(data)
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error)
      setAlertMessage("Impossible de charger les statistiques du système")
      setAlertType("error")
    }
  }

  // Récupérer la liste des utilisateurs
  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const data = await AdminService.getUsers(usersPage, 10, usersSearch)
      setUsers(data.users)
      setUsersTotal(data.total)
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error)
      setAlertMessage("Impossible de charger la liste des utilisateurs")
      setAlertType("error")
    } finally {
      setIsLoading(false)
    }
  }

  // Récupérer la liste des roadtrips
  const fetchRoadtrips = async () => {
    try {
      setIsLoading(true)
      const data = await AdminService.getRoadtrips(roadtripsPage, 10, roadtripsSearch)
      setRoadtrips(data.trips)
      setRoadtripsTotal(data.total)
    } catch (error) {
      console.error("Erreur lors de la récupération des roadtrips:", error)
      setAlertMessage("Impossible de charger la liste des roadtrips")
      setAlertType("error")
    } finally {
      setIsLoading(false)
    }
  }

  // Récupérer les métriques
  const fetchMetrics = async () => {
    try {
      setIsLoading(true)
      const data = await AdminService.getMetrics(metricsTimeframe)
      setMetricsData(data)
    } catch (error) {
      console.error("Erreur lors de la récupération des métriques:", error)
      setAlertMessage("Impossible de charger les métriques")
      setAlertType("error")
    } finally {
      setIsLoading(false)
    }
  }

  // Supprimer un utilisateur
  const deleteUser = async (userId) => {
    try {
      setIsProcessingUser(true)
      await AdminService.deleteUser(userId)

      // Retirer l'utilisateur de la liste
      setUsers(users.filter(user => user.id !== userId))

      setAlertMessage("Utilisateur supprimé avec succès")
      setAlertType("success")
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error)
      setAlertMessage("Impossible de supprimer l'utilisateur")
      setAlertType("error")
    } finally {
      setUserToDelete(null)
      setIsProcessingUser(false)
    }
  }

  // Supprimer un roadtrip
  const deleteRoadtrip = async (roadtripId) => {
    try {
      setIsProcessingRoadtrip(true)
      await AdminService.deleteRoadtrip(roadtripId)

      // Retirer le roadtrip de la liste
      setRoadtrips(roadtrips.filter(roadtrip => roadtrip.id !== roadtripId))

      setAlertMessage("Roadtrip supprimé avec succès")
      setAlertType("success")
    } catch (error) {
      console.error("Erreur lors de la suppression du roadtrip:", error)
      setAlertMessage("Impossible de supprimer le roadtrip")
      setAlertType("error")
    } finally {
      setRoadtripToDelete(null)
      setIsProcessingRoadtrip(false)
    }
  }

  // Affichage pendant le chargement initial
  if (isLoading && !isAdmin) {
    return (
      <div className="container py-10 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold">Vérification des autorisations...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Administration</h1>
          <Link href="/dashboard">
            <Button variant="outline">Retour au Dashboard utilisateur</Button>
          </Link>
        </div>

        {alertMessage && (
          <AlertMessage message={alertMessage} type={alertType} />
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full md:w-[500px]">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Utilisateurs</span>
            </TabsTrigger>
            <TabsTrigger value="roadtrips" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Roadtrips</span>
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Métriques</span>
            </TabsTrigger>
          </TabsList>

          {/* Onglet Dashboard - Vue d'ensemble */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Utilisateurs</CardTitle>
                  <CardDescription>Total et actifs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-3xl font-bold">{stats.totalUsers}</div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {stats.activeUsers} actifs
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% d'utilisateurs actifs
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Roadtrips</CardTitle>
                  <CardDescription>Total et publiés</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-3xl font-bold">{stats.totalRoadtrips}</div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {stats.publishedRoadtrips} publiés
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {Math.round((stats.publishedRoadtrips / stats.totalRoadtrips) * 100)}% de roadtrips publiés
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Derniers utilisateurs inscrits</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {users.slice(0, 5).map(user => (
                        <div key={user.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                              {user.firstName?.charAt(0) || user.email.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">{user.firstName} {user.lastName}</div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                          <Badge variant={user.isVerified ? "success" : "secondary"}>
                            {user.isVerified ? "Actif" : "Inactif"}
                          </Badge>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab("users")}>
                        Voir tous les utilisateurs
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Derniers roadtrips créés</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {roadtrips?.slice(0, 5).map(roadtrip => (
                        <div key={roadtrip._id} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{roadtrip.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {roadtrip.country} — {roadtrip.bestSeason}
                            </div>
                          </div>
                          <Badge variant={roadtrip.isPublished ? "success" : "secondary"}>
                            {roadtrip.isPublished ? "Publié" : "Brouillon"}
                          </Badge>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab("roadtrips")}>
                        Voir tous les roadtrips
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Utilisateurs */}
          <TabsContent value="users" className="space-y-6">
            <UsersListPage/>
          </TabsContent>

          {/* Onglet Roadtrips */}
          <TabsContent value="roadtrips" className="space-y-6">
            <RoadtripsListPage />
          </TabsContent>

          {/* Onglet Métriques */}
          <TabsContent value="metrics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Métriques et statistiques</CardTitle>
                <CardDescription>
                  Analysez les tendances d'utilisation et les métriques de performance de la plateforme.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div className="font-medium">Période :</div>
                  <div className="flex">
                    <Button
                      variant={metricsTimeframe === "week" ? "default" : "outline"}
                      size="sm"
                      className="rounded-r-none"
                      onClick={() => setMetricsTimeframe("week")}
                    >
                      Semaine
                    </Button>
                    <Button
                      variant={metricsTimeframe === "month" ? "default" : "outline"}
                      size="sm"
                      className="rounded-none border-l-0 border-r-0"
                      onClick={() => setMetricsTimeframe("month")}
                    >
                      Mois
                    </Button>
                    <Button
                      variant={metricsTimeframe === "year" ? "default" : "outline"}
                      size="sm"
                      className="rounded-l-none"
                      onClick={() => setMetricsTimeframe("year")}
                    >
                      Année
                    </Button>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin h-8 w-8 text-primary" />
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Croissance des utilisateurs</CardTitle>
                      </CardHeader>
                      <CardContent className="h-80">
                        <div className="h-full w-full bg-muted/20 rounded-lg p-4 flex items-center justify-center">
                          <div className="text-center text-muted-foreground">
                            Graphique de croissance des utilisateurs
                            <p className="text-xs mt-2">
                              (Utilisez une librairie comme Recharts pour implémenter ce graphique)
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Création de roadtrips</CardTitle>
                      </CardHeader>
                      <CardContent className="h-80">
                        <div className="h-full w-full bg-muted/20 rounded-lg p-4 flex items-center justify-center">
                          <div className="text-center text-muted-foreground">
                            Graphique de création de roadtrips
                            <p className="text-xs mt-2">
                              (Utilisez une librairie comme Recharts pour implémenter ce graphique)
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Taux d'engagement</CardTitle>
                      </CardHeader>
                      <CardContent className="h-80">
                        <div className="h-full w-full bg-muted/20 rounded-lg p-4 flex items-center justify-center">
                          <div className="text-center text-muted-foreground">
                            Graphique de taux d'engagement
                            <p className="text-xs mt-2">
                              (Utilisez une librairie comme Recharts pour implémenter ce graphique)
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Statistiques clés</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <dl className="space-y-4">
                          <div className="flex items-center justify-between">
                            <dt className="text-sm font-medium text-muted-foreground">Nouveaux utilisateurs</dt>
                            <dd className="text-sm font-semibold">+{metricsData.userGrowth[0]?.value || 0}</dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-sm font-medium text-muted-foreground">Roadtrips créés</dt>
                            <dd className="text-sm font-semibold">+{metricsData.roadtripCreation[0]?.value || 0}</dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-sm font-medium text-muted-foreground">Taux de conversion</dt>
                            <dd className="text-sm font-semibold">{metricsData.engagementRate[0]?.value || 0}%</dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-sm font-medium text-muted-foreground">Temps moyen sur le site</dt>
                            <dd className="text-sm font-semibold">12m 30s</dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-sm font-medium text-muted-foreground">Taux de rebond</dt>
                            <dd className="text-sm font-semibold">32%</dd>
                          </div>
                        </dl>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Boîte de dialogue de confirmation pour la suppression d'un utilisateur */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => !isProcessingUser && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                Confirmer la suppression
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer définitivement l'utilisateur
              <span className="font-semibold">
                {" "}{userToDelete?.firstName} {userToDelete?.lastName}{" "}
              </span>
              ({userToDelete?.email}) ?
              <p className="mt-2 text-red-500">Cette action est irréversible et supprimera toutes les données associées à cet utilisateur.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessingUser}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToDelete && deleteUser(userToDelete.id)}
              disabled={isProcessingUser}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {isProcessingUser ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" />
                  Supprimer définitivement
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Boîte de dialogue de confirmation pour la suppression d'un roadtrip */}
      <AlertDialog open={!!roadtripToDelete} onOpenChange={() => !isProcessingRoadtrip && setRoadtripToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                Confirmer la suppression
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer définitivement le roadtrip
              <span className="font-semibold">
                {" "}{roadtripToDelete?.title}{" "}
              </span>
              créé par {roadtripToDelete?.author?.firstName} {roadtripToDelete?.author?.lastName} ?
              <p className="mt-2 text-red-500">Cette action est irréversible et supprimera tous les points d'intérêt, commentaires et likes associés.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessingRoadtrip}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => roadtripToDelete && deleteRoadtrip(roadtripToDelete.id)}
              disabled={isProcessingRoadtrip}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {isProcessingRoadtrip ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" />
                  Supprimer définitivement
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}