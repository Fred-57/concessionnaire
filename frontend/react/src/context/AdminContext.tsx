import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminContextType {
  isAdmin: boolean;
  toggleAdmin: (value: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("is_admin") === "true"
  );

  const toggleAdmin = (value: boolean) => {
    setIsAdmin(value);
    localStorage.setItem("is_admin", value.toString());
  };

  useEffect(() => {
    const storedIsAdmin = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(storedIsAdmin);
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, toggleAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
