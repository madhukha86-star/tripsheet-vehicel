import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { GovHeader } from "@/components/GovHeader";
import { AddTripsheet } from "@/components/AddTripsheet";

export const Route = createFileRoute("/add-record")({ component: AddRecord });

function AddRecord() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  if (loading || !session) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <GovHeader />
      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="mb-3 text-sm">
          <Link to="/search-record" className="text-primary underline">Go to Search</Link>
        </div>
        <AddTripsheet />
      </main>
    </div>
  );
}
