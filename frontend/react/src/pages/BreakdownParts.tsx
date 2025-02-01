import { Layout } from "@/components/Layout";
import { columns } from "@/types/breakdownPart";
import { DataTable } from "@/components/ui/data-table";
import { useEffect, useState } from "react";
import ky from "ky";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router";
import { BreakdownType } from "@/types/breakdown";

export function BreakdownParts() {
  const { identifier } = useParams();
  const { toast } = useToast();

  const [breakdown, setBreakdown] = useState<BreakdownType | null>(null);

  useEffect(() => {
    const fetchBreakdown = async () => {
      const breakdownApi = await ky
        .get(`/express/breakdowns/${identifier}`)
        .json();
      setBreakdown(breakdownApi as BreakdownType);
    };

    fetchBreakdown();
  }, [toast, identifier]);

  return (
    <Layout
      title={`Breakdown de ${breakdown?.rentalIdentifier} - ${breakdown?.date.value}`}
    >
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-medium">Description</h3>
          </div>
          <div className="pl-6">
            {breakdown?.description ? (
              <p className="text-sm text-muted-foreground">
                {breakdown.description}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Aucune description
              </p>
            )}
          </div>
          <div className="pl-6 text-xs text-muted-foreground">
            ID Breakdown: {breakdown?.identifier || "N/A"}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-medium">Pièces</h3>
      </div>
      <DataTable
        columns={columns()}
        data={
          breakdown?.parts.map((part) => ({
            totalCost: Number(part.part.cost.value) * Number(part.quantity),
            ...part,
          })) || []
        }
      />
    </Layout>
  );
}
