'use client'

import { useState } from "react"

// Types et données
import { MapPin, Star, Download, Shield, Clock, Headphones } from "lucide-react"
import HeroSection from "@/components/premium/hero"
import FeaturesSection from "@/components/premium/features"
import PricingSection from "@/components/premium/pricing"
import TestimonialsSection from "@/components/premium/testimonials"
import FaqSection from "@/components/premium/faq"
import SuccessModal from "@/components/premium/succes-modal"

// Données à utiliser dans les composants enfants
const premiumFeatures = [
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
  },
  {
    icon: Shield,
    title: "Hébergements exclusifs",
    description: "Bénéficiez de réductions et d'offres spéciales sur des hébergements sélectionnés par nos experts.",
    color: "bg-amber-100 text-amber-600",
    bgColor: "bg-amber-50"
  },
  {
    icon: Clock,
    title: "Accès prioritaire",
    description: "Soyez le premier à découvrir les nouveaux itinéraires et fonctionnalités avant tout le monde.",
    color: "bg-indigo-100 text-indigo-600",
    bgColor: "bg-indigo-50"
  },
  {
    icon: Headphones,
    title: "Support dédié 24/7",
    description: "Une équipe de conseillers voyage à votre service pour répondre à toutes vos questions.",
    color: "bg-rose-100 text-rose-600",
    bgColor: "bg-rose-50"
  }
]

const testimonials = [
  {
    name: "Sophie Durand",
    location: "Paris, France",
    text: "ROADTRIP! Premium a transformé notre façon de voyager. Les itinéraires détaillés et les recommandations locales nous ont permis de découvrir des lieux que nous n'aurions jamais trouvés autrement.",
    avatar: "/avatars/sophie.jpg",
    rating: 5
  },
  {
    name: "Marco Ricci",
    location: "Rome, Italie",
    text: "L'assistant IA est bluffant ! Il a créé un road trip parfait adapté à nos envies en quelques minutes. Le support client a également été très réactif quand nous avons eu besoin d'aide.",
    avatar: "/avatars/marco.jpg",
    rating: 5
  },
  {
    name: "Emma Johnson",
    location: "Londres, UK",
    text: "Les cartes hors-ligne nous ont sauvés lors de notre voyage en Écosse où la connexion était limitée. L'abonnement premium en vaut vraiment la peine pour cette fonctionnalité seule !",
    avatar: "/avatars/emma.jpg",
    rating: 4
  }
]

const faqs = [
  {
    question: "Comment fonctionne l'abonnement Premium ?",
    answer: "L'abonnement ROADTRIP! Premium vous donne accès à toutes les fonctionnalités exclusives de notre plateforme. Vous pouvez choisir entre un abonnement mensuel ou annuel, ce dernier vous permettant d'économiser 25%. Une fois abonné, vous aurez immédiatement accès à tous les itinéraires premium, l'assistant IA, les cartes hors-ligne et toutes les autres fonctionnalités exclusives."
  },
  {
    question: "Puis-je annuler mon abonnement à tout moment ?",
    answer: "Oui, vous pouvez annuler votre abonnement à tout moment. Si vous annulez un abonnement mensuel, vous continuerez à avoir accès aux fonctionnalités premium jusqu'à la fin de la période de facturation en cours. Pour les abonnements annuels, vous conserverez l'accès jusqu'à la fin de l'année d'abonnement. Aucun remboursement partiel n'est prévu pour les annulations en milieu de période."
  },
  {
    question: "Quelles sont les différences entre la version gratuite et premium ?",
    answer: "La version gratuite vous permet d'accéder aux itinéraires de base, à la recherche de destinations et à la sauvegarde de favoris. La version premium débloque l'ensemble des fonctionnalités : itinéraires détaillés exclusifs, assistant IA personnalisé, cartes hors-ligne illimitées, recommandations d'hébergements exclusifs, accès prioritaire aux nouveautés et support client dédié 24/7."
  },
  {
    question: "L'assistant IA est-il vraiment personnalisé ?",
    answer: "Absolument ! Notre assistant IA analyse vos préférences de voyage, votre budget, vos centres d'intérêt et même la durée souhaitée pour créer des itinéraires sur mesure. Il peut également adapter des itinéraires existants à vos besoins spécifiques et vous suggérer des alternatives en fonction de la météo ou d'autres facteurs."
  },
  {
    question: "Comment fonctionnent les cartes hors-ligne ?",
    answer: "Les cartes hors-ligne vous permettent d'accéder à vos itinéraires sans connexion internet. Avant votre départ, téléchargez simplement les cartes des régions que vous allez visiter. Vous pourrez ensuite y accéder même en zone sans couverture réseau. Les cartes incluent tous les points d'intérêt, les informations sur les étapes et même les commentaires des autres voyageurs."
  }
]

export default function PremiumPage() {
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <HeroSection />
      <FeaturesSection />
      <PricingSection
        features={premiumFeatures.map(feature => ({ title: feature.title }))} 
        onSubscribe={() => setShowSuccessModal(true)} 
      />
      <TestimonialsSection testimonials={testimonials} />
      <FaqSection faqs={faqs} />      
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
      />
    </div>
  )
}