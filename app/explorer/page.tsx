"use client"

import { useEffect, useState } from "react"
import { RoadtripService } from "@/services/roadtrip-service"
import RoadTripCard from "@/components/road-trip-card"
import { Loader2, Filter, Plane, Map, RefreshCcw } from "lucide-react"
import SearchFilters from "@/components/search-bar"
import { Button } from "@/components/ui/button"

export default function ExplorerPage() {
  const [roadtrips, setRoadtrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [durationRange, setDurationRange] = useState("all")
  const [budgetRange, setBudgetRange] = useState("all")
  const [season, setSeason] = useState("all")
  const [selectedTag, setSelectedTag] = useState("all")
  const [isPremium, setIsPremium] = useState("all")
  const [activeFilters, setActiveFilters] = useState(0)

  const fetchRoadtrips = async () => {
    setLoading(true)
    try {
      const allTrips = await RoadtripService.getAllPublicRoadtrips()
      let filtered = allTrips
      let activeFiltersCount = 0

      if (searchQuery.trim()) {
        filtered = filtered.filter(trip =>
          trip.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        activeFiltersCount++
      }

      if (selectedCountry !== "all") {
        filtered = filtered.filter(trip => trip.country === selectedCountry)
        activeFiltersCount++
      }

      if (durationRange !== "all") {
        filtered = filtered.filter(trip => {
          if (durationRange === "short") return trip.duration <= 3
          if (durationRange === "medium") return trip.duration > 3 && trip.duration <= 7
          if (durationRange === "long") return trip.duration > 7
        })
        activeFiltersCount++
      }

      if (budgetRange !== "all") {
        filtered = filtered.filter(trip => {
          const amount = trip.budget?.amount || 0
          if (budgetRange === "low") return amount <= 500
          if (budgetRange === "medium") return amount > 500 && amount <= 1000
          if (budgetRange === "high") return amount > 1000
        })
        activeFiltersCount++
      }

      if (season !== "all") {
        filtered = filtered.filter(trip => trip.bestSeason?.toLowerCase() === season)
        activeFiltersCount++
      }

      if (selectedTag !== "all") {
        filtered = filtered.filter(trip => trip.tags?.includes(selectedTag))
        activeFiltersCount++
      }

      if (isPremium !== "all") {
        filtered = filtered.filter(trip => trip.isPremium === (isPremium === "true"))
        activeFiltersCount++
      }

      setActiveFilters(activeFiltersCount)
      setRoadtrips(filtered)
    } catch (error) {
      console.error("Erreur lors du chargement des roadtrips :", error)
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedCountry("all")
    setDurationRange("all")
    setBudgetRange("all")
    setSeason("all")
    setSelectedTag("all")
    setIsPremium("all")
  }

  useEffect(() => {
    fetchRoadtrips()
  }, [searchQuery, selectedCountry, durationRange, budgetRange, season, selectedTag, isPremium])

  const allCountries = Array.from(new Set(roadtrips.map(trip => trip.country)))
  const allTags = Array.from(new Set(roadtrips.flatMap(trip => trip.tags || [])))

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <div className="container py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <Plane className="mr-3 h-6 w-6 text-primary" />
                Explorer les Roadtrips
              </h1>
              <p className="text-gray-600">
                Découvrez nos itinéraires soigneusement sélectionnés à travers le monde
              </p>
            </div>
            
            {activeFilters > 0 && (
              <Button 
                variant="outline" 
                onClick={resetFilters}
                className="flex items-center gap-2 border-primary text-primary hover:bg-primary/5 self-start"
              >
                <RefreshCcw className="h-4 w-4" />
                Réinitialiser les filtres
                <span className="ml-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilters}
                </span>
              </Button>
            )}
          </div>

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
        </div>

        <div className="mb-4 flex justify-between items-center">
          <div className="text-gray-600">
            {loading ? (
              <span className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Chargement des roadtrips...
              </span>
            ) : (
              <span>
                {roadtrips.length} {roadtrips.length > 1 ? 'itinéraires trouvés' : 'itinéraire trouvé'}
              </span>
            )}
          </div>

          {/* Vous pourriez ajouter un filtre de tri ici si nécessaire */}
          {roadtrips.length > 0 && !loading && (
            <div className="text-sm text-gray-500">
              <Map className="inline-block h-4 w-4 mr-1" /> 
              {Array.from(new Set(roadtrips.map(trip => trip.country))).length} pays disponibles
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-80 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-gray-500 animate-pulse">Chargement de vos aventures...</p>
            </div>
          </div>
        ) : roadtrips.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-100">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <Filter className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-3">Aucun roadtrip ne correspond à vos critères</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Essayez d'ajuster vos filtres pour découvrir nos itinéraires incroyables ou explorez-les tous.
            </p>
            <Button 
              onClick={resetFilters} 
              className="bg-primary hover:bg-primary-700 text-white"
            >
              Afficher tous les roadtrips
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {roadtrips.map((trip, index) => (
                  <RoadTripCard
                    id={trip._id}
                    title={trip.title}
                    image={trip.image}
                    country={trip.country}
                    region={trip.region}
                    duration={trip.duration}
                    budget={trip.budget?.amount || 0}
                    tags={trip.tags}
                    isPremium={trip.isPremium}
                  />
              ))}
            </div>
            
            {roadtrips.length > 9 && (
              <div className="flex justify-center mt-12">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 max-w-lg text-center">
                  <p className="text-gray-700 mb-4">
                    Vous avez découvert {roadtrips.length} destinations incroyables. Trouvez celle qui vous fera rêver !
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="border-primary text-primary hover:bg-primary/5"
                  >
                    Revenir aux filtres
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}