import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-primary">RoadTrip!</h3>
            <p className="text-sm text-gray-600">
              Votre compagnon idéal pour planifier des road trips inoubliables à travers le monde.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Twitter size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Découvrir</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/explorer" className="text-gray-600 hover:text-primary">
                  Explorer
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="text-gray-600 hover:text-primary">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/themes" className="text-gray-600 hover:text-primary">
                  Thèmes de voyage
                </Link>
              </li>
              <li>
                <Link href="/saisons" className="text-gray-600 hover:text-primary">
                  Meilleures saisons
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Compte</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auth" className="text-gray-600 hover:text-primary">
                  Connexion
                </Link>
              </li>
              <li>
                <Link href="/auth" className="text-gray-600 hover:text-primary">
                  Inscription
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-gray-600 hover:text-primary">
                  Mes favoris
                </Link>
              </li>
              <li>
                <Link href="/premium" className="text-gray-600 hover:text-primary">
                  Abonnement Premium
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Aide</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-primary">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-primary">
                  Conditions d'utilisation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} RoadTrip! Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
