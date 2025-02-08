import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { createApiClientHeader } from "@/tools/apiClientHeader";
import { MaintenanceType } from "@/types/maintenance";
import { columns } from "@/types/maintenance";
import { Bike, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ky from "ky";
import { toast } from "@/hooks/use-toast";
import { MotorcycleType } from "@/types/motorcycle";
import { ModelType } from "@/types/model";
import { GuaranteeType } from "@/types/guarantee";

export function MotorcycleProfile() {
  const { identifier } = useParams();
  const navigate = useNavigate();

  const [mileage, setMileage] = useState<number>(0);
  const [dateOfCommissioning, setDateOfCommissioning] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [modelIdentifier, setModelIdentifier] = useState<string>("");
  const [model, setModel] = useState<ModelType>();
  const [guaranteeIdentifier, setGuaranteeIdentifier] = useState<string | null>(
    null
  );
  const [guarantees, setGuarantees] = useState<GuaranteeType[]>([]);
  const [rentalIdentifiers, setRentalIdentifiers] = useState<string[]>([]);
  const [maintenanceIdentifiers, setMaintenanceIdentifiers] = useState<
    string[]
  >([]);
  const [maintenances, setMaintenances] = useState<MaintenanceType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const apiClient = createApiClientHeader();
      const driver = (await apiClient
        .get(`/express/motorcycles/${identifier}`)
        .json()) as MotorcycleType;
      setMileage(driver.mileage.value);
      setDateOfCommissioning(driver.dateOfCommissioning);
      setStatus(driver.status.value);
      setModelIdentifier(driver.modelIdentifier);
      setGuaranteeIdentifier(driver.guaranteeIdentifier);
      setRentalIdentifiers(driver.rentalIdentifiers);
      setMaintenanceIdentifiers(driver.maintenanceIdentifiers);
    };

    // Fetch all Maintenances for the Motorcycle
    const fetchMaintenances = async () => {
      const apiClient = createApiClientHeader();
      const maintenances = await apiClient
        .get(`/express/motorcycles/${identifier}/maintenances`)
        .json();
      setMaintenances(maintenances as MaintenanceType[]);
    };

    fetchData();
    fetchMaintenances();
  }, [identifier]);

  // Fetch Model
  useEffect(() => {
    const fetchModel = async () => {
      const apiClient = createApiClientHeader();
      const model = (await apiClient
        .get(`/express/models/${modelIdentifier}`)
        .json()) as ModelType;
      setModel(model);
    };

    if (modelIdentifier) {
      fetchModel();
    }
  }, [modelIdentifier]);

  // Fetch Guarantee
  useEffect(() => {
    const fetchGuarantee = async () => {
      const apiClient = createApiClientHeader();
      const guarantees = (await apiClient
        .get(`/express/guarantees/${guaranteeIdentifier}`)
        .json()) as GuaranteeType[];
      setGuarantees(guarantees);
    };

    if (guaranteeIdentifier) {
      fetchGuarantee();
    }
  }, [guaranteeIdentifier]);

  const goToUpdate = (maintenance: MaintenanceType) => {
    navigate(`/maintenances/${maintenance.identifier}`);
  };

  const goToParts = (maintenance: MaintenanceType) => {
    navigate(`/maintenances/${maintenance.identifier}/parts`);
  };

  const handleDelete = async (maintenance: MaintenanceType) => {
    try {
      const response = await ky.delete(
        `/express/maintenances/${maintenance.identifier}`
      );

      if (response.ok) {
        toast({
          title: "Maintenance supprimée",
        });
      }
      setMaintenances(
        maintenances.filter((b) => b.identifier !== maintenance.identifier)
      );
    } catch {
      toast({
        title: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout title="Profil de la Moto">
      <div className="flex flex-col space-y-4 w-full">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex justify-center">
              <div className=" p-4 rounded-full bg-slate-100 w-fit">
                <Bike className="w-16 h-16 text-stone-600" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <h3 className="font-medium">VIN:</h3>
              <p>{identifier}</p>
            </div>

            {/* Kilometrage */}
            <div className="flex space-x-4">
              <h3 className="font-medium">Kilométrage:</h3>
              <p>{mileage} Km</p>
            </div>

            {/* Date de mise en service */}
            <div className="flex space-x-4">
              <h3 className="font-medium">Date de mise en service:</h3>
              <p>{new Date(dateOfCommissioning).toLocaleString("fr-FR")}</p>
            </div>

            {/* Statut */}
            <div className="flex space-x-4">
              <h3 className="font-medium">Statut:</h3>
              <p>{status}</p>
            </div>

            {/* Modèle */}
            <div className="flex space-x-4">
              <h3 className="font-medium">Modèle:</h3>
              <p>{model?.name.value}</p>
            </div>

            {/* Garantie */}
            {guarantees.length > 0 && (
              <div className="flex space-x-4">
                <h3 className="font-medium">Garantie:</h3>
                <p>{guarantees.map((guarantee) => `${guarantee.name}`)}</p>
              </div>
            )}
          </CardContent>
        </Card>
        <div>
          <h2 className="text-lg font-medium">Ses entretiens:</h2>
          <DataTable
            columns={columns({ goToUpdate, handleDelete, goToParts })}
            data={maintenances}
          />
        </div>
      </div>
    </Layout>
  );
}
