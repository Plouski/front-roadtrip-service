import Link from "next/link"
import { ChevronRight, Filter, Loader2, Map, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import RoadTripCard from "@/components/road-trip-card"

interface PopularRoadtripsProps {
  roadtrips: any[]
  loading: boolean
  onResetFilters: () => void
}

export default function PopularRoadtrips({ roadtrips, loading, onResetFilters }: PopularRoadtripsProps) {
  return (
    <section className="mt-20">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center group">
          <div className="h-10 w-1.5 bg-gradient-to-b from-primary to-primary/40 rounded-full mr-4 group-hover:scale-y-110 transition-transform"></div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">Road trips populaires</h2>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-80 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping"></div>
              <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
            </div>
            <p className="text-gray-500 mt-4 font-medium">Chargement des itinéraires...</p>
          </div>
        </div>
      ) : roadtrips.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6 shadow-inner">
            <Filter className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold mb-3 text-gray-800">Aucun roadtrip trouvé</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
            Essayez d'ajuster vos critères de recherche pour découvrir nos itinéraires incroyables.
          </p>
          <Button 
            variant="outline" 
            onClick={onResetFilters}
            className="rounded-full px-8 py-6 h-auto text-lg border-2 hover:bg-gray-50"
          >
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {roadtrips.slice(0, 6).map((trip) => (
            <div key={trip.id} className="group transform transition-all duration-300 hover:-translate-y-2">
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
        <div className="mt-12 text-center">
          <Link href="/explorer">
            <Button 
              variant="outline" 
              className="rounded-full h-auto text-lg border-2 border-primary/80 text-primary hover:bg-primary/5 shadow-sm hover:shadow-md transition-all font-medium"
            >
              Explorer tous les itinéraires
              <Map className="ml-3 h-5 w-5" />
            </Button>
          </Link>
        </div>
      )}
    </section>
  )
}