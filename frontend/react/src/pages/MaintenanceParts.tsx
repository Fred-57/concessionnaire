import { Layout } from "@/components/Layout";
import { columns } from "@/types/maintenancePart";
import { DataTable } from "@/components/ui/data-table";
import { useEffect, useState } from "react";
import ky from "ky";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router";
import { MaintenanceType } from "@/types/maintenance";

export function MaintenanceParts() {
  const { identifier } = useParams();
  const { toast } = useToast();

  const [maintenance, setMaintenance] = useState<MaintenanceType | null>(null);

  useEffect(() => {
    const fetchMaintenance = async () => {
      const maintenanceApi = await ky
        .get(`/express/maintenances/${identifier}`)
        .json();
      setMaintenance(maintenanceApi as MaintenanceType);
    };

    fetchMaintenance();
  }, [toast]);

  return (
    <Layout
      title={`Maintenance de ${maintenance?.motorcycleIdentifier} - ${maintenance?.date}`}
    >
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-medium">Recommandations techniques</h3>
          </div>
          <div className="pl-6">
            {maintenance?.recommendation ? (
              <p className="text-sm text-muted-foreground">
                {maintenance.recommendation}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Aucune recommandation
              </p>
            )}
          </div>
          <div className="pl-6 text-xs text-muted-foreground">
            ID Maintenance: {maintenance?.identifier || "N/A"}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-medium">Pièces</h3>
      </div>
      <DataTable
        columns={columns()}
        data={
          maintenance?.parts.map((part) => ({
            totalCost: Number(part.part.cost.value) * Number(part.quantity),
            ...part,
          })) || []
        }
      />
    </Layout>
  );
}
