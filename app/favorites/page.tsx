"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { RoadtripService } from "@/services/roadtrip-service"
import RoadTripCard from "@/components/road-trip-card"
import { Heart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import SearchFilters from "@/components/search-bar"

export default function FavoritesPage() {
  const router = useRouter()

  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // États pour les filtres
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [selectedTag, setSelectedTag] = useState("all")
  const [budgetRange, setBudgetRange] = useState("all")
  const [durationRange, setDurationRange] = useState("all")
  const [season, setSeason] = useState("all")
  const [isPremium, setIsPremium] = useState("all")

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true)
        const data = await RoadtripService.getFavoriteRoadtrips()
        const favoriteTrips = Array.isArray(data.roadtrips) ? data.roadtrips : []
        setFavorites(favoriteTrips.map((trip: any) => ({ ...trip, isFavorite: true })))
      } catch (error) {
        console.error("Erreur lors du chargement des favoris:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  const filtered = favorites.filter((trip) => {
    const query = searchQuery.toLowerCase()
    const amount = trip.budget?.amount || 0

    return (
      (!searchQuery || trip.title.toLowerCase().includes(query) || trip.country.toLowerCase().includes(query) || trip.tags?.some((tag: string) => tag.toLowerCase().includes(query))) &&
      (selectedCountry === "all" || trip.country === selectedCountry) &&
      (selectedTag === "all" || trip.tags?.includes(selectedTag)) &&
      (budgetRange === "all" ||
        (budgetRange === "low" && amount <= 500) ||
        (budgetRange === "medium" && amount > 500 && amount <= 1000) ||
        (budgetRange === "high" && amount > 1000)) &&
      (durationRange === "all" ||
        (durationRange === "short" && trip.duration <= 3) ||
        (durationRange === "medium" && trip.duration > 3 && trip.duration <= 7) ||
        (durationRange === "long" && trip.duration > 7)) &&
      (season === "all" || trip.bestSeason?.toLowerCase() === season) &&
      (isPremium === "all" || trip.isPremium === (isPremium === "true"))
    )
  })

  const allCountries = Array.from(new Set(favorites.map((t) => t.country)))
  const allTags = Array.from(new Set(favorites.flatMap((t) => t.tags || [])))

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Mes favoris</h1>

      <SearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        durationRange={durationRange}
        setDurationRange={setDurationRange}
        budgetRange={budgetRange}
        setBudgetRange={setBudgetRange}
        season={season}
        setSeason={setSeason}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        isPremium={isPremium}
        setIsPremium={setIsPremium}
        allCountries={allCountries}
        allTags={allTags}
      />

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold mb-2">Aucun favori trouvé</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Essayez d’élargir vos filtres ou explorez de nouveaux roadtrips.
          </p>
          <Button onClick={() => router.push("/")}>Explorer les road trips</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filtered.map((trip) => (
            <RoadTripCard
              key={trip._id}
              id={trip._id}
              title={trip.title}
              image={trip.image}
              country={trip.country}
              region={trip.region}
              duration={trip.duration}
              budget={trip.budget?.amount || 0}
              tags={trip.tags}
              isPremium={trip.isPremium}
              isFavorite={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}
