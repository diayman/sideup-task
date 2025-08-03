import "./App.css";
import Dashboard from "./pages/Dashboard";
import { SidebarProvider } from "./context/SidebarContext";

function App() {
  return (
    <SidebarProvider>
      <Dashboard />
    </SidebarProvider>
  );
}

export default App;
