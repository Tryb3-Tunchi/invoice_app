import { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { SEED_INVOICES } from "../utils/seedData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useLocalStorage("invoice-theme", "dark");
  const [invoices, setInvoices] = useLocalStorage("invoices", SEED_INVOICES);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  function addInvoice(invoice) {
    setInvoices((prev) => [invoice, ...prev]);
  }

  function updateInvoice(id, data) {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, ...data } : inv)),
    );
  }

  function deleteInvoice(id) {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  }

  function markAsPaid(id) {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "paid" } : inv)),
    );
  }

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        invoices,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        markAsPaid,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
