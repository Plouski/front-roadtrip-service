"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AssistantService } from "@/services/assistant-service";
import { AuthService } from "@/services/auth-service";
import {
  Bot,
  User,
  ArrowLeft,
  Send,
  Download,
  Menu,
  X,
  ChevronLeft,
  PlusCircle,
  History,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useIsMobile } from "@/hooks/use-mobile";

interface Message {
  _id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  conversationId: string;
}

export default function ConversationPage() {
  const router = useRouter();
  const params = useParams();
  const conversationId = params?.conversationId as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conversationTitle, setConversationTitle] = useState("Conversation");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isMobile = useIsMobile();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Vérification de l'authentification et du rôle au chargement du composant
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

        // Charger la conversation
        await loadConversation();
      } catch (error) {
        console.error("Erreur lors de la vérification d'authentification:", error);
        setError("Erreur lors de la vérification de votre accès.");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, conversationId]);

  // Fermer automatiquement la sidebar sur mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, isMobile ? "d MMM, HH:mm" : "d MMM yyyy à HH:mm", { locale: fr });
    } catch (e) {
      return "";
    }
  };

  // Fonction pour charger la conversation
  const loadConversation = async () => {
    try {
      if (!conversationId) return;

      const result = await AssistantService.getConversationById(conversationId);

      // Vérifier si result est un tableau
      if (Array.isArray(result)) {
        setMessages(result);

        // Trouver le premier message utilisateur pour le titre
        const firstUserMessage = result.find(msg => msg.role === "user");
        if (firstUserMessage) {
          const content = firstUserMessage.content;
          const title = content.length > 30 ? `${content.substring(0, 30)}...` : content;
          setConversationTitle(title);
        }
      } else {
        // Si le résultat n'est pas un tableau, vérifier s'il a une propriété qui contient les messages
        console.warn("Le résultat de getConversationById n'est pas un tableau:", result);

        // Essayer de trouver des messages dans le résultat (adapter selon votre API)
        const messagesArray = result.messages || result.data || [];

        if (Array.isArray(messagesArray) && messagesArray.length > 0) {
          setMessages(messagesArray);

          const firstUserMessage = messagesArray.find(msg => msg.role === "user");
          if (firstUserMessage) {
            const content = firstUserMessage.content;
            const title = content.length > 30 ? `${content.substring(0, 30)}...` : content;
            setConversationTitle(title);
          }
        } else {
          console.error("Impossible de trouver des messages dans la réponse");
        }
      }

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } catch (err) {
      console.error("Erreur lors du chargement de la conversation:", err);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      _id: Date.now().toString(),
      role: "user" as const,
      content: input,
      createdAt: new Date().toISOString(),
      conversationId,
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

      const assistantMessage = {
        _id: Date.now().toString(),
        role: "assistant" as const,
        content: result.reponse || result.message || JSON.stringify(result),
        createdAt: new Date().toISOString(),
        conversationId,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      await AssistantService.saveMessage("assistant", assistantMessage.content, conversationId);
    } catch (error) {
      console.error("Erreur IA:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    const input = document.getElementById("pdf-content");
    if (!input) return;

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${conversationTitle || "conversation"}.pdf`);

    // Fermer la sidebar sur mobile après téléchargement
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const startNewSession = () => {
    router.push("/ai");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-stone-50">
        <div className="text-stone-500 flex flex-col items-center">
          <div className="mb-4">Chargement de la conversation...</div>
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-3 h-3 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-3 h-3 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Affichage d'un message d'erreur
  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-stone-50 p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 max-w-md text-center mb-6">
          {error}
        </div>
        <Link href="/ai/history">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'historique
          </Button>
        </Link>
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
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
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

              {/* Mettre en évidence la conversation active */}
              <div
                className={`${!sidebarOpen ? "md:p-3 md:w-12 md:h-12 md:rounded-full md:justify-center" : "w-full py-5 px-4 rounded-xl"
                  } bg-red-50 text-red-600 border border-red-100 flex items-center gap-2`}
              >
                <MessageSquare className="h-4 w-4" />
                <span className={`${!sidebarOpen && "md:hidden"} text-sm font-medium truncate`}>
                  {conversationTitle}
                </span>
              </div>

              <Button
                onClick={startNewSession}
                variant="outline"
                className={`${!sidebarOpen ? "md:p-3 md:w-12 md:h-12 md:rounded-full md:justify-center" : "w-full py-6 rounded-xl"
                  } border-stone-200 hover:bg-stone-50 hover:border-stone-300 transition-all flex items-center gap-2 text-stone-700`}
              >
                <PlusCircle className="h-4 w-4" />
                <span className={`${!sidebarOpen && "md:hidden"}`}>Nouvelle conversation</span>
              </Button>

              <Link href="/ai/history" className="block">
                <Button
                  variant="ghost"
                  className={`${!sidebarOpen ? "md:p-3 md:w-12 md:h-12 md:rounded-full md:justify-center" : "w-full py-5 rounded-xl"
                    } text-stone-600 hover:bg-stone-100 hover:text-stone-800 transition-all flex items-center gap-2`}
                >
                  <History className="h-4 w-4" />
                  <span className={`${!sidebarOpen && "md:hidden"}`}>Historique</span>
                </Button>
              </Link>

              <Button
                onClick={handleDownloadPDF}
                variant="ghost"
                className={`${!sidebarOpen ? "md:p-3 md:w-12 md:h-12 md:rounded-full md:justify-center" : "w-full py-5 rounded-xl"
                  } text-stone-600 hover:bg-stone-100 hover:text-stone-800 transition-all flex items-center gap-2`}
              >
                <Download className="h-4 w-4" />
                <span className={`${!sidebarOpen && "md:hidden"}`}>Télécharger PDF</span>
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
      <div className="flex-1 flex flex-col">
        {/* Header avec bouton menu pour mobile ou desktop fermé */}
        <header className={`bg-white border-b border-stone-200 p-4 shadow-sm flex items-center`}>
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

          <h2 className="text-lg md:text-xl font-light text-stone-800 truncate flex-1">
            {conversationTitle}
          </h2>
        </header>

        {/* Toggle button pour desktop - uniquement visible quand la sidebar est ouverte */}
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

        {/* Messages area */}
        <div className="flex-grow overflow-y-auto">
          <div
            id="pdf-content"
            className="container mx-auto space-y-4 md:space-y-6 p-3 md:p-6"
          >
            {messages.length === 0 ? (
              <div className="flex justify-center items-center h-40">
                <div className="text-stone-400 text-center">
                  <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>Aucun message trouvé dans cette conversation</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex max-w-xs sm:max-w-md md:max-w-2xl ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`p-3 md:p-5 rounded-2xl text-sm md:text-base whitespace-pre-wrap leading-relaxed ${message.role === "assistant"
                          ? "bg-white text-stone-800 border border-stone-100 shadow-sm"
                          : "bg-red-600 text-white shadow-md"
                        }`}
                    >
                      {message.content}
                      <div className={`mt-1 md:mt-2 text-xs ${message.role === "assistant" ? "text-stone-400" : "text-red-100"}`}>
                        {formatDate(message.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex max-w-xs sm:max-w-md md:max-w-2xl flex-row">
                  <div className="bg-white text-stone-500 p-4 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-stone-200 bg-white shadow-sm">
          <div className="container mx-auto p-3 md:p-4">
            <form onSubmit={handleSubmit} className="flex items-center gap-2 md:gap-3">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isMobile ? "Votre question..." : "Posez votre question sur votre voyage..."}
                disabled={isLoading}
                className="flex-1 text-sm md:text-base py-4 md:py-6 px-3 md:px-4 rounded-xl border border-stone-200 focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm bg-stone-50"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-red-500 hover:bg-red-600 text-white p-4 md:p-6 rounded-xl transition-all shadow"
              >
                <Send className="h-4 md:h-5 w-4 md:w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}