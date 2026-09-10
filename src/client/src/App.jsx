import { useEffect, useState } from "react";
import { DataProvider, useData } from "./context/DataContext.jsx";
import { MonthProvider } from "./context/MonthContext.jsx";
import { getToken, clearToken } from "./lib/api.js";
import Header from "./components/Header.jsx";
import TabBar from "./components/TabBar.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import OverviewPage from "./pages/OverviewPage.jsx";
import ExpensesPage from "./pages/ExpensesPage.jsx";
import IncomePage from "./pages/IncomePage.jsx";
import BudgetsPage from "./pages/BudgetsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

function AppShell({ onLogout }) {
  const [tab, setTab] = useState("overview");
  const { loading, error } = useData();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <TabBar active={tab} onChange={setTab} />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-5">
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 text-sm">
            {error}
          </div>
        )}
        {loading ? (
          <p className="text-center text-ink/50 py-10">Loading your finances…</p>
        ) : (
          <div key={tab} className="animate-page-in">
            {tab === "overview" && <OverviewPage />}
            {tab === "expenses" && <ExpensesPage />}
            {tab === "income" && <IncomePage />}
            {tab === "budgets" && <BudgetsPage />}
            {tab === "settings" && <SettingsPage onLogout={onLogout} />}
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(() => !!getToken());

  useEffect(() => {
    function handleUnauthorized() {
      clearToken();
      setAuthed(false);
    }
    window.addEventListener("pennypilot:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("pennypilot:unauthorized", handleUnauthorized);
  }, []);

  if (!authed) {
    return <LoginPage onLoggedIn={() => setAuthed(true)} />;
  }

  return (
    <DataProvider>
      <MonthProvider>
        <AppShell onLogout={() => setAuthed(false)} />
      </MonthProvider>
    </DataProvider>
  );
}
