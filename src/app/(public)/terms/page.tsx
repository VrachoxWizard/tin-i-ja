import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uvjeti Korištenja",
  description:
    "Uvjeti korištenja DealFlow platforme — pravila i odgovornosti pri korištenju M&A tržišta.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="flex flex-col bg-background">
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />

        <div className="container relative z-10 mx-auto px-4 max-w-3xl">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 px-4 py-1.5 border border-white/10 text-muted-foreground text-[0.65rem] font-bold uppercase tracking-[0.2em] mb-12">
              <span className="w-1.5 h-1.5 bg-primary" />
              Pravni Dokumenti
            </div>

            <h1 className="text-4xl md:text-6xl font-heading text-foreground mb-8 leading-[1.05] tracking-tighter">
              Uvjeti Korištenja
            </h1>
            <p className="text-muted-foreground text-sm">
              Zadnje ažuriranje: {new Date().toLocaleDateString("hr-HR")}
            </p>
          </div>

          <div className="prose prose-invert max-w-none prose-headings:font-heading prose-headings:tracking-tight prose-p:text-muted-foreground prose-p:font-light prose-p:leading-relaxed prose-li:text-muted-foreground prose-li:font-light prose-strong:text-foreground">
            <h2>1. Prihvaćanje uvjeta</h2>
            <p>
              Korištenjem DealFlow platforme (dealflow.hr) pristajete na ove
              Uvjete korištenja. Ako se ne slažete s ovim uvjetima, molimo vas
              da ne koristite platformu.
            </p>

            <h2>2. Opis usluge</h2>
            <p>
              DealFlow je digitalna platforma za spajanje vlasnika tvrtki
              (prodavatelja) s kvalificiranim investitorima (kupcima) na
              hrvatskom tržištu. Usluge uključuju:
            </p>
            <ul>
              <li>AI generiranje anonimnih poslovnih teasera</li>
              <li>AI procjenu vrijednosti tvrtke (informativnog karaktera)</li>
              <li>Upravljanje NDA ugovorima</li>
              <li>Deal Room za sigurnu razmjenu dokumenata</li>
              <li>Matchmaking između kupaca i prodavatelja</li>
            </ul>

            <h2>3. Registracija i korisnički račun</h2>
            <p>
              Za korištenje platforme potrebna je registracija s valjanom email
              adresom. Odgovorni ste za sigurnost svog korisničkog računa i
              lozinke. DealFlow ne odgovara za neovlašteni pristup vašem računu
              uzrokovan vašom nepažnjom.
            </p>

            <h2>4. Točnost podataka</h2>
            <p>
              Korisnici jamče da su svi podaci uneseni na platformu (financijski
              podaci, poslovne informacije) točni i istiniti. DealFlow ne
              preuzima odgovornost za točnost podataka koje korisnici unose.
            </p>

            <h2>5. AI procjena vrijednosti</h2>
            <p>
              AI procjena vrijednosti tvrtke putem DealFlow platforme je
              informativnog karaktera i ne predstavlja profesionalnu valuaciju.
              Ne može zamijeniti profesionalnu financijsku analizu i savjetovanje
              kvalificiranih stručnjaka. DealFlow ne snosi odgovornost za
              poslovne odluke donesene na temelju AI procjene.
            </p>

            <h2>6. NDA i povjerljivost</h2>
            <p>
              Pristupom punim podacima o tvrtki putem Deal Rooma, kupac prihvaća
              uvjete NDA ugovora i obvezuje se na čuvanje povjerljivih
              informacija. Kršenje NDA ugovora može rezultirati pravnim
              posljedicama.
            </p>

            <h2>7. Intelektualno vlasništvo</h2>
            <p>
              Sav sadržaj na DealFlow platformi, uključujući dizajn, tekstove,
              algoritme i AI modele, vlasništvo je DealFlow Advisory d.o.o.
              Neovlašteno kopiranje ili distribucija sadržaja je zabranjeno.
            </p>

            <h2>8. Ograničenje odgovornosti</h2>
            <p>
              DealFlow platforma pruža se &quot;kakva jest&quot; (as-is). Ne
              jamčimo neprekidan rad platforme niti uspješnost bilo koje
              transakcije. DealFlow djeluje isključivo kao posrednik i nije
              strana u transakcijama između kupaca i prodavatelja.
            </p>

            <h2>9. Prekid korištenja</h2>
            <p>
              DealFlow zadržava pravo suspendirati ili ukinuti korisnički račun
              u slučaju kršenja ovih uvjeta, zlouporabe platforme ili
              neovlaštenih aktivnosti.
            </p>

            <h2>10. Primjenjivo pravo</h2>
            <p>
              Na ove Uvjete korištenja primjenjuje se pravo Republike Hrvatske.
              Za sve sporove nadležan je sud u Zagrebu.
            </p>

            <h2>11. Kontakt</h2>
            <p>
              Za pitanja vezana uz ove uvjete, obratite se na:{" "}
              <a
                href="mailto:info@dealflow.hr"
                className="text-primary hover:underline"
              >
                info@dealflow.hr
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
