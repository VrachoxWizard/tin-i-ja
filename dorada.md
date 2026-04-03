# DealFlow — Pregled svih poboljšanja

Ovaj dokument opisuje sve što je napravljeno na DealFlow aplikaciji kroz 5 faza razvoja.

---

## Faza 1: Sigurnost

### Jačanje lozinki
- Lozinka sada mora imati **najmanje 8 znakova**
- Mora sadržavati **veliko slovo**, **malo slovo**, **znamenku** i **poseban znak** (npr. !@#$%)
- Provjera se vrši na serveru kod registracije i kod promjene lozinke
- Korisnik dobiva jasnu poruku na hrvatskom ako lozinka ne zadovoljava pravila

### Sustav revizije (Audit log)
- Kreirana je tablica `audit_logs` u bazi koja bilježi svaku administrativnu radnju
- Svaki put kad administrator napravi promjenu (npr. suspendira korisnika, obriše oglas), to se automatski zapisuje
- Zapisuje se: tko je napravio radnju, što je napravljeno, na čemu, i kada
- Samo administratori mogu čitati zapisnik

---

## Faza 2: Administratorsko sučelje

### Baza podataka
- Dodano polje `suspended_at` na korisnike — omogućuje suspenziju korisničkih računa
- Kreirano 6 sigurnih funkcija u bazi za administratorske operacije:
  - Ažuriranje korisnika (ime, email, uloga)
  - Suspenzija / reaktivacija korisnika
  - Brisanje korisnika (i svih povezanih podataka)
  - Promjena statusa oglasa
  - Brisanje oglasa
  - Upravljanje NDA zahtjevima

### Serverske akcije
- 8 serverskih akcija u `src/app/actions/admin.ts`
- Svaka akcija provjerava je li korisnik administrator
- Svaka akcija validira ulazne podatke pomoću Zod biblioteke
- Svaka akcija automatski zapisuje promjenu u audit log

### Korisničko sučelje
- **Korisnici** (`/dashboard/admin/users`) — popis svih korisnika s mogućnošću suspenzije i brisanja
- **Uređivanje korisnika** (`/dashboard/admin/users/[id]`) — forma za promjenu imena, emaila i uloge
- **Oglasi** (`/dashboard/admin/listings`) — popis svih oglasa s mogućnošću promjene statusa i brisanja
- **Uređivanje oglasa** (`/dashboard/admin/listings/[id]`) — forma za uređivanje detalja oglasa
- **NDA zahtjevi** (`/dashboard/admin/ndas`) — pregled i upravljanje svim NDA zahtjevima
- **Zapisnik aktivnosti** (`/dashboard/admin/audit-log`) — pregled svih administrativnih radnji
- Ažuriran admin dashboard s navigacijskim karticama za brzi pristup svim stranicama

---

## Faza 3: Broker sučelje

### Baza podataka
- Dodano polje `broker_id` na oglase — omogućuje dodjelu brokera pojedinom oglasu
- Kreirane 3 sigurnosne politike (RLS) koje brokeru dopuštaju pristup samo dodijeljenim oglasima, NDA zahtjevima i datotekama
- Kreirana funkcija `broker_overview` koja vraća statistiku za brokerov dashboard

### Serverske akcije
- **Pregled NDA zahtjeva** — broker može odobriti ili odbiti NDA za svoje oglase
- **Upload dokumenata** — broker može dodavati datoteke u deal room, s ograničenjem broja uploada (rate limiting)
- Svaka akcija provjerava je li broker dodijeljen tom oglasu

### Korisničko sučelje
- **Broker dashboard** (`/dashboard/broker`) — pregled statistike (ukupni oglasi, aktivni, NDA na čekanju) i popis dodijeljenih oglasa
- **Detalji oglasa** (`/dashboard/broker/listings/[id]`) — pregled oglasa s upravljanjem NDA zahtjevima
- **Deal room** (`/dashboard/broker/deal-room/[id]`) — pregled i upload dokumenata za deal room

### Usmjeravanje (Routing)
- Ažuriran middleware (`proxy-session.ts`) da prepoznaje ulogu brokera
- Brokeri se automatski preusmjeravaju na `/dashboard/broker` nakon prijave
- Korisnici koji nisu brokeri ne mogu pristupiti broker stranicama

---

## Faza 4: Testiranje

### Jedinični testovi (Vitest)
- Instaliran Vitest i konfiguriran (`vitest.config.ts`)
- Napisano **34 testa** u 5 testnih datoteka:
  - **password-validation** — 14 testova: provjera svih pravila za lozinku
  - **auth-errors** — 5 testova: provjera poruka o greškama na hrvatskom
  - **audit** — 3 testa: provjera da se audit log poziva s ispravnim parametrima
  - **contracts** — 7 testova: provjera konstanti (uloge, statusi, tipovi)
  - **rate-limit** — 5 testova: provjera ograničenja broja zahtjeva
- Svi testovi prolaze

### End-to-End testovi (Playwright)
- Instaliran Playwright i konfiguriran (`playwright.config.ts`)
- Napisano **14 E2E testova** u 2 datoteke:
  - **public-pages** — 10 testova: provjera da se sve javne stranice učitavaju (početna, kupnja, prodaja, kontakt, oglasi, uvjeti, privatnost, sukcesija, valuacija)
  - **auth-pages** — 4 testa za forme + 4 testa za preusmjeravanje neprijavljenih korisnika s dashboard stranica

### Pokretanje testova
- `npm test` — pokreće jedinične testove
- `npm run test:e2e` — pokreće E2E testove
- `npm run test:watch` — pokreće testove u watch modu

---

## Faza 5: CI/CD (Automatizacija)

### GitHub Actions
- Kreiran workflow u `.github/workflows/ci.yml` s 5 poslova:
  1. **Lint i provjera tipova** — ESLint + TypeScript provjera
  2. **Jedinični testovi** — pokreće Vitest
  3. **Build** — produkcijski build Next.js aplikacije (ovisi o koraku 1 i 2)
  4. **E2E testovi** — pokreće Playwright u Chromium pregledniku (ovisi o koraku 3)
  5. **Deploy** — automatski deploy na Vercel pri pushu na `main` granu (ovisi o koracima 3 i 4)

### Potrebni GitHub tajni ključevi
Za aktiviranje CI/CD pipeline-a potrebno je dodati ove tajne u GitHub postavke repozitorija:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

---

## Sažetak u brojevima

| Stavka | Broj |
|--------|------|
| Ukupno ruta u aplikaciji | 33 |
| Novih admin stranica | 6 |
| Novih broker stranica | 3 |
| Migracija baze podataka | 8 |
| Serverskih akcija (admin) | 8 |
| Serverskih akcija (broker) | 2 |
| RPC funkcija u bazi | 8 |
| Jediničnih testova | 34 |
| E2E testova | 14 |
| CI/CD poslova | 5 |

---

*Zadnje ažuriranje: 3. travnja 2026.*
