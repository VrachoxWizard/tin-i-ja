import { Metadata } from 'next';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { SellerOnboardingForm } from '@/components/features/SellerOnboardingForm';

export const metadata: Metadata = {
  title: 'Prodajte Tvrtku | DealFlow',
  description: 'Započnite proces prodaje vaše tvrtke diskretno i sigurno.',
};

export default function SellPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 w-full bg-gradient-to-b from-background to-[#F5F7FA]">
        <section className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-df-navy mb-4 font-dm-sans">
              Započnite prodaju tvrtke
            </h1>
            <p className="text-lg text-slate-600">
              Unesite podatke o vašoj tvrtki. Vaši stvarni podaci ostat će tajni sve do potpisivanja NDA ugovora.
              Naša AI tehnologija automatski će kreirati anonimni "Slijepi Teaser" za zaštitu vaše privatnosti.
            </p>
          </div>
          
          <SellerOnboardingForm />
        </section>
      </main>
      <Footer />
    </div>
  );
}
