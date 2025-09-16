import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/Login";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthService, AuthUser } from "./auth/authService";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    return AuthService.getCurrentUser();
  });

  const handleLogin = (userType: 'user' | 'admin', email?: string) => {
    const userData = AuthService.login(userType, email);
    setUser(userData);
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {!user && <Login onLogin={handleLogin} />}
        {user?.type === 'user' && <Index onLogout={handleLogout} />}
        {user?.type === 'admin' && <AdminDashboard onLogout={handleLogout} />}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
