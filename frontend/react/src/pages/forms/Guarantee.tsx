import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import ky from "ky";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SyntheticEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { GuaranteeType } from "@/types/guarantee";
import { PartType } from "@/types/part";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function GuaranteeForm({ mode }: { mode: "create" | "update" }) {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState<string>("");
  const [durationInMonths, setDurationInMonths] = useState<number>(0);
  const [coveredAmount, setCoveredAmount] = useState<number>(0);
  const [partsIdentifiers, setPartsIdentifiers] = useState<string[]>([]);
  const [parts, setParts] = useState<PartType[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const guarantee = (await ky
        .get(`/express/guarantees/${identifier}`)
        .json()) as GuaranteeType;

      setName(guarantee.name.value);
      setDurationInMonths(guarantee.durationInMonths.value);
      setCoveredAmount(guarantee.coveredAmount.value);
      setPartsIdentifiers(guarantee.partsIdentifiers);
    };

    const fetchParts = async () => {
      const parts = await ky.get("/express/parts").json();
      setParts(parts as PartType[]);
    };

    if (mode === "update") {
      fetchData();
    }
    fetchParts();
  }, [mode, identifier]);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const method = mode === "create" ? "post" : "put";
      const endpoint =
        mode === "create"
          ? "/express/guarantees"
          : `/express/guarantees/${identifier}`;

      const response = await ky[method](endpoint, {
        json: {
          name,
          durationInMonths,
          coveredAmount,
          partsIdentifiers,
          motorcyclesIdentifiers: [],
        },
      });

      if (response.ok) {
        toast({
          title: mode === "create" ? "Garantie créée" : "Garantie mise à jour",
        });

        navigate("/guarantees");
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
    <Layout title="Garanties">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Nom</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="durationInMonths">Durée (mois)</Label>
          <Input
            type="number"
            value={durationInMonths}
            onChange={(e) => setDurationInMonths(Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="coveredAmount">Montant couvert (€)</Label>
          <Input
            type="number"
            value={coveredAmount}
            placeholder="Montant couvert"
            onChange={(e) => setCoveredAmount(Number(e.target.value))}
            min={0}
            step={0.01}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="parts">Pièces</Label>
          <Select
            value={partsIdentifiers[0]}
            onValueChange={(value) => {
              if (partsIdentifiers.includes(value)) {
                setPartsIdentifiers(
                  partsIdentifiers.filter((v) => v !== value)
                );
              } else {
                setPartsIdentifiers([...partsIdentifiers, value]);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner des pièces">
                {partsIdentifiers.length > 0
                  ? `${partsIdentifiers.length} pièces sélectionnée(s)`
                  : "Sélectionner des pièces"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {parts.map((part) => (
                <SelectItem key={part.identifier} value={part.identifier}>
                  {part.name.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="mt-4">
          {mode === "create" ? "Créer" : "Mettre à jour"}
        </Button>
      </form>
    </Layout>
  );
}

export function GuaranteeCreate() {
  return <GuaranteeForm mode="create" />;
}

export function GuaranteeUpdate() {
  return <GuaranteeForm mode="update" />;
}
