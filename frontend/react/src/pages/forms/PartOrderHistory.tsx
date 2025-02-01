import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import ky from "ky";
import { Input } from "@/components/ui/input";
import { useState, useEffect, SyntheticEvent } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { PartType } from "@/types/part";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export function PartOrderHistoryForm() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [parts, setParts] = useState<PartType[]>([]);

  const [date, setDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [partIdentifier, setPartIdentifier] = useState<string>("");

  const [cost, setCost] = useState<number>(0);

  useEffect(() => {
    const fetchParts = async () => {
      const parts = await ky.get("/express/parts").json();
      setParts(parts as PartType[]);
    };
    fetchParts();
  }, []);

  const handleQuantityChange = (event: SyntheticEvent<HTMLInputElement>) => {
    const quantity = parseInt(event.currentTarget.value);
    setQuantity(quantity);

    const part = parts.find((p) => p.identifier === partIdentifier);
    if (part) {
      setCost(part.cost.value * quantity);
    }
  };

  const handlePartIdentifierChange = (value: string) => {
    setPartIdentifier(value);

    const part = parts.find((p) => p.identifier === value);
    if (part) {
      setCost(part.cost.value * quantity);
    }
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await ky.post("/express/partOrderHistory", {
        json: {
          date,
          quantity,
          partIdentifier,
        },
      });

      if (response.ok) {
        toast({
          title: "Commande créée",
        });

        // Reset form
        setDate("");
        setQuantity(0);
        setPartIdentifier("");
      }
    } catch {
      toast({
        title: "Erreur lors de la création",
      });
    }
  };

  return (
    <Layout title="Commander une pièce">
      <form className="flex flex-col gap-5 items-start" onSubmit={handleSubmit}>
        {/* Date */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Quantity */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="quantity">Quantité</Label>
          <Input
            id="quantity"
            type="number"
            placeholder="Quantité"
            value={quantity}
            onChange={handleQuantityChange}
            required
            min={1}
          />
        </div>

        {/* Part Identifier */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="partIdentifier">Pièce</Label>
          <Select
            value={partIdentifier}
            onValueChange={handlePartIdentifierChange}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Pièce" />
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

        {/* Cost */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="cost">Coût</Label>
          <Input id="cost" type="number" value={cost} disabled />
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/parts")}
          >
            Retour
          </Button>
          <Button type="submit">Créer</Button>
        </div>
      </form>
    </Layout>
  );
}

export function PartOrderHistoryCreate() {
  return <PartOrderHistoryForm />;
}
