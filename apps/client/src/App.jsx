import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RoleMaster from "./pages/RoleMaster";
import LabourMaster from "./pages/LabourMaster";
import ProductMaster from "./pages/ProductMaster";
import ProductionEntry from "./pages/ProductionEntry";
import WeeklySalary from "./pages/WeeklySalary";
import Payments from "./pages/Payments";

const queryClient = new QueryClient();

//Protected Route wrapper
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="roles" element={<RoleMaster />} />
              <Route path="labours" element={<LabourMaster />} />
              <Route path="products" element={<ProductMaster />} />
              <Route path="production" element={<ProductionEntry />} />
              <Route path="salary" element={<WeeklySalary />} />
              <Route path="payments" element={<Payments />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
