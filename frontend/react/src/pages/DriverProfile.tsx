import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { createApiClientHeader } from "@/tools/apiClientHeader";
import { BreakdownType } from "@/types/breakdown";
import { DriverType } from "@/types/driver";
import { columns } from "@/types/breakdown";
import { UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ky from "ky";
import { toast } from "@/hooks/use-toast";

export function DriverProfile() {
  const { identifier } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [license, setLicense] = useState<string>("");
  const [numberOfYearsOfExperience, setNumberOfYearsOfExperience] =
    useState<number>(0);
  const [breakdowns, setBreakdowns] = useState<BreakdownType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const apiClient = createApiClientHeader();
      const driver = (await apiClient
        .get(`/express/drivers/${identifier}`)
        .json()) as DriverType;
      setName(driver.name.value);
      setLicense(driver.license);
      setNumberOfYearsOfExperience(driver.numberOfYearsOfExperience);
    };

    // Fetch all Breakdowns for the Driver
    const fetchBreakdowns = async () => {
      const apiClient = createApiClientHeader();
      const breakdowns = await apiClient
        .get(`/express/breakdowns/driver/${identifier}`)
        .json();
      setBreakdowns(breakdowns as BreakdownType[]);
    };

    fetchData();
    fetchBreakdowns();
  }, [identifier]);

  const goToUpdate = (breakdown: BreakdownType) => {
    navigate(`/breakdowns/${breakdown.identifier}`);
  };

  const goToParts = (breakdown: BreakdownType) => {
    navigate(`/breakdowns/${breakdown.identifier}/parts`);
  };

  const handleDelete = async (breakdown: BreakdownType) => {
    try {
      const response = await ky.delete(
        `/express/breakdowns/${breakdown.identifier}`
      );

      if (response.ok) {
        toast({
          title: "Panne supprimée",
        });
      }
      setBreakdowns(
        breakdowns.filter((b) => b.identifier !== breakdown.identifier)
      );
    } catch {
      toast({
        title: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout title="Profil du conducteur">
      <div className="flex flex-col space-y-4 w-full">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex justify-center">
              <div className=" p-4 rounded-full bg-slate-100 w-fit">
                <UserRound className="w-16 h-16 text-stone-600" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <h3 className="font-medium">Nom:</h3>
              <p>{name}</p>
            </div>
            <div className="flex space-x-4">
              <h3 className="font-medium">Permis:</h3>
              <p>{license}</p>
            </div>
            <div className="flex space-x-4">
              <h3 className="font-medium">Nombre d'années d'expérience:</h3>
              <p>{numberOfYearsOfExperience}</p>
            </div>
          </CardContent>
        </Card>
        <div>
          <h2 className="text-lg font-medium">Ses accidents:</h2>
          <DataTable
            columns={columns({ goToUpdate, handleDelete, goToParts })}
            data={breakdowns}
          />
        </div>
      </div>
    </Layout>
  );
}
