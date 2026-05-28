import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Calendar, LogIn, LogOut } from "lucide-react";
import dgmLogo from "@/assets/dgm-logo.png";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

function useNow() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function GovHeader() {
  const now = useNow();
  const { user } = useAuth();
  const date = now.toLocaleDateString("en-GB");
  const time = now.toLocaleTimeString("en-GB");

  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-3 py-2 sm:py-3 flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2 min-w-0 flex-1">
          <img src={dgmLogo} alt="DGM Maharashtra" className="w-10 h-10 sm:w-14 sm:h-14 object-contain shrink-0" loading="lazy" />
          <div className="leading-tight min-w-0">
            <p className="font-bold text-primary text-[11px] sm:text-base truncate">DIRECTORATE OF GEOLOGY AND MINING</p>
            <p className="font-serif text-foreground text-[10px] sm:text-sm">Govt. Of Maharashtra</p>
            <p className="sm:hidden flex items-center gap-1 text-[10px] text-muted-foreground">
              <Calendar className="w-3 h-3" /> {date} {time}
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1 text-xs text-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{date} {time}</span>
          </div>
          {user ? (
            <Button size="sm" variant="default" onClick={async () => { await supabase.auth.signOut(); }}>
              <LogOut className="w-4 h-4 sm:mr-1" /> <span className="hidden sm:inline">Logout</span>
            </Button>
          ) : (
            <Link to="/auth">
              <Button size="sm"><LogIn className="w-4 h-4 sm:mr-1" /> <span className="hidden sm:inline">Login</span></Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
