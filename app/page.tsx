'use client'

import { useEffect, useState } from "react"
import Hero from "@/components/accueil/hero"
import PremiumFeatures from "@/components/accueil/premium-features"
import { RoadtripService } from "@/services/roadtrip-service"
import SearchFilters from "@/components/search-bar"
import HowItWorks from "@/components/accueil/how-it-works"
import PopularRoadtrips from "@/components/accueil/popular-roadtrips"

export default function Home() {
  const [roadtrips, setRoadtrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [durationRange, setDurationRange] = useState("all")
  const [budgetRange, setBudgetRange] = useState("all")
  const [season, setSeason] = useState("all")
  const [selectedTag, setSelectedTag] = useState("all")
  const [isPremium, setIsPremium] = useState("all")

  const fetchRoadtrips = async () => {
    setLoading(true)
    try {

      const allTrips = await RoadtripService.getAllPublicRoadtrips()

      let filtered = allTrips

      {/* Destination */}
      if (searchQuery.trim()) {
        filtered = filtered.filter((trip: { title: string }) =>
          trip.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      {/* Pays */}
      if (selectedCountry !== "all") {
        filtered = filtered.filter((trip: { country: string }) => trip.country === selectedCountry)
      }

      {/* Durée */}
      if (durationRange !== "all") {
        filtered = filtered.filter((trip: { duration: number }) => {
          if (durationRange === "short") return trip.duration <= 3
          if (durationRange === "medium") return trip.duration > 3 && trip.duration <= 7
          if (durationRange === "long") return trip.duration > 7
        })
      }

      {/* Budget */}
      if (budgetRange !== "all") {
        filtered = filtered.filter((trip: { budget: { amount: number } }) => {
          const amount = trip.budget?.amount || 0
          if (budgetRange === "low") return amount <= 500
          if (budgetRange === "medium") return amount > 500 && amount <= 1000
          if (budgetRange === "high") return amount > 1000
        })
      }

      {/* Saison */}
      if (season !== "all") {
        filtered = filtered.filter((trip: { bestSeason: string }) => trip.bestSeason?.toLowerCase() === season)
      }

      {/* Tag */}
      if (selectedTag !== "all") {
        filtered = filtered.filter((trip: { tags: string | string[] }) => trip.tags?.includes(selectedTag))
      }

      {/* Type de roadtrip */}
      if (isPremium !== "all") {
        filtered = filtered.filter((trip: { isPremium: boolean }) => trip.isPremium === (isPremium === "true"))
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
  }, [])

  const allCountries = Array.from(new Set(roadtrips.map(trip => trip.country)))
  const allTags = Array.from(new Set(roadtrips.flatMap(trip => trip.tags || [])))

  return (
    <div className="overflow-hidden">
      <Hero />
      <div className="py-10 px-5">
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
          onSearch={fetchRoadtrips}
        />
        <PopularRoadtrips
          roadtrips={roadtrips}
          loading={loading}
          onResetFilters={() => {
            setSearchQuery("")
            setSelectedCountry("all")
            setDurationRange("all")
            setBudgetRange("all")
            setSeason("all")
            setSelectedTag("all")
            setIsPremium("all")
            setTimeout(() => {
              fetchRoadtrips()
            }, 0)
          }}          
        />
      <PremiumFeatures />
      <HowItWorks />
      </div>
    </div>
  )
}