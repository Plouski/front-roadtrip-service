"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AuthService } from "@/services/auth-service"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Menu, X, User, Heart, Map, Home, LogOut, UserCircle, Settings, LayoutDashboard
} from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  const pathname = usePathname()
  const router = useRouter()

  // Récupère le statut d'authentification et le rôle de l'utilisateur
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      try {
        const authenticated = await AuthService.checkAuthentication()
        setIsAuthenticated(authenticated)

        if (authenticated) {
          const userData = await AuthService.getProfile() // ✅ Correction ici
          setUserRole(userData?.role || "user")
        } else {
          setUserRole(null)
        }
      } catch (error) {
        console.error("Erreur de vérification d'authentification:", error)
        setIsAuthenticated(false)
        setUserRole(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname])

  // Effet pour gérer le scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleLogout = async () => {
    await AuthService.logout()
    setIsAuthenticated(false)
    setUserRole(null)
    router.push("/auth")
  }

  const isAdmin = userRole === "admin"

  const navItems = [
    { name: "Accueil", href: "/", icon: Home },
    { name: "Explorer", href: "/explorer", icon: Map },
    { name: "Favoris", href: "/favorites", icon: Heart, requiresAuth: true }
  ]

  const filteredNavItems = navItems.filter(
    item => !item.requiresAuth || isAuthenticated
  )

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur transition-all duration-200",
        scrolled ? "bg-white/95 shadow-sm" : "bg-white border-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo + Navigation principale */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            {/* Logo desktop */}
            <div className="hidden sm:block">
              <Image
                src="/logo.png"
                alt="ROADTRIP! La vraie aventure"
                width={180}
                height={50}
                className="h-10 w-auto"
                priority
              />
            </div>
            {/* Logo mobile */}
            <div className="block sm:hidden">
              <Image
                src="/logo.png"
                alt="ROADTRIP!"
                width={40}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </div>
          </Link>

          <nav className="hidden md:flex gap-6">
            {filteredNavItems.map(({ name, href, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors relative py-1",
                    isActive
                      ? "text-primary"
                      : "text-gray-600 hover:text-primary"
                  )}
                >
                  <Icon className="mr-1 h-4 w-4" />
                  {name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Actions à droite (auth, admin, premium...) */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && isAdmin && (
            <Link href="/admin/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="bg-yellow-50 text-yellow-800 border-yellow-200 hover:bg-yellow-100"
              >
                <Settings className="mr-2 h-4 w-4" />
                Administration
              </Button>
            </Link>
          )}

          {isLoading ? (
            <div className="h-9 w-24 rounded-md bg-gray-100 animate-pulse" />
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-gray-200 hover:bg-gray-50"
                >
                  <UserCircle className="h-4 w-4 text-primary" />
                  <span>Mon compte</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Mon profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/favorites" className="flex items-center">
                    <Heart className="mr-2 h-4 w-4" />
                    Mes favoris
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-200 hover:bg-gray-50 hover:text-primary transition-colors"
              >
                <User className="mr-2 h-4 w-4" />
                Connexion
              </Button>
            </Link>
          )}

          <Link href="/premium">
            <Button className="bg-gradient-to-r from-primary to-primary-700 hover:opacity-90 shadow-sm">
              Premium
            </Button>
          </Link>
        </div>

        {/* Bouton menu mobile */}
        <button
          className="flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="container md:hidden py-4 space-y-4 bg-white border-t border-gray-100">
          <nav className="flex flex-col space-y-4">
            {filteredNavItems.map(({ name, href, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors p-2 rounded-md",
                    isActive
                      ? "text-primary bg-red-50"
                      : "text-gray-600 hover:text-primary hover:bg-gray-50"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="mr-2 h-5 w-5" />
                  {name}
                </Link>
              )
            })}

            {isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center text-sm font-medium transition-colors p-2 rounded-md text-gray-600 hover:text-primary hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Tableau de bord
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center text-sm font-medium transition-colors p-2 rounded-md text-gray-600 hover:text-primary hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="mr-2 h-5 w-5" />
                  Mon profil
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center text-sm font-medium transition-colors p-2 rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    Administration
                  </Link>
                )}

                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center text-sm font-medium transition-colors p-2 rounded-md text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Déconnexion
                </button>
              </>
            )}
          </nav>

          {/* Boutons mobile (connexion/premium) */}
          <div className="flex flex-col space-y-2 p-2">
            {!isAuthenticated && (
              <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full border-gray-200">
                  <User className="mr-2 h-4 w-4" />
                  Connexion
                </Button>
              </Link>
            )}
            <Link href="/premium" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-primary to-primary-700 hover:opacity-90">
                Premium
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
