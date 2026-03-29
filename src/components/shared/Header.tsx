'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight } from 'lucide-react'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-slate-950/70 backdrop-blur-xl border-b border-white/10 shadow-glass py-3' : 'bg-transparent py-5'}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-heading text-2xl font-bold tracking-tight text-white flex items-center gap-2 group">
          <div className="size-8 rounded-lg bg-gradient-to-br from-trust to-blue-700 flex items-center justify-center shadow-lg group-hover:shadow-trust/25 transition-shadow border border-white/10">
            <span className="text-white text-sm font-bold">D</span>
          </div>
          DealFlow
        </Link>
        <div className="hidden md:flex flex-1 justify-center">
          <nav className="flex items-center gap-8 text-sm font-medium font-sans px-8 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-md">
            <Link href="/listings" className="text-slate-300 hover:text-white transition-colors">
              Kupujem
            </Link>
            <Link href="/sell" className="text-slate-300 hover:text-white transition-colors">
              Prodajem
            </Link>
            <Link href="/succession" className="text-slate-300 hover:text-white transition-colors">
              Nasljeđivanje
            </Link>
          </nav>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="font-sans text-sm font-semibold text-slate-300 hover:text-white transition-colors">
            Prijava
          </Link>
          <Link href="/valuate">
            <Button className="bg-gold text-slate-950 hover:bg-gold/90 rounded-full font-heading px-6 shadow-[0_0_15px_rgba(201,165,80,0.3)] hover:shadow-[0_0_25px_rgba(201,165,80,0.5)] transition-all border-none group">
              Procijeni vrijednost
              <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-slate-950/95 backdrop-blur-xl border-b border-white/10 shadow-glass md:hidden"
          >
            <div className="flex flex-col px-4 py-6 space-y-4 font-sans text-base">
              <Link href="/listings" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white transition-colors py-2 border-b border-white/5">Kupujem</Link>
              <Link href="/sell" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white transition-colors py-2 border-b border-white/5">Prodajem</Link>
              <Link href="/succession" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white transition-colors py-2 border-b border-white/5">Nasljeđivanje</Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-white font-semibold py-2">Prijava</Link>
              <Link href="/valuate" onClick={() => setMobileMenuOpen(false)} className="pt-2">
                <Button className="w-full bg-gold text-slate-950 hover:bg-gold/90 rounded-full font-heading shadow-[0_0_15px_rgba(201,165,80,0.3)] border-none">
                  Procijeni vrijednost
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
