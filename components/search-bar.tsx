"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, ChevronDown, ChevronUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function SearchBar() {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [budget, setBudget] = useState([500])
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const tags = [
    "Nature",
    "Aventure",
    "Détente",
    "Gastronomie",
    "Culture",
    "Plage",
    "Montagne",
    "Urbain",
    "Famille",
    "Romantique",
  ]

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <Input placeholder="Rechercher une destination..." className="w-full" />
        </div>
        <div className="w-full md:w-[180px]">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Pays" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="france">France</SelectItem>
              <SelectItem value="italie">Italie</SelectItem>
              <SelectItem value="espagne">Espagne</SelectItem>
              <SelectItem value="portugal">Portugal</SelectItem>
              <SelectItem value="grece">Grèce</SelectItem>
              <SelectItem value="usa">États-Unis</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-[180px]">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Durée" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekend">Weekend (1-3j)</SelectItem>
              <SelectItem value="court">Court (4-7j)</SelectItem>
              <SelectItem value="moyen">Moyen (8-14j)</SelectItem>
              <SelectItem value="long">Long (15j+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Search className="mr-2 h-4 w-4" />
          Rechercher
        </Button>
      </div>

      <div className="mt-3">
        <button
          className="flex items-center text-sm text-gray-500 hover:text-primary"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
        >
          Recherche avancée
          {isAdvancedOpen ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
        </button>
      </div>

      {isAdvancedOpen && (
        <div className="mt-4 space-y-4 pt-3 border-t">
          <div>
            <label className="block text-sm font-medium mb-2">Budget (€)</label>
            <div className="flex items-center gap-4">
              <Slider
                defaultValue={[500]}
                max={5000}
                step={100}
                value={budget}
                onValueChange={setBudget}
                className="flex-1"
              />
              <span className="w-16 text-right">{budget[0]}€</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Saison</label>
            <div className="flex flex-wrap gap-2">
              {["Printemps", "Été", "Automne", "Hiver"].map((season) => (
                <Select key={season}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder={season} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ideal">Idéale</SelectItem>
                    <SelectItem value="good">Bonne</SelectItem>
                    <SelectItem value="any">Peu importe</SelectItem>
                  </SelectContent>
                </Select>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Type de voyage</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    selectedTags.includes(tag) ? "bg-primary hover:bg-primary/80" : "hover:bg-gray-100"
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
