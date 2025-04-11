import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { roadTrips } from "@/lib/data"
import { Calendar, MapPin, DollarSign, Clock, Lock } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: {
    id: string
  }
}

export default function RoadTripPage({ params }: PageProps) {
  const roadTrip = roadTrips.find((trip) => trip.id === params.id)

  if (!roadTrip) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Itinéraire non trouvé</h1>
        <p className="mb-8">L'itinéraire que vous recherchez n'existe pas ou a été supprimé.</p>
        <Link href="/">
          <Button>Retour à l'accueil</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Hero image */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${roadTrip.image})`,
          }}
        />
        <div className="absolute inset-0 hero-gradient" />

        <div className="container relative z-10 flex h-full flex-col justify-end pb-8 text-white">
          <div className="flex flex-wrap gap-2 mb-3">
            {roadTrip.tags.map((tag) => (
              <Badge key={tag} className="bg-white/20 hover:bg-white/30">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="text-4xl font-bold mb-2">{roadTrip.title}</h1>
          <div className="flex items-center text-lg">
            <MapPin className="mr-1 h-5 w-5" />
            {roadTrip.country}
            {roadTrip.region ? ` • ${roadTrip.region}` : ""}
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="prose max-w-none">
              <h2>Description</h2>
              <p>{roadTrip.description}</p>

              <h2>Points d'intérêt</h2>
              <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                {roadTrip.pointsOfInterest.map((poi) => (
                  <div key={poi.name} className="border rounded-lg overflow-hidden">
                    <img src={poi.image || "/placeholder.svg"} alt={poi.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">{poi.name}</h3>
                      <p className="text-gray-600">{poi.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Premium content */}
              <div className="relative my-8 border rounded-lg p-6">
                <h2 className="mb-4">Contenu Premium</h2>

                <div className={roadTrip.isPremium ? "" : "premium-blur"}>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-2">Itinéraire détaillé jour par jour</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Planification optimisée des étapes</li>
                      <li>Temps de conduite estimés entre chaque point</li>
                      <li>Suggestions d'arrêts panoramiques</li>
                      <li>Recommandations d'hébergements</li>
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-2">Carte interactive complète</h3>
                    <div className="bg-gray-200 h-64 rounded flex items-center justify-center">
                      <span className="text-gray-500">Carte interactive détaillée</span>
                    </div>
                  </div>
                </div>

                {!roadTrip.isPremium && (
                  <div className="absolute inset-0 premium-overlay flex flex-col items-center justify-center rounded-lg">
                    <Lock className="h-8 w-8 text-accent mb-3" />
                    <h3 className="text-xl font-bold mb-2">Contenu Premium</h3>
                    <p className="text-center mb-4 max-w-md">
                      Débloquez l'accès à l'itinéraire détaillé, la carte interactive et bien plus encore.
                    </p>
                    <Link href="/premium">
                      <Button className="bg-gradient-to-r from-accent to-yellow-400 hover:opacity-90">
                        Passer à Premium
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">Informations pratiques</h3>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <div className="font-medium">Meilleure saison</div>
                      <div className="text-gray-600">{roadTrip.bestSeason}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <div className="font-medium">Durée</div>
                      <div className="text-gray-600">{roadTrip.duration} jours</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <div className="font-medium">Budget estimé</div>
                      <div className="text-gray-600">{roadTrip.budget}€</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full bg-primary hover:bg-primary/90">Ajouter aux favoris</Button>

                <Button variant="outline" className="w-full">
                  Partager
                </Button>

                <Button
                  className={`w-full ${
                    roadTrip.isPremium ? "bg-accent hover:bg-accent/90" : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!roadTrip.isPremium}
                >
                  {roadTrip.isPremium ? "Télécharger l'itinéraire" : "Réservé aux membres Premium"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
