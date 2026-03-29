import { Metadata } from 'next';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { GlowCard } from '@/components/ui/GlowCard';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, FileText, CheckCircle, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nadzorna Ploča Prodavatelja | DealFlow',
  description: 'Upravljajte svojim oglasima i zahtjevima za NDA.',
};

export default async function SellerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch the seller's most recent active listing
  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  // Fetch NDAs for this listing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let ndaList: any[] = [];
  if (listing) {
    const { data } = await supabase
      .from('ndas')
      .select(`
        id,
        status,
        created_at,
        buyer_id,
        users!ndas_buyer_id_fkey(full_name)
      `)
      .eq('listing_id', listing.id)
      .order('created_at', { ascending: false });
    ndaList = data || [];
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1 w-full bg-slate-50 dark:bg-slate-950 py-12 relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-df-gold/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-df-trust-blue/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-jakarta tracking-tight mb-8">
            Nadzorna Ploča <span className="text-slate-500 dark:text-slate-400 font-dm-sans text-xl ml-2 font-normal">(Prodavatelj)</span>
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <GlowCard className="border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-glass rounded-2xl overflow-hidden hover:shadow-lg transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Pregledi Teasera
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-slate-900 dark:text-white font-jakarta">-</div> {/* Mocked for MVP */}
              </CardContent>
            </GlowCard>
            <GlowCard className="border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-glass rounded-2xl overflow-hidden hover:shadow-lg transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Algoritamska Uparivanja
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-slate-900 dark:text-white font-jakarta">-</div> {/* Mocked for MVP */}
              </CardContent>
            </GlowCard>
            <GlowCard className="border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-glass rounded-2xl overflow-hidden hover:shadow-lg transition-all ring-1 ring-df-trust-blue/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-df-trust-blue uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-4 h-4" /> NDA Zahtjevi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-df-trust-blue font-jakarta">{ndaList.length}</div>
              </CardContent>
            </GlowCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Listing Management */}
            <div className="lg:col-span-2 space-y-6">
              <GlowCard className="border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-glass rounded-2xl overflow-hidden">
                <CardHeader className="bg-white/40 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/60 px-6 py-5">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl text-slate-900 dark:text-white font-jakarta">Moj Aktivni Oglas</CardTitle>
                    {listing ? (
                      <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 border-none">Aktivno</Badge>
                    ) : (
                      <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 border-none">Nema Oglasa</Badge>
                    )}
                  </div>
                  <CardDescription className="text-slate-500 dark:text-slate-400 font-inter mt-1">Ovo je slijepi teaser koji kupci trenutno vide.</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {listing ? (
                    <>
                      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-5 rounded-xl text-slate-600 dark:text-slate-300 font-inter text-sm mb-5 shadow-sm line-clamp-6 leading-relaxed relative">
                        <div className="absolute top-0 right-0 bg-gradient-to-l from-white dark:from-slate-900 w-12 h-full pointer-events-none" />
                        <div dangerouslySetInnerHTML={{ __html: listing.blind_teaser || 'Nema generiranog teasera.' }} />
                      </div>
                      <Link href="/listings">
                        <Button variant="outline" className="font-jakarta rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 h-10 px-5">
                          <Eye className="w-4 h-4 mr-2 text-slate-400" /> Pregledaj kao investitor
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <div className="text-center py-12 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                      <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-600 dark:text-slate-300 font-inter mb-4">Još niste kreirali oglas.</p>
                      <Link href="/sell">
                        <Button className="bg-df-trust-blue hover:bg-df-trust-blue/90 text-white font-jakarta rounded-xl shadow-md transition-all h-10 px-6">
                          Započni proces valuacije
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </GlowCard>
            </div>

            {/* NDA Requests */}
            <div className="space-y-6">
              <GlowCard className="border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-glass rounded-2xl overflow-hidden">
                <CardHeader className="bg-white/40 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/60 px-6 py-5">
                  <CardTitle className="text-xl text-slate-900 dark:text-white font-jakarta">NDA Pristigli Zahtjevi</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {ndaList.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                       <CheckCircle className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-inter">Trenutno nema novih zahtjeva.</p>
                    </div>
                  ) : null}
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {ndaList.map((req: any) => (
                    <div key={req.id as string} className="p-5 border border-slate-200/60 dark:border-slate-700/60 rounded-xl bg-white/80 dark:bg-slate-900/80 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white font-jakarta mb-1">{req.users?.full_name || 'Skriveni Investitor'}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-inter flex items-center"><Clock className="w-3 h-3 mr-1 opacity-70" /> {new Date(req.created_at).toLocaleDateString('hr-HR')}</p>
                        </div>
                        {req.status === 'pending' ? (
                          <Badge variant="outline" className="bg-amber-50/80 text-amber-700 border-amber-200/60 font-medium whitespace-nowrap">Na čekanju</Badge>
                        ) : req.status === 'signed' ? (
                          <Badge variant="outline" className="bg-green-50/80 text-green-700 border-green-200/60 font-medium whitespace-nowrap">Odobreno</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50/80 text-red-700 border-red-200/60 font-medium whitespace-nowrap">Odbijeno</Badge>
                        )}
                      </div>
                      
                      {req.status === 'pending' && (
                        <div className="flex gap-2 mt-1">
                          <Button size="sm" className="flex-1 bg-df-trust-blue hover:bg-df-trust-blue/90 text-white font-jakarta rounded-lg h-9 shadow-sm">
                            Odobri
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 font-jakarta rounded-lg h-9">
                            Odbij
                          </Button>
                        </div>
                      )}
                      {req.status === 'signed' && (
                         <Button size="sm" variant="outline" className="w-full font-jakarta rounded-lg border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 h-9">
                           <FileText className="w-3.5 h-3.5 mr-2 text-slate-400" /> Otvori Deal Room
                         </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </GlowCard>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
