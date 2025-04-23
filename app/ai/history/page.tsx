"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AssistantService } from "@/services/assistant-service";
import { AuthService } from "@/services/auth-service";
import { Calendar, MessageSquare, ArrowRight, Clock, Trash2, AlertCircle, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { usePathname, useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Message {
  _id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  conversationId: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [groupedMessages, setGroupedMessages] = useState<Record<string, Message[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérification d'authentification simplifiée
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const { isAuthenticated, role } = await AuthService.checkAuthenticationAndRole();
        
        if (!isAuthenticated) {
          console.log("Non authentifié, redirection vers /auth");
          router.push("/auth");
          return;
        }
        
        if (role !== "premium" && role !== "admin") {
          console.log(`Rôle ${role} non autorisé, redirection vers /premium`);
          router.push("/premium");
          return;
        }
        
        // Charger l'historique
        await loadHistory();
      } catch (error) {
        console.error("Erreur lors de la vérification d'authentification:", error);
        setError("Erreur lors de la vérification de votre accès.");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  const loadHistory = async () => {
    try {
      const history = await AssistantService.getHistory();
      
      // Vérifier le format de la réponse et adapter si nécessaire
      if (history && typeof history === 'object') {
        setGroupedMessages(history);
      } else {
        console.error("Format de réponse d'historique non reconnu:", history);
        setError("Format de données non reconnu.");
      }
    } catch (err) {
      setError("Erreur lors du chargement de l'historique.");
      console.error("Erreur getHistory:", err);
    }
  };

  // Formatage de la date pour affichage (adapté pour mobile)
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, isMobile ? "d MMM à HH:mm" : "d MMMM yyyy à HH:mm", { locale: fr });
    } catch (e) {
      return "Date inconnue";
    }
  };

  // Trouve le premier message d'une conversation pour obtenir sa date
  const getConversationDate = (messages: Message[]) => {
    if (!Array.isArray(messages) || messages.length === 0) return "Date inconnue";
    
    try {
      const sortedMessages = [...messages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      return formatDate(sortedMessages[0].createdAt);
    } catch (error) {
      console.error("Erreur lors de l'extraction de la date:", error);
      return "Date inconnue";
    }
  };

  // Trouver un titre pour la conversation basé sur le premier message utilisateur
  const getConversationTitle = (messages: any[]) => {
    try {
      // Vérifier si messages est un tableau
      if (!Array.isArray(messages)) {
        console.warn("messages n'est pas un tableau:", messages);
        return "Nouvelle conversation";
      }
      
      const firstUserMessage = messages.find(msg => msg && msg.role === "user");
      if (!firstUserMessage) return "Nouvelle conversation";
      
      // Limiter la longueur du titre en fonction de la vue mobile ou desktop
      const content = firstUserMessage.content;
      const maxLength = isMobile ? 25 : 40;
      return content.length > maxLength ? `${content.substring(0, maxLength)}...` : content;
    } catch (error) {
      console.error("Erreur lors de l'extraction du titre:", error);
      return "Nouvelle conversation";
    }
  };

  const handleDeleteClick = (conversationId: string) => {
    setConversationToDelete(conversationId);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!conversationToDelete) return;
    
    setIsDeleting(conversationToDelete);
    
    try {
      await AssistantService.deleteConversation(conversationToDelete);
      
      // Mettre à jour l'état local en supprimant la conversation
      const updatedMessages = { ...groupedMessages };
      delete updatedMessages[conversationToDelete];
      setGroupedMessages(updatedMessages);
      
      toast.success("Conversation supprimée avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Impossible de supprimer la conversation.");
    } finally {
      setDialogOpen(false);
      setIsDeleting(null);
      setConversationToDelete(null);
    }
  };

  // Affichage d'un indicateur de chargement
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-stone-50">
        <div className="text-stone-500 flex flex-col items-center">
          <div className="mb-4">Chargement de l'historique...</div>
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-3 h-3 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-3 h-3 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8 md:py-16">
      <div className="container max-w-5xl px-4 md:px-6">
        {/* Header avec bouton retour pour mobile */}
        <div className="mb-6 md:mb-12 flex items-center justify-between md:justify-center">
          {isMobile && (
            <Link href="/ai" className="inline-flex items-center text-stone-600 hover:text-stone-800">
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span>Retour</span>
            </Link>
          )}
          <div className={`${isMobile ? 'text-center flex-1' : 'text-center'}`}>
            <h1 className="text-2xl md:text-3xl font-light text-stone-800 mb-2 md:mb-3">
              <span className="text-xl md:text-2xl mr-2">✈️</span> Historique des voyages
            </h1>
            {!isMobile && (
              <p className="text-stone-500 text-lg">Retrouvez toutes vos conversations avec l'assistant ROADTRIP!</p>
            )}
          </div>
          {isMobile && <div className="w-16"></div>}
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 md:p-4 mb-6 md:mb-8 text-center shadow-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {Object.entries(groupedMessages).map(([convId, messagesData]) => {
            // Vérifier si messagesData est un tableau
            if (!Array.isArray(messagesData)) {
              console.warn(`Les messages pour la conversation ${convId} ne sont pas un tableau:`, messagesData);
              return null;
            }
            
            // S'assurer que tous les éléments sont valides
            const validMessages = messagesData.filter(msg => msg && typeof msg === 'object');
            if (validMessages.length === 0) return null;
            
            try {
              const preview = validMessages.slice(0, 2);
              const conversationDate = getConversationDate(validMessages);
              const conversationTitle = getConversationTitle(validMessages);
              const isCurrentlyDeleting = isDeleting === convId;

              return (
                <div
                  key={convId}
                  className={`bg-white border border-stone-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${isCurrentlyDeleting ? 'opacity-50' : ''}`}
                >
                  <div className="p-4 md:p-6 border-b border-stone-100">
                    <h2 className="text-lg md:text-xl font-medium text-stone-800 mb-1 md:mb-2">
                      {conversationTitle}
                    </h2>
                    <div className="flex items-center gap-2 text-stone-500 text-xs md:text-sm">
                      <Clock className="h-3 w-3 md:h-4 md:w-4" />
                      <span>{conversationDate}</span>
                    </div>
                  </div>

                  <div className="p-4 md:p-6 space-y-3 md:space-y-4 bg-stone-50 border-b border-stone-100">
                    {preview.map((msg) => (
                      <div
                        key={msg._id}
                        className={`rounded-lg p-3 md:p-4 ${
                          msg.role === "user" 
                            ? "bg-red-600 text-white" 
                            : "bg-white text-stone-700 border border-stone-200"
                        }`}
                      >
                        <div className="text-xs md:text-sm mb-1 md:mb-2 font-medium">
                          {msg.role === "user" ? "Vous" : "Assistant ROADTRIP!"}
                        </div>
                        <p className="text-xs md:text-sm line-clamp-2">
                          {msg.content}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 md:p-4 flex justify-between items-center bg-white">
                    <div className="flex gap-2 items-center">
                      <div className="text-xs text-stone-500 font-light">
                        {validMessages.length} message{validMessages.length > 1 ? "s" : ""}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-full"
                        onClick={() => handleDeleteClick(convId)}
                        disabled={isCurrentlyDeleting}
                      >
                        <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                    </div>
                    
                    <Link
                      href={`/ai/conversation/${convId}`}
                      className="flex items-center text-red-500 hover:text-red-700 transition-colors text-xs md:text-sm font-medium group"
                    >
                      {isMobile ? 'Voir' : 'Voir la conversation'}
                      <ArrowRight className="ml-1 h-3 w-3 md:h-4 md:w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            } catch (error) {
              console.error(`Erreur lors du rendu de la conversation ${convId}:`, error);
              return null;
            }
          })}
        </div>

        {Object.keys(groupedMessages).length === 0 && !error && (
          <div className="bg-white border border-stone-200 rounded-xl p-6 md:p-10 text-center mt-6 md:mt-8 shadow-sm">
            <MessageSquare className="h-10 w-10 md:h-12 md:w-12 text-stone-300 mx-auto mb-3 md:mb-4" />
            <h3 className="text-lg md:text-xl font-medium text-stone-700 mb-2">Aucune conversation</h3>
            <p className="text-stone-500 mb-4 md:mb-6 text-sm md:text-base">
              Vous n'avez pas encore démarré de conversation avec l'assistant ROADTRIP!.
            </p>
            <Link 
              href="/ai" 
              className="inline-flex items-center bg-red-500 hover:bg-red-600 text-white py-2 md:py-3 px-4 md:px-6 text-sm md:text-base rounded-lg transition-colors shadow-sm"
            >
              Démarrer une conversation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="bg-white max-w-xs md:max-w-md mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-stone-800 text-lg md:text-xl">Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription className="text-stone-600 text-sm md:text-base">
              Êtes-vous sûr de vouloir supprimer cette conversation ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex space-x-2 justify-end">
            <AlertDialogCancel 
              className="bg-stone-100 hover:bg-stone-200 text-stone-700 border-none text-sm"
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600 text-white text-sm"
              onClick={handleConfirmDelete}
              disabled={isDeleting !== null}
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}