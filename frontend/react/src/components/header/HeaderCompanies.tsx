import { CompanyType } from "@/types/company";
import ky from "ky";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function HeaderCompanies() {
  const [companies, setCompanies] = useState<CompanyType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const companiesApi = (await ky
        .get(`/express/companies`)
        .json()) as CompanyType[];
      setCompanies(companiesApi);
    };

    fetchData();
  }, []);

  const handleValueChange = (value: string) => {
    localStorage.setItem("company_id", value);
    window.location.reload();
  };

  return (
    <div className="">
      <Select
        defaultValue={localStorage.getItem("company_id") || ""}
        onValueChange={(value) => handleValueChange(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Entreprise" />
        </SelectTrigger>
        <SelectContent>
          {/* Companies */}
          {companies.map((companie) => (
            <SelectItem key={companie.identifier} value={companie.identifier}>
              {companie.name.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
