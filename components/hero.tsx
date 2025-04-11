import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/accueil.png?height=1080&width=1920')",
          backgroundPosition: "center 30%",
        }}
      />
      <div className="absolute inset-0 hero-gradient" />

      <div className="container relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Votre prochaine aventure commence ici
        </h1>
        <p className="mb-8 max-w-2xl text-lg sm:text-xl">
          Découvrez des itinéraires uniques, planifiez votre road trip idéal et créez des souvenirs inoubliables
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/explorer">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
              Explorer les itinéraires
            </Button>
          </Link>
          <Link href="/premium">
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/20">
              Découvrir Premium
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
