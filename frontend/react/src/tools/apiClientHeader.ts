import ky from "ky";

export const createApiClientHeader = () => {
  const companyId = localStorage.getItem("company_id") || "";
  return ky.create({
    headers: {
      "Content-Type": "application/json",
      "Company-Identifier": companyId,
    },
  });
};
