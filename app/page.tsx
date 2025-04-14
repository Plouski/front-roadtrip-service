'use client'

import { useEffect, useState } from "react"
import Hero from "@/components/hero"
import { Loader2, Map, Compass, ChevronRight, Filter, Star } from "lucide-react"
import RoadTripCard from "@/components/road-trip-card"
import PremiumFeatures from "@/components/premium-features"
import { RoadtripService } from "@/services/roadtrip-service"
import SearchFilters from "@/components/search-bar"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [roadtrips, setRoadtrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [durationRange, setDurationRange] = useState("all")
  const [budgetRange, setBudgetRange] = useState("all")
  const [season, setSeason] = useState("all")
  const [selectedTag, setSelectedTag] = useState("all")
  const [isPremium, setIsPremium] = useState("all")
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

  const fetchRoadtrips = async () => {
    setLoading(true)
    try {
      const allTrips = await RoadtripService.getAllPublicRoadtrips()
      let filtered = allTrips

      if (searchQuery.trim()) {
        filtered = filtered.filter(trip =>
          trip.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      if (selectedCountry !== "all") {
        filtered = filtered.filter(trip => trip.country === selectedCountry)
      }

      if (durationRange !== "all") {
        filtered = filtered.filter(trip => {
          if (durationRange === "short") return trip.duration <= 3
          if (durationRange === "medium") return trip.duration > 3 && trip.duration <= 7
          if (durationRange === "long") return trip.duration > 7
        })
      }

      if (budgetRange !== "all") {
        filtered = filtered.filter(trip => {
          const amount = trip.budget?.amount || 0
          if (budgetRange === "low") return amount <= 500
          if (budgetRange === "medium") return amount > 500 && amount <= 1000
          if (budgetRange === "high") return amount > 1000
        })
      }

      if (season !== "all") {
        filtered = filtered.filter(trip => trip.bestSeason?.toLowerCase() === season)
      }

      if (selectedTag !== "all") {
        filtered = filtered.filter(trip => trip.tags?.includes(selectedTag))
      }

      if (isPremium !== "all") {
        filtered = filtered.filter(trip => trip.isPremium === (isPremium === "true"))
      }

      setRoadtrips(filtered)
    } catch (error) {
      console.error("Erreur lors du chargement des roadtrips :", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoadtrips()
  }, [searchQuery, selectedCountry, durationRange, budgetRange, season, selectedTag, isPremium])

  const allCountries = Array.from(new Set(roadtrips.map(trip => trip.country)))
  const allTags = Array.from(new Set(roadtrips.flatMap(trip => trip.tags || [])))

  return (
    <div className="overflow-hidden">
      <Hero />

      <div className="container py-12 px-4 sm:px-6 lg:px-8">
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

        <section className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="h-8 w-1 bg-primary rounded-full mr-3"></div>
              <h2 className="text-2xl font-bold">Road trips populaires</h2>
            </div>
            <Link href="/explorer" className="group flex items-center text-primary hover:text-primary-700 transition-colors">
              <span className="mr-1">Voir tout</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-60 bg-gray-50 rounded-lg">
              <div className="flex flex-col items-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
                <p className="text-gray-500">Chargement des itinéraires...</p>
              </div>
            </div>
          ) : roadtrips.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Filter className="h-7 w-7 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">Aucun roadtrip trouvé</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Essayez d'ajuster vos critères de recherche pour découvrir nos itinéraires incroyables.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCountry("all")
                  setDurationRange("all")
                  setBudgetRange("all")
                  setSeason("all")
                  setSelectedTag("all")
                  setIsPremium("all")
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {roadtrips.slice(0, 6).map((trip) => (
                <RoadTripCard
                  key={trip.id}
                  id={trip.id}
                  title={trip.title}
                  image={trip.image}
                  country={trip.country}
                  region={trip.region}
                  duration={trip.duration}
                  budget={
                    typeof trip.budget === "object"
                      ? `${trip.budget.amount} ${trip.budget.currency}`
                      : `${trip.budget} €`
                  }
                  tags={trip.tags}
                  isPremium={trip.isPremium}
                />
              ))}
            </div>
          )}

          {roadtrips.length > 0 && (
            <div className="mt-8 text-center">
              <Link href="/explorer">
                <Button variant="outline" className="rounded-full px-6 border-primary text-primary hover:bg-primary/5">
                  Explorer tous les itinéraires
                  <Map className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </section>
      </div>

      <PremiumFeatures />

      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 to-transparent"></div>
        <div className="absolute -top-5 -right-5 w-32 h-32 bg-primary/5 rounded-full"></div>
        
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="h-px w-8 bg-primary/40 mr-3"></div>
              <span className="text-primary font-semibold">FONCTIONNEMENT</span>
              <div className="h-px w-8 bg-primary/40 ml-3"></div>
            </div>
            <h2 className="text-3xl font-bold mb-4">Comment ça marche</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Planifier votre road trip parfait n'a jamais été aussi simple avec ROADTRIP!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
            {/* Ligne connectant les étapes */}
            <div className="absolute top-16 left-[calc(50%-60px)] right-[calc(50%-60px)] h-0.5 bg-gray-200 hidden md:block"></div>
            
            {/* Étape 1 */}
            <div className="relative text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center shadow-md">
                  <span className="text-2xl font-bold">1</span>
                </div>
              </div>
              <div className="pt-8">
                <h3 className="text-xl font-bold mb-3">Explorez</h3>
                <p className="text-gray-600 leading-relaxed">
                  Parcourez notre collection d'itinéraires soigneusement sélectionnés à travers le monde entier.
                </p>
                <div className="mt-6 flex justify-center">
                  <Map className="h-10 w-10 text-primary/40" />
                </div>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="relative text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center shadow-md">
                  <span className="text-2xl font-bold">2</span>
                </div>
              </div>
              <div className="pt-8">
                <h3 className="text-xl font-bold mb-3">Personnalisez</h3>
                <p className="text-gray-600 leading-relaxed">
                  Adaptez l'itinéraire à vos préférences, ajoutez des étapes ou modifiez la durée selon vos envies.
                </p>
                <div className="mt-6 flex justify-center">
                  <Compass className="h-10 w-10 text-primary/40" />
                </div>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="relative text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center shadow-md">
                  <span className="text-2xl font-bold">3</span>
                </div>
              </div>
              <div className="pt-8">
                <h3 className="text-xl font-bold mb-3">Voyagez</h3>
                <p className="text-gray-600 leading-relaxed">
                  Téléchargez votre itinéraire et partez à l'aventure avec toutes les informations nécessaires.
                </p>
                <div className="mt-6 flex justify-center">
                  <Star className="h-10 w-10 text-primary/40" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/explorer">
              <Button className="bg-primary hover:bg-primary-700 text-white rounded-full px-8 py-6 h-auto text-lg">
                Commencer l'aventure
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}