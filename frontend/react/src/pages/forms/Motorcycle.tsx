import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import ky from "ky";
import { Input } from "@/components/ui/input";
import { SyntheticEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MotorcycleType } from "@/types/motorcycle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModelType } from "@/types/model";

export function MotorcycleForm({ mode }: { mode: "create" | "update" }) {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const companyIdentifier = localStorage.getItem("company_id");
  if (!companyIdentifier) {
    navigate("/home");
    return;
  }

  const api = ky.create({
    headers: {
      "company-identifier": companyIdentifier,
    },
  });

  const [models, setModels] = useState<ModelType[]>([]);
  // const [guarantees, setGuarantees] = useState<GuaranteeType[]>([]);

  // Motorcycle form state
  const [formIdentifier, setFormIdentifier] = useState<string>("");
  const [mileage, setMileage] = useState<number>(0);
  const [dateOfCommissioning, setDateOfCommissioning] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [modelIdentifier, setModelIdentifier] = useState<string>("");
  const [guaranteeIdentifier, setGuaranteeIdentifier] = useState<string | null>(
    ""
  );

  useEffect(() => {
    const fetchData = async () => {
      const motorcycle = (await api
        .get(`/express/motorcycles/${identifier}`)
        .json()) as MotorcycleType;

      const dateOfCommissioning = new Date(motorcycle.dateOfCommissioning);
      const year = dateOfCommissioning.getFullYear();
      const month = (dateOfCommissioning.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const day = dateOfCommissioning.getDate().toString().padStart(2, "0");
      const formattedDateOfCommissioning = `${year}-${month}-${day}`;

      setFormIdentifier(motorcycle.identifier);
      setMileage(motorcycle.mileage.value);
      setDateOfCommissioning(formattedDateOfCommissioning);
      setStatus(motorcycle.status.value);
      setModelIdentifier(motorcycle.modelIdentifier);
      setGuaranteeIdentifier(motorcycle.guaranteeIdentifier);
    };

    if (mode === "update") {
      fetchData();
    }
  }, [mode, identifier]);

  useEffect(() => {
    const fetchModels = async () => {
      const modelsApi = await api.get("/express/models").json();
      setModels(modelsApi as ModelType[]);
    };

    fetchModels();
  }, []);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const method = mode === "create" ? "post" : "put";
      const endpoint =
        mode === "create"
          ? "/express/motorcycles"
          : `/express/motorcycles/${identifier}`;

      const response = await api[method](endpoint, {
        json: {
          identifier: mode === "create" ? formIdentifier : identifier,
          mileage,
          dateOfCommissioning,
          status,
          modelIdentifier,
          guaranteeIdentifier:
            guaranteeIdentifier && guaranteeIdentifier !== ""
              ? guaranteeIdentifier
              : null,
        },
      });

      if (response.ok) {
        toast({
          title: mode === "create" ? "Moto créée" : "Moto mise à jour",
        });

        // Reset form
        if (mode === "create") {
          setMileage(0);
          setDateOfCommissioning("");
          setStatus("");
          setModelIdentifier("");
          setGuaranteeIdentifier(null);
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
    <Layout title="Motos">
      <form className="flex flex-col gap-5 items-start" onSubmit={handleSubmit}>
        {/* Identifier */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="identifier">
            Numéro d'identification du véhicule (VIN)
          </Label>
          <Input
            type="text"
            id="identifier"
            placeholder="Numéro d'identification du véhicule (VIN)"
            value={formIdentifier}
            onChange={(e) => setFormIdentifier(e.target.value)}
            disabled={mode === "update"}
            required
          />
        </div>

        {/* Mileage */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="mileage">Kilométrage</Label>
          <Input
            type="number"
            id="mileage"
            placeholder="Kilométrage"
            value={mileage}
            onChange={(e) => setMileage(Number(e.target.value))}
            required
          />
        </div>

        {/* Date of commissioning */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="dateOfCommissioning">Date de mise en service</Label>
          <Input
            type="date"
            id="dateOfCommissioning"
            placeholder="Date de mise en service"
            value={dateOfCommissioning}
            onChange={(e) => setDateOfCommissioning(e.target.value)}
            required
          />
        </div>

        {/* Status */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="status">Statut</Label>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AVAILABLE">Disponible</SelectItem>
              <SelectItem value="RENTED">Réservée</SelectItem>
              <SelectItem value="IN_REPAIR">En réparation</SelectItem>
              <SelectItem value="IN_MAINTENANCE">En maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Model */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="model">Modèle</Label>
          <Select
            value={modelIdentifier}
            onValueChange={(value) => setModelIdentifier(value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Modèle" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.identifier} value={model.identifier}>
                  {model.name.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Guarantee */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="guarantee">Garantie</Label>
          <Input
            type="text"
            id="guarantee"
            placeholder="Garantie"
            value={guaranteeIdentifier ?? ""}
            onChange={(e) => setGuaranteeIdentifier(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/motorcycles")}
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

export function MotorcycleCreate() {
  return <MotorcycleForm mode="create" />;
}

export function MotorcycleUpdate() {
  return <MotorcycleForm mode="update" />;
}
