import { useState } from "react";
import { AppProvider } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import InvoiceList from "./components/InvoiceList";
import InvoiceDetail from "./components/InvoiceDetail";
import InvoiceForm from "./components/InvoiceForm";
import styles from "./App.module.css";

function InvoiceApp() {
  const [view, setView] = useState("list"); // 'list' | 'detail'
  const [selectedId, setSelectedId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  function openDetail(id) {
    setSelectedId(id);
    setView("detail");
  }

  function openNew() {
    setEditId(null);
    setFormOpen(true);
  }

  function openEdit(id) {
    setEditId(id);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditId(null);
  }

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main} id="main-content">
        {view === "list" && (
          <InvoiceList onSelect={openDetail} onNew={openNew} />
        )}
        {view === "detail" && (
          <InvoiceDetail
            invoiceId={selectedId}
            onBack={() => setView("list")}
            onEdit={openEdit}
          />
        )}
      </main>

      {formOpen && <InvoiceForm invoiceId={editId} onClose={closeForm} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <InvoiceApp />
    </AppProvider>
  );
}
