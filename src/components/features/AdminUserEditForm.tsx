'use client'

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { adminUpdateUserAction } from "@/app/actions/admin";

const ROLES = [
  { value: "buyer", label: "Kupac" },
  { value: "seller", label: "Prodavatelj" },
  { value: "broker", label: "Broker" },
  { value: "admin", label: "Admin" },
];

export function AdminUserEditForm({
  userId,
  defaultValues,
}: {
  userId: string;
  defaultValues: {
    full_name: string;
    email: string;
    role: string;
  };
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <form
      action={(formData) =>
        startTransition(async () => {
          await adminUpdateUserAction(userId, formData);
          router.refresh();
        })
      }
      className="space-y-5"
    >
      <div>
        <label className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">
          Ime i prezime
        </label>
        <input
          name="full_name"
          type="text"
          defaultValue={defaultValues.full_name}
          className="w-full h-10 rounded-none border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">
          Email
        </label>
        <input
          name="email"
          type="email"
          defaultValue={defaultValues.email}
          className="w-full h-10 rounded-none border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">
          Uloga
        </label>
        <select
          name="role"
          defaultValue={defaultValues.role}
          className="w-full h-10 rounded-none border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
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
