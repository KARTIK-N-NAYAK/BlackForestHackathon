import { useState } from "react";
import { MessageSquare, Database, FileSpreadsheet, Shield } from "lucide-react";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import Templates from "./pages/Templates";
import "./index.css";

type Page = "chat" | "dashboard" | "templates";

const NAV = [
  { id: "chat" as Page,       label: "KI-Assistent",        icon: MessageSquare   },
  { id: "dashboard" as Page,  label: "Wissensbasis",         icon: Database        },
  { id: "templates" as Page,  label: "Vorlagen ausfüllen",   icon: FileSpreadsheet },
];

const PAGE_TITLES: Record<Page, string> = {
  chat:      "KI-Assistent – Energiewende",
  dashboard: "Wissensbasis verwalten",
  templates: "Vorlagen ausfüllen",
};

export default function App() {
  const [page, setPage] = useState<Page>("chat");
  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-logo">
          <h1>🏛️ Kommunaler KI-Assistent</h1>
          <p>Energiewende &amp; Wärmeplanung</p>
        </div>
        <div className="sidebar-nav">
          {NAV.map(item => (
            <div key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => setPage(item.id)}>
              <item.icon size={16} />
              {item.label}
            </div>
          ))}
        </div>
        <div className="sidebar-footer">
          <Shield size={11} style={{ display: "inline", marginRight: 4 }} />
          <span>Lokal &amp; DSGVO-konform</span><br />
          Keine Daten verlassen Ihr System
        </div>
      </nav>
      <div className="main">
        <div className="topbar">
          <h2>{PAGE_TITLES[page]}</h2>
          <span className="badge badge-green">● Lokal</span>
          <span className="badge badge-blue">Mistral (Ollama)</span>
        </div>
        {page === "chat"      && <Chat />}
        {page === "dashboard" && <Dashboard />}
        {page === "templates" && <Templates />}
      </div>
    </div>
  );
}
