import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Truck, Search, PlusSquare } from "lucide-react";

export const Route = createFileRoute("/")({ component: Landing });

function Landing() {
  return (
    <div className="min-h-screen bg-muted/20">
      <header className="bg-primary text-primary-foreground border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-2">
          <Truck className="w-6 h-6" />
          <div>
            <h1 className="font-semibold leading-tight">Tripsheet / Vehicle Verification</h1>
            <p className="text-xs opacity-80 leading-tight">Mineral Transit Portal</p>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold mb-2">Welcome</h2>
        <p className="text-muted-foreground mb-8">Choose an option to continue.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/search-record">
            <Card className="p-6 hover:shadow-md transition cursor-pointer h-full">
              <Search className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-1">Search Records</h3>
              <p className="text-sm text-muted-foreground">Publicly search tripsheet, transit pass or vehicle records and download PDFs.</p>
            </Card>
          </Link>
          <Link to="/add-record">
            <Card className="p-6 hover:shadow-md transition cursor-pointer h-full">
              <PlusSquare className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-1">Add Record (Admin)</h3>
              <p className="text-sm text-muted-foreground">Login as administrator to submit new tripsheet entries.</p>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
