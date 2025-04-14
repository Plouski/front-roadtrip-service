// RoadTripComponents.tsx
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, DollarSign, Clock, Lock, Heart, Share2, FileText, AlertTriangle, Map, Compass, Star, Filter } from "lucide-react"
import Link from "next/link"

// Composant Hero - Mise à jour pour correspondre au style de la page d'accueil
export const RoadTripHero = ({
    image,
    title,
    country,
    region,
    duration,
    budget,
    isPremium,
    canAccessPremium,
    tags
}: any) => {
    return (
        <div className="relative h-[60vh] w-full overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{ backgroundImage: `url(${image})` }}
            />
            {/* Gradient amélioré similaire à la page d'accueil */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

            {/* Petite ligne décorative comme sur la page d'accueil */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 to-transparent"></div>

            <div className="container relative z-10 flex h-full flex-col justify-end pb-12 text-white">
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags?.map((tag: string, index: number) => (
                        <Badge key={index} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-none transition-colors">
                            {tag}
                        </Badge>
                    ))}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{title}</h1>
                <div className="flex items-center text-lg font-medium">
                    <MapPin className="mr-2 h-5 w-5 text-white/90" />
                    <span className="text-white/90">{country}
                        {region ? ` • ${region}` : ""}
                    </span>

                    {/* Badge Premium - Style cohérent avec le reste du site */}
                    {isPremium && (
                        <Badge className={`ml-5 ${canAccessPremium ? 'bg-green-500' : 'bg-primary'} text-white border-none transition-colors`}>
                            {canAccessPremium ? "Premium Débloqué" : "Premium"}
                        </Badge>
                    )}
                </div>
            </div>
        </div>
    )
}

// Composant pour l'itinéraire jour par jour (version standard)
export const RoadTripItinerary = ({ itinerary }: any) => {
    return (
        <div className="mt-12">
            <div className="flex items-center mb-6">
                <div className="h-8 w-1 bg-primary rounded-full mr-3"></div>
                <h2 className="text-xl font-bold text-gray-800">Itinéraire jour par jour</h2>
            </div>
            <div className="space-y-5">
                {itinerary.map((step: any, index: number) => (
                    <div
                        key={index}
                        className={`border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                    >
                        <h3 className="text-xl font-semibold text-gray-800">Jour {step.day} — {step.title}</h3>
                        <p className="text-gray-700 mt-2">{step.description}</p>
                        {step.overnight && (
                            <p className="text-xs text-primary font-medium mt-2 flex items-center">
                                <Clock className="h-4 w-4 mr-1" /> Nuit sur place
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

// Composant pour l'itinéraire premium (version verrouillée)
export const PremiumItineraryLocked = ({ itinerary }: any) => {
    return (
        <div className="relative my-16 border rounded-xl p-10 bg-white shadow-md">
            <div className="flex items-center mb-8">
                <div className="h-8 w-1 bg-primary rounded-full mr-3"></div>
                <h2 className="text-xl font-bold text-gray-800">Itinéraire détaillé jour par jour</h2>
            </div>

            {/* Version limitée pour les non-premium */}
            <div className="space-y-6 opacity-60 blur-[2px]">
                {itinerary.slice(0, 2).map((step: any, index: number) => (
                    <div key={index} className={`border rounded-xl p-6 shadow-sm ${index % 2 === 0 ? 'bg-blue-50/30' : 'bg-white'}`}>
                        <h3 className="text-xl font-semibold text-gray-800">Jour {step.day} — {step.title}</h3>
                        <p className="text-gray-700 mt-2">{step.description}</p>
                    </div>
                ))}
            </div>

            {/* Overlay de verrouillage - Style amélioré et plus spacieux */}
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm">
                <div className="p-10 flex flex-col items-center max-w-lg text-center">
                    <div className="bg-primary/10 p-4 rounded-full mb-6">
                        <Lock className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Contenu Premium</h3>
                    <p className="text-gray-600 mb-2 text-lg">
                        Débloquez l'accès à l'itinéraire détaillé, la carte interactive et bien plus encore.
                    </p>
                    <Link href="/premium">
                        <Button className="bg-primary hover:bg-primary-700 text-white px-8 py-3 rounded-full transition-colors">
                            Passer à Premium
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

// Composant pour l'itinéraire premium (version débloquée)
export const PremiumItineraryUnlocked = ({ itinerary }: any) => {
    return (
        <div className="my-16 border rounded-xl p-10 bg-white shadow-md">
            <div className="flex items-center mb-8">
                <div className="h-8 w-1 bg-primary rounded-full mr-3"></div>
                <h2 className="text-xl font-bold text-gray-800">Itinéraire détaillé jour par jour</h2>
            </div>
            <div className="space-y-8">
                {itinerary.map((step: any, index: number) => (
                    <div
                        key={index}
                        className={`border rounded-xl p-6 shadow-sm transition-all hover:shadow-md ${index % 2 === 0 ? 'bg-blue-50/30' : 'bg-white'}`}
                    >
                        <h3 className="text-xl font-semibold text-gray-800">Jour {step.day} — {step.title}</h3>
                        <p className="text-gray-700 mt-3 mb-2">{step.description}</p>

                        {/* Détails additionnels premium */}
                        {/* <div className="mt-6 pt-6 border-t border-gray-200">
                            <h4 className="font-semibold text-gray-800 mb-4">Détails de l'étape</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {step.drivingTime && (
                                    <div className="flex items-center bg-gray-50 rounded-lg p-3 hover:shadow-sm transition-shadow">
                                        <Clock className="h-6 w-6 text-primary mr-3" />
                                        <div>
                                            <div className="text-sm text-gray-500">Temps de conduite</div>
                                            <div className="font-medium">{step.drivingTime}</div>
                                        </div>
                                    </div>
                                )}
                                {step.distance && (
                                    <div className="flex items-center bg-gray-50 rounded-lg p-3 hover:shadow-sm transition-shadow">
                                        <MapPin className="h-6 w-6 text-primary mr-3" />
                                        <div>
                                            <div className="text-sm text-gray-500">Distance</div>
                                            <div className="font-medium">{step.distance} km</div>
                                        </div>
                                    </div>
                                )}
                                {step.accommodation && (
                                    <div className="flex items-center bg-gray-50 rounded-lg p-3 hover:shadow-sm transition-shadow">
                                        <Calendar className="h-6 w-6 text-primary mr-3" />
                                        <div>
                                            <div className="text-sm text-gray-500">Hébergement</div>
                                            <div className="font-medium">{step.accommodation}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div> */}

                        {step.tips && (
                            <div className="mt-6 bg-primary/5 p-5 rounded-lg border-l-4 border-primary">
                                <h4 className="font-semibold text-primary-700 mb-2">Conseils</h4>
                                <p className="text-gray-700">{step.tips}</p>
                            </div>
                        )}

                        {step.overnight && (
                            <p className="text-sm text-primary font-medium mt-4 flex items-center">
                                <Clock className="h-4 w-4 mr-2" /> Nuit sur place
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

// Composant pour les points d'intérêt
export const PointsOfInterest = ({ points }: any) => {
    return (
        <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <div className="h-8 w-1 bg-primary rounded-full mr-3"></div>
                    <h2 className="text-xl font-bold text-gray-800">Points d'intérêt</h2>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                {points?.map((poi: any, index: number) => (
                    <div key={index} className="border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow group">
                        <div className="relative overflow-hidden h-52">
                            <img
                                src={poi.image || "/placeholder.svg"}
                                alt={poi.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Effet de dégradé comme sur la page d'accueil */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="p-5">
                            <h3 className="font-semibold text-xl mb-2 text-gray-800 group-hover:text-primary transition-colors">{poi.name}</h3>
                            <p className="text-gray-600 ">{poi.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Composant pour le panneau latéral d'informations
export const RoadTripSidebar = ({
    roadTrip,
    userRole,
    canAccessPremium,
    favorite,
    handleAddToFavorites,
    handleShare,
    generatePdf,
    handleDelete
}: any) => {
    return (
        <div className="lg:col-span-1">
            <div className="sticky top-20">
                <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold mb-5 text-gray-800 border-b pb-3">Informations pratiques</h3>

                    <div className="space-y-5">
                        <div className="flex items-center group">
                            <div className="bg-primary/10 p-2 rounded-lg mr-4 group-hover:bg-primary/20 transition-colors">
                                <Calendar className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-500 text-sm">Meilleure saison</div>
                                <div className="font-semibold text-gray-800">{roadTrip.bestSeason}</div>
                            </div>
                        </div>

                        <div className="flex items-center group">
                            <div className="bg-primary/10 p-2 rounded-lg mr-4 group-hover:bg-primary/20 transition-colors">
                                <Clock className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-500 text-sm">Durée</div>
                                <div className="font-semibold text-gray-800">{roadTrip.duration} jours</div>
                            </div>
                        </div>

                        <div className="flex items-center group">
                            <div className="bg-primary/10 p-2 rounded-lg mr-4 group-hover:bg-primary/20 transition-colors">
                                <DollarSign className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-500 text-sm">Budget estimé</div>
                                <div className="font-semibold text-gray-800">
                                    {typeof roadTrip.budget === 'object'
                                        ? `${roadTrip.budget.amount || 0} ${roadTrip.budget.currency || "€"}`
                                        : `${roadTrip.budget || 0} €`
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statut d'accès Premium */}
                {roadTrip.isPremium && (
                    <div className={`rounded-xl p-6 mb-8 shadow-sm ${canAccessPremium ? 'bg-green-50 border border-green-200' : 'bg-primary/5 border border-primary/20'}`}>
                        <h3 className="font-semibold flex items-center gap-3 mb-2">
                            {canAccessPremium ? (
                                <>
                                    <div className="bg-green-100 p-1.5 rounded-full">
                                        <span className="text-green-600 text-lg">✓</span>
                                    </div>
                                    <span className="text-green-800 text-lg">Accès Premium</span>
                                </>
                            ) : (
                                <>
                                    <div className="bg-primary/10 p-1.5 rounded-full">
                                        <Lock className="h-5 w-5 text-primary" />
                                    </div>
                                    <span className="text-primary text-lg">Contenu verrouillé</span>
                                </>
                            )}
                        </h3>
                        <p className="text-sm mt-3 mb-2 ml-1">
                            {canAccessPremium
                                ? userRole === 'admin'
                                    ? "Vous avez accès à tout le contenu en tant qu'administrateur."
                                    : "Vous avez accès à tout le contenu avec votre abonnement premium."
                                : "Certains contenus sont réservés aux abonnés premium."}
                        </p>

                        {!canAccessPremium && (
                            <div className="mt-5">
                                <Link href="/premium">
                                    <Button size="sm" className="w-full bg-primary hover:bg-primary-700 font-medium py-2.5 rounded-full transition-colors">
                                        Débloquer Premium
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-3 bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <Button
                        className={`w-full ${favorite ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-700'} text-white font-medium flex items-center justify-center gap-2 rounded-full transition-colors`}
                        onClick={handleAddToFavorites}
                    >
                        <Heart className={`h-5 w-5 ${favorite ? 'fill-white' : ''} transition-transform hover:scale-110`} />
                        {favorite ? 'Ajouté aux favoris' : 'Ajouter aux favoris'}
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full font-medium flex items-center justify-center gap-2 rounded-full hover:bg-primary/5 transition-colors"
                        onClick={handleShare}
                    >
                        <Share2 className="h-5 w-5" />
                        Partager
                    </Button>

                    {/* Afficher les boutons d'export uniquement pour les utilisateurs premium ou admin ou si le roadtrip n'est pas premium */}
                    {(canAccessPremium || !roadTrip.isPremium) && (
                        <Button
                            variant="outline"
                            className="w-full font-medium flex items-center justify-center gap-2 rounded-full hover:bg-primary/5 transition-colors"
                            onClick={generatePdf}
                        >
                            <FileText className="h-5 w-5" />
                            Exporter en PDF
                        </Button>
                    )}

                    {/* Boutons admin */}
                    {userRole === 'admin' && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Administration</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <Link href={`/admin/roadtrip/update/${roadTrip._id}`} className="col-span-1">
                                    <Button variant="secondary" className="w-full rounded-full hover:bg-gray-100 transition-colors">Modifier</Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                    className="w-full rounded-full transition-colors text-white bg-red-600 hover:bg-red-500"
                                >
                                    Supprimer
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// Composant pour l'état de chargement - Style similaire à la page d'accueil
export const LoadingState = () => {
    return (
        <div className="container py-16 text-center">
            <div className="flex flex-col items-center">
                <div className="h-10 w-10 animate-spin text-primary mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" className="opacity-20"></circle>
                        <path d="M12 2a10 10 0 0 1 10 10" className="opacity-100"></path>
                    </svg>
                </div>
                <p className="text-gray-500">Chargement de l'itinéraire...</p>
            </div>
        </div>
    )
}

// Composant pour l'état d'erreur
export const ErrorState = ({ error }: { error: string }) => {
    return (
        <div className="container py-16 max-w-md mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center shadow-md">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h1 className="text-xl font-bold mb-3 text-red-700">Erreur</h1>
                <p className="mb-6 text-red-600">{error}</p>
                <Link href="/">
                    <Button className="px-6 font-medium rounded-full">Retour à l'accueil</Button>
                </Link>
            </div>
        </div>
    )
}

// Composant pour l'état "non trouvé"
export const NotFoundState = () => {
    return (
        <div className="container py-16 max-w-md mx-auto">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center shadow-md">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Filter className="h-7 w-7 text-primary" />
                </div>
                <h1 className="text-xl font-bold mb-3 text-gray-800">Itinéraire non trouvé</h1>
                <p className="mb-6 text-gray-600">L'itinéraire que vous recherchez n'existe pas ou a été supprimé.</p>
                <Link href="/">
                    <Button className="px-6 font-medium bg-primary hover:bg-primary-700 text-white rounded-full transition-colors">
                        Retour à l'accueil
                    </Button>
                </Link>
            </div>
        </div>
    )
}