import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AlternativeView from "./pages/AlternativeView";
import InconsistentRecords from "./pages/InconsistentRecords";
import DeParaMapping from "./pages/DeParaMapping";
import DeParaMappingList from "./pages/DeParaMappingList";
import EquipamentosPublicos from "./pages/EquipamentosPublicos";
import ComparacaoVPDs from "./pages/ComparacaoVPDs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard/:type" element={<Dashboard />} />
          <Route path="/alternative" element={<AlternativeView />} />
          <Route path="/inconsistent-records" element={<InconsistentRecords />} />
          <Route path="/de-para" element={<DeParaMappingList />} />
          <Route path="/de-para/:id" element={<DeParaMapping />} />
          <Route path="/equipamentos-publicos" element={<EquipamentosPublicos />} />
          <Route path="/comparacao-vpds" element={<ComparacaoVPDs />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
