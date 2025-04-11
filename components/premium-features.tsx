import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function PremiumFeatures() {
  const features = [
    "Accès à tous les itinéraires détaillés",
    "Assistant IA personnalisé pour planifier vos voyages",
    "Téléchargement des cartes hors-ligne",
    "Recommandations d'hébergements exclusifs",
    "Mises à jour prioritaires des nouveaux itinéraires",
    "Support client dédié 24/7",
  ]

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Passez à RoadTrip! Premium</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Débloquez toutes les fonctionnalités et profitez d'une expérience de voyage sans limites avec notre
            abonnement premium.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-xl font-bold mb-2">Gratuit</h3>
            <div className="text-3xl font-bold mb-6">0€</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Accès aux itinéraires de base</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Recherche de destinations</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Sauvegarde de favoris</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full">
              Commencer gratuitement
            </Button>
          </div>

          {/* Monthly Plan */}
          <div className="bg-primary text-white rounded-lg shadow-lg p-6 border border-primary transform scale-105 z-10">
            <div className="absolute -top-3 right-8 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
              POPULAIRE
            </div>
            <h3 className="text-xl font-bold mb-2">Mensuel</h3>
            <div className="text-3xl font-bold mb-1">9,99€</div>
            <p className="text-sm mb-6 opacity-80">par mois</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 mt-0.5" />
                <span>Tous les avantages gratuits</span>
              </li>
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full bg-white text-primary hover:bg-gray-100">S'abonner maintenant</Button>
          </div>

          {/* Annual Plan */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-xl font-bold mb-2">Annuel</h3>
            <div className="text-3xl font-bold mb-1">89,99€</div>
            <p className="text-sm text-gray-500 mb-1">par an</p>
            <p className="text-sm text-green-600 font-medium mb-6">Économisez 25%</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Tous les avantages mensuels</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Accès prioritaire aux nouveautés</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Contenu exclusif</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
              S'abonner à l'année
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
