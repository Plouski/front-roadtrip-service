import { Map, Compass, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  return (
    <section className="py-24 bg-gradient-to-br from-muted/30 to-white relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent" />
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-70" />
      <div className="absolute bottom-20 -left-20 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl" />
      
      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-5">
            <div className="h-px w-12 bg-primary/40 mr-4" />
            <span className="text-primary font-semibold tracking-wider text-sm">FONCTIONNEMENT</span>
            <div className="h-px w-12 bg-primary/40 ml-4" />
          </div>
          <h2 className="text-4xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">Comment ça marche</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Planifier votre road trip parfait n'a jamais été aussi simple avec 
            <span className="text-primary font-semibold mx-1">ROADTRIP!</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 max-w-5xl mx-auto relative">
          {/* Ligne connectant les cartes (visible uniquement sur desktop) */}
          <div className="absolute top-20 left-16 right-16 h-0.5 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 hidden md:block" />

          {[
            {
              icon: Map,
              title: "Explorez",
              description: "Parcourez notre collection d'itinéraires soigneusement sélectionnés à travers le monde entier.",
              color: "from-blue-500 to-primary"
            },
            {
              icon: Compass,
              title: "Personnalisez",
              description: "Adaptez l'itinéraire à vos préférences, ajoutez des étapes ou modifiez la durée selon vos envies.",
              color: "from-purple-500 to-blue-500"
            },
            {
              icon: Star,
              title: "Voyagez",
              description: "Téléchargez votre itinéraire et partez à l'aventure avec toutes les informations nécessaires.",
              color: "from-amber-500 to-orange-500"
            },
          ].map((step, i) => (
            <div
              key={i}
              className="relative text-center p-8 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                <div className={`bg-gradient-to-br ${step.color} text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl font-bold">{i + 1}</span>
                </div>
              </div>
              <div className="pt-12">
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                <div className="mt-8 flex justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                  <step.icon className="text-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link href="/explorer">
            <Button className="bg-gradient-to-r from-primary to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white rounded-full h-auto text-lg font-medium shadow-md hover:shadow-lg transition-all group">
              Commencer l'aventure
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}