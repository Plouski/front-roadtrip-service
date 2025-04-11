import Hero from "@/components/hero"
import SearchBar from "@/components/search-bar"
import RoadTripCard from "@/components/road-trip-card"
import PremiumFeatures from "@/components/premium-features"
import { roadTrips } from "@/lib/data"

export default function Home() {
  return (
    <div>
      <Hero />

      <div className="container py-8">
        <div className="-mt-16 relative z-20">
          <SearchBar />
        </div>

        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Road trips populaires</h2>
            <a href="/explorer" className="text-primary hover:underline">
              Voir tout
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadTrips.slice(0, 6).map((trip) => (
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
        </section>
      </div>

      <PremiumFeatures />

      <section className="container py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Comment ça marche</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Planifier votre road trip parfait n'a jamais été aussi simple avec RoadTrip!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Explorez</h3>
            <p className="text-gray-600">
              Parcourez notre collection d'itinéraires soigneusement sélectionnés à travers le monde.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Personnalisez</h3>
            <p className="text-gray-600">
              Adaptez l'itinéraire à vos préférences, ajoutez des étapes ou modifiez la durée.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Voyagez</h3>
            <p className="text-gray-600">
              Téléchargez votre itinéraire et partez à l'aventure avec toutes les informations nécessaires.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
