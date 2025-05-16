"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RoadtripService } from "@/services/roadtrip-service";
import RoadTripCard from "@/components/road-trip-card";
import { Heart, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchFilters from "@/components/search-bar";
import Loading from "@/components/ui/loading";

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [budgetRange, setBudgetRange] = useState("all");
  const [durationRange, setDurationRange] = useState("all");
  const [season, setSeason] = useState("all");
  const [isPremium, setIsPremium] = useState("all");
  const [activeFilters, setActiveFilters] = useState(0);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const data = await RoadtripService.getFavoriteRoadtrips();
        const favoriteTrips = Array.isArray(data.roadtrips)
          ? data.roadtrips
          : [];
        const mapped = favoriteTrips.map((trip: any) => ({
          ...trip,
          isFavorite: true,
        }));
        setFavorites(mapped);
        setFilteredFavorites(mapped);
      } catch (error) {
        console.error("Erreur lors du chargement des favoris:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    const count =
      (searchQuery.trim() ? 1 : 0) +
      (selectedCountry !== "all" ? 1 : 0) +
      (selectedTag !== "all" ? 1 : 0) +
      (budgetRange !== "all" ? 1 : 0) +
      (durationRange !== "all" ? 1 : 0) +
      (season !== "all" ? 1 : 0) +
      (isPremium !== "all" ? 1 : 0);

    setActiveFilters(count);
  }, [
    searchQuery,
    selectedCountry,
    selectedTag,
    budgetRange,
    durationRange,
    season,
    isPremium,
  ]);

  const applyFilters = () => {
    const query = searchQuery.toLowerCase();

    const result = favorites.filter((trip) => {
      const amount = trip.budget?.amount || 0;

      return (
        (!searchQuery ||
          trip.title.toLowerCase().includes(query) ||
          trip.country.toLowerCase().includes(query) ||
          trip.tags?.some((tag: string) =>
            tag.toLowerCase().includes(query)
          )) &&
        (selectedCountry === "all" || trip.country === selectedCountry) &&
        (selectedTag === "all" || trip.tags?.includes(selectedTag)) &&
        (budgetRange === "all" ||
          (budgetRange === "low" && amount <= 500) ||
          (budgetRange === "medium" && amount > 500 && amount <= 1000) ||
          (budgetRange === "high" && amount > 1000)) &&
        (durationRange === "all" ||
          (durationRange === "short" && trip.duration <= 3) ||
          (durationRange === "medium" &&
            trip.duration > 3 &&
            trip.duration <= 7) ||
          (durationRange === "long" && trip.duration > 7)) &&
        (season === "all" || trip.bestSeason?.toLowerCase() === season) &&
        (isPremium === "all" || trip.isPremium === (isPremium === "true"))
      );
    });

    setFilteredFavorites(result);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCountry("all");
    setSelectedTag("all");
    setBudgetRange("all");
    setDurationRange("all");
    setSeason("all");
    setIsPremium("all");
    setFilteredFavorites(favorites);
  };

  const allCountries = Array.from(new Set(favorites.map((t) => t.country)));
  const allTags = Array.from(new Set(favorites.flatMap((t) => t.tags || [])));

  return (
    <div className="container py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug">
          Mes favoris
        </h2>
        {activeFilters > 0 && (
          <Button onClick={resetFilters} className="flex items-center gap-2 ">
            <RefreshCcw className="h-4 w-4" />
            Réinitialiser les filtres
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
        onSearch={applyFilters}
      />

      {loading ? (
        <Loading text="Chargement de vos favoris..." />
      ) : filteredFavorites.length === 0 ? (
        <div className="rounded-xl p-12 text-center border border-gray-100">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6 shadow-inner">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold">Aucun favori trouvé</h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto mb-5 leading-relaxed sm:leading-relaxed">
            Essayez d’élargir vos filtres ou explorez de nouveaux roadtrips.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={resetFilters}>Réinitialiser les filtres</Button>
            <Button variant="outline" onClick={() => router.push("/explorer")}>
              Explorer tous les roadtrips
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredFavorites.map((trip) => (
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
  );
}
