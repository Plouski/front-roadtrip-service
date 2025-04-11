export interface RoadTrip {
  id: string
  title: string
  image: string
  country: string
  region?: string
  duration: number
  budget: number
  tags: string[]
  description: string
  isPremium: boolean
  bestSeason: string
  pointsOfInterest: {
    name: string
    description: string
    image: string
  }[]
}

export const roadTrips: RoadTrip[] = [
  {
    id: "cote-azur",
    title: "La Côte d'Azur en cabriolet",
    image: "/placeholder.svg?height=600&width=800",
    country: "France",
    region: "Côte d'Azur",
    duration: 7,
    budget: 1200,
    tags: ["Plage", "Luxe", "Gastronomie", "Culture"],
    description:
      "Découvrez les joyaux de la Côte d'Azur lors d'un road trip inoubliable. De Nice à Saint-Tropez, en passant par Monaco et Cannes, profitez des plus belles plages de la Méditerranée, des villages perchés et d'une gastronomie d'exception.",
    isPremium: false,
    bestSeason: "Été",
    pointsOfInterest: [
      {
        name: "Nice",
        description: "Promenade des Anglais et vieille ville",
        image: "/placeholder.svg?height=300&width=400",
      },
      {
        name: "Monaco",
        description: "Casino de Monte-Carlo et Grand Prix",
        image: "/placeholder.svg?height=300&width=400",
      },
      {
        name: "Cannes",
        description: "La Croisette et le Palais des Festivals",
        image: "/placeholder.svg?height=300&width=400",
      },
    ],
  },
  {
    id: "route-66",
    title: "Mythique Route 66",
    image: "/placeholder.svg?height=600&width=800",
    country: "États-Unis",
    duration: 14,
    budget: 3500,
    tags: ["Aventure", "Historique", "Désert", "Urbain"],
    description:
      "Parcourez la légendaire Route 66 de Chicago à Los Angeles. Traversez 8 États et découvrez l'Amérique authentique avec ses diners rétro, ses motels vintage et ses paysages à couper le souffle.",
    isPremium: true,
    bestSeason: "Printemps",
    pointsOfInterest: [
      {
        name: "Chicago",
        description: "Point de départ historique",
        image: "/placeholder.svg?height=300&width=400",
      },
      {
        name: "Grand Canyon",
        description: "Une des merveilles naturelles du monde",
        image: "/placeholder.svg?height=300&width=400",
      },
      {
        name: "Los Angeles",
        description: "Santa Monica, fin de la Route 66",
        image: "/placeholder.svg?height=300&width=400",
      },
    ],
  },
  {
    id: "toscane",
    title: "Collines de Toscane",
    image: "/placeholder.svg?height=600&width=800",
    country: "Italie",
    region: "Toscane",
    duration: 5,
    budget: 950,
    tags: ["Gastronomie", "Vin", "Culture", "Romantique"],
    description:
      "Sillonnez les routes sinueuses de Toscane entre vignobles, cyprès et villages médiévaux. Dégustez les meilleurs vins italiens et savourez la cuisine locale dans un cadre idyllique.",
    isPremium: false,
    bestSeason: "Automne",
    pointsOfInterest: [
      {
        name: "Florence",
        description: "Berceau de la Renaissance",
        image: "/placeholder.svg?height=300&width=400",
      },
      {
        name: "Sienne",
        description: "Cité médiévale et Palio",
        image: "/placeholder.svg?height=300&width=400",
      },
      {
        name: "Val d'Orcia",
        description: "Paysages classés à l'UNESCO",
        image: "/placeholder.svg?height=300&width=400",
      },
    ],
  },
  {
    id: "ring-road",
    title: "Ring Road Islandais",
    image: "/placeholder.svg?height=600&width=800",
    country: "Islande",
    duration: 10,
    budget: 2800,
    tags: ["Nature", "Aventure", "Paysages", "Volcans"],
    description:
      "Faites le tour complet de l'Islande sur la célèbre Ring Road. Cascades, glaciers, sources chaudes, plages de sable noir et aurores boréales vous attendent dans ce voyage extraordinaire.",
    isPremium: true,
    bestSeason: "Été",
    pointsOfInterest: [
      {
        name: "Cercle d'Or",
        description: "Geysir, Gullfoss et Thingvellir",
        image: "/placeholder.svg?height=300&width=400",
      },
      {
        name: "Jökulsárlón",
        description: "Lagon glaciaire spectaculaire",
        image: "/placeholder.svg?height=300&width=400",
      },
      {
        name: "Myvatn",
        description: "Zone géothermique et bains naturels",
        image: "/placeholder.svg?height=300&width=400",
      },
    ],
  },
  {
    id: "garden-route",
    title: "Garden Route Sud-Africaine",
    image: "/placeholder.svg?height=600&width=800",
    country: "Afrique du Sud",
    region: "Cap-Occidental",
    duration: 8,
    budget: 1800,
    tags: ["Safari", "Nature", "Plage", "Aventure"],
    description:
      "Explorez la célèbre Garden Route entre Le Cap et Port Elizabeth. Entre océan et montagnes, découvrez une faune exceptionnelle, des plages paradisiaques et des forêts luxuriantes.",
    isPremium: false,
    bestSeason: "Printemps",
    pointsOfInterest: [
      {
        name: "Le Cap",
        description: "Table Mountain et Cap de Bonne-Espérance",
        image: "/placeholder.svg?height=300&width=400",
      },
      {
        name: "Hermanus",
        description: "Observation des baleines",
        image: "/placeholder.svg?height=300&width=400",
      },
      {
        name: "Parc National de Tsitsikamma",
        description: "Forêts et ponts suspendus",
        image: "/placeholder.svg?height=300&width=400",
      },
    ],
  },
  {
    id: "fjords-norvege",
    title: "Route des Fjords Norvégiens",
    image: "/placeholder.svg?height=600&width=800",
    country: "Norvège",
    duration: 9,
    budget: 2200,
    tags: ["Nature", "Paysages", "Randonnée", "Photographie"],
    description:
      "Parcourez les routes spectaculaires de Norvège entre fjords vertigineux, montagnes escarpées et villages de pêcheurs colorés. Une immersion totale dans des paysages à couper le souffle.",
    isPremium: true,
    bestSeason: "Été",
    pointsOfInterest: [
      {
        name: "Geirangerfjord",
        description: "Un des plus beaux fjords du monde",
        image: "/placeholder.svg?height=300&width=400",
      },
      {
        name: "Route des Trolls",
        description: "Route de montagne spectaculaire",
        image: "/placeholder.svg?height=300&width=400",
      },
      {
        name: "Bergen",
        description: "Ville hanséatique et port historique",
        image: "/placeholder.svg?height=300&width=400",
      },
    ],
  },
]
