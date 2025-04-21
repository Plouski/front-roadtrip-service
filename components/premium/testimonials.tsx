import { Star } from "lucide-react"

interface Testimonial {
  name: string
  location: string
  text: string
  avatar: string
  rating: number
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ce que disent nos abonnés</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez pourquoi nos utilisateurs premium ne voyagent plus jamais sans ROADTRIP!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative">
      <div className="absolute -top-5 -right-5">
        <div className="bg-white rounded-full p-2 shadow-md border border-gray-100">
          <div className="bg-yellow-400 rounded-full p-3">
            <Star className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>
      
      <div className="flex items-center mb-6">
        <div className="h-14 w-14 rounded-full bg-gray-200 overflow-hidden mr-4 border-2 border-primary">
          <img src="/api/placeholder/56/56" alt={testimonial.name} className="h-full w-full object-cover" />
        </div>
        <div>
          <h4 className="font-bold text-lg">{testimonial.name}</h4>
          <p className="text-gray-500 text-sm">{testimonial.location}</p>
        </div>
      </div>
      
      <div className="mb-4 flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-200'} mr-1`} 
            fill={i < testimonial.rating ? 'currentColor' : 'none'} 
          />
        ))}
      </div>
      
      <p className="text-gray-600 italic">"{testimonial.text}"</p>
    </div>
  )
}