import { Metadata } from 'next';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { BuyerOnboardingForm } from '@/components/features/BuyerOnboardingForm';

export const metadata: Metadata = {
  title: 'Kupite Tvrtku | DealFlow',
  description: 'Pronađite idealnu tvrtku za akviziciju. Kriterijski potpomognuto spajanje.',
};

export default function BuyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 w-full bg-gradient-to-b from-background to-[#F5F7FA]">
        <section className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-df-navy mb-4 font-dm-sans">
              Postanite DealFlow Investitor
            </h1>
            <p className="text-lg text-slate-600">
              Registrirajte svoje investicijske kriterije. Naš algoritam automatski će vas
              spojiti s visoko profitabilnim i provjerenim tvrtkama na hrvatskom tržištu.
            </p>
          </div>
          
          <BuyerOnboardingForm />
        </section>
      </main>
      <Footer />
    </div>
  );
}
