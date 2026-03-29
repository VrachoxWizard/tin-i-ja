import {
  BarChart3,
  Shield,
  Users,
  Lock,
  ShieldCheck,
  Eye,
  FileSignature,
  Scale,
  type LucideIcon,
} from "lucide-react";

/* ─── Value Propositions (replaces fake stats) ─── */
export const valueProps = [
  { icon: Eye, label: "Potpuna Diskrecija", desc: "Blind teaseri" },
  { icon: BarChart3, label: "AI Procjena", desc: "U 2 minute" },
  { icon: FileSignature, label: "NDA Zaštita", desc: "Digitalni potpis" },
  { icon: ShieldCheck, label: "GDPR", desc: "EU usklađenost" },
] as const;

/* ─── Dual journey paths ─── */
export const sellerBenefits = [
  "Besplatna AI procjena vrijednosti vaše tvrtke",
  "Anonimni blind teaser štiti vaš identitet",
  "Algoritam pronalazi kvalificirane kupce",
] as const;

export const buyerBenefits = [
  "Verificirane akvizicijske prilike u Hrvatskoj",
  "Detaljni financijski pokazatelji uz NDA",
  "Automatizirano uparivanje po vašim kriterijima",
] as const;

/* ─── Feature cards ─── */
export interface FeatureCard {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: "trust" | "gold" | "indigo" | "emerald";
  size: "large" | "tall" | "small";
}

export const features: FeatureCard[] = [
  {
    icon: BarChart3,
    title: "AI Valuator Tvrtke",
    description:
      "Algoritam analizira vaše financijske pokazatelje i uspoređuje ih s recentnim EU transakcijama za preciznu procjenu tržišne vrijednosti.",
    accent: "trust",
    size: "large",
  },
  {
    icon: Shield,
    title: "Blind Teaseri",
    description:
      "Vaš identitet ostaje skriven. Kupci vide isključivo anonimizirani profil s financijskim modelom i industrijskim pregledom.",
    accent: "gold",
    size: "tall",
  },
  {
    icon: Users,
    title: "Pametno Spajanje",
    description:
      "Algoritam pronalazi kupce koji odgovaraju vašoj tvrtki po industriji, veličini i investicijskom budžetu.",
    accent: "indigo",
    size: "small",
  },
  {
    icon: Lock,
    title: "Siguran NDA Proces",
    description:
      "Digitalni potpis NDA ugovora uz punu pravnu zaštitu prema EU regulativi.",
    accent: "emerald",
    size: "small",
  },
];

/* ─── Process steps ─── */
export interface ProcessStep {
  icon: LucideIcon;
  title: string;
  desc: string;
  accent: "trust" | "gold" | "indigo" | "emerald";
}

export const processSteps: ProcessStep[] = [
  {
    icon: BarChart3,
    title: "Procjena",
    desc: "AI valuator analizira vašu tvrtku",
    accent: "trust",
  },
  {
    icon: Shield,
    title: "Teaser",
    desc: "Generiramo anonimni blind teaser",
    accent: "gold",
  },
  {
    icon: Users,
    title: "Uparivanje",
    desc: "Algoritam pronalazi idealne kupce",
    accent: "indigo",
  },
  {
    icon: Lock,
    title: "NDA & Deal",
    desc: "Sigurno povezivanje i pregovaranje",
    accent: "emerald",
  },
];

/* ─── Trust methodology points (replaces fake testimonials) ─── */
export const trustPoints = [
  {
    icon: Scale,
    title: "Algoritamska procjena",
    description:
      "Valuacija temeljena na stvarnim EU transakcijskim podacima i industrijskim multiplikatorima — ne na subjektivnim procjenama.",
  },
  {
    icon: Shield,
    title: "Potpuna privatnost",
    description:
      "Blind teaser model osigurava da vaš identitet ostaje skriven sve do potpisivanja NDA ugovora. Nema curenja podataka.",
  },
  {
    icon: ShieldCheck,
    title: "Regulatorna usklađenost",
    description:
      "Platforma je u potpunosti usklađena s GDPR-om i hrvatskim zakonodavstvom. Svi podaci pohranjeni su unutar EU.",
  },
] as const;
