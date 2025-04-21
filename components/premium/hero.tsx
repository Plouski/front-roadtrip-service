import { ChevronRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative pt-24 pb-32 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-blue-50 z-0"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-1 mb-6">
            <Sparkles className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">Expérience premium</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-primary to-gray-800">
            Élevez vos road trips au niveau supérieur
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Découvrez une expérience de voyage sans précédent avec des itinéraires exclusifs, 
            un assistant IA personnalisé et des fonctionnalités premium conçues pour les 
            aventuriers passionnés.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-gradient-to-r from-primary to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white rounded-xl h-auto text-lg font-medium shadow-md hover:shadow-xl transition-all group" 
              onClick={() => document.getElementById('pricing')?.scrollIntoView({behavior: 'smooth'})}
            >
              Démarrer l'aventure
              <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Link href="/explorer">
              <Button variant="outline" className="rounded-xl h-auto text-lg border-gray-300 hover:bg-gray-50 font-medium">
                Explorer les itinéraires
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white z-20"></div>
          <div className="relative z-10 bg-white shadow-2xl rounded-3xl overflow-hidden mx-auto max-w-5xl border border-gray-100">
          </div>
        </div>
      </div>
    </section>
  )
}