import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Check,
  Star,
  MapPin,
  Download,
} from "lucide-react";

export default function PremiumFeatures() {
  const features = [
    {
      text: "Accès à tous les itinéraires détaillés",
      icon: MapPin,
      color: "bg-red-100 text-red-600",
    },
    {
      text: "Assistant IA personnalisé pour planifier vos voyages",
      icon: Star,
      color: "bg-red-100 text-red-600",
    },
    {
      text: "Téléchargement des cartes hors-ligne",
      icon: Download,
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container relative z-10">
        <div className="text-center mb-10">
          <div className="mb-4 inline-flex items-center justify-center">
            <span className="font-bold text-primary uppercase">
              Abonnement Premium
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-5">
            Passez à{" "}
            <span className="relative">
              ROADTRIP!
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary rounded-full"></span>
            </span>{" "}
            Premium
          </h2>
          <p className="text-sm leading-relaxed sm:leading-relaxed">
            Débloquez toutes les fonctionnalités et vivez une expérience de
            voyage exceptionnelle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className="border-gray-100 rounded-xl p-10 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-lg sm:text-xl font-semibold mb-5 text-center">Découverte</h4>
              <div className="text-4xl font-bold text-foreground mb-1">0€</div>
              <p className="text-sm text-muted-foreground mb-8">
                pour toujours
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "Accès aux itinéraires de base",
                  "Recherche de destinations",
                  "Sauvegarde de favoris",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="h-6 w-6 mr-3 mt-0.5 flex items-center justify-center rounded-full bg-green-50">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed sm:leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth">
                <div className="flex justify-center">
                  <Button variant="outline" className="">
                    Commencer gratuitement
                  </Button>
                </div>
              </Link>
            </div>
          </div>

          {/* Mensual Plan */}
          <div className="border-gray-100 rounded-xl p-10 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-primary/5 rounded-2xl z-0"></div>
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-700 via-primary to-primary-700 rounded-t-2xl"></div>
            <div className="relative z-10">
              <div className="text-primary text-end">Populaire</div>
              <h4 className="text-lg sm:text-xl font-semibold mb-5 text-center">Mensuel</h4>
              <div className="text-4xl font-bold text-foreground mb-1">5€</div>
              <p className="text-sm text-muted-foreground mb-8">par mois</p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start">
                  <div className="h-6 w-6 mr-3 mt-0.5 flex items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="font-medium text-gray-800">
                    Tous les avantages gratuits
                  </span>
                </li>
                {features.map(({ text, icon: Icon, color }, index) => (
                  <li key={index} className="flex items-start">
                    <div
                      className={`h-6 w-6 mr-3 mt-0.5 flex items-center justify-center rounded-full ${color}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed sm:leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>
              <Link href="/premium">
                <div className="flex justify-center">
                  <Button>S'abonner maintenant</Button>
                </div>
              </Link>
            </div>
          </div>

          {/* Annual Plan */}
          <div className="border-gray-100 rounded-xl p-10 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-lg sm:text-xl font-semibold mb-5 text-center">Annuel</h4>

              <div className="text-4xl font-bold text-foreground mb-1">45€</div>
              <p className="text-sm text-muted-foreground ">par an</p>
              <div className="text-green-700 text-end mb-8">Économisez 25%</div>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start">
                  <div className="h-6 w-6 mr-3 mt-0.5 flex items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="font-medium text-gray-800">
                    Tous les avantages gratuits
                  </span>
                </li>
                {features.map(({ text, icon: Icon, color }, index) => (
                  <li key={index} className="flex items-start">
                    <div
                      className={`h-6 w-6 mr-3 mt-0.5 flex items-center justify-center rounded-full ${color}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed sm:leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>
              <Link href="/premium">
                <div className="flex justify-center">
                  <Button variant="outline">S'abonner à l'année</Button>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
