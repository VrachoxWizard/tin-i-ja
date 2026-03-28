import { Metadata } from 'next';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Clock, Building2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Nadzorna Ploča Kupca | DealFlow',
  description: 'Pregledajte svoje NDA statuse i algoritmom uparene tvrtke.',
};

export default async function BuyerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch NDAs with related listing industry
  const { data: ndas, error: ndaError } = await supabase
    .from('ndas')
    .select(`
      id,
      status,
      created_at,
      listing_id,
      listings (
        industry_nkd
      )
    `)
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false });

  // Fallback to empty array if error
  const ndaList = ndas || [];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1 w-full bg-[#F5F7FA] py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-df-navy font-dm-sans">
              Nadzorna Ploča (Investitor)
            </h1>
            <Link href="/listings">
              <Button className="bg-df-trust-blue hover:bg-df-trust-blue/90">
                Pretraži Tržište
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Action Center */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-df-navy">Statusi NDA Zahtjeva</CardTitle>
                  <CardDescription>Pratite napredak vaših zahtjeva za otkrivanje punih informacija o tvrtkama.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ndaList.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      Nemate još poslani NDA zahtjev. <Link href="/listings" className="text-df-trust-blue hover:underline">Zatražite prvi.</Link>
                    </div>
                  ) : null}
                  {ndaList.map((nda: any) => (
                    <div key={nda.id} className="flex flex-col sm:flex-row justify-between items-center p-4 border border-slate-100 rounded-lg bg-white shadow-sm gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-df-navy">Prilika #{nda.listing_id.split('-')[0]}</p>
                          <p className="text-sm text-slate-500">{nda.listings?.industry_nkd || 'Nepoznata industrija'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        {nda.status === 'pending' ? (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex gap-1">
                            <Clock className="w-3 h-3" /> Na čekanju
                          </Badge>
                        ) : nda.status === 'signed' ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex gap-1">
                            <FileText className="w-3 h-3" /> Odobreno
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex gap-1">
                            Odbijeno
                          </Badge>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant={nda.status === 'signed' ? 'default' : 'outline'}
                          className={nda.status === 'signed' ? 'bg-df-navy hover:bg-df-navy/90' : ''}
                          disabled={nda.status !== 'signed'}
                        >
                          {nda.status === 'signed' ? 'Ulaz u Deal Room' : 'Zatraženo'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Profile Summary */}
            <div className="space-y-6">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-df-navy">Moj Investicijski Profil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Ime</span>
                    <span className="font-semibold text-df-navy">{user?.user_metadata?.full_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Email</span>
                    <span className="font-semibold text-df-navy">{user?.email}</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-slate-500">Status</span>
                    <span className="font-semibold text-green-600">Verificiran</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full text-df-trust-blue hover:text-df-trust-blue/80 hover:bg-df-trust-blue/10">
                    Ažuriraj Profil
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
