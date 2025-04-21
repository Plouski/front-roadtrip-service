import { LucideIcon, MapPin, Star, Download, Shield, Clock, Headphones } from "lucide-react"

type FeatureProps = {
  icon: LucideIcon
  title: string
  description: string
  color: string
  bgColor: string
}

const premiumFeatures: FeatureProps[] = [
  {
    icon: MapPin,
    title: "Itinéraires détaillés & exclusifs",
    description: "Accédez à notre collection complète d'itinéraires premium avec points d'intérêt cachés et recommandations locales.",
    color: "bg-blue-100 text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    icon: Star,
    title: "Assistant IA personnalisé",
    description: "Notre IA vous aide à planifier vos voyages selon vos préférences, budget et style de voyage.",
    color: "bg-purple-100 text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    icon: Download,
    title: "Cartes hors-ligne illimitées",
    description: "Téléchargez tous vos itinéraires et cartes pour y accéder même sans connexion internet.",
    color: "bg-green-100 text-green-600",
    bgColor: "bg-green-50"
  }
]

function FeatureCard({ feature }: { feature: FeatureProps }) {
  const Icon = feature.icon
  
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
      <div className={`${feature.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        <Icon className={`h-8 w-8 ${feature.color.split(' ')[1]}`} />
      </div>
      <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
      <p className="text-gray-600">{feature.description}</p>
    </div>
  )
}

export default function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Fonctionnalités exclusives</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nos abonnés premium bénéficient d'un accès complet à des fonctionnalités exclusives 
            conçues pour rendre chaque voyage inoubliable.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {premiumFeatures.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}