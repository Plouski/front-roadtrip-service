'use client'

import { useState } from "react"
import { AlertCircle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FAQ {
  question: string
  answer: string
}

interface FaqSectionProps {
  faqs: FAQ[]
}

export default function FaqSection({ faqs }: FaqSectionProps) {
  const [isFaqOpen, setIsFaqOpen] = useState<number | null>(null)
  
  return (
    <section className="py-20 bg-gradient-to-br from-white to-blue-50 relative">
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Questions fréquentes</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tout ce que vous devez savoir sur notre abonnement premium
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                onClick={() => setIsFaqOpen(isFaqOpen === index ? null : index)}
                className={`w-full text-left p-6 rounded-xl flex justify-between items-center transition-all ${
                  isFaqOpen === index 
                  ? 'bg-gradient-to-r from-primary/10 to-white shadow-md' 
                  : 'bg-white shadow-sm hover:shadow border border-gray-100'
                }`}
              >
                <span className="font-semibold text-lg">{faq.question}</span>
                <ChevronRight className={`h-5 w-5 transition-transform ${isFaqOpen === index ? 'rotate-90' : ''}`} />
              </button>
              
              {isFaqOpen === index && (
                <div className="px-6 pt-2 pb-6 text-gray-600 bg-white rounded-b-xl border-x border-b border-gray-100 -mt-1">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center p-6 rounded-xl bg-white shadow-lg border border-gray-100 max-w-2xl mx-auto">
            <div className="flex items-center">
              <div className="flex items-center justify-center rounded-full bg-blue-100 w-12 h-12 mr-6">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-lg mb-1">Vous avez d'autres questions ?</h4>
                <p className="text-gray-600">
                  Notre équipe de support est disponible 24/7 pour vous aider
                </p>
              </div>
            </div>
            <Button className="ml-6 bg-primary hover:bg-primary-700 text-white rounded-xl px-6 h-auto py-3 whitespace-nowrap">
              Contacter le support
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}