import React from 'react';
import { MissionControl } from './components/MissionControl';
import { Toaster } from 'react-hot-toast';
import './App.css';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { TokyoPromoBar } from "./components/TokyoPromoBar";
import Header from "./components/Header";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'hsl(220 25% 8%)',
              color: '#fff',
              border: '1px solid hsl(220 25% 15%)',
            },
            success: {
              iconTheme: {
                primary: 'hsl(320 100% 65%)',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: 'hsl(0 100% 65%)',
                secondary: '#fff',
              },
            },
          }}
        />
        <Sonner />
        <div className="min-h-screen bg-background">
          <TokyoPromoBar />
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
