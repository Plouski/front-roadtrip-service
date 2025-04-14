import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, MapPin, Plane } from "lucide-react"

export default function Hero() {
  return (
    <div className="relative h-[650px] w-full overflow-hidden">
      {/* Image d'arrière-plan avec overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 animate-slow-zoom"
        style={{
          backgroundImage: "url('/accueil.jpg?height=1080&width=1920')",
          backgroundPosition: "center 30%",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      
      {/* Contenu principal */}
      <div className="container relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
        <div className="flex items-center mb-4">
          <Plane className="h-8 w-8 text-primary mr-2 animate-float" />
          <span className="text-xl font-bold text-primary">ROADTRIP!</span>
        </div>
        
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl max-w-4xl leading-tight">
          Votre prochaine <span className="text-primary">aventure</span> commence ici
        </h1>
        
        <p className="mb-10 max-w-2xl text-lg sm:text-xl leading-relaxed text-gray-100">
          Découvrez des itinéraires uniques, planifiez votre road trip idéal 
          et créez des souvenirs inoubliables
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5">
          <Link href="/explorer">
            <Button size="lg" className="bg-primary hover:bg-primary-700 text-white px-8 h-12 group relative overflow-hidden">
              <span className="relative z-10 flex items-center">
                Explorer les itinéraires
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-primary-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Button>
          </Link>
          
          <Link href="/premium">
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 h-12"
            >
              <span className="mr-2">✨</span>
              Découvrir Premium
            </Button>
          </Link>
        </div>
        
        {/* Badge destinations */}
        <div className="absolute bottom-12 flex items-center justify-center">
          <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
            <MapPin className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm font-medium">+100 destinations à découvrir</span>
          </div>
        </div>
      </div>
    </div>
  )
}