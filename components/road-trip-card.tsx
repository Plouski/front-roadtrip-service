"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart, Plane } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
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
  isFavorite: isFavoriteProp = false
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
      <Card className="overflow-hidden transition-all hover:shadow-md border-t-4 border-t-red-600">
        <div className="relative">
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={image || "/placeholder.svg"}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <button
            onClick={toggleFavorite}
            className="absolute right-3 top-3 rounded-full bg-white/80 p-2 backdrop-blur-sm transition-colors hover:bg-white"
          >
            <Heart
              className={cn("h-5 w-5 transition-colors", isFavorite ? "fill-red-600 text-red-600" : "text-gray-600")}
            />
          </button>
          {isPremium && (
            <div className="absolute left-3 top-3">
              <Badge className="bg-red-600 text-white font-semibold">Premium</Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-medium text-gray-500 flex items-center">
              <Plane className="h-4 w-4 mr-1 text-red-600" />
              {country}
              {region ? ` • ${region}` : ""}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="font-semibold">{duration}</span>
              <span className="text-gray-500">jours</span>
            </div>
          </div>

          <h3 className="mb-2 text-lg font-bold">{title}</h3>

          <div className="mb-3 flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-gray-100 text-black hover:bg-gray-200">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-gray-500">
                +{tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="text-lg font-bold text-red-600">
            {budget}€<span className="ml-1 text-sm font-normal text-gray-500">estimé</span>
          </div>
        </CardContent>

        <CardFooter className="border-t p-4 pt-3">
          <Link href={`/roadtrip/${id}`} className="w-full">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white">En savoir plus</Button>
          </Link>
        </CardFooter>
      </Card>
    </>
  )
}