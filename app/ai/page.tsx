"use client";

import { useState, useEffect, useRef } from "react";
import { AssistantService } from "@/services/assistant-service";
import { AuthService } from "@/services/auth-service";
import { formatAiResponse } from "@/lib/formatAiResponse";
import { 
  Send, 
  History, 
  PlusCircle, 
  Download, 
  Menu, 
  X, 
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(() => crypto.randomUUID());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const isMobile = useIsMobile();
  const router = useRouter();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [includeWeather, setIncludeWeather] = useState(true);


  // Vérification d'authentification avec la méthode simplifiée
  useEffect(() => {
    const checkAuth = async () => {
      setIsCheckingAuth(true);
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
        
        // Initialisation du message de bienvenue
        setMessages([
          {
            id: "welcome",
            role: "assistant",
            content:
              "Bonjour ! Je suis votre assistant ROADTRIP!. Posez-moi vos questions sur vos prochains voyages !",
          },
        ]);
        
        // Focus automatique sur le champ de saisie
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
        router.push("/auth");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  // Fermer automatiquement la sidebar sur mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const startNewSession = () => {
    setConversationId(crypto.randomUUID());
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Nouvelle session démarrée. Je suis prêt à vous aider à planifier votre roadtrip !",
      },
    ]);
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    
    // Fermer la sidebar sur mobile après avoir démarré une nouvelle session
    if (isMobile) {
      setSidebarOpen(false);
    }
    
    toast.success("Nouvelle conversation démarrée");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      await AssistantService.saveMessage("user", input, conversationId);

      const result = await AssistantService.askAssistant(input, {
        location: "Italie",
        duration: 7,
        budget: 1200,
        travelStyle: "détente",
        includeWeather: true,
        includeAttractions: true,
        conversationId,
      });

      const formatted = formatAiResponse(result);

      const assistantMessage = {
        id: Date.now().toString(),
        role: "assistant" as const,
        content: formatted,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      await AssistantService.saveMessage("assistant", formatted, conversationId);
    } catch (error) {
      console.error("Erreur lors de l'appel à l'IA:", error);
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Une erreur est survenue lors de l'appel à l'IA. Veuillez réessayer.",
        },
      ]);
      
      toast.error("Erreur lors de l'appel à l'IA");
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  };

  const handleDownloadPDF = async () => {
    const input = document.getElementById("pdf-content");
    if (!input) return;

    // Afficher un message de chargement
    if (isMobile) {
      toast.info("Génération du PDF en cours...");
    }

    try {
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
      pdf.save(`conversation-${conversationId}.pdf`);
      
      // Fermer la sidebar sur mobile après téléchargement
      if (isMobile) {
        setSidebarOpen(false);
        toast.success("PDF téléchargé avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de la création du PDF:", error);
      toast.error("Impossible de générer le PDF");
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Affichage d'un indicateur de chargement pendant la vérification d'authentification
  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-stone-50">
        <div className="text-stone-500 flex flex-col items-center">
          <div className="mb-4">Chargement de l'assistant...</div>
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
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      {/* Sidebar - avec animation de transition */}
      {(sidebarOpen || !isMobile) && (
        <aside 
          className={`
            ${sidebarOpen ? "w-72" : "w-0 md:w-20"} 
            ${sidebarOpen ? "translate-x-0" : isMobile ? "-translate-x-full" : "translate-x-0"}
            transition-all duration-300 ease-in-out 
            flex-shrink-0 border-r border-stone-200 bg-white 
            flex flex-col h-full
            ${isMobile ? "fixed z-30" : "relative"}
          `}
        >
          <div className="p-4 md:p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <h2 className={`text-xl font-light text-stone-800 flex items-center gap-2 ${!sidebarOpen && "md:hidden"}`}>
                Assistant ROADTRIP!
              </h2>
              
              {/* Logo minimaliste quand la sidebar est réduite (visible seulement sur desktop) */}
              <div className={`${sidebarOpen ? "hidden" : "hidden md:flex"} items-center justify-center w-full`}>
                <span className="text-2xl">✈️</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleSidebar}
                className="p-0 h-8 w-8 rounded-full md:hidden"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className={`flex flex-col gap-4 ${!sidebarOpen && "md:items-center"}`}>
              <Button
                onClick={startNewSession}
                variant="outline"
                className={`${
                  !sidebarOpen ? "md:p-3 md:w-12 md:h-12 md:rounded-full md:justify-center" : "w-full py-5 md:py-6 rounded-xl"
                } border-stone-200 hover:bg-stone-50 hover:border-stone-300 transition-all flex items-center gap-2 text-stone-700`}
              >
                <PlusCircle className="h-4 w-4" />
                <span className={`${!sidebarOpen && "md:hidden"} text-sm md:text-base`}>Nouvelle conversation</span>
              </Button>

              <Link href="/ai/history" className="block">
                <Button
                  variant="ghost"
                  className={`${
                    !sidebarOpen ? "md:p-3 md:w-12 md:h-12 md:rounded-full md:justify-center" : "w-full py-4 md:py-5 rounded-xl"
                  } text-stone-600 hover:bg-stone-100 hover:text-stone-800 transition-all flex items-center gap-2`}
                >
                  <History className="h-4 w-4" />
                  <span className={`${!sidebarOpen && "md:hidden"} text-sm md:text-base`}>Historique</span>
                </Button>
              </Link>

              <Button
                onClick={handleDownloadPDF}
                variant="ghost"
                className={`${
                  !sidebarOpen ? "md:p-3 md:w-12 md:h-12 md:rounded-full md:justify-center" : "w-full py-4 md:py-5 rounded-xl"
                } text-stone-600 hover:bg-stone-100 hover:text-stone-800 transition-all flex items-center gap-2`}
                disabled={messages.length <= 1}
              >
                <Download className="h-4 w-4" />
                <span className={`${!sidebarOpen && "md:hidden"} text-sm md:text-base`}>Télécharger PDF</span>
              </Button>
            </div>

            <div className={`mt-auto pt-6 border-t border-stone-100 ${!sidebarOpen && "md:hidden"}`}>
              <p className="text-xs text-stone-500 italic">
                Votre compagnon de voyage intelligent
              </p>
            </div>
          </div>
        </aside>
      )}

      {/* Overlay pour fermer le menu sur mobile */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Chat area */}
      <div 
        className={`flex-1 flex flex-col w-full transition-all duration-300 ease-in-out`}
      >
        {/* Header avec bouton menu pour mobile ou desktop fermé */}
        <div className={`bg-white border-b border-stone-200 p-4 shadow-sm flex items-center justify-between`}>
          <div className="flex items-center">
            {(!sidebarOpen || isMobile) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="p-1 mr-3"
              >
                <Menu className="h-6 w-6 text-stone-700" />
              </Button>
            )}
            <h2 className="text-lg font-light text-stone-800">
              Assistant RoadTrip
            </h2>
          </div>
          
          {isMobile && (
            <Link href="/ai/history">
              <Button variant="ghost" size="icon" className="p-1">
                <History className="h-5 w-5 text-stone-700" />
              </Button>
            </Link>
          )}
        </div>

        {/* Toggle button pour desktop - uniquement visible quand la sidebar est ouverte et sur desktop */}
        {sidebarOpen && !isMobile && (
          <div className="absolute left-72 top-6 z-20 transform -translate-x-1/2 transition-all duration-300 ease-in-out">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="bg-white h-8 w-8 rounded-full border border-stone-200 shadow-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div 
          ref={chatContainerRef}
          id="pdf-content" 
          className="flex-1 overflow-y-auto p-3 md:p-8 space-y-4 md:space-y-6 bg-stone-50"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs sm:max-w-md md:max-w-2xl p-3 md:p-5 rounded-2xl text-sm md:text-base whitespace-pre-wrap leading-relaxed ${
                  message.role === "assistant"
                    ? "bg-white text-stone-800 shadow-sm border border-stone-100"
                    : "bg-red-600 text-white shadow-md"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-stone-500 p-4 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
                <span className="text-xs text-stone-400 ml-2">L'assistant réfléchit...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-stone-200 px-3 md:px-8 py-3 md:py-5 bg-white flex items-center gap-2 md:gap-3 shadow-sm"
        >
          <Input
            ref={inputRef}
            className="flex-1 text-sm md:text-base py-4 md:py-6 px-3 md:px-4 rounded-xl border border-stone-200 focus:ring-1 focus:ring-red-600 focus:border-red-600 transition-all shadow-sm bg-stone-50"
            placeholder={isMobile ? "Votre question..." : "Posez votre question sur votre voyage..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />

          <Button
            type="submit"
            className="bg-red-600 text-white hover:bg-red-700 p-4 md:p-6 rounded-xl transition-all shadow"
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 md:h-5 w-4 md:w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}