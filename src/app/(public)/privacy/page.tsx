import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politika Privatnosti",
  description:
    "Politika privatnosti DealFlow platforme — kako prikupljamo, koristimo i štitimo vaše osobne podatke.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
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
              Politika Privatnosti
            </h1>
            <p className="text-muted-foreground text-sm">
              Zadnje ažuriranje: {new Date().toLocaleDateString("hr-HR")}
            </p>
          </div>

          <div className="prose prose-invert max-w-none prose-headings:font-heading prose-headings:tracking-tight prose-p:text-muted-foreground prose-p:font-light prose-p:leading-relaxed prose-li:text-muted-foreground prose-li:font-light prose-strong:text-foreground">
            <h2>1. Uvod</h2>
            <p>
              DealFlow Advisory d.o.o. (&quot;DealFlow&quot;, &quot;mi&quot;,
              &quot;nas&quot;) posvećen je zaštiti vaše privatnosti. Ova
              politika privatnosti objašnjava kako prikupljamo, koristimo,
              pohranjujemo i štitimo vaše osobne podatke kada koristite našu
              platformu na dealflow.hr.
            </p>

            <h2>2. Podaci koje prikupljamo</h2>
            <p>Prikupljamo sljedeće kategorije podataka:</p>
            <ul>
              <li>
                <strong>Podaci o registraciji:</strong> ime, prezime, email
                adresa, lozinka (hashirana)
              </li>
              <li>
                <strong>Poslovni podaci:</strong> financijski podaci o tvrtki
                (prihod, EBITDA, SDE), industrija, regija, opis poslovanja
              </li>
              <li>
                <strong>Profil kupca:</strong> ciljane industrije, regije,
                raspon investicije
              </li>
              <li>
                <strong>Tehnički podaci:</strong> IP adresa, vrsta preglednika,
                podaci o korištenju platforme
              </li>
            </ul>

            <h2>3. Kako koristimo vaše podatke</h2>
            <p>Vaše podatke koristimo isključivo za:</p>
            <ul>
              <li>Pružanje usluga platforme (spajanje kupaca i prodavatelja)</li>
              <li>Generiranje anonimnih teasera putem AI tehnologije</li>
              <li>AI procjenu vrijednosti tvrtke</li>
              <li>Upravljanje NDA ugovorima između stranaka</li>
              <li>Poboljšanje funkcionalnosti platforme</li>
            </ul>

            <h2>4. Zaštita podataka</h2>
            <p>
              Primjenjujemo tehničke i organizacijske mjere zaštite uključujući
              enkripciju podataka, kontrolu pristupa putem Row Level Security
              (RLS) na bazi podataka, te NDA ugovore koji štite povjerljive
              informacije između stranaka.
            </p>

            <h2>5. Dijeljenje podataka</h2>
            <p>
              Vaše poslovne podatke ne dijelimo s trećim stranama bez vašeg
              pristanka. Anonimni teaseri (blind teaseri) vidljivi su svim
              registriranim korisnicima, ali ne sadrže identifikacijske
              podatke. Puni podaci o tvrtki dostupni su isključivo kupcima koji
              potpišu NDA ugovor.
            </p>

            <h2>6. AI obrada podataka</h2>
            <p>
              Koristimo Google Gemini AI za generiranje anonimnih teasera i
              procjenu vrijednosti. Podaci poslani AI servisu koriste se
              isključivo za obradu zahtjeva i ne pohranjuju se od strane AI
              pružatelja usluge.
            </p>

            <h2>7. Vaša prava (GDPR)</h2>
            <p>
              U skladu s Općom uredbom o zaštiti podataka (GDPR), imate pravo
              na pristup, ispravak, brisanje, ograničenje obrade i prijenos
              svojih osobnih podataka. Za ostvarivanje ovih prava, kontaktirajte
              nas na{" "}
              <a
                href="mailto:info@dealflow.hr"
                className="text-primary hover:underline"
              >
                info@dealflow.hr
              </a>
              .
            </p>

            <h2>8. Kolačići</h2>
            <p>
              Koristimo tehničke kolačiće nužne za funkcioniranje platforme
              (autentifikacija, sesija). Ne koristimo kolačiće za praćenje ili
              oglašavanje.
            </p>

            <h2>9. Kontakt</h2>
            <p>
              Za sva pitanja vezana uz zaštitu podataka, obratite se na:{" "}
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
