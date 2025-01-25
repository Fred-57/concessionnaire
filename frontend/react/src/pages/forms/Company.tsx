import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import ky from "ky";
import { Input } from "@/components/ui/input";
import { SyntheticEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CompanyType, CompanyTypeEnum } from "@/types/company";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CompanyForm({ mode }: { mode: "create" | "update" }) {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState<string>("");
  const [type, setType] = useState<CompanyTypeEnum>(CompanyTypeEnum.CAR_DEALER);

  useEffect(() => {
    const fetchData = async () => {
      const company = (await ky
        .get(`/express/companies/${identifier}`)
        .json()) as CompanyType;

      setName(company.name.value);
      setType(company.type);
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
          ? "/express/companies"
          : `/express/companies/${identifier}`;

      const response = await ky[method](endpoint, {
        json: { name, type },
      });

      if (response.ok) {
        toast({
          title:
            mode === "create" ? "Entreprise créée" : "Entreprise mise à jour",
        });

        // Reset form
        if (mode === "create") {
          setName("");
          setType(CompanyTypeEnum.CAR_DEALER);
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
    <Layout title="Entreprises">
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

        {/* Type */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="type">Type</Label>
          <Select
            value={type}
            onValueChange={(value) => setType(value as CompanyTypeEnum)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={CompanyTypeEnum.CAR_DEALER}>
                Concessionnaire
              </SelectItem>
              <SelectItem value={CompanyTypeEnum.PARTNER}>
                Partenaire
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/companies")}
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

export function CompanyCreate() {
  return <CompanyForm mode="create" />;
}

export function CompanyUpdate() {
  return <CompanyForm mode="update" />;
}
