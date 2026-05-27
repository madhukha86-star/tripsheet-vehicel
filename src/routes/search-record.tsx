import { createFileRoute, Link } from "@tanstack/react-router";
import { SearchTripsheet } from "@/components/SearchTripsheet";
import { Truck } from "lucide-react";

export const Route = createFileRoute("/search-record")({ component: SearchRecord });

function SearchRecord() {
  return (
    <div className="min-h-screen bg-muted/20">
      <header className="bg-primary text-primary-foreground border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <Link to="/" className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            <div>
              <h1 className="font-semibold leading-tight">Tripsheet / Vehicle Verification</h1>
              <p className="text-xs opacity-80 leading-tight">Public Search Portal</p>
            </div>
          </Link>
          <Link to="/add-record" className="text-xs underline opacity-90">Admin Login</Link>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <SearchTripsheet />
      </main>
    </div>
  );
}
