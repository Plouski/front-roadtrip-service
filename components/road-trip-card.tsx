"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface RoadTripCardProps {
  id: string
  title: string
  image: string
  country: string
  region?: string
  duration: number
  budget: number
  tags: string[]
  isPremium?: boolean
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
}: RoadTripCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
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
            className={cn("h-5 w-5 transition-colors", isFavorite ? "fill-red-500 text-red-500" : "text-gray-600")}
          />
        </button>

        {isPremium && (
          <div className="absolute left-3 top-3">
            <Badge className="premium-badge font-semibold">Premium</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-medium text-gray-500">
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
            <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-gray-500">
              +{tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="text-lg font-bold text-primary">
          {budget}€<span className="ml-1 text-sm font-normal text-gray-500">estimé</span>
        </div>
      </CardContent>

      <CardFooter className="border-t p-4 pt-3">
        <Link href={`/road-trip/${id}`} className="w-full">
          <Button className="w-full bg-primary hover:bg-primary/90">En savoir plus</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
