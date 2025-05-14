"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { AuthService } from "@/services/auth-service"
import LoginPromptModal from "@/components/ui/login-prompt-modal"
import { RoadtripService } from "@/services/roadtrip-service"

interface RoadTripCardProps {
  id: string
  title: string
  image: string
  country: string
  region?: string
  duration: number
  budget: string
  tags: string[]
  isPremium?: boolean
  isFavorite?: boolean
}

export default function RoadTripCard({
  id,
  title,
  image,
  country,
  region,
  duration,
  budget,
  tags,
  isPremium = false,
  isFavorite: isFavoriteProp = false,
}: RoadTripCardProps) {
  
  const [isFavorite, setIsFavorite] = useState(isFavoriteProp)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await AuthService.checkAuthentication()
      setIsAuthenticated(auth)
    }
    checkAuth()
  }, [])

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      setShowLoginPrompt(true)
      return
    }

    try {
      const response = await RoadtripService.toggleFavorite(id)
      setIsFavorite(response.favorited)
    } catch (error) {
      console.error("Erreur lors de l'ajout/retrait du favori :", error)
    }
  }

  return (
    <>
      <LoginPromptModal open={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />

      <Card className="border-none shadow-md hover:shadow-lg rounded-xl overflow-hidden">
        <div className="relative">
          <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
            <img
              src={image || "/placeholder.svg"}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Bouton favoris */}
          <button
            onClick={toggleFavorite}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 backdrop-blur-sm hover:bg-white shadow"
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-colors",
                isFavorite ? "fill-red-600 text-red-600" : "text-gray-600"
              )}
            />
          </button>

          {/* Badge Premium */}
          {isPremium && (
            <div className="absolute left-3 top-3">
              <Badge className="bg-red-600 text-white">Premium</Badge>
            </div>
          )}
        </div>

        <CardContent className="p-5">
          {/* Pays / Durée */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>{country}{region ? ` • ${region}` : ""}</span>
            <span>{duration} jours</span>
          </div>

          {/* Titre */}
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h3>

          {/* Tags */}
          <div className="mb-3 flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline">+{tags.length - 3}</Badge>
            )}
          </div>

          {/* Budget */}
          <div className="text-sm text-red-600 font-medium">
            {budget}€
            <span className="text-gray-500 font-normal"> estimé</span>
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0">
          <Link href={`/roadtrip/${id}`} className="w-full">
            <Button className="w-full">
              En savoir plus
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </>
  )
}
