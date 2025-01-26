import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useState, useEffect, SyntheticEvent } from "react";
import { DriverType } from "@/types/driver";
import { useParams } from "react-router";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createApiClientHeader } from "@/tools/apiClientHeader";

export function DriverForm({ mode }: { mode: "create" | "update" }) {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState<string>("");
  const [license, setLicense] = useState<string>("");
  const [numberOfYearsOfExperience, setNumberOfYearsOfExperience] =
    useState<number>(0);
  const [companyIdentifier, setCompanyIdentifier] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const apiClient = createApiClientHeader();
      const driver = (await apiClient
        .get(`/express/drivers/${identifier}`)
        .json()) as DriverType;
      setName(driver.name.value);
      setLicense(driver.license);
      setNumberOfYearsOfExperience(driver.numberOfYearsOfExperience);
      setCompanyIdentifier(driver.companyIdentifier);
    };

    if (mode === "update") {
      fetchData();
    }
  }, [mode, identifier]);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const method = mode === "create" ? "post" : "put";
      const endpoint =
        mode === "create"
          ? "/express/drivers"
          : `/express/drivers/${identifier}`;

      const apiClient = createApiClientHeader();

      const response = await apiClient[method](endpoint, {
        json: { name, license, numberOfYearsOfExperience, companyIdentifier },
      });

      if (response.ok) {
        toast({
          title:
            mode === "create" ? "Conducteur créé" : "Conducteur mis à jour",
        });

        // Reset form
        if (mode === "create") {
          setName("");
          setLicense("");
          setNumberOfYearsOfExperience(0);
          setCompanyIdentifier("");
        }
      }
    } catch {
      toast({
        title:
          mode === "create"
            ? "Erreur lors de la création"
            : "Erreur lors de la mise à jour",
        variant: "destructive",
      });
    }
  };
  return (
    <Layout title="Conducteurs">
      <form className="flex flex-col gap-5 items-start" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="name">Nom</Label>
          <Input
            id="name"
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* License */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label>Permis de conduire</Label>
          <Select value={license} onValueChange={(value) => setLicense(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Permis de conduire" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="A2">A2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Number of years of experience */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="numberOfYearsOfExperience">
            Nombre d'années d'expérience
          </Label>
          <Input
            id="numberOfYearsOfExperience"
            type="number"
            value={numberOfYearsOfExperience}
            onChange={(e) => setNumberOfYearsOfExperience(+e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/drivers")}
          >
            Retour
          </Button>
          <Button type="submit">
            {mode === "create" ? "Créer" : "Mettre à jour"}
          </Button>
        </div>
      </form>
    </Layout>
  );
}

export function DriverCreate() {
  return <DriverForm mode="create" />;
}

export function DriverUpdate() {
  return <DriverForm mode="update" />;
}
