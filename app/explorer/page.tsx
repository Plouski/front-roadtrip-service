"use client";

import { useEffect, useState } from "react";
import { RoadtripService } from "@/services/roadtrip-service";
import RoadTripCard from "@/components/road-trip-card";
import { Loader2, Filter, Plane, Map, RefreshCcw } from "lucide-react";
import SearchFilters from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";

export default function ExplorerPage() {
  const [roadtrips, setRoadtrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [durationRange, setDurationRange] = useState("all");
  const [budgetRange, setBudgetRange] = useState("all");
  const [season, setSeason] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [isPremium, setIsPremium] = useState("all");
  const [activeFilters, setActiveFilters] = useState(0);

  const fetchRoadtrips = async () => {
    setLoading(true);
    try {
      const allTrips = await RoadtripService.getAllPublicRoadtrips();
      let filtered = allTrips;
      let activeFiltersCount = 0;

      if (searchQuery.trim()) {
        filtered = filtered.filter((trip: { title: string }) =>
          trip.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        activeFiltersCount++;
      }

      if (selectedCountry !== "all") {
        filtered = filtered.filter(
          (trip: { country: string }) => trip.country === selectedCountry
        );
        activeFiltersCount++;
      }

      if (durationRange !== "all") {
        filtered = filtered.filter((trip: { duration: number }) => {
          if (durationRange === "short") return trip.duration <= 3;
          if (durationRange === "medium")
            return trip.duration > 3 && trip.duration <= 7;
          if (durationRange === "long") return trip.duration > 7;
        });
        activeFiltersCount++;
      }

      if (budgetRange !== "all") {
        filtered = filtered.filter((trip: { budget: { amount: number } }) => {
          const amount = trip.budget?.amount || 0;
          if (budgetRange === "low") return amount <= 500;
          if (budgetRange === "medium") return amount > 500 && amount <= 1000;
          if (budgetRange === "high") return amount > 1000;
        });
        activeFiltersCount++;
      }

      if (season !== "all") {
        filtered = filtered.filter(
          (trip: { bestSeason: string }) =>
            trip.bestSeason?.toLowerCase() === season
        );
        activeFiltersCount++;
      }

      if (selectedTag !== "all") {
        filtered = filtered.filter((trip: { tags: string | string[] }) =>
          trip.tags?.includes(selectedTag)
        );
        activeFiltersCount++;
      }

      if (isPremium !== "all") {
        filtered = filtered.filter(
          (trip: { isPremium: boolean }) =>
            trip.isPremium === (isPremium === "true")
        );
        activeFiltersCount++;
      }

      setActiveFilters(activeFiltersCount);
      setRoadtrips(filtered);
    } catch (error) {
      console.error("Erreur lors du chargement des roadtrips :", error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCountry("all");
    setDurationRange("all");
    setBudgetRange("all");
    setSeason("all");
    setSelectedTag("all");
    setIsPremium("all");
    fetchRoadtrips();
  };

  useEffect(() => {
    fetchRoadtrips();
  }, []);

  const allCountries = Array.from(
    new Set(roadtrips.map((trip) => trip.country))
  );
  const allTags = Array.from(
    new Set(roadtrips.flatMap((trip) => trip.tags || []))
  );

  return (
    <div className="container py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-snug">
            Explorer les Roadtrips
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed sm:leading-relaxed">
            Découvrez nos itinéraires soigneusement sélectionnés à travers le
            monde
          </p>
        </div>
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
        onSearch={fetchRoadtrips}
      />
      <div className="mb-4 flex justify-between items-center">
        <div className="text-gray-600">
          {loading ? (
            <Loading text="Chargement des itinéraires..." />
          ) : (
            <span>
              {roadtrips.length}{" "}
              {roadtrips.length > 1
                ? "itinéraires trouvés"
                : "itinéraire trouvé"}
            </span>
          )}
        </div>
        {roadtrips.length > 0 && !loading && (
          <div className="text-sm text-gray-500">
            <Map className="inline-block h-4 w-4 mr-1" />
            {
              Array.from(new Set(roadtrips.map((trip) => trip.country))).length
            }{" "}
            pays disponibles
          </div>
        )}
      </div>

      {loading ? (
        <Loading text="Chargement de vos aventures..." />
      ) : roadtrips.length === 0 ? (
        <div className="rounded-xl p-12 text-center border border-gray-100 ">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6 shadow-inner">
            <Filter className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold">
            Aucun roadtrip ne correspond à vos critères
          </h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto mb-5 leading-relaxed sm:leading-relaxed">
            EEssayez d'ajuster vos filtres pour découvrir nos itinéraires
            incroyables ou explorez-les tous.
          </p>
          <Button variant="outline" onClick={resetFilters}>
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
                  Vous avez découvert {roadtrips.length} destinations
                  incroyables. Trouvez celle qui vous fera rêver !
                </p>
                <Button
                  variant="outline"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
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
  );
}
