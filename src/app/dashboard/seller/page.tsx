import { Metadata } from 'next';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, FileText, CheckCircle, XCircle } from 'lucide-react';
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
      
      <main className="flex-1 w-full bg-[#F5F7FA] py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold text-df-navy font-dm-sans mb-8">
            Nadzorna Ploča (Prodavatelj)
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Pregledi Teasera</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-df-navy">0</div> {/* Mocked for MVP */}
              </CardContent>
            </Card>
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Algoritamska Uparivanja</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-df-navy">0</div> {/* Mocked for MVP */}
              </CardContent>
            </Card>
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">NDA Zahtjevi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-df-trust-blue">{ndaList.length}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Listing Management */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl text-df-navy">Moj Aktivni Oglas</CardTitle>
                    {listing ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Aktivno</Badge>
                    ) : (
                      <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100">Nema Oglasa</Badge>
                    )}
                  </div>
                  <CardDescription>Ovo je slijepi teaser koji kupci trenutno vide.</CardDescription>
                </CardHeader>
                <CardContent>
                  {listing ? (
                    <>
                      <div className="bg-slate-50 p-4 rounded-md text-slate-700 text-sm mb-4 line-clamp-4" dangerouslySetInnerHTML={{ __html: listing.blind_teaser || 'Nema generiranog teasera.' }} />
                      <Link href="/listings">
                        <Button variant="outline" className="text-df-navy border-slate-300">
                          <Eye className="w-4 h-4 mr-2" /> Pregledaj kao kupac
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      Još niste kreirali oglas.{' '}
                      <Link href="/sell" className="text-df-trust-blue hover:underline">
                        Pokrenite proces valuacije i kreiranja.
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* NDA Requests */}
            <div className="space-y-6">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-df-navy">NDA Zahtjevi</CardTitle>
                  <CardDescription>Upravljajte pristupom vašim podacima</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ndaList.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm">
                      Nema novih zahtjeva za potpisivanje NDA.
                    </div>
                  ) : null}
                  {ndaList.map((req: any) => (
                    <div key={req.id} className="p-4 border border-slate-100 rounded-lg bg-white shadow-sm flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-sm text-df-navy">{req.users?.full_name || 'Skriveni Investitor'}</p>
                          <p className="text-xs text-slate-500">{new Date(req.created_at).toLocaleDateString('hr-HR')}</p>
                        </div>
                        {req.status === 'pending' ? (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Na čekanju</Badge>
                        ) : req.status === 'signed' ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Odobreno</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Odbijeno</Badge>
                        )}
                      </div>
                      
                      {req.status === 'pending' && (
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" className="flex-1 bg-df-trust-blue hover:bg-df-trust-blue/90 text-white">
                            <CheckCircle className="w-4 h-4 mr-1" /> Odobri
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                            <XCircle className="w-4 h-4 mr-1" /> Odbij
                          </Button>
                        </div>
                      )}
                      {req.status === 'signed' && (
                         <Button size="sm" variant="outline" className="w-full text-df-navy border-slate-200">
                           <FileText className="w-4 h-4 mr-1" /> Otvori Deal Room
                         </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
