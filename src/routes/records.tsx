import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { GovHeader } from "@/components/GovHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, ExternalLink, Download } from "lucide-react";
import { downloadTripsheetPdf } from "@/lib/tripsheet-pdf";
import type { Tripsheet } from "@/components/SearchTripsheet";

export const Route = createFileRoute("/records")({ component: RecordsPage });

function RecordsPage() {
  const { session, loading, user } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Tripsheet[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  const load = async () => {
    setBusy(true);
    const { data, error } = await supabase
      .from("tripsheets")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    setBusy(false);
    if (error) return toast.error(error.message);
    setRows((data as Tripsheet[]) ?? []);
  };

  useEffect(() => {
    if (session) load();
  }, [session]);

  const remove = async (id: string) => {
    if (!confirm("Delete this record?")) return;
    const { error } = await supabase.from("tripsheets").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    setRows((p) => p.filter((r) => r.id !== id));
  };

  if (loading || !session) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <GovHeader />
      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Saved Records ({rows.length})</h2>
          <Link to="/add-record" className="text-primary text-sm underline">+ Add new</Link>
        </div>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <th className="p-2">Sr.No</th>
                  <th className="p-2">Transit Pass No</th>
                  <th className="p-2">Vehicle</th>
                  <th className="p-2">Mineral</th>
                  <th className="p-2">Issue Date</th>
                  <th className="p-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {busy && <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">Loading...</td></tr>}
                {!busy && rows.length === 0 && <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">No records</td></tr>}
                {rows.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-2">{(r as any).sr_no ?? "-"}</td>
                    <td className="p-2 font-mono">{r.transit_pass_number ?? "-"}</td>
                    <td className="p-2">{r.vehicle_number ?? "-"}</td>
                    <td className="p-2">{r.mineral_name_grade ?? "-"}</td>
                    <td className="p-2">{r.issue_date ?? "-"}</td>
                    <td className="p-2">
                      <div className="flex justify-end gap-1 flex-wrap">
                        <Link to="/record/$id" params={{ id: r.id }}>
                          <Button size="sm" variant="outline"><ExternalLink className="w-3 h-3" /></Button>
                        </Link>
                        <Button size="sm" variant="outline" onClick={() => downloadTripsheetPdf(r)}>
                          <Download className="w-3 h-3" />
                        </Button>
                        {user?.id === (r as any).created_by && (
                          <Button size="sm" variant="destructive" onClick={() => remove(r.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
