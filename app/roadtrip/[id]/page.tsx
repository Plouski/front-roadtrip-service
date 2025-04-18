"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getUserRole } from "@/lib/auth"
import { RoadtripService } from "@/services/roadtrip-service"
import { AuthService } from "@/services/auth-service"
import { AdminService } from "@/services/admin-service"
import LoginPromptModal from "@/components/ui/login-prompt-modal"
import jsPDF from "jspdf"

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
        const role = getUserRole() || "visitor"
        setUserRole(role)

        const trip = await RoadtripService.getRoadtripById(id)
        setRoadTrip(trip)

        try {
          await RoadtripService.incrementViewCount(trip._id)
        } catch (err) {
          console.error("Erreur lors de l'enregistrement de la vue:", err)
        }

        if (trip.userAccess) {
          setCanAccessPremium(trip.userAccess.canAccessPremium || role === 'admin')
          setFavorite(trip.userAccess.isFavorite || false)
        } else {
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

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState error={error} />
  if (!roadTrip) return <NotFoundState />

  return (
    <div className="animate-fadeIn">
      <LoginPromptModal open={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />

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

      <div className="container max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <section className="prose max-w-none">
              <h2 className="text-xl font-semibold text-foreground mb-2">Description</h2>
              <p className="text-muted-foreground text-base leading-7">{roadTrip.description}</p>
            </section>

            {roadTrip.pointsOfInterest?.length > 0 && (
              <PointsOfInterest points={roadTrip.pointsOfInterest} />
            )}

            {roadTrip.itinerary?.length > 0 && !roadTrip.isPremium && (
              <RoadTripItinerary itinerary={roadTrip.itinerary} />
            )}

            {roadTrip.isPremium && roadTrip.itinerary?.length > 0 && (
              canAccessPremium
                ? <PremiumItineraryUnlocked itinerary={roadTrip.itinerary} />
                : <PremiumItineraryLocked itinerary={roadTrip.itinerary} />
            )}
          </div>

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