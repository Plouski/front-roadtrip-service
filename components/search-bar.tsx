import { Search, ChevronDown, ChevronUp, Plane } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

interface SearchFiltersProps {
  searchQuery: string
  setSearchQuery: (value: string) => void
  selectedCountry: string
  setSelectedCountry: (value: string) => void
  durationRange: string
  setDurationRange: (value: string) => void
  budgetRange: string
  setBudgetRange: (value: string) => void
  season: string
  setSeason: (value: string) => void
  selectedTag: string
  setSelectedTag: (value: string) => void
  isPremium: string
  setIsPremium: (value: string) => void
  allCountries: string[]
  allTags: string[]
}

export default function SearchFilters({
  searchQuery,
  setSearchQuery,
  selectedCountry,
  setSelectedCountry,
  durationRange,
  setDurationRange,
  budgetRange,
  setBudgetRange,
  season,
  setSeason,
  selectedTag,
  setSelectedTag,
  isPremium,
  setIsPremium,
  allCountries,
  allTags,
}: SearchFiltersProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

  return (
    <div className="mb-8 bg-white rounded-xl shadow-md p-5 border-t-4 border-t-red-600">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <label className="text-sm text-muted-foreground mb-1 block">Destination</label>
          <Input
            placeholder="Rechercher par titre..."
            className="w-full focus-visible:ring-red-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-full md:w-[180px]">
          <label className="text-sm text-muted-foreground mb-1 block">Pays</label>
          <Select onValueChange={setSelectedCountry} defaultValue={selectedCountry}>
            <SelectTrigger className="focus-visible:ring-red-600">
              <SelectValue placeholder="Pays" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              {allCountries.map((country) => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-[180px]">
          <label className="text-sm text-muted-foreground mb-1 block">Durée</label>
          <Select onValueChange={setDurationRange} defaultValue={durationRange}>
            <SelectTrigger className="focus-visible:ring-red-600">
              <SelectValue placeholder="Durée" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="short">1-3 jours</SelectItem>
              <SelectItem value="medium">4-7 jours</SelectItem>
              <SelectItem value="long">8+ jours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <Search className="mr-2 h-4 w-4" />
            Rechercher
          </Button>
        </div>
      </div>

      <div className="mt-3">
        <button
          className="flex items-center text-sm text-gray-500 hover:text-red-600"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
        >
          Recherche avancée
          {isAdvancedOpen ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
        </button>
      </div>

      {isAdvancedOpen && (
        <div className="mt-4 space-y-6 pt-4 border-t">
          <div>
            <h3 className="text-md font-semibold mb-2 flex items-center">
              <Plane className="h-4 w-4 mr-1 text-red-600" />
              Budget
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { label: "Budget léger", sublabel: "0-500€", value: "low" },
                { label: "Budget moyen", sublabel: "500-1000€", value: "medium" },
                { label: "Budget confort", sublabel: "1000-2000€", value: "high" },
                { label: "Budget luxe", sublabel: "2000-5000€", value: "luxury" },
              ].map(({ label, sublabel, value }) => (
                <Badge
                  key={value}
                  variant={budgetRange === value ? "default" : "outline"}
                  className={`cursor-pointer flex flex-col items-center px-3 py-2 ${
                    budgetRange === value ? "bg-red-600 hover:bg-red-700 text-white" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setBudgetRange(budgetRange === value ? "all" : value)}
                >
                  <span>{label}</span>
                  <span className="text-xs opacity-80">{sublabel}</span>
                </Badge>
              ))}
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>0€</span>
                <span>1000€</span>
                <span>2000€</span>
                <span>5000€</span>
              </div>
              <Slider
                min={0}
                max={5000}
                step={100}
                value={[
                  budgetRange === "low" ? 250 : 
                  budgetRange === "medium" ? 750 : 
                  budgetRange === "high" ? 1500 : 
                  budgetRange === "luxury" ? 3500 : 0
                ]}
                onValueChange={([val]) => {
                  if (val <= 500) setBudgetRange("low")
                  else if (val <= 1000) setBudgetRange("medium")
                  else if (val <= 2000) setBudgetRange("high")
                  else setBudgetRange("luxury")
                }}
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-2 flex items-center">
              <Plane className="h-4 w-4 mr-1 text-red-600" />
              Saison idéale
            </h3>
            <div className="flex flex-wrap gap-2">
              {["printemps", "été", "automne", "hiver"].map((s) => (
                <Badge
                  key={s}
                  variant={season === s ? "default" : "outline"}
                  className={`cursor-pointer ${
                    season === s ? "bg-red-600 hover:bg-red-700 text-white" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSeason(season === s ? "all" : s)}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-2 flex items-center">
              <Plane className="h-4 w-4 mr-1 text-red-600" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className={`cursor-pointer ${
                    selectedTag === tag ? "bg-red-600 hover:bg-red-700 text-white" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedTag(selectedTag === tag ? "all" : tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-2 flex items-center">
              <Plane className="h-4 w-4 mr-1 text-red-600" />
              Type de roadtrip
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Tous", value: "all" },
                { label: "Gratuit", value: "false" },
                { label: "Premium", value: "true" },
              ].map(({ label, value }) => (
                <Badge
                  key={value}
                  variant={isPremium === value ? "default" : "outline"}
                  className={`cursor-pointer ${
                    isPremium === value ? "bg-red-600 hover:bg-red-700 text-white" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setIsPremium(value)}
                >
                  {label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}