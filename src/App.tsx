import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppStoreProvider } from "@/store/appStore";
import Layout from "./components/Layout";
import StoreManagerLayout from "./components/StoreManagerLayout";
import Dashboard from "./pages/Dashboard";
import StoreManagerDashboard from "./pages/StoreManagerDashboard";
import RegionalManagerDashboard from "./pages/RegionalManagerDashboard";
import MaterialRequestForm from "./pages/MaterialRequestForm";
import ShipmentStatus from "./pages/ShipmentStatus";
import TicketLogs from "./pages/TicketLogs";
import Reports from "./pages/Reports";
import TicketList from "./pages/TicketList";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import EngineerDashboard from "./pages/EngineerDashboard";
import Returns from "./pages/Returns";
import EngineerReports from "./pages/EngineerReports";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppStoreProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            
            {/* Store Manager Routes */}
            <Route path="/store-manager/dashboard" element={
              <ProtectedRoute>
                <StoreManagerLayout>
                  <StoreManagerDashboard />
                </StoreManagerLayout>
              </ProtectedRoute>
            } />
            <Route path="/store-manager/shipments" element={
              <ProtectedRoute>
                <StoreManagerLayout>
                  <ShipmentStatus />
                </StoreManagerLayout>
              </ProtectedRoute>
            } />
            <Route path="/store-manager/logs" element={
              <ProtectedRoute>
                <StoreManagerLayout>
                  <TicketLogs />
                </StoreManagerLayout>
              </ProtectedRoute>
            } />
            <Route path="/store-manager/reports" element={
              <ProtectedRoute>
                <StoreManagerLayout>
                  <Reports />
                </StoreManagerLayout>
              </ProtectedRoute>
            } />
            
            {/* Regional Manager Routes */}
            <Route path="/regional-manager/dashboard" element={<ProtectedRoute><RegionalManagerDashboard /></ProtectedRoute>} />
            <Route path="/regional-manager/mr-form" element={<ProtectedRoute><MaterialRequestForm /></ProtectedRoute>} />
            
            {/* Engineer Routes */}
            <Route path="/engineer-dashboard" element={<ProtectedRoute><EngineerDashboard /></ProtectedRoute>} />
            <Route path="/engineer/returns" element={<ProtectedRoute><Returns /></ProtectedRoute>} />
            <Route path="/engineer/reports" element={<ProtectedRoute><EngineerReports /></ProtectedRoute>} />
            <Route path="/material-request-form" element={<ProtectedRoute><MaterialRequestForm /></ProtectedRoute>} />
            
            {/* Regular User Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/tickets" element={
              <ProtectedRoute>
                <Layout>
                  <TicketList />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppStoreProvider>
  </QueryClientProvider>
);

export default App;
