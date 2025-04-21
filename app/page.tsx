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
          }}
        />
      </div>
      <PremiumFeatures />
      <HowItWorks />
    </div>
  )
}