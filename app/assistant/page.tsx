"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Lock } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

const exampleQuestions = [
  "Suggère-moi un road trip de 7 jours en Italie",
  "Quelles sont les meilleures périodes pour visiter la Norvège ?",
  "Je voyage avec des enfants, quelles destinations recommandes-tu ?",
  "Quel budget prévoir pour un road trip de 10 jours aux USA ?",
]

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Bonjour ! Je suis votre assistant RoadTrip! personnel. Comment puis-je vous aider à planifier votre prochain voyage ? Vous pouvez me poser des questions sur des destinations, me demander des suggestions d'itinéraires, ou des conseils de voyage.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isPremium, setIsPremium] = useState(true) // For demo purposes, set to true

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Voici un itinéraire personnalisé pour votre road trip : commencez par visiter les points d'intérêt principaux, puis dirigez-vous vers les zones moins touristiques pour une expérience authentique. N'oubliez pas de prévoir du temps pour les activités spontanées !",
        "Pour cette destination, je recommande de voyager pendant l'épaule-saison (avril-mai ou septembre-octobre) pour éviter les foules tout en profitant d'une météo agréable. Les prix sont également plus abordables durant ces périodes.",
        "Basé sur vos préférences, je suggère un itinéraire de 10 jours qui combine nature, culture et détente. Vous pourriez commencer par 3 jours dans la capitale, puis louer une voiture pour explorer la côte pendant 4 jours, avant de terminer par 3 jours dans les montagnes.",
        "Pour un budget de 2000€, je vous conseille de privilégier des hébergements de type guesthouse ou Airbnb, et de prévoir environ 30-40€ par jour pour la nourriture. La location de voiture représentera environ 25% de votre budget total.",
      ]

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  if (!isPremium) {
    return (
      <div className="container py-16 flex flex-col items-center justify-center text-center">
        <div className="bg-gray-100 p-4 rounded-full mb-6">
          <Lock className="h-10 w-10 text-accent" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Fonctionnalité Premium</h1>
        <p className="text-gray-600 max-w-md mb-8">
          L'assistant IA personnalisé est disponible uniquement pour les membres Premium. Débloquez cette fonctionnalité
          pour planifier vos voyages plus facilement.
        </p>
        <Button className="bg-gradient-to-r from-accent to-yellow-400 hover:opacity-90">Passer à Premium</Button>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Assistant IA</h1>
          <p className="text-gray-600">Votre planificateur de voyage personnel</p>
        </div>
        <Badge className="premium-badge">Premium</Badge>
      </div>

      <div className="bg-white rounded-lg shadow-md h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex mb-4 ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
            >
              <div className={`flex max-w-[80%] ${message.role === "assistant" ? "items-start" : "items-end"}`}>
                {message.role === "assistant" && (
                  <div className="bg-primary text-white rounded-full p-2 mr-2">
                    <Bot className="h-5 w-5" />
                  </div>
                )}

                <div
                  className={`p-3 rounded-lg ${message.role === "assistant" ? "bg-gray-100" : "bg-primary text-white"}`}
                >
                  {message.content}
                </div>

                {message.role === "user" && (
                  <div className="bg-gray-700 text-white rounded-full p-2 ml-2">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="flex items-start">
                <div className="bg-primary text-white rounded-full p-2 mr-2">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="p-3 rounded-lg bg-gray-100">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce"></div>
                    <div
                      className="h-2 w-2 bg-gray-300 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-gray-300 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-4">
          {messages.length <= 2 && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Suggestions :</p>
              <div className="flex flex-wrap gap-2">
                {exampleQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-left"
                    onClick={() => setInput(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()} className="bg-primary hover:bg-primary/90">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
