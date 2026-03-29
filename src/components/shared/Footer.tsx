import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-navy text-slate-300 relative overflow-hidden">
      {/* Glowing abstract blob in the background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-trust/20 rounded-[100%] blur-[120px] pointer-events-none" />
      
      <div className="mx-auto py-20 px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        {/* Call to action section at the top of the footer */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm mb-16 shadow-glass">
          <div className="mb-6 md:mb-0">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">Spremni za sljedeći korak?</h2>
            <p className="text-slate-400 font-sans max-w-md">Besplatno procijenite vrijednost vaše tvrtke uz naš napredni AI alat.</p>
          </div>
          <Link href="/valuate">
            <Button className="bg-gold text-white hover:bg-gold/90 rounded-full font-heading px-8 py-6 text-lg shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all border-none group">
              Započnite besplatnu procjenu
              <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link href="/" className="font-heading text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <div className="size-8 rounded-lg bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center shadow-lg">
                <span className="text-navy text-sm font-bold">D</span>
              </div>
              DealFlow
            </Link>
            <p className="text-sm text-slate-400 font-sans leading-relaxed">
              Premium M&A platforma za male i srednje tvrtke u Republici Hrvatskoj. Spajamo vlasnike s kvalificiranim investitorima kroz transparentan, siguran i diskretan proces.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold mb-6 text-white text-lg">Za Prodavatelje</h3>
            <ul className="space-y-4 text-sm font-sans">
              <li><Link href="/valuate" className="hover:text-gold transition-colors block">Procijeni vrijednost</Link></li>
              <li><Link href="/sell" className="hover:text-gold transition-colors block">Započni prodaju</Link></li>
              <li><Link href="/succession" className="hover:text-gold transition-colors block">Planiranje nasljeđivanja</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-semibold mb-6 text-white text-lg">Za Kupce</h3>
            <ul className="space-y-4 text-sm font-sans">
              <li><Link href="/listings" className="hover:text-gold transition-colors block">Pregledaj tvrtke</Link></li>
              <li><Link href="/buy" className="hover:text-gold transition-colors block">Kriteriji pretrage</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-semibold mb-6 text-white text-lg">Kontakt</h3>
            <ul className="space-y-4 text-sm font-sans">
              <li className="flex items-center gap-3"><span className="p-2 rounded-full bg-white/5"><svg className="size-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></span> info@dealflow.hr</li>
              <li className="flex items-center gap-3"><span className="p-2 rounded-full bg-white/5"><svg className="size-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></span> +385 1 234 5678</li>
              <li className="flex items-center gap-3"><span className="p-2 rounded-full bg-white/5"><svg className="size-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></span> Zagreb, Hrvatska</li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-sans">
          <p>© 2026 DealFlow. Sva prava pridržana. Izrađeno za tržište Republike Hrvatske.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-gold transition-colors">Uvjeti korištenja</Link>
            <Link href="#" className="hover:text-gold transition-colors">Pravila privatnosti</Link>
            <Link href="#" className="hover:text-gold transition-colors">Kolačići</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
