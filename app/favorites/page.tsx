"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import RoadTripCard from "@/components/road-trip-card"
import { roadTrips } from "@/lib/data"
import { Search, Heart } from "lucide-react"

export default function FavoritesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recent")

  // For demo purposes, let's assume these are the user's favorites
  // In a real app, this would come from a database or API
  const favoriteIds = ["cote-azur", "toscane", "garden-route"]
  const favorites = roadTrips.filter((trip) => favoriteIds.includes(trip.id))

  const filteredFavorites = favorites.filter(
    (trip) =>
      trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    if (sortBy === "price-asc") return a.budget - b.budget
    if (sortBy === "price-desc") return b.budget - a.budget
    if (sortBy === "duration-asc") return a.duration - b.duration
    if (sortBy === "duration-desc") return b.duration - a.duration
    // Default: recent (no change in order)
    return 0
  })

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mes favoris</h1>
          <p className="text-gray-600">Retrouvez tous vos road trips préférés au même endroit</p>
        </div>
      </div>

      {favorites.length > 0 ? (
        <>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Rechercher dans vos favoris..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Plus récents</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
                <SelectItem value="duration-asc">Durée croissante</SelectItem>
                <SelectItem value="duration-desc">Durée décroissante</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFavorites.map((trip) => (
              <RoadTripCard
                key={trip.id}
                id={trip.id}
                title={trip.title}
                image={trip.image}
                country={trip.country}
                region={trip.region}
                duration={trip.duration}
                budget={trip.budget}
                tags={trip.tags}
                isPremium={trip.isPremium}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold mb-2">Aucun favori pour le moment</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Explorez nos road trips et ajoutez-les à vos favoris pour les retrouver facilement ici.
          </p>
          <Button className="bg-primary hover:bg-primary/90">Explorer les road trips</Button>
        </div>
      )}
    </div>
  )
}
