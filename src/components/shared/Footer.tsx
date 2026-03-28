import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <span className="font-heading text-xl font-bold text-foreground">DealFlow</span>
            <p className="text-sm text-muted-foreground font-sans">
              Premium M&A platforma za male i srednje tvrtke u Republici Hrvatskoj. Spajamo vlasnike s kvalificiranim investitorima.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold mb-4 text-foreground">Za Prodavatelje</h3>
            <ul className="space-y-2 text-sm text-muted-foreground font-sans">
              <li><Link href="/valuate" className="hover:text-primary transition-colors">Procijeni vrijednost</Link></li>
              <li><Link href="/sell" className="hover:text-primary transition-colors">Započni prodaju</Link></li>
              <li><Link href="/succession" className="hover:text-primary transition-colors">Planiranje nasljeđivanja</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-semibold mb-4 text-foreground">Za Kupce</h3>
            <ul className="space-y-2 text-sm text-muted-foreground font-sans">
              <li><Link href="/listings" className="hover:text-primary transition-colors">Pregledaj tvrtke</Link></li>
              <li><Link href="/buy" className="hover:text-primary transition-colors">Kriteriji pretrage</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-semibold mb-4 text-foreground">Kontakt</h3>
            <ul className="space-y-2 text-sm text-muted-foreground font-sans">
              <li>info@dealflow.hr</li>
              <li>+385 1 234 5678</li>
              <li>Zagreb, Hrvatska</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground font-sans">
          <p>© 2026 DealFlow. Sva prava pridržana.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-foreground">Uvjeti korištenja</Link>
            <Link href="#" className="hover:text-foreground">Pravila privatnosti</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
