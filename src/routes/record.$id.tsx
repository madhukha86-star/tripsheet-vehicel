import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tripsheet } from "@/components/SearchTripsheet";
import { TripsheetDetails } from "@/components/TripsheetDetails";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Truck } from "lucide-react";
import { downloadTripsheetPdf } from "@/lib/tripsheet-pdf";

export const Route = createFileRoute("/record/$id")({ component: RecordView });

function RecordView() {
  const { id } = useParams({ from: "/record/$id" });
  const [record, setRecord] = useState<Tripsheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data, error } = await supabase.from("tripsheets").select("*").eq("id", id).maybeSingle();
      if (!alive) return;
      if (error) setError(error.message);
      setRecord((data as Tripsheet) ?? null);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [id]);

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="bg-primary text-primary-foreground border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            <h1 className="font-semibold">Tripsheet Record</h1>
          </Link>
          <Link to="/search-record" className="text-xs underline opacity-90">Search</Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6">
        {loading && <p className="text-muted-foreground">Loading record...</p>}
        {!loading && error && <p className="text-destructive">{error}</p>}
        {!loading && !record && !error && (
          <Card className="p-6 text-center">
            <p className="font-medium">Record not found</p>
            <p className="text-sm text-muted-foreground mt-1">The requested tripsheet does not exist.</p>
          </Card>
        )}
        {record && (
          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 p-4 border-b bg-muted/30">
              <div>
                <h2 className="font-semibold">Tripsheet Code: {record.tripsheet_code}</h2>
                <p className="text-xs text-muted-foreground">Transit Pass: {record.transit_pass_number ?? "—"}</p>
              </div>
              <Button size="sm" onClick={() => downloadTripsheetPdf(record)}>
                <Download className="w-4 h-4 mr-1" /> Download PDF
              </Button>
            </div>
            <div className="p-4">
              <TripsheetDetails record={record} />
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
