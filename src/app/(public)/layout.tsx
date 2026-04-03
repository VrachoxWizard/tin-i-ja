import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </SmoothScroll>
  );
}
