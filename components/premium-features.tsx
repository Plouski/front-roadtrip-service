import { Button } from "@/components/ui/button"
import { Check, Plane, Star, Shield, Clock, MapPin, Download, Headphones } from "lucide-react"

export default function PremiumFeatures() {
  const features = [
    {
      text: "Accès à tous les itinéraires détaillés",
      icon: MapPin
    },
    {
      text: "Assistant IA personnalisé pour planifier vos voyages",
      icon: Star
    },
    {
      text: "Téléchargement des cartes hors-ligne",
      icon: Download
    },
    {
      text: "Recommandations d'hébergements exclusifs",
      icon: Shield
    },
    {
      text: "Mises à jour prioritaires des nouveaux itinéraires",
      icon: Clock
    },
    {
      text: "Support client dédié 24/7",
      icon: Headphones
    }
  ]

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 relative overflow-hidden">
      {/* Éléments de design de fond */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-primary to-transparent"></div>
      <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-primary/5"></div>
      <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-primary/5"></div>

      <div className="container relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="h-px w-12 bg-primary/60 mr-4"></div>
            <span className="text-primary font-semibold">ABONNEMENT</span>
            <div className="h-px w-12 bg-primary/60 ml-4"></div>
          </div>
          <h2 className="text-4xl font-bold mb-4">Passez à <span className="text-primary">ROADTRIP!</span> Premium</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Débloquez toutes les fonctionnalités et profitez d'une expérience de voyage sans limites avec notre
            abonnement premium.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200 transition-transform duration-300 hover:shadow-lg relative hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gray-200 rounded-t-xl"></div>
            <h3 className="text-xl font-bold mb-2 flex items-center">
              <span className="mr-2">🌱</span>
              Découverte
            </h3>
            <div className="text-4xl font-bold mb-1">0€</div>
            <p className="text-sm text-gray-500 mb-6">pour toujours</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div className="flex items-center justify-center h-5 w-5 rounded-full bg-green-100 mr-3 mt-0.5">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span>Accès aux itinéraires de base</span>
              </li>
              <li className="flex items-start">
                <div className="flex items-center justify-center h-5 w-5 rounded-full bg-green-100 mr-3 mt-0.5">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span>Recherche de destinations</span>
              </li>
              <li className="flex items-start">
                <div className="flex items-center justify-center h-5 w-5 rounded-full bg-green-100 mr-3 mt-0.5">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span>Sauvegarde de favoris</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full rounded-lg border-gray-300 hover:border-gray-400 hover:bg-gray-50">
              Commencer gratuitement
            </Button>
          </div>

          {/* Monthly Plan */}
          <div className="bg-white rounded-xl shadow-xl p-8 border-0 transform scale-105 z-10 relative hover:-translate-y-1 transition-transform duration-300">
            
            {/* Barre supérieure colorée */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-primary-700 rounded-t-xl"></div>
            
            <h3 className="text-xl font-bold mb-2 flex items-center text-primary">
              <Plane className="h-5 w-5 mr-2 transform rotate-45" />
              Mensuel
            </h3>
            <div className="text-4xl font-bold mb-1">9,99€</div>
            <p className="text-sm text-gray-500 mb-6">par mois</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 mr-3 mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span className="font-medium">Tous les avantages gratuits</span>
              </li>
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <li key={index} className="flex items-start">
                    <div className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 mr-3 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span>{feature.text}</span>
                  </li>
                );
              })}
            </ul>
            <Button className="w-full bg-primary hover:bg-primary-700 text-white shadow-md rounded-lg">
              S'abonner maintenant
            </Button>
          </div>

          {/* Annual Plan */}
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200 transition-transform duration-300 hover:shadow-lg relative hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-t-xl"></div>
            <h3 className="text-xl font-bold mb-2 flex items-center">
              <span className="mr-2">⭐</span>
              Annuel
            </h3>
            <div className="text-4xl font-bold mb-1">89,99€</div>
            <p className="text-sm text-gray-500 mb-1">par an</p>
            <div className="bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full inline-block mb-6">
              Économisez 25%
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 mr-3 mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span className="font-medium">Tous les avantages gratuits</span>
              </li>
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <li key={index} className="flex items-start">
                    <div className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 mr-3 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span>{feature.text}</span>
                  </li>
                );
              })}
            </ul>
            <Button variant="outline" className="w-full rounded-lg border-primary text-primary hover:bg-primary/5">
              S'abonner à l'année
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}