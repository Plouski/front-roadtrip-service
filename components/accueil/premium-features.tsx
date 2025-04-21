import { Button } from "@/components/ui/button";
import Link from "next/link"
import {
  Check,
  Plane,
  Star,
  Shield,
  Clock,
  MapPin,
  Download,
  Headphones,
  Sparkles,
} from "lucide-react";

export default function PremiumFeatures() {
  const features = [
    {
      text: "Accès à tous les itinéraires détaillés",
      icon: MapPin,
      color: "bg-blue-100 text-blue-600"
    },
    {
      text: "Assistant IA personnalisé pour planifier vos voyages",
      icon: Star,
      color: "bg-purple-100 text-purple-600"
    },
    {
      text: "Téléchargement des cartes hors-ligne",
      icon: Download,
      color: "bg-green-100 text-green-600"
    },
    {
      text: "Recommandations d'hébergements exclusifs",
      icon: Shield,
      color: "bg-amber-100 text-amber-600"
    },
    {
      text: "Mises à jour prioritaires des nouveaux itinéraires",
      icon: Clock,
      color: "bg-indigo-100 text-indigo-600"
    },
    {
      text: "Support client dédié 24/7",
      icon: Headphones,
      color: "bg-rose-100 text-rose-600"
    },
  ];

  return (

    <section className="py-28 relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute top-0 left-0 right-0 w-full h-full bg-gradient-to-b from-white to-muted/30 z-0"></div>
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-3/4 h-3/4 bg-primary/10 blur-3xl rounded-full opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-200/20 blur-3xl rounded-full"></div>

      <div className="container relative z-10">
        <div className="text-center mb-20">
          <div className="mb-4 inline-flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary mr-2" />
            <span className="text-sm font-bold tracking-widest text-primary uppercase">
              Abonnement Premium
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-5 bg-clip-text bg-gradient-to-r from-gray-900 via-primary to-gray-800">
            Passez à <span className="relative">
              ROADTRIP!
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary rounded-full"></span>
            </span> Premium
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Débloquez toutes les fonctionnalités et vivez une expérience de voyage exceptionnelle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white border border-gray-100 rounded-2xl p-10 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 z-0"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-3 flex items-center">
                <span className="mr-2 text-2xl">🌱</span> Découverte
              </h3>
              <div className="text-4xl font-bold text-foreground mb-1">0€</div>
              <p className="text-sm text-muted-foreground mb-8">pour toujours</p>
              <ul className="space-y-4 mb-10">
                {["Accès aux itinéraires de base", "Recherche de destinations", "Sauvegarde de favoris"].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="h-6 w-6 mr-3 mt-0.5 flex items-center justify-center rounded-full bg-green-50">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth">
                <Button
                  variant="outline"
                  className="w-full rounded-xl h-auto border-gray-200 text-gray-700 text-base font-medium hover:border-gray-300 hover:bg-gray-50"
                >
                  Commencer gratuitement
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-10 shadow-2xl border-0 transform scale-105 z-20 relative hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-primary/5 rounded-2xl z-0"></div>
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-700 via-primary to-primary-700 rounded-t-2xl"></div>
            <div className="relative z-10">
              <div className="absolute top-4 right-4 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                Populaire
              </div>
              <h3 className="text-xl font-bold mb-3 flex items-center text-primary">
                <Plane className="h-5 w-5 mr-2 rotate-45" /> Mensuel
              </h3>
              <div className="text-4xl font-bold text-foreground mb-1">5€</div>
              <p className="text-sm text-muted-foreground mb-8">par mois</p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start">
                  <div className="h-6 w-6 mr-3 mt-0.5 flex items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="font-medium text-gray-800">Tous les avantages gratuits</span>
                </li>
                {features.map(({ text, icon: Icon, color }, index) => (
                  <li key={index} className="flex items-start">
                    <div className={`h-6 w-6 mr-3 mt-0.5 flex items-center justify-center rounded-full ${color}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-gray-700">{text}</span>
                  </li>
                ))}
              </ul>
              <Link href="/premium">
                <Button className="w-full bg-gradient-to-r from-primary to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white rounded-xl h-auto text-base font-medium shadow-md">
                  S'abonner maintenant
                </Button>
              </Link>
            </div>
          </div>

          {/* Annual Plan */}
          <div className="bg-white border border-gray-100 rounded-2xl p-10 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-amber-50 rounded-full -ml-16 -mt-16 z-0"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-3 flex items-center">
                <span className="mr-2 text-2xl">⭐</span> Annuel
              </h3>
              <div className="text-4xl font-bold text-foreground mb-1">45€</div>
              <p className="text-sm text-muted-foreground mb-2">par an</p>
              <div className="bg-green-50 text-green-700 text-sm font-bold px-4 py-1.5 rounded-full inline-block mb-8">
                Économisez 25%
              </div>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start">
                  <div className="h-6 w-6 mr-3 mt-0.5 flex items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="font-medium text-gray-800">Tous les avantages gratuits</span>
                </li>
                {features.map(({ text, icon: Icon, color }, index) => (
                  <li key={index} className="flex items-start">
                    <div className={`h-6 w-6 mr-3 mt-0.5 flex items-center justify-center rounded-full ${color}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-gray-700">{text}</span>
                  </li>
                ))}
              </ul>
              <Link href="/premium">
                <Button
                  variant="outline"
                  className="w-full rounded-xl h-auto border-primary text-primary hover:bg-primary/5 text-base font-medium"
                >
                  S'abonner à l'année
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}