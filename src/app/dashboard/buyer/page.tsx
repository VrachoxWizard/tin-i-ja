import { Metadata } from "next";
import { GlowCard } from "@/components/ui/GlowCard";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Clock,
  Building2,
  ExternalLink,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Nadzorna Ploča Kupca | DealFlow",
  description: "Pregledajte svoje NDA statuse i algoritmom uparene tvrtke.",
};

export default async function BuyerDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch NDAs with related listing industry
  const { data: ndas } = await supabase
    .from("ndas")
    .select(
      `
      id,
      status,
      created_at,
      listing_id,
      listings (
        industry_nkd
      )
    `,
    )
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false });

  // Fallback to empty array if error
  const ndaList = ndas || [];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 w-full bg-slate-50 dark:bg-slate-950 py-12 relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-df-trust-blue/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-df-gold/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-jakarta tracking-tight">
              Nadzorna Ploča{" "}
              <span className="text-df-trust-blue font-dm-sans opacity-80 text-xl ml-2 font-normal">
                (Investitor)
              </span>
            </h1>
            <Link href="/listings">
              <Button className="bg-df-trust-blue hover:bg-df-trust-blue/90 text-white font-jakarta rounded-xl shadow-md hover:shadow-lg transition-all h-11 px-6">
                <ExternalLink className="w-4 h-4 mr-2" /> Pretraži Tržište
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Action Center */}
            <div className="lg:col-span-2 space-y-6">
              <GlowCard className="border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-glass rounded-2xl overflow-hidden">
                {/* Premium top accent bar */}
                <div className="h-1 bg-linear-to-r from-df-trust-blue via-df-navy to-df-gold" />
                <CardHeader className="bg-white/40 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/60 px-6 py-5">
                  <CardTitle className="text-xl text-slate-900 dark:text-white font-heading">
                    Statusi NDA Zahtjeva
                  </CardTitle>
                  <CardDescription className="text-slate-500 dark:text-slate-400 font-inter">
                    Pratite napredak vaših zahtjeva za otkrivanje punih
                    informacija o tvrtkama.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {ndaList.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                      <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-500 dark:text-slate-400 font-inter">
                        Nemate još poslani NDA zahtjev.
                      </p>
                      <Link
                        href="/listings"
                        className="text-df-trust-blue hover:text-df-trust-blue/80 font-semibold hover:underline mt-2 inline-block"
                      >
                        Zatražite prvi.
                      </Link>
                    </div>
                  ) : null}
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {ndaList.map((nda: any) => (
                    <div
                      key={nda.id as string}
                      className="flex flex-col sm:flex-row justify-between items-center p-4 border border-slate-200/60 dark:border-slate-700/60 rounded-xl bg-white/80 dark:bg-slate-900/80 shadow-sm hover:shadow-md transition-shadow gap-4 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-df-trust-blue/10 group-hover:text-df-trust-blue transition-colors">
                          <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white font-jakarta">
                            Tvrtka #{nda.listing_id.split("-")[0]}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 font-inter">
                            {nda.listings?.industry_nkd ||
                              "Nepoznata industrija"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        {nda.status === "pending" ? (
                          <Badge
                            variant="outline"
                            className="bg-amber-50/80 text-amber-700 border-amber-200/60 font-medium px-3 py-1 flex gap-1.5 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50"
                          >
                            <Clock className="w-3.5 h-3.5" /> Na čekanju
                          </Badge>
                        ) : nda.status === "signed" ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50/80 text-green-700 border-green-200/60 font-medium px-3 py-1 flex gap-1.5 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/50"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Odobreno
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-red-50/80 text-red-700 border-red-200/60 font-medium px-3 py-1 flex gap-1.5 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50"
                          >
                            Odbijeno
                          </Badge>
                        )}

                        <Button
                          size="sm"
                          variant={
                            nda.status === "signed" ? "default" : "outline"
                          }
                          className={`rounded-lg font-jakarta h-9 ${nda.status === "signed" ? "bg-df-navy hover:bg-df-navy/90 text-white shadow-sm" : "border-slate-200 dark:border-slate-700 bg-transparent"}`}
                          disabled={nda.status !== "signed"}
                        >
                          {nda.status === "signed"
                            ? "Otvori Deal Room"
                            : "Zatraženo"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </GlowCard>
            </div>

            {/* Profile Summary */}
            <div className="space-y-6">
              <GlowCard className="border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-glass rounded-2xl overflow-hidden">
                <CardHeader className="bg-white/40 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/60 px-6 py-5">
                  <CardTitle className="text-xl text-slate-900 dark:text-white font-heading">
                    Moj Profil
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-5 text-sm">
                  {/* Avatar */}
                  <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/60">
                    <div className="w-14 h-14 rounded-full bg-linear-to-br from-trust to-blue-700 flex items-center justify-center text-white font-heading text-xl font-bold shadow-lg">
                      {(user?.user_metadata?.full_name || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white font-heading">
                        {user?.user_metadata?.full_name || "N/A"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-42.5">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/60 pb-3">
                    <span className="text-slate-500 dark:text-slate-400">
                      Aktivni NDA
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {
                        ndaList.filter(
                          (n: { status: string }) => n.status === "signed",
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-slate-500 dark:text-slate-400">
                      Status verifikacije
                    </span>
                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 border-none">
                      Verificiran
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="bg-slate-50/50 dark:bg-slate-950/20 px-6 py-4 border-t border-slate-100 dark:border-slate-800/60">
                  <Button
                    variant="outline"
                    className="w-full font-heading rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Postavke Profila
                  </Button>
                </CardFooter>
              </GlowCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
