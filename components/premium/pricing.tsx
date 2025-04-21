'use client'

import { Check, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { SubscriptionService } from "@/services/subscription-service"
import { AuthService } from "@/services/auth-service"
import { useRouter } from "next/navigation"

interface PricingFeature {
  title: string
}

export default function PricingSection({ features }: { features: PricingFeature[] }) {
    
    const router = useRouter()

    const handleSubscribe = async (plan: 'monthly' | 'annual') => {
        const token = AuthService.getAuthToken();
        if (!token) {
            router.push("/auth"); // ou window.location.href = "/auth"
            return;
        }
      
        try {
          const url = await SubscriptionService.startCheckoutSession(plan);
          if (url) window.location.href = url;
        } catch (error) {
          alert(error.message || "Erreur lors de la souscription.");
        }
      };
      

  return (
    <section id="pricing" className="py-24 bg-gradient-to-br from-blue-50 to-white relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent"></div>
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Choisissez votre formule</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Flexible et adaptée à vos besoins, notre tarification vous permet de profiter d'une expérience premium qui vous correspond.
          </p>
        </div>

        <Tabs defaultValue="monthly" className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-10">
            <TabsList className="p-1 bg-gray-100 rounded-xl">
              <TabsTrigger value="monthly" className="rounded-lg py-3 px-6 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Mensuel
              </TabsTrigger>
              <TabsTrigger value="annual" className="rounded-lg py-3 px-6 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Annuel <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">-25%</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="monthly">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <FreePlanCard />
              <PremiumPlanCard
                type="monthly"
                price="5€"
                period="par mois, sans engagement"
                features={features}
                onSubscribe={() => handleSubscribe("monthly")}
              />
            </div>
          </TabsContent>

          <TabsContent value="annual">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <FreePlanCard />
              <PremiumPlanCard
                type="annual"
                price="45€"
                period="par an"
                regularPrice=""
                savings="Économisez 25%"
                features={features}
                onSubscribe={() => handleSubscribe("annual")}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

function FreePlanCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-10 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      <h3 className="text-xl font-bold mb-3 flex items-center">
        <span className="mr-2 text-2xl">🌱</span> Découverte
      </h3>
      <div className="text-4xl font-bold text-foreground mb-1">0€</div>
      <p className="text-sm text-muted-foreground mb-8">pour toujours</p>
      <ul className="space-y-4 mb-10">
        {["Accès aux itinéraires de base", "Recherche de destinations", "Sauvegarde de favoris"].map((item, index) => (
          <li key={index} className="flex items-start">
            <div className="h-6 w-6 mr-3 mt-0.5 flex items-center justify-center rounded-full bg-green-50">
              <Check className="h-3.5 w-3.5 text-green-600" />
            </div>
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
      <Link href="/auth">
        <Button
          variant="outline"
          className="w-full rounded-xl h-auto border-gray-200 text-gray-700 text-base font-medium hover:border-gray-300 hover:bg-gray-50"
        >
          Continuer gratuitement
        </Button>
      </Link>
    </div>
  )
}

interface PremiumPlanCardProps {
  type: 'monthly' | 'annual'
  price: string
  period: string
  regularPrice?: string
  savings?: string
  features: PricingFeature[]
  onSubscribe: () => void
}

function PremiumPlanCard({
  type,
  price,
  period,
  regularPrice,
  savings,
  features,
  onSubscribe
}: PremiumPlanCardProps) {
  return (
    <div className="bg-white rounded-2xl p-10 shadow-2xl border-0 transform scale-105 z-20 relative hover:shadow-2xl transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-white to-primary/5 rounded-2xl z-0"></div>
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-700 via-primary to-primary-700 rounded-t-2xl"></div>
      <div className="relative z-10">
        <div className="absolute top-4 right-4 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
          {type === 'monthly' ? 'Recommandé' : 'Économie de 25%'}
        </div>
        <h3 className="text-xl font-bold mb-3 flex items-center text-primary">
          <Star className="h-5 w-5 mr-2" /> Premium {type === 'monthly' ? 'Mensuel' : 'Annuel'}
        </h3>
        <div className="text-4xl font-bold text-foreground mb-1">{price}</div>
        <p className="text-sm text-muted-foreground mb-1">{period}</p>

        {regularPrice && savings && (
          <p className="text-sm text-muted-foreground mb-8">
            <span className="line-through text-gray-400 mr-1">{regularPrice}</span>
            <span className="text-green-600">{savings}</span>
          </p>
        )}

        {!regularPrice && <div className="mb-8"></div>}

        <ul className="space-y-4 mb-10">
          {features.map(({ title }, index) => (
            <li key={index} className="flex items-start">
              <div className="h-6 w-6 mr-3 mt-0.5 flex items-center justify-center rounded-full bg-primary/10">
                <Check className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-gray-700">{title}</span>
            </li>
          ))}
        </ul>
        <Button
          className="w-full bg-gradient-to-r from-primary to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white rounded-xl h-auto text-base font-medium shadow-md"
          onClick={onSubscribe}
        >
          {type === 'monthly' ? "S'abonner maintenant" : "S'abonner à l'année"}
        </Button>
      </div>
    </div>
  )
}
