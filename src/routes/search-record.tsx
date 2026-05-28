import { createFileRoute } from "@tanstack/react-router";
import { SearchTripsheet } from "@/components/SearchTripsheet";
import { GovHeader } from "@/components/GovHeader";

export const Route = createFileRoute("/search-record")({ component: SearchRecord });

function SearchRecord() {
  return (
    <div className="min-h-screen bg-muted/20">
      <GovHeader />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">Search Data by Tripsheet/Vehicle Verification</h2>
        <SearchTripsheet />
      </main>
    </div>
  );
}
