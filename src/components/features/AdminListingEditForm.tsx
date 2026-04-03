'use client'

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { adminUpdateListingAction } from "@/app/actions/admin";

interface ListingFields {
  company_name: string;
  industry_nkd: string;
  region: string;
  year_founded: number;
  employees: number;
  revenue_eur: number;
  ebitda_eur: number;
  sde_eur: number;
  asking_price_eur: number;
  reason_for_sale: string;
  transition_support: string;
  owner_dependency_score: number;
  digital_maturity: number;
}

const FIELDS: { name: keyof ListingFields; label: string; type: string }[] = [
  { name: "company_name", label: "Naziv tvrtke", type: "text" },
  { name: "industry_nkd", label: "Industrija (NKD)", type: "text" },
  { name: "region", label: "Regija", type: "text" },
  { name: "year_founded", label: "Godina osnivanja", type: "number" },
  { name: "employees", label: "Broj zaposlenih", type: "number" },
  { name: "revenue_eur", label: "Prihod (EUR)", type: "number" },
  { name: "ebitda_eur", label: "EBITDA (EUR)", type: "number" },
  { name: "sde_eur", label: "SDE (EUR)", type: "number" },
  { name: "asking_price_eur", label: "Tražena cijena (EUR)", type: "number" },
  { name: "owner_dependency_score", label: "Ovisnost o vlasniku (1-5)", type: "number" },
  { name: "digital_maturity", label: "Digitalna zrelost (1-5)", type: "number" },
];

export function AdminListingEditForm({
  listingId,
  defaultValues,
}: {
  listingId: string;
  defaultValues: ListingFields;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <form
      action={(formData) =>
        startTransition(async () => {
          await adminUpdateListingAction(listingId, formData);
          router.refresh();
        })
      }
      className="space-y-5"
    >
      {FIELDS.map((field) => (
        <div key={field.name}>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">
            {field.label}
          </label>
          <input
            name={field.name}
            type={field.type}
            defaultValue={defaultValues[field.name]}
            className="w-full h-10 rounded-none border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      ))}

      <div>
        <label className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">
          Razlog prodaje
        </label>
        <textarea
          name="reason_for_sale"
          defaultValue={defaultValues.reason_for_sale}
          rows={3}
          className="w-full rounded-none border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-y"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">
          Prijelazna podrška
        </label>
        <textarea
          name="transition_support"
          defaultValue={defaultValues.transition_support}
          rows={3}
          className="w-full rounded-none border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-y"
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="rounded-none bg-df-trust-blue text-white hover:bg-df-trust-blue/90"
        >
          {isPending ? "Spremanje..." : "Spremi promjene"}
        </Button>
      </div>
    </form>
  );
}
