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
import { supabase } from './supabase/config/client';

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    supabase: typeof supabase;
  }
}

const queryClient = new QueryClient();

// Expose supabase client for debugging
if (typeof window !== 'undefined') {
  window.supabase = supabase;
}

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
  const isAuthPage = ['/login', '/signup', '/reset-password', '/auth/update-password', '/auth/callback'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-background">
      {!isAuthPage && <TokyoPromoBar />}
      {!isAuthPage && <Header />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/update-password" element={<UpdatePasswordPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
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
