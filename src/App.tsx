import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import Proveedores from "./pages/Proveedores";
import Almacenes from "./pages/Almacenes";
import Formulas from "./pages/Formulas";
import Pedidos from "./pages/Pedidos";
import Contactos from "./pages/Contactos";
import Bancos from "./pages/Bancos";
import Pagos from "./pages/Pagos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/proveedores" element={<Proveedores />} />
          <Route path="/almacenes" element={<Almacenes />} />
          <Route path="/formulas" element={<Formulas />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/contactos" element={<Contactos />} />
          <Route path="/bancos" element={<Bancos />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
