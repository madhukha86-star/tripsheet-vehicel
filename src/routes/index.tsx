import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Search, PlusSquare } from "lucide-react";
import { GovHeader } from "@/components/GovHeader";
import { SearchTripsheet } from "@/components/SearchTripsheet";

export const Route = createFileRoute("/")({ component: Landing });

function Landing() {
  return (
    <div className="min-h-screen bg-muted/20">
      <GovHeader />
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <SearchTripsheet />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/search-record">
            <Card className="p-5 hover:shadow-md transition cursor-pointer h-full">
              <Search className="w-7 h-7 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Search Records</h3>
              <p className="text-sm text-muted-foreground">Public search portal for tripsheet, transit pass or vehicle records.</p>
            </Card>
          </Link>
          <Link to="/add-record">
            <Card className="p-5 hover:shadow-md transition cursor-pointer h-full">
              <PlusSquare className="w-7 h-7 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Add Record (Admin)</h3>
              <p className="text-sm text-muted-foreground">Login as administrator to submit new tripsheet entries.</p>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
