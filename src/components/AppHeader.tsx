import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import { LogOut, Truck } from "lucide-react";

export function AppHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  return (
    <header className="bg-primary text-primary-foreground border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5" />
          <div>
            <h1 className="font-semibold leading-tight">Tripsheet / Vehicle Verification</h1>
            <p className="text-xs opacity-80 leading-tight">Mineral Transit Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs opacity-80 hidden sm:inline">{user?.email}</span>
          <Button size="sm" variant="secondary" onClick={logout}>
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
