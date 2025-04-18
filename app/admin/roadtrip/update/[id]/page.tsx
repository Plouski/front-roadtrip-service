"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { RoadtripService } from "@/services/roadtrip-service"
import { AuthService } from "@/services/auth-service"
import { AlertMessage } from "@/components/ui/alert-message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, Clock, DollarSign, Loader2, AlertCircle, CheckCircle2, Plus, Minus, X, ImagePlus, ChevronRight, ChevronLeft, Save } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { countries } from "@/lib/countries"
import { availableTags } from "@/lib/tags"
import { seasons } from "@/lib/seasons"
import { uploadImageToCloudinary } from "@/lib/cloudinary"
import { AdminService } from "@/services/admin-service"

// Type pour les points d'intérêt
type PointOfInterest = {
  id?: string;
  name: string;
  description: string;
  image: string;
};

// Type pour les étapes de l'itinéraire
type ItineraryStep = {
  id?: string;
  day: number;
  title: string;
  description: string;
  overnight: boolean;
  drivingTime?: string;
  distance?: number;
  accommodation?: string;
  tips?: string;
};

export default function EditRoadTripPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(null);
  const [activeTab, setActiveTab] = useState("basic-info");
  
  // État principal du roadtrip
  const [roadtrip, setRoadtrip] = useState({
    title: "",
    description: "",
    country: "",
    region: "",
    duration: 1,
    budget: 0,
    bestSeason: "",
    image: "/placeholder.svg?height=600&width=800",
    isPremium: false,
    tags: [],
    pointsOfInterest: [],
    itinerary: [],
    isPublished: false
  });
  
  // État pour les entrées d'itinéraire (un pour chaque jour)
  const [itineraryInputs, setItineraryInputs] = useState<ItineraryStep[]>([]);
  
  // États temporaires pour l'ajout de nouveaux éléments
  const [selectedTag, setSelectedTag] = useState("");
  const [tempPointOfInterest, setTempPointOfInterest] = useState<PointOfInterest>({
    name: "",
    description: "",
    image: "/placeholder.svg?height=300&width=400"
  });

  // Vérifier si c'est un administrateur et charger les données du roadtrip
  useEffect(() => {
    const isAdmin = async () => {
      try {
        const authenticated = await AuthService.isAdmin();
        setIsAdmin(authenticated);

        if (!authenticated) {
          router.push('/');
          return;
        }
        
        // Chargement des données du roadtrip
        if (id) {
          setIsLoading(true);
          try {
            const data = await RoadtripService.getRoadtripById(id);
            
            // Mise à jour des données du roadtrip
            setRoadtrip({
              title: data.title || "",
              description: data.description || "",
              country: data.country || "",
              region: data.region || "",
              duration: data.duration || 7,
              budget: typeof data.budget === 'object' ? data.budget.amount : (data.budget || 1000),
              bestSeason: data.bestSeason || "",
              image: data.image || "/placeholder.svg?height=600&width=800",
              isPremium: data.isPremium || false,
              tags: data.tags || [],
              pointsOfInterest: data.pointsOfInterest || [],
              itinerary: data.itinerary || [],
              isPublished: data.isPublished || false
            });
            
            // Mise à jour des étapes d'itinéraire
            if (data.itinerary && data.itinerary.length > 0) {
              const steps = data.itinerary.map((step: any) => ({
                id: step.id || `step-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                day: step.day,
                title: step.title || "",
                description: step.description || "",
                overnight: step.overnight !== undefined ? step.overnight : true,
                drivingTime: step.drivingTime || "",
                distance: step.distance || 0,
                accommodation: step.accommodation || "",
                tips: step.tips || ""
              }));
              setItineraryInputs(steps);
            }
          } catch (error: any) {
            console.error("Erreur lors du chargement du roadtrip:", error);
            showAlert("Erreur lors du chargement des données", "error");
          } finally {
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsLoading(false);
      }
    };

    isAdmin();
  }, [id, router]);

  // Mise à jour des étapes d'itinéraire lorsque la durée change
  useEffect(() => {
    if (!isLoading) {
      // Créer un tableau d'étapes basé sur la durée avec valeurs par défaut
      const steps = Array.from({ length: roadtrip.duration }, (_, i) => ({
        id: `step-${Date.now()}-${i}`,
        day: i + 1,
        title: "",
        description: "",
        overnight: true,
        drivingTime: "",
        distance: 0,
        accommodation: "",
        tips: ""
      }));
      
      // Conserver les données déjà saisies si elles existent
      const updatedSteps = steps.map(step => {
        const existingStep = itineraryInputs.find(item => item.day === step.day);
        return existingStep ? existingStep : step;
      });
      
      setItineraryInputs(updatedSteps);
    }
  }, [roadtrip.duration, isLoading]);
  
  // Fonctions de gestion des modifications
  const handleChange = (field, value) => {
    setRoadtrip(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Gestion des alertes
  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
  };
  
  const clearAlert = () => {
    setAlertMessage("");
    setAlertType(null);
  };
  
  // Gestion des images
  const handleImageUpload = async (type, index = null) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const imageUrl = await uploadImageToCloudinary(file);

        if (type === "main") {
          handleChange("image", imageUrl);
        } else if (type === "poi" && index === null) {
          setTempPointOfInterest((prev) => ({ ...prev, image: imageUrl }));
        } else if (type === "poi" && index !== null) {
          const updatedPOIs = [...roadtrip.pointsOfInterest];
          updatedPOIs[index].image = imageUrl;
          handleChange("pointsOfInterest", updatedPOIs);
        }
      } catch (error) {
        console.error("Erreur upload Cloudinary :", error);
        showAlert("Erreur lors de l'upload de l'image", "error");
      }
    };

    input.click();
  };
  
  // Gestion des tags
  const handleTagSelect = (tag) => {
    setRoadtrip(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };
  
  // Mise à jour d'une étape d'itinéraire
  const updateItineraryInput = (index, field, value) => {
    setItineraryInputs(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };
  
  // Gestion des points d'intérêt
  const addPointOfInterest = () => {
    if (!tempPointOfInterest.name || !tempPointOfInterest.description) {
      showAlert("Veuillez remplir tous les champs du point d'intérêt", "error");
      return;
    }

    const newPoi = {
      ...tempPointOfInterest,
      id: `poi-${Date.now()}`
    };

    setRoadtrip(prev => ({
      ...prev,
      pointsOfInterest: [...prev.pointsOfInterest, newPoi]
    }));

    // Réinitialiser le formulaire temporaire
    setTempPointOfInterest({
      name: "",
      description: "",
      image: "/placeholder.svg?height=300&width=400"
    });
  };

  const removePointOfInterest = (index) => {
    setRoadtrip(prev => ({
      ...prev,
      pointsOfInterest: prev.pointsOfInterest.filter((_, i) => i !== index)
    }));
  };
  
  // Ajout d'une nouvelle étape d'itinéraire
  const addItineraryStep = () => {
    const newStep: ItineraryStep = {
      id: `step-${Date.now()}`,
      day: itineraryInputs.length + 1,
      title: "",
      description: "",
      overnight: true,
      drivingTime: "",
      distance: 0,
      accommodation: "",
      tips: "",
    };
    setItineraryInputs([...itineraryInputs, newStep]);
  };

  // Mise à jour d'une étape d'itinéraire par ID
  const updateItineraryStep = (stepId, field, value) => {
    setItineraryInputs(
      itineraryInputs.map(step => (step.id === stepId ? { ...step, [field]: value } : step))
    );
  };

  // Suppression d'une étape d'itinéraire
  const removeItineraryStep = (stepId) => {
    // Filtrer les étapes pour retirer celle avec l'ID donné
    const filteredSteps = itineraryInputs.filter(step => step.id !== stepId);
    
    // Réorganiser les jours
    const updatedSteps = filteredSteps.map((step, index) => ({
      ...step,
      day: index + 1
    }));
    
    setItineraryInputs(updatedSteps);
  };
  
  // Navigation et validation des onglets
  const validateCurrentTab = () => {
    if (activeTab === "basic-info") {
      if (!roadtrip.title || !roadtrip.country || !roadtrip.description) {
        showAlert("Veuillez remplir tous les champs obligatoires (titre, pays, description)", "error");
        return false;
      }
    } else if (activeTab === "details") {
      if (!roadtrip.bestSeason || roadtrip.tags.length === 0) {
        showAlert("Veuillez sélectionner au moins une saison et un tag", "error");
        return false;
      }
    } else if (activeTab === "points-of-interest") {
      if (roadtrip.pointsOfInterest.length === 0) {
        showAlert("Veuillez ajouter au moins un point d'intérêt", "error");
        return false;
      }
    } else if (activeTab === "itinerary") {
      // Vérifier que tous les jours ont un titre et une description
      const incompleteDay = itineraryInputs.find(day => !day.title || !day.description);
      if (incompleteDay) {
        showAlert(`Veuillez compléter les informations pour le jour ${incompleteDay.day}`, "error");
        return false;
      }
    }

    return true;
  };

  const navigateTabs = (direction) => {
    const tabs = ["basic-info", "details", "points-of-interest", "itinerary", "publishing"];
    const currentIndex = tabs.indexOf(activeTab);
    const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex >= 0 && nextIndex < tabs.length) {
      setActiveTab(tabs[nextIndex]);
    }
  };

  const handleNextTab = () => {
    if (validateCurrentTab()) {
      navigateTabs('next');
      clearAlert();
    }
  };

  const isTabUnlocked = (tab) => {
    switch (tab) {
      case "basic-info":
        return true;
      case "details":
        return roadtrip.title && roadtrip.country && roadtrip.description;
      case "points-of-interest":
        return roadtrip.bestSeason && roadtrip.tags.length > 0;
      case "itinerary":
        return roadtrip.pointsOfInterest.length > 0;
      case "publishing":
        // Vérifie que tous les jours d'itinéraire ont été complétés
        return itineraryInputs.length > 0 && 
               itineraryInputs.every(day => day.title && day.description);
      default:
        return false;
    }
  };
  
  // Sauvegarde du roadtrip
  const handleSaveRoadtrip = async (publish = false) => {
    try {
      // Validation finale de tous les champs requis
      if (
        !roadtrip.title ||
        !roadtrip.country ||
        !roadtrip.description ||
        !roadtrip.bestSeason ||
        roadtrip.tags.length === 0 ||
        roadtrip.pointsOfInterest.length === 0 ||
        itineraryInputs.some(step => !step.title || !step.description)
      ) {
        showAlert("Veuillez remplir tous les champs obligatoires dans chaque section", "error");
        return;
      }

      setIsSaving(true);

      const roadtripToSave = {
        ...roadtrip,
        itinerary: itineraryInputs,
        isPublished: publish
      };

      // Appel au service pour mettre à jour le roadtrip
      await AdminService.updateRoadtrip(id, roadtripToSave);

      showAlert(`Roadtrip ${publish ? 'publié' : 'sauvegardé'} avec succès !`, "success");

      // Redirection vers la page de visualisation après un court délai
      setTimeout(() => {
        router.push(`/roadtrip/${id}`);
      }, 1500);
    } catch (error) {
      console.error("Error saving roadtrip:", error);
      showAlert("Erreur lors de la sauvegarde du roadtrip", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold">Chargement...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Modifier le Roadtrip</h1>
          <Button variant="outline" onClick={() => router.push('/admin/dashboard')}>
            Annuler
          </Button>
        </div>

        {alertMessage && (
          <AlertMessage message={alertMessage} type={alertType} />
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="basic-info">Infos de base</TabsTrigger>
            <TabsTrigger value="details" disabled={!isTabUnlocked("details")}>Détails</TabsTrigger>
            <TabsTrigger value="points-of-interest" disabled={!isTabUnlocked("points-of-interest")}>Points d'intérêt</TabsTrigger>
            <TabsTrigger value="itinerary" disabled={!isTabUnlocked("itinerary")}>Itinéraire</TabsTrigger>
            <TabsTrigger value="publishing" disabled={!isTabUnlocked("publishing")}>Publication</TabsTrigger>
          </TabsList>

          {/* Onglet Informations de base */}
          <TabsContent value="basic-info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations essentielles</CardTitle>
                <CardDescription>
                  Commençons par les informations de base de votre roadtrip
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-1">
                  <Label htmlFor="title">Titre du roadtrip <span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    placeholder="Ex: La Côte d'Azur en cabriolet"
                    value={roadtrip.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="country">Pays <span className="text-red-500">*</span></Label>
                    <Select
                      value={roadtrip.country}
                      onValueChange={(value) => handleChange('country', value)}
                    >
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Sélectionner un pays" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="region">Région (optionnel)</Label>
                    <Input
                      id="region"
                      placeholder="Ex: Provence-Alpes-Côte d'Azur"
                      value={roadtrip.region}
                      onChange={(e) => handleChange('region', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez votre roadtrip de manière attrayante..."
                    value={roadtrip.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={5}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label>Image principale</Label>
                  <div className="border rounded-md p-4">
                    <div className="aspect-video bg-muted rounded-md overflow-hidden">
                      <img
                        src={roadtrip.image}
                        alt="Image principale du roadtrip"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="mt-2 w-full"
                      onClick={() => handleImageUpload("main")}
                    >
                      <ImagePlus className="mr-2 h-4 w-4" />
                      Choisir une image
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleNextTab}>
                  Suivant
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Onglet Détails */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Détails du voyage</CardTitle>
                <CardDescription>
                  Ajoutez des détails pratiques sur votre roadtrip
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="duration">Durée (jours) <span className="text-red-500">*</span></Label>
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleChange('duration', Math.max(1, roadtrip.duration - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        value={roadtrip.duration}
                        onChange={(e) => handleChange('duration', parseInt(e.target.value) || 1)}
                        required
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleChange('duration', roadtrip.duration + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="bestSeason">Meilleure saison <span className="text-red-500">*</span></Label>
                    <Select
                      value={roadtrip.bestSeason}
                      onValueChange={(value) => handleChange('bestSeason', value)}
                    >
                      <SelectTrigger id="bestSeason">
                        <SelectValue placeholder="Sélectionner une saison" />
                      </SelectTrigger>
                      <SelectContent>
                        {seasons.map((season) => (
                          <SelectItem key={season} value={season}>{season}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="budget">Budget estimé (€) <span className="text-red-500">*</span></Label>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>500 €</span>
                      <span>5000 €</span>
                    </div>
                    <Slider
                      id="budget"
                      min={500}
                      max={5000}
                      step={100}
                      value={[roadtrip.budget]}
                      onValueChange={(value) => handleChange('budget', value[0])}
                    />
                    <div className="text-center font-medium">
                      {roadtrip.budget} €
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Tags <span className="text-red-500">*</span></Label>
                  <p className="text-sm text-muted-foreground">Sélectionnez les tags qui correspondent à votre roadtrip (au moins un)</p>

                  <div className="flex flex-wrap gap-2">
                    {roadtrip.tags.map((tag) => (
                      <Badge key={tag} className="cursor-pointer" onClick={() => handleTagSelect(tag)}>
                        {tag} <X className="ml-1 h-3 w-3" />
                      </Badge>
                    ))}
                  </div>

                  <Select
                    value={selectedTag}
                    onValueChange={(value) => {
                      setSelectedTag(value);
                      if (value && !roadtrip.tags.includes(value)) {
                        handleTagSelect(value);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ajouter un tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTags
                        .filter(tag => !roadtrip.tags.includes(tag))
                        .map((tag) => (
                          <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPremium"
                    checked={roadtrip.isPremium}
                    onCheckedChange={(checked) => handleChange('isPremium', checked)}
                  />
                  <Label htmlFor="isPremium">
                    Contenu premium (réservé aux abonnés)
                  </Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigateTabs('prev')}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Précédent
                </Button>
                <Button onClick={handleNextTab}>
                  Suivant
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Onglet Points d'intérêt */}
          <TabsContent value="points-of-interest" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Points d'intérêt</CardTitle>
                <CardDescription>
                  Ajoutez les lieux incontournables de votre roadtrip
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Points d'intérêt existants */}
                {roadtrip.pointsOfInterest.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Points d'intérêt ajoutés</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {roadtrip.pointsOfInterest.map((poi, index) => (
                        <div key={index} className="border rounded-md p-4 space-y-2">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{poi.name}</h4>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removePointOfInterest(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{poi.description}</p>
                          <div className="aspect-video bg-muted rounded-md overflow-hidden">
                            <img
                              src={poi.image}
                              alt={poi.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleImageUpload("poi", index)}
                          >
                            <ImagePlus className="mr-2 h-3 w-3" />
                            Changer l'image
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ajouter un nouveau point d'intérêt */}
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="text-lg font-medium">Ajouter un point d'intérêt</h3>

                  <div className="space-y-1">
                    <Label htmlFor="poi-name">Nom du lieu <span className="text-red-500">*</span></Label>
                    <Input
                      id="poi-name"
                      placeholder="Ex: Mont Saint-Michel"
                      value={tempPointOfInterest.name}
                      onChange={(e) => setTempPointOfInterest(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="poi-description">Description <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="poi-description"
                      placeholder="Décrivez ce lieu..."
                      value={tempPointOfInterest.description}
                      onChange={(e) => setTempPointOfInterest(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                                  
                  <div className="space-y-1">
                    <Label>Image</Label>
                    <div className="aspect-video bg-muted rounded-md overflow-hidden">
                      <img
                        src={tempPointOfInterest.image}
                        alt="Image du point d'intérêt"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="mt-2 w-full"
                      onClick={() => handleImageUpload("poi")}
                    >
                      <ImagePlus className="mr-2 h-4 w-4" />
                      Choisir une image
                    </Button>
                  </div>

                  <Button
                    className="w-full"
                    onClick={addPointOfInterest}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter ce point d'intérêt
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigateTabs('prev')}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Précédent
                </Button>
                <Button onClick={handleNextTab}>
                  Suivant
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Onglet Itinéraire */}
          <TabsContent value="itinerary" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Itinéraire jour par jour</CardTitle>
                <CardDescription>
                  Détaillez l'itinéraire de votre roadtrip pour une durée de {roadtrip.duration} jours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Jours d'itinéraire générés dynamiquement */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Étapes de l'itinéraire</h3>
                    <p className="text-sm text-muted-foreground">
                      {itineraryInputs.filter(day => day.title && day.description).length} / {roadtrip.duration} jours complétés
                    </p>
                  </div>
                  
                  {itineraryInputs.map((day, index) => (
                    <div key={day.id || index} className="border rounded-md p-4 space-y-4">
                      <h3 className="text-lg font-medium flex items-center">
                        <span className="flex items-center justify-center bg-primary text-primary-foreground w-8 h-8 rounded-full mr-2">
                          {day.day}
                        </span>
                        Jour {day.day}
                      </h3>

                      <div className="space-y-1">
                        <Label htmlFor={`step-title-${index}`}>Titre <span className="text-red-500">*</span></Label>
                        <Input
                          id={`step-title-${index}`}
                          placeholder="Ex: Randonnée dans les gorges"
                          value={day.title}
                          onChange={(e) => updateItineraryInput(index, "title", e.target.value)}
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor={`step-description-${index}`}>Description <span className="text-red-500">*</span></Label>
                        <Textarea
                          id={`step-description-${index}`}
                          placeholder="Décrivez l'étape en détail..."
                          value={day.description}
                          onChange={(e) => updateItineraryInput(index, "description", e.target.value)}
                          rows={3}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`overnight-${index}`}
                          checked={day.overnight}
                          onCheckedChange={(checked) => updateItineraryInput(index, "overnight", checked)}
                        />
                        <Label htmlFor={`overnight-${index}`}>Nuit sur place</Label>
                      </div>
                      
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigateTabs('prev')}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Précédent
                </Button>
                <Button onClick={handleNextTab}>
                  Suivant
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Onglet Publication */}
          <TabsContent value="publishing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publication</CardTitle>
                <CardDescription>
                  Finalisez et publiez votre roadtrip
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Aperçu du roadtrip */}
                <div className="bg-muted p-6 rounded-md">
                  <h3 className="text-xl font-semibold mb-4">{roadtrip.title || "Titre du roadtrip"}</h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <div className="aspect-video bg-background rounded-md overflow-hidden">
                        <img
                          src={roadtrip.image}
                          alt="Image principale du roadtrip"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Destination</h4>
                        <p>{roadtrip.country}{roadtrip.region ? `, ${roadtrip.region}` : ""}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Durée</h4>
                        <p>{roadtrip.duration} jours</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Budget</h4>
                        <p>{roadtrip.budget} €</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Meilleure saison</h4>
                        <p>{roadtrip.bestSeason}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Type de voyage</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {roadtrip.tags.map(tag => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                    <p className="mt-1">{roadtrip.description}</p>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Points d'intérêt</h4>
                    <p className="mt-1">{roadtrip.pointsOfInterest.length} points d'intérêt ajoutés</p>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Itinéraire</h4>
                    <p className="mt-1">{roadtrip.duration} jours détaillés</p>
                  </div>

                  {roadtrip.isPremium && (
                    <div className="mt-4 px-4 py-2 bg-amber-100 text-amber-800 rounded-md">
                      Ce roadtrip sera marqué comme contenu premium, réservé aux abonnés.
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Options de publication</h3>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="publish-now"
                        checked={roadtrip.isPublished}
                        onCheckedChange={(checked) => handleChange('isPublished', checked)}
                      />
                      <div>
                        <Label htmlFor="publish-now" className="font-medium">
                          Publier immédiatement
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Le roadtrip sera visible par tous les utilisateurs.
                        </p>
                      </div>
                    </div>

                    {!roadtrip.isPublished && (
                      <div className="pl-6">
                        <p className="text-sm text-muted-foreground">
                          Votre roadtrip sera enregistré comme brouillon et ne sera visible que par vous.
                          Vous pourrez le publier ultérieurement depuis votre dashboard.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigateTabs('prev')}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Précédent
                </Button>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleSaveRoadtrip(false)}
                    disabled={isSaving}
                  >
                    {isSaving ?
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> :
                      <Save className="mr-2 h-4 w-4" />
                    }
                    Enregistrer comme brouillon
                  </Button>
                  <Button
                    onClick={() => handleSaveRoadtrip(true)}
                    disabled={isSaving}
                  >
                    {isSaving ?
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> :
                      null
                    }
                    Publier
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}