import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Calendar, LogIn, LogOut } from "lucide-react";
import emblem from "@/assets/emblem-india.png";
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
  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const date = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const time = now.toLocaleTimeString("en-GB");

  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          <img src={emblem} alt="Government of India" width={56} height={56} className="w-12 h-12 sm:w-14 sm:h-14 object-contain" loading="lazy" />
          <img src={dgmLogo} alt="DGM Maharashtra" width={56} height={56} className="w-12 h-12 sm:w-14 sm:h-14 object-contain" loading="lazy" />
          <div className="leading-tight">
            <p className="font-bold text-primary text-sm sm:text-base">DIRECTORATE OF GEOLOGY AND MINING</p>
            <p className="font-serif text-foreground text-sm sm:text-base">Govt. Of Maharashtra</p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-start gap-2 text-xs text-foreground">
            <Calendar className="w-4 h-4 mt-0.5 text-primary" />
            <div className="leading-tight">
              <div>{day}</div>
              <div>{date}</div>
              <div>{time}</div>
            </div>
          </div>
          {user ? (
            <Button size="sm" variant="default" onClick={async () => { await supabase.auth.signOut(); }}>
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          ) : (
            <Link to="/auth">
              <Button size="sm"><LogIn className="w-4 h-4 mr-1" /> Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
