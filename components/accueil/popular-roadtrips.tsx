import Link from "next/link";
import { Filter, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import RoadTripCard from "@/components/road-trip-card";
import Loading from "../ui/loading";

interface PopularRoadtripsProps {
  roadtrips: any[];
  loading: boolean;
  onResetFilters: () => void;
}

export default function PopularRoadtrips({
  roadtrips,
  loading,
  onResetFilters,
}: PopularRoadtripsProps) {
  return (
    <section>
      <div className="flex items-center group mb-5">
        <div className="h-10 w-1.5 bg-gradient-to-b from-primary to-primary/40 rounded-full mr-4 group-hover:scale-y-110 transition-transform"></div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Road trips populaires</h2>
      </div>
      {loading ? (
        <Loading text="Chargement des roadtrips..." />
      ) : roadtrips.length === 0 ? (
        <div className="rounded-xl p-12 text-center border border-gray-100 ">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6 shadow-inner">
            <Filter className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold">Aucun roadtrip trouvé</h3>
          <p className="text-sm sm:text-base md:text-lg text-gray-500 max-w-md mx-auto mb-5">
            Essayez d'ajuster vos critères de recherche pour découvrir nos
            itinéraires incroyables.
          </p>
          <Button variant="outline" onClick={onResetFilters}>
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {roadtrips.slice(0, 6).map((trip) => (
            <div
              key={trip.id}
            >
              <RoadTripCard
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
            </div>
          ))}
        </div>
      )}
      {roadtrips.length > 0 && !loading && (
        <div className="mt-5 text-center">
          <Link href="/explorer">
            <Button variant="outline">
              Explorer tous les itinéraires
              <Map className="ml-3 h-5 w-5" />
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}
