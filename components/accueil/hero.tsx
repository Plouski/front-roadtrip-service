import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      {/* Image d'arrière-plan avec overlay */}
      <div
        className="absolute inset-0 bg-cover"
        style={{
          backgroundImage: "url('/accueil.jpg?height=1080&width=1920')",
          backgroundPosition: "center 30%",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      {/* Contenu principal */}
      <div className="container relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 max-w-4xl leading-snug sm:leading-tight">
          Votre prochaine <span className="text-primary">aventure</span>{" "}
          commence ici
        </h1>
        <p className="mb-10 max-w-2xl text-smtext-white/90 leading-relaxed sm:leading-relaxed">
          Découvrez des itinéraires uniques, planifiez votre road trip idéal et
          créez des souvenirs inoubliables.
        </p>
        {/* Boutons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <Link href="/explorer">
            <Button>Explorer les itinéraires</Button>
          </Link>
          <Link href="/premium">
            <Button variant="outline">Découvrir Premium</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
