import { Map, Compass, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  return (
    <section>
      <div className="container px-4">
        {/* Section titre */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="h-px w-10 sm:w-12 bg-primary mr-3 sm:mr-4" />
            <span className="text-primary font-semibold tracking-wide text-xs sm:text-sm">
              FONCTIONNEMENT
            </span>
            <div className="h-px w-10 sm:w-12 bg-primary ml-3 sm:ml-4" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Comment ça marche
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed sm:leading-relaxed">
            Planifier votre road trip parfait n’a jamais été aussi simple avec{" "}
            <span className="text-primary font-medium">ROADTRIP!</span>
          </p>
        </div>

        {/* Étapes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 max-w-5xl mx-auto relative">
          <div className="absolute top-20 left-16 right-16 h-0.5 bg-gradient-to-r from-primary via-primary to-primary hidden md:block" />
          {[
            {
              icon: Map,
              title: "Explorez",
              description:
                "Parcourez notre collection d'itinéraires soigneusement sélectionnés à travers le monde entier.",
              color: "bg-red-600",
            },
            {
              icon: Compass,
              title: "Personnalisez",
              description:
                "Adaptez l'itinéraire à vos préférences, ajoutez des étapes ou modifiez la durée selon vos envies.",
              color: "bg-red-600",
            },
            {
              icon: Star,
              title: "Voyagez",
              description:
                "Téléchargez votre itinéraire et partez à l'aventure avec toutes les informations nécessaires.",
              color: "bg-red-600",
            },
          ].map((step, i) => (
            <div
              key={i}
              className="relative text-center p-6 sm:p-8 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                <div
                  className={`${step.color} text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <span className="text-xl sm:text-2xl font-bold">{i + 1}</span>
                </div>
              </div>
              <div className="pt-12">
                <h4 className="text-lg sm:text-xl font-semibold mb-4">{step.title}</h4>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {step.description}
                </p>
                <div className="mt-6 flex justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                  <step.icon className="text-primary w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton final */}
        <div className="text-center mt-12">
          <Link href="/explorer">
            <Button>
              Commencer l'aventure
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
