import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, DollarSign, Clock, Lock, Heart, Share2, FileText, AlertTriangle, Filter } from "lucide-react"
import Link from "next/link"

export const RoadTripHero = ({
    image,
    title,
    country,
    region,
    isPremium,
    canAccessPremium,
    tags
}: any) => {
    return (
        <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] w-full overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{ backgroundImage: `url(${image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-primary/60 to-transparent"></div>

            <div className="container relative z-10 flex h-full flex-col justify-end pb-8 md:pb-12 text-white">
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags?.map((tag: string, index: number) => (
                        <Badge key={index} className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-none transition-colors">
                            {tag}
                        </Badge>
                    ))}
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 tracking-tight">{title}</h1>
                <div className="flex items-center text-base md:text-lg font-medium">
                    <MapPin className="mr-2 h-4 w-4 md:h-5 md:w-5 text-white/90" />
                    <span className="text-white/90">{country}
                        {region ? ` • ${region}` : ""}
                    </span>

                    {/* Badge Premium - Style discret et élégant */}
                    {isPremium && (
                        <Badge className={`ml-4 ${canAccessPremium ? 'bg-green-500/90' : 'bg-primary/90'} text-white border-none transition-colors backdrop-blur-sm`}>
                            {canAccessPremium ? "Premium Débloqué" : "Premium"}
                        </Badge>
                    )}
                </div>
            </div>
        </div>
    )
}

export const RoadTripItinerary = ({ itinerary }: any) => {
    return (
        <div className="mt-8 md:mt-12">
            <div className="flex items-center mb-6">
                <div className="h-6 md:h-8 w-px md:w-1 bg-primary rounded-full mr-3"></div>
                <h2 className="text-lg md:text-xl font-bold text-gray-800">Itinéraire jour par jour</h2>
            </div>
            <div className="space-y-4 md:space-y-5">
                {itinerary.map((step: any, index: number) => (
                    <div
                        key={index}
                        className={`border border-gray-100 rounded-lg md:rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all ${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}
                    >
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800">Jour {step.day} — {step.title}</h3>
                        <p className="text-gray-700 mt-2 text-sm md:text-base">{step.description}</p>
                        {step.overnight && (
                            <p className="text-xs text-primary font-medium mt-2 flex items-center">
                                <Clock className="h-3 w-3 md:h-4 md:w-4 mr-1" /> Nuit sur place
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export const PremiumItineraryLocked = ({ itinerary }: any) => {
    return (
        <div className="relative my-8 md:my-16 border border-gray-100 rounded-lg md:rounded-xl p-6 md:p-10 bg-white shadow-sm">
            <div className="flex items-center mb-6 md:mb-8">
                <div className="h-6 md:h-8 w-px md:w-1 bg-primary rounded-full mr-3"></div>
                <h2 className="text-lg md:text-xl font-bold text-gray-800">Itinéraire détaillé jour par jour</h2>
            </div>

            {/* Version limitée pour les non-premium - Effet de flou plus subtil */}
            <div className="space-y-5 md:space-y-6 opacity-70 blur-[1px]">
                {itinerary.slice(0, 2).map((step: any, index: number) => (
                    <div key={index} className={`border rounded-lg md:rounded-xl p-5 md:p-6 shadow-sm ${index % 2 === 0 ? 'bg-blue-50/20' : 'bg-white'}`}>
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800">Jour {step.day} — {step.title}</h3>
                        <p className="text-gray-700 mt-2 text-sm md:text-base">{step.description}</p>
                    </div>
                ))}
            </div>

            {/* Overlay de verrouillage - Design plus discret et élégant */}
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg md:rounded-xl bg-white/80 backdrop-blur-sm">
                <div className="p-6 md:p-10 flex flex-col items-center max-w-sm md:max-w-lg text-center">
                    <div className="bg-primary/5 p-3 md:p-4 rounded-full mb-4 md:mb-6">
                        <Lock className="h-8 w-8 md:h-10 md:w-10 text-primary/80" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800">Contenu Premium</h3>
                    <p className="text-gray-600 mb-4 text-base md:text-lg">
                        Débloquez l'accès à l'itinéraire détaillé, la carte interactive et bien plus encore.
                    </p>
                    <Link href="/premium">
                        <Button className="bg-primary/90 hover:bg-primary text-white px-6 md:px-8 py-2 md:py-3 rounded-full transition-colors shadow-sm hover:shadow">
                            Passer à Premium
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export const PremiumItineraryUnlocked = ({ itinerary }: any) => {
    return (
        <div className="my-8 md:my-16 border border-gray-100 rounded-lg md:rounded-xl p-6 md:p-10 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-6 md:mb-8">
                <div className="h-6 md:h-8 w-px md:w-1 bg-primary rounded-full mr-3"></div>
                <h2 className="text-lg md:text-xl font-bold text-gray-800">Itinéraire détaillé jour par jour</h2>
            </div>
            <div className="space-y-6 md:space-y-8">
                {itinerary.map((step: any, index: number) => (
                    <div
                        key={index}
                        className={`border border-gray-100 rounded-lg md:rounded-xl p-5 md:p-6 shadow-sm transition-all hover:shadow-md ${index % 2 === 0 ? 'bg-blue-50/20' : 'bg-white'}`}
                    >
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800">Jour {step.day} — {step.title}</h3>
                        <p className="text-gray-700 mt-2 md:mt-3 mb-2 text-sm md:text-base">{step.description}</p>

                        {step.tips && (
                            <div className="mt-4 md:mt-6 bg-primary/5 p-4 md:p-5 rounded-lg border-l-2 md:border-l-4 border-primary/40">
                                <h4 className="font-semibold text-primary-700 mb-2 text-sm md:text-base">Conseils</h4>
                                <p className="text-gray-700 text-sm md:text-base">{step.tips}</p>
                            </div>
                        )}

                        {step.overnight && (
                            <p className="text-xs md:text-sm text-primary font-medium mt-3 md:mt-4 flex items-center">
                                <Clock className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" /> Nuit sur place
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export const PointsOfInterest = ({ points }: any) => {
    return (
        <div className="mt-8 md:mt-12">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <div className="h-6 md:h-8 w-px md:w-1 bg-primary rounded-full mr-3"></div>
                    <h2 className="text-lg md:text-xl font-bold text-gray-800">Points d'intérêt</h2>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 my-4 md:my-8">
                {points?.map((poi: any, index: number) => (
                    <div key={index} className="border border-gray-100 rounded-lg md:rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                        <div className="relative overflow-hidden h-40 md:h-52">
                            <img
                                src={poi.image || "/placeholder.svg"}
                                alt={poi.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Effet de dégradé plus subtil */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="p-4 md:p-5">
                            <h3 className="font-semibold text-base md:text-lg lg:text-xl mb-1 md:mb-2 text-gray-800 group-hover:text-primary transition-colors">{poi.name}</h3>
                            <p className="text-gray-600 text-sm md:text-base">{poi.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

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
            <div className="sticky top-16 md:top-20">
                <div className="bg-white rounded-lg md:rounded-xl p-5 md:p-6 mb-4 md:mb-6 shadow-sm border border-gray-100 hover:shadow transition-shadow">
                    <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-5 text-gray-800 border-b border-gray-100 pb-3">Informations pratiques</h3>

                    <div className="space-y-4 md:space-y-5">
                        <div className="flex items-center group">
                            <div className="p-1.5 md:p-2 rounded-lg mr-3 md:mr-4 group-hover:bg-primary/10 transition-colors">
                                <Calendar className="h-5 w-5 md:h-6 md:w-6 text-primary/80" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-500 text-xs md:text-sm">Meilleure saison</div>
                                <div className="font-semibold text-gray-800 text-sm md:text-base">{roadTrip.bestSeason}</div>
                            </div>
                        </div>

                        <div className="flex items-center group">
                            <div className="p-1.5 md:p-2 rounded-lg mr-3 md:mr-4 group-hover:bg-primary/10 transition-colors">
                                <Clock className="h-5 w-5 md:h-6 md:w-6 text-primary/80" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-500 text-xs md:text-sm">Durée</div>
                                <div className="font-semibold text-gray-800 text-sm md:text-base">{roadTrip.duration} jours</div>
                            </div>
                        </div>

                        <div className="flex items-center group">
                            <div className="p-1.5 md:p-2 rounded-lg mr-3 md:mr-4 group-hover:bg-primary/10 transition-colors">
                                <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-primary/80" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-500 text-xs md:text-sm">Budget estimé</div>
                                <div className="font-semibold text-gray-800 text-sm md:text-base">
                                    {typeof roadTrip.budget === 'object'
                                        ? `${roadTrip.budget.amount || 0} ${roadTrip.budget.currency || "€"}`
                                        : `${roadTrip.budget || 0} €`
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statut d'accès Premium - Style plus élégant */}
                {roadTrip.isPremium && (
                    <div className={`rounded-lg md:rounded-xl p-5 md:p-6 mb-4 md:mb-6 shadow-sm ${canAccessPremium ? 'bg-green-50/70 border border-green-100' : 'bg-primary/5 border border-primary/10'}`}>
                        <h3 className="font-semibold flex items-center gap-2 md:gap-3 mb-2">
                            {canAccessPremium ? (
                                <>
                                    <div className="bg-green-100 p-1 md:p-1.5 rounded-full">
                                        <span className="text-green-600 text-base md:text-lg">✓</span>
                                    </div>
                                    <span className="text-green-800 text-base md:text-lg">Accès Premium</span>
                                </>
                            ) : (
                                <>
                                    <div className="bg-primary/10 p-1 md:p-1.5 rounded-full">
                                        <Lock className="h-4 w-4 md:h-5 md:w-5 text-primary/80" />
                                    </div>
                                    <span className="text-primary text-base md:text-lg">Contenu verrouillé</span>
                                </>
                            )}
                        </h3>
                        <p className="text-xs md:text-sm mt-2 md:mt-3 mb-2 ml-1">
                            {canAccessPremium
                                ? userRole === 'admin'
                                    ? "Vous avez accès à tout le contenu en tant qu'administrateur."
                                    : "Vous avez accès à tout le contenu avec votre abonnement premium."
                                : "Certains contenus sont réservés aux abonnés premium."}
                        </p>

                        {!canAccessPremium && (
                            <div className="mt-4 md:mt-5">
                                <Link href="/premium">
                                    <Button size="sm" className="w-full bg-primary/90 hover:bg-primary font-medium py-2 md:py-2.5 text-sm rounded-full transition-colors shadow-sm hover:shadow">
                                        Débloquer Premium
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-2 md:space-y-3 bg-white rounded-lg md:rounded-xl p-5 md:p-6 shadow-sm border border-gray-100 hover:shadow transition-shadow">
                    <Button
                        className={`w-full ${favorite ? 'bg-red-500/90 hover:bg-red-500' : 'bg-primary/90 hover:bg-primary'} text-white font-medium flex items-center justify-center gap-2 rounded-full transition-colors text-sm shadow-sm hover:shadow py-2 md:py-2.5`}
                        onClick={handleAddToFavorites}
                    >
                        <Heart className={`h-4 w-4 md:h-5 md:w-5 ${favorite ? 'fill-white' : ''} transition-transform hover:scale-110`} />
                        {favorite ? 'Ajouté aux favoris' : 'Ajouter aux favoris'}
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full font-medium flex items-center justify-center gap-2 rounded-full hover:bg-primary/5 transition-colors text-sm py-2 md:py-2.5"
                        onClick={handleShare}
                    >
                        <Share2 className="h-4 w-4 md:h-5 md:w-5" />
                        Partager
                    </Button>

                    {/* Afficher les boutons d'export uniquement pour les utilisateurs premium ou admin ou si le roadtrip n'est pas premium */}
                    {(canAccessPremium || !roadTrip.isPremium) && (
                        <Button
                            variant="outline"
                            className="w-full font-medium flex items-center justify-center gap-2 rounded-full hover:bg-primary/5 transition-colors text-sm py-2 md:py-2.5"
                            onClick={generatePdf}
                        >
                            <FileText className="h-4 w-4 md:h-5 md:w-5" />
                            Exporter en PDF
                        </Button>
                    )}

                    {/* Boutons admin */}
                    {userRole === 'admin' && (
                        <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
                            <h3 className="text-xs md:text-sm font-semibold text-gray-500 uppercase mb-2 md:mb-3">Administration</h3>
                            <div className="grid grid-cols-2 gap-2 md:gap-3">
                                <Link href={`/admin/roadtrip/update/${roadTrip._id}`} className="col-span-1">
                                    <Button variant="secondary" className="w-full rounded-full hover:bg-gray-100 transition-colors text-sm py-1.5 md:py-2">Modifier</Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                    className="w-full rounded-full transition-colors text-white bg-red-500/90 hover:bg-red-500 text-sm py-1.5 md:py-2"
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

export const LoadingState = () => {
    return (
        <div className="container py-8 md:py-16 text-center">
            <div className="flex flex-col items-center">
                <div className="h-8 w-8 md:h-10 md:w-10 animate-spin text-primary/80 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" className="opacity-20"></circle>
                        <path d="M12 2a10 10 0 0 1 10 10" className="opacity-100"></path>
                    </svg>
                </div>
                <p className="text-gray-500 text-sm md:text-base">Chargement de l'itinéraire...</p>
            </div>
        </div>
    )
}

export const ErrorState = ({ error }: { error: string }) => {
    return (
        <div className="container py-8 md:py-16 max-w-xs sm:max-w-sm md:max-w-md mx-auto">
            <div className="bg-red-50/80 border border-red-100 rounded-lg md:rounded-xl p-6 md:p-8 text-center shadow-sm">
                <AlertTriangle className="h-10 w-10 md:h-12 md:w-12 text-red-400 mx-auto mb-3 md:mb-4" />
                <h1 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-red-700">Erreur</h1>
                <p className="mb-4 md:mb-6 text-red-600 text-sm md:text-base">{error}</p>
                <Link href="/">
                    <Button className="px-5 md:px-6 py-1.5 md:py-2 font-medium rounded-full text-sm">Retour à l'accueil</Button>
                </Link>
            </div>
        </div>
    )
}

export const NotFoundState = () => {
    return (
        <div className="container py-8 md:py-16 max-w-xs sm:max-w-sm md:max-w-md mx-auto">
            <div className="bg-primary/5 border border-primary/10 rounded-lg md:rounded-xl p-6 md:p-8 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 mb-3 md:mb-4">
                    <Filter className="h-6 w-6 md:h-7 md:w-7 text-primary/80" />
                </div>
                <h1 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-800">Itinéraire non trouvé</h1>
                <p className="mb-4 md:mb-6 text-gray-600 text-sm md:text-base">L'itinéraire que vous recherchez n'existe pas ou a été supprimé.</p>
                <Link href="/">
                    <Button className="px-5 md:px-6 py-1.5 md:py-2 font-medium bg-primary/90 hover:bg-primary text-white rounded-full transition-colors text-sm shadow-sm hover:shadow">
                        Retour à l'accueil
                    </Button>
                </Link>
            </div>
        </div>
    )
}