import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { PartType, columns } from "@/types/part";
import {
  PartOrderHistoryType,
  columns as partOrderHistoryColumns,
} from "@/types/partOrderHistory";
import ky from "ky";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function Part() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [parts, setParts] = useState<PartType[]>([]);
  const [partOrderHistory, setPartOrderHistory] = useState<
    PartOrderHistoryType[]
  >([]);

  useEffect(() => {
    const fetchParts = async () => {
      const partsApi = await ky.get("/express/parts").json();
      setParts(partsApi as PartType[]);
    };

    fetchParts();
  }, []);

  useEffect(() => {
    const fetchPartOrderHistory = async () => {
      let partOrderHistoryApi = (await ky
        .get("/express/partOrderHistory")
        .json()) as PartOrderHistoryType[];

      partOrderHistoryApi = partOrderHistoryApi.map((partOrderHistory) => {
        const part = parts.find(
          (p) => p.identifier === partOrderHistory.partIdentifier.value
        ) as PartType;
        return {
          ...partOrderHistory,
          partIdentifier: {
            value: part.name.value,
          },
        };
      });

      setPartOrderHistory(partOrderHistoryApi as PartOrderHistoryType[]);
    };

    if (parts.length > 0) {
      fetchPartOrderHistory();
    }
  }, [parts]);

  const goToUpdate = (part: PartType) => {
    navigate(`/parts/${part.identifier}`);
  };

  const handleDelete = async (part: PartType) => {
    const response = await ky.delete(`/express/parts/${part.identifier}`);
    if (response.ok) {
      toast({
        title: "Pièce supprimée",
      });

      const newParts = parts.filter((p) => p.identifier !== part.identifier);
      setParts(newParts);
    } else {
      toast({
        title: "Erreur lors de la suppression",
      });
    }
  };

  const handleCancelOrder = async (order: PartOrderHistoryType) => {
    const response = await ky.patch(
      `/express/partOrderHistory/${order.identifier}/status`,
      {
        json: {
          status: "CANCELED",
        },
      }
    );

    if (response.ok) {
      toast({
        title: "Commande annulée",
      });

      const newPartOrderHistory = partOrderHistory.map((p) => {
        if (p.identifier === order.identifier) {
          return { ...p, status: "CANCELED" };
        }
        return p;
      });

      setPartOrderHistory(newPartOrderHistory);
    } else {
      toast({
        title: "Erreur lors de l'annulation",
      });
    }
  };

  return (
    <Layout
      title="Pièces"
      button={{
        label: "Ajouter",
        path: "/parts/create",
      }}
    >
      <DataTable columns={columns({ goToUpdate, handleDelete })} data={parts} />

      {parts.length > 0 && (
        <PartOrderHistory
          partOrderHistory={partOrderHistory}
          handleCancelOrder={handleCancelOrder}
        />
      )}
    </Layout>
  );
}

function PartOrderHistory({
  partOrderHistory,
  handleCancelOrder,
}: {
  partOrderHistory: PartOrderHistoryType[];
  handleCancelOrder: (order: PartOrderHistoryType) => Promise<void>;
}) {
  const navigate = useNavigate();

  const isAdmin =
    localStorage.getItem("role") === "gestionnaire" ||
    localStorage.getItem("is_admin") === "true"
      ? true
      : false;

  return (
    <section className="flex flex-col gap-5 mt-5">
      <div className="flex justify-between items-center h-10">
        <h1 className="text-2xl font-bold tracking-tight">
          Historique des commandes
        </h1>
        {isAdmin && (
          <Button
            onClick={() => navigate("/partOrderHistory/create")}
            className="self-start"
          >
            Commander
          </Button>
        )}
      </div>
      <DataTable
        columns={partOrderHistoryColumns({ handleCancelOrder })}
        data={partOrderHistory}
      />
    </section>
  );
}
