
import React, { useEffect } from 'react';
import { MissionControl } from './components/MissionControl';
import { Toaster } from 'react-hot-toast';
import './App.css';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { TokyoPromoBar } from "./components/TokyoPromoBar";
import Header from "./components/Header";
import { LoginPage } from './pages/auth/LoginPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { UpdatePasswordPage } from './pages/auth/UpdatePasswordPage';
import { AuthCallbackPage } from './pages/auth/AuthCallbackPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuthStore } from './lib/store/auth';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";

const queryClient = new QueryClient();

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, session, loading } = useAuthStore();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        useAuthStore.setState({ 
          user: session?.user ?? null, 
          session,
          loading: false
        });
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      useAuthStore.setState({ 
        user: session?.user ?? null, 
        session,
        loading: false
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  return <>{children}</>;
};

const AppContent = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const isAuthPage = ['/login', '/signup', '/reset-password', '/auth/update-password', '/auth/callback'].includes(location.pathname);
  const isDashboard = location.pathname === '/dashboard';

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/update-password" element={<UpdatePasswordPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
        </Routes>
      </div>
    );
  }

  if (user && isDashboard) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-col min-h-screen">
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="flex-1" />
              </header>
              <div className="flex-1 p-4">
                <Routes>
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <MissionControl />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TokyoPromoBar />
      <Header />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MissionControl />
            </ProtectedRoute>
          }
        />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
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
          <AppContent />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
