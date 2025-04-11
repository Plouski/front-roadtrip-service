"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, User, Heart, Map, Home, LogOut, UserCircle } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { AuthService } from "@/services/auth-service"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Vérifier l'authentification au chargement et quand le pathname change
    const checkAuth = async () => {
      setIsLoading(true)
      const authenticated = await AuthService.checkAuthentication()
      setIsAuthenticated(authenticated)
      setIsLoading(false)
    }
    
    checkAuth()
  }, [pathname])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = async () => {
    await AuthService.logout()
    setIsAuthenticated(false)
    router.push('/')
  }

  const navItems = [
    { name: "Accueil", href: "/", icon: Home },
    { name: "Explorer", href: "/explorer", icon: Map },
    { name: "Favoris", href: "/favorites", icon: Heart, requiresAuth: true },
  ]

  // Filtrer les éléments de navigation qui nécessitent une authentification si l'utilisateur n'est pas connecté
  const filteredNavItems = navItems.filter(item => 
    !item.requiresAuth || (item.requiresAuth && isAuthenticated)
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">RoadTrip!</span>
          </Link>

          <nav className="hidden md:flex gap-6">
            {filteredNavItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="mr-1 h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {isLoading ? (
            // Placeholder pendant le chargement
            <div className="h-9 w-24 rounded-md bg-muted animate-pulse"></div>
          ) : isAuthenticated ? (
            // Utilisateur connecté: Afficher menu utilisateur
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <UserCircle className="h-4 w-4" />
                  <span>Mon compte</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Tableau de bord</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Mon profil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/favorites">Mes favoris</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Utilisateur non connecté: Afficher bouton de connexion
            <Link href="/auth">
              <Button variant="outline" size="sm">
                <User className="mr-2 h-4 w-4" />
                Connexion
              </Button>
            </Link>
          )}
          <Link href="/premium">
            <Button className="bg-gradient-to-r from-accent to-yellow-400 hover:opacity-90">Premium</Button>
          </Link>
        </div>

        <button className="flex items-center justify-center rounded-md p-2 md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="container md:hidden py-4 space-y-4">
          <nav className="flex flex-col space-y-4">
            {filteredNavItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href ? "text-primary" : "text-muted-foreground",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
            
            {isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserCircle className="mr-2 h-4 w-4" />
                  Tableau de bord
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="mr-2 h-4 w-4" />
                  Mon profil
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center text-sm font-medium transition-colors hover:text-red-500 text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </button>
              </>
            )}
          </nav>
          <div className="flex flex-col space-y-2">
            {!isAuthenticated && (
              <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  <User className="mr-2 h-4 w-4" />
                  Connexion
                </Button>
              </Link>
            )}
            <Link href="/premium" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-accent to-yellow-400 hover:opacity-90">Premium</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}