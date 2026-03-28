import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-heading text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <div className="size-6 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs">D</span>
          </div>
          DealFlow
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium font-sans">
          <Link href="/listings" className="text-muted-foreground hover:text-foreground transition-colors">
            Kupujem
          </Link>
          <Link href="/sell" className="text-muted-foreground hover:text-foreground transition-colors">
            Prodajem
          </Link>
          <Link href="/succession" className="text-muted-foreground hover:text-foreground transition-colors">
            Nasljeđivanje
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:inline-flex font-sans text-sm font-medium hover:text-primary transition-colors">
            Prijava
          </Link>
          <Link href="/valuate">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-heading">
              Procijeni vrijednost
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
