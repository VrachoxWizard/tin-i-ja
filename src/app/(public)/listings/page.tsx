import { Metadata } from 'next';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { TeaserCard } from '@/components/features/TeaserCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Pregled Tvrtki (M&A Prilike) | DealFlow',
  description: 'Pregledajte verificirane B2B akvizicijske prilike u Hrvatskoj.',
};

export default async function ListingsPage() {
  const supabase = await createClient();
  const { data: listings } = await supabase.rpc('get_active_teasers');

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      {/* Search Header */}
      <div className="bg-df-navy py-12 border-b border-df-navy/90">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 font-dm-sans">
            Akvizicijske Prilike
          </h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Pretraži po industriji, regiji ili ključnoj riječi..." 
                className="pl-10 py-6 text-lg bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus-visible:ring-df-trust-blue"
              />
            </div>
            <Button size="lg" className="py-6 bg-df-trust-blue hover:bg-df-trust-blue/90 text-white min-w-[140px]">
              Traži
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 w-full bg-[#F5F7FA] py-12">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 lg:w-72 shrink-0">
            <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm sticky top-24 space-y-8">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-bold text-df-navy flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filteri
                </h3>
                <span className="text-xs text-df-trust-blue font-semibold cursor-pointer">Poništi</span>
              </div>
              
              <div className="space-y-3">
                <Label className="font-semibold text-slate-700">Industrija</Label>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Sve Industrije</SelectItem>
                    <SelectItem value="it">IT i Softver</SelectItem>
                    <SelectItem value="manufacturing">Proizvodnja</SelectItem>
                    <SelectItem value="tourism">Turizam</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="font-semibold text-slate-700">Regija</Label>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Cijela Hrvatska</SelectItem>
                    <SelectItem value="zagreb">Grad Zagreb</SelectItem>
                    <SelectItem value="dalmacija">Dalmacija</SelectItem>
                    <SelectItem value="istra">Istra</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="font-semibold text-slate-700">EBITDA Raspon</Label>
                <Select defaultValue="any">
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Bilo koji iznos</SelectItem>
                    <SelectItem value="0-100">Do 100k EUR</SelectItem>
                    <SelectItem value="100-500">100k - 500k EUR</SelectItem>
                    <SelectItem value="500+">Preko 500k EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full bg-df-navy hover:bg-df-navy/90">Primijeni Filtere</Button>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {listings?.map((teaser: any) => (
                <TeaserCard 
                  key={teaser.listing_id} 
                  id={teaser.listing_id.split('-')[0]} 
                  industry={teaser.industry_nkd}
                  region={teaser.region}
                  revenue={teaser.revenue_eur}
                  ebitda={teaser.ebitda_eur}
                  askingPrice={teaser.asking_price_eur}
                  blindTeaserHtml={teaser.blind_teaser}
                />
              ))}
              {(!listings || listings.length === 0) && (
                <div className="col-span-1 lg:col-span-2 text-center py-24 text-slate-500 bg-white rounded-xl border border-slate-200 shadow-sm">
                  Trenutno nema aktivnih prilika.
                </div>
              )}
            </div>
            
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg" className="border-df-trust-blue text-df-navy font-semibold px-8 py-6">
                Učitaj još rezultata
              </Button>
            </div>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
