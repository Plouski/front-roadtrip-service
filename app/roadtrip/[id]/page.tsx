"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getUserRole } from "@/lib/auth"
import { RoadtripService } from "@/services/roadtrip-service"
import { AuthService } from "@/services/auth-service"
import { AdminService } from "@/services/admin-service"
import LoginPromptModal from "@/components/ui/login-prompt-modal"
import jsPDF from "jspdf"

// Importation des composants modulaires
import {
  RoadTripHero,
  RoadTripItinerary,
  PremiumItineraryLocked,
  PremiumItineraryUnlocked,
  PointsOfInterest,
  RoadTripSidebar,
  LoadingState,
  ErrorState,
  NotFoundState
} from "@/components/roadtrip-component"

export default function RoadTripPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [roadTrip, setRoadTrip] = useState<any>(null)
  const [userRole, setUserRole] = useState<string>("visitor")
  const [canAccessPremium, setCanAccessPremium] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [favorite, setFavorite] = useState<boolean>(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await AuthService.checkAuthentication();
      setIsAuthenticated(authStatus);
    };

    const loadRoadtrip = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Récupérer le rôle de l'utilisateur
        const role = getUserRole() || "visitor"
        setUserRole(role)

        // Charger les données du roadtrip
        const trip = await RoadtripService.getRoadtripById(id)
        setRoadTrip(trip)

        try {
          await RoadtripService.incrementViewCount(trip._id)
        } catch (err) {
          console.error("Erreur lors de l'enregistrement de la vue:", err)
        }

        // L'API nous informe si l'utilisateur peut accéder au contenu premium
        if (trip.userAccess) {
          setCanAccessPremium(trip.userAccess.canAccessPremium || role === 'admin')
          setFavorite(trip.userAccess.isFavorite || false)
        } else {
          // Fallback si userAccess n'est pas fourni
          setCanAccessPremium(role === 'admin' || role === 'premium')
        }
      } catch (error: any) {
        console.error("Erreur lors du chargement du roadtrip:", error)
        setError(error.message || "Erreur lors du chargement des données")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth();
    loadRoadtrip();
  }, [id])

  const handleAddToFavorites = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      setShowLoginPrompt(true)
      return
    }

    setFavorite(!favorite)
    // Ici vous pouvez appeler votre API pour sauvegarder l'état des favoris
  }

  const handleDelete = async () => {
    const confirmed = confirm("Voulez-vous vraiment supprimer ce roadtrip ?")
    if (!confirmed) return

    try {
      await AdminService.deleteRoadtrip(roadTrip._id)
      router.push("/")
    } catch (error: any) {
      alert(`Erreur lors de la suppression du roadtrip: ${error.message}`)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: roadTrip.title,
        text: roadTrip.description,
        url: window.location.href,
      }).catch(console.error)
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Lien copié dans le presse-papiers !")
    }
  }

  const generatePdf = () => {
    const doc = new jsPDF()
    let y = 10

    doc.setFont("helvetica", "bold")
    doc.setFontSize(18)
    doc.text(roadTrip.title, 10, y)
    y += 10
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Pays : ${roadTrip.country}`, 10, y)
    y += 6
    if (roadTrip.region) {
      doc.text(`Région : ${roadTrip.region}`, 10, y)
      y += 6
    }
    doc.text(`Durée : ${roadTrip.duration} jours`, 10, y)
    y += 6
    doc.text(`Budget : ${roadTrip.budget} €`, 10, y)
    y += 10

    doc.setFont("helvetica", "bold")
    doc.text("Itinéraire :", 10, y)
    y += 8

    doc.setFont("helvetica", "normal")
    roadTrip.itinerary?.forEach((step: any) => {
      if (y > 270) {
        doc.addPage()
        y = 10
      }
      doc.setFont("helvetica", "bold")
      doc.text(`Jour ${step.day} — ${step.title}`, 10, y)
      y += 6
      doc.setFont("helvetica", "normal")
      doc.text(doc.splitTextToSize(step.description, 180), 10, y)
      y += 10
    })

    doc.save(`${roadTrip.title.replace(/\s+/g, "-").toLowerCase()}.pdf`)
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} />
  }

  if (!roadTrip) {
    return <NotFoundState />
  }

  return (
    <div>
      <LoginPromptModal open={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />

      {/* Hero section */}
      <RoadTripHero
        image={roadTrip.image}
        title={roadTrip.title}
        country={roadTrip.country}
        region={roadTrip.region}
        duration={roadTrip.duration}
        budget={roadTrip.budget}
        isPremium={roadTrip.isPremium}
        canAccessPremium={canAccessPremium}
        tags={roadTrip.tags}
      />

      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            <div className="prose max-w-none">
              <h2 className="text-xl font-bold text-gray-800">Description</h2>
              <p className="text-lg text-gray-700 leading-relaxed">{roadTrip.description}</p>

              {/* Points d'intérêt */}
              {roadTrip.pointsOfInterest?.length > 0 && (
                <PointsOfInterest points={roadTrip.pointsOfInterest} />
              )}

              {/* Itinéraire */}
              {roadTrip.itinerary?.length > 0 && !roadTrip.isPremium && (
                <RoadTripItinerary itinerary={roadTrip.itinerary} />
              )}

              {/* Itinéraire Premium */}
              {roadTrip.isPremium && roadTrip.itinerary?.length > 0 && (
                canAccessPremium 
                  ? <PremiumItineraryUnlocked itinerary={roadTrip.itinerary} />
                  : <PremiumItineraryLocked itinerary={roadTrip.itinerary} />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <RoadTripSidebar
            roadTrip={roadTrip}
            userRole={userRole}
            canAccessPremium={canAccessPremium}
            favorite={favorite}
            handleAddToFavorites={handleAddToFavorites}
            handleShare={handleShare}
            generatePdf={generatePdf}
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  )
}