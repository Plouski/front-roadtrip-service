import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Lock,
  Heart,
  Share2,
  TriangleAlert,
  Download,
} from "lucide-react";
import Link from "next/link";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

{
  /* Hero */
}
export const RoadTripHero = ({
  image,
  title,
  description,
  country,
  region,
  isPremium,
  canAccessPremium,
  tags,
}: any) => {
  return (
    <div className="relative h-[50vh] w-full overflow-hidden">
      {/* Image de fond */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />
      {/* Overlay dégradé sombre */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      <div className="container relative z-10 flex h-full flex-col justify-end pb-8 md:pb-12 text-white">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags?.map((tag: string, index: number) => (
            <Badge key={index} className="bg-white/10 hover:bg-white/20">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Titre */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 max-w-4xl leading-snug sm:leading-tight">
          {title}
        </h1>

        {/* Description */}
        {description && (
          <div className="relative max-w-3xl text-sm sm:text-base md:text-lg mb-4 line-clamp-3 md:line-clamp-none">
            {description}
            {/* Effet fondu si description longue sur petit écran */}
            <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-black to-transparent pointer-events-none md:hidden" />
          </div>
        )}

        {/* Localisation + Premium */}
        <div className="flex items-center text-sm sm:text-base md:text-lg font-medium">
          <MapPin className="mr-2 h-4 w-4 md:h-5 md:w-5 text-white/90" />
          <span>
            {country}
            {region ? ` • ${region}` : ""}
          </span>

          {isPremium && (
            <Badge
              className={`ml-4 ${
                canAccessPremium ? "bg-green-500/90" : "bg-primary/90"
              } text-white border-none transition-colors backdrop-blur-sm`}
            >
              {canAccessPremium ? "Premium Débloqué" : "Premium"}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

{
  /* Itinéraires */
}
export const RoadTripItinerary = ({ itinerary }: any) => {
  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="h-5 md:h-10 w-px md:w-1 bg-primary rounded-full mr-2"></div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug">
          Itinéraire jour par jour
        </h2>
      </div>
      <div className="space-y-4 md:space-y-5">
        {itinerary.map((step: any, index: number) => (
          <div
            key={index}
            className={`border border-gray-100 rounded-lg md:rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all ${
              index % 2 === 0 ? "bg-gray-50/50" : "bg-white"
            }`}
          >
            <h3 className="text-lg font-semibold line-clamp-2">
              Jour {step.day} — {step.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed sm:leading-relaxed">
              {step.description}
            </p>
            {step.overnight && (
              <p className="text-xs text-primary font-medium mt-2 flex items-center">
                <Clock className="h-3 w-3 md:h-4 md:w-4 mr-1" /> Nuit sur place
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

{
  /* Premium Locked */
}
export const PremiumItineraryLocked = () => {
  return (
    <div className="my-8 md:my-16 border border-gray-100 rounded-lg md:rounded-xl p-6 md:p-10 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center mb-6 md:mb-8">
        <div className="h-5 md:h-10 w-px md:w-1 bg-primary rounded-full mr-2" />
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug">
          Itinéraire détaillé jour par jour
        </h2>
      </div>

      <div className="relative flex flex-col items-center justify-center text-center px-4 py-10 md:py-14 bg-white border border-dashed border-primary/30 rounded-xl">
        <div className="mb-5">
          <div className="bg-primary/10 p-4 md:p-5 rounded-full inline-flex items-center justify-center">
            <Lock className="h-8 w-8 md:h-10 md:w-10 text-primary" />
          </div>
        </div>
        <h3 className="text-lg font-semibold line-clamp-2 mb-3">
          Contenu réservé aux membres Premium
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed sm:leading-relaxed max-w-xl mb-6">
          Débloquez l’accès à l’itinéraire détaillé, la carte interactive, les
          conseils exclusifs et bien plus encore.
        </p>
        <Link href="/premium">
          <Button>Passer à Premium</Button>
        </Link>
      </div>
    </div>
  );
};

{
  /* Points d'intérêt */
}
export const PointsOfInterest = ({ points }: any) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="h-5 md:h-10 w-px md:w-1 bg-primary rounded-full mr-2"></div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug">
            Points d'intérêt
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 my-4 md:my-8">
        {points?.map((poi: any, index: number) => (
          <div
            key={index}
            className="border border-gray-100 rounded-lg md:rounded-xl overflow-hidden shadow-sm hover:shadow-md"
          >
            <div className="relative overflow-hidden h-40 md:h-52">
              <img
                src={poi.image || "/placeholder.svg"}
                alt={poi.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 md:p-5">
              <h3 className="text-lg font-semibold line-clamp-2">{poi.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed sm:leading-relaxed">
                {poi.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

{
  /* Sidebar */
}
export const RoadTripSidebar = ({
  roadTrip,
  userRole,
  canAccessPremium,
  favorite,
  handleAddToFavorites,
  handleShare,
  handleDelete,
}: any) => {
  return (
    <div className="lg:col-span-1">
      <div className="sticky">
        <div className="bg-white rounded-lg md:rounded-xl p-5 md:p-6 mb-4 md:mb-6 shadow-sm border border-gray-100 hover:shadow transition-shadow">
          <h3 className="text-lg font-semibold line-clamp-2 mb-5 text-center">
            Informations pratiques
          </h3>
          <div className="space-y-4 md:space-y-5">
            <div className="flex items-center group">
              <div className="mr-2">
                <Calendar className="h-5 w-5 md:h-6 md:w-6 text-primary/80" />
              </div>
              <div>
                <div className="font-semibold">Meilleure saison</div>
                <div className="text-gray-600 text-sm leading-relaxed sm:leading-relaxed">
                  {roadTrip.bestSeason}
                </div>
              </div>
            </div>
            <div className="flex items-center group">
              <div className="mr-2">
                <Clock className="h-5 w-5 md:h-6 md:w-6 text-primary/80" />
              </div>
              <div>
                <div className="font-semibold">Durée</div>
                <div className="text-gray-600 text-sm leading-relaxed sm:leading-relaxed">
                  {roadTrip.duration} jours
                </div>
              </div>
            </div>
            <div className="flex items-center group">
              <div className="mr-2">
                <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-primary/80" />
              </div>
              <div>
                <div className="font-semibold">Budget estimé</div>
                <div className="text-gray-600 text-sm leading-relaxed sm:leading-relaxed">
                  {typeof roadTrip.budget === "object"
                    ? `${roadTrip.budget.amount || 0} ${
                        roadTrip.budget.currency || "€"
                      }`
                    : `${roadTrip.budget || 0} €`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statut d'accès Premium */}
        {roadTrip.isPremium && userRole === "user" && (
          <div className="rounded-lg md:rounded-xl p-5 md:p-6 mb-4 md:mb-6 shadow-sm bg-primary/5 border border-primary/10 transition-shadow hover:shadow">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 text-primary">
              <div className="bg-primary/10 p-1.5 rounded-full">
                <Lock className="h-4 w-4 md:h-5 md:w-5 text-primary/80" />
              </div>
              Contenu verrouillé
            </h3>
            <p className="text-sm md:text-base text-gray-700 mb-4">
              Certains contenus sont réservés aux abonnés premium.
            </p>
            <Link href="/premium">
              <Button
                size="sm"
                className="rounded-full bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm hover:shadow px-4 py-2 text-sm"
              >
                Débloquer Premium
              </Button>
            </Link>
          </div>
        )}

        {/* Boutons */}
        <div className="space-y-2 md:space-y-3 bg-white rounded-lg md:rounded-xl p-5 md:p-6 shadow-sm border border-gray-100 hover:shadow transition-shadow">
          {/* Share */}
          <Button variant="outline" onClick={handleShare}>
            Partager
            <Share2 className="ml-2 h-4 w-4 md:h-5 md:w-5" />
          </Button>

          {/* Afficher les boutons d'export uniquement pour les utilisateurs premium ou admin ou si le roadtrip n'est pas premium */}
          {(canAccessPremium || !roadTrip.isPremium) && (
            <Button
              variant="outline"
              onClick={() => generateRoadtripPdf(roadTrip.title || "roadtrip")}
            >
              Télécharger PDF
              <Download className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Button>
          )}

          {/* Favoris */}
          <Button onClick={handleAddToFavorites}>
            {favorite ? "Ajouté aux favoris" : "Ajouter aux favoris"}
            <Heart
              className={`ml-2 h-4 w-4 md:h-5 md:w-5 ${
                favorite ? "fill-white" : ""
              } transition-transform hover:scale-110`}
            />
          </Button>

          {/* Boutons admin */}
          {userRole === "admin" && (
            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold line-clamp-2 mb-2">
                Administration
              </h3>
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                <Link
                  href={`/admin/roadtrip/update/${roadTrip._id}`}
                  className="col-span-1"
                >
                  <Button variant="outline">Modifier</Button>
                </Link>
                <Button onClick={handleDelete}>Supprimer</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

{
  /* Generate PDF */
}
export const generateRoadtripPdf = async (fileName = "roadtrip") => {
  const input = document.getElementById("roadtrip-pdf");
  if (!input) return;

  window.scrollTo(0, 0);

  const canvas = await html2canvas(input, {
    scale: 2,
    useCORS: true,
    scrollY: -window.scrollY,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`${fileName}.pdf`);
};