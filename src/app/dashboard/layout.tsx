import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { PageTransition } from "@/components/ui/PageTransition";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <PageTransition>
        <main className="flex-1 flex flex-col relative">
          {/* Subtle grid pattern */}
          <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0" />
          <div className="relative z-10">{children}</div>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
