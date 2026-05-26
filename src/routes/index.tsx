import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AppHeader } from "@/components/AppHeader";
import { SearchTripsheet } from "@/components/SearchTripsheet";
import { AddTripsheet } from "@/components/AddTripsheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
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
      <AppHeader />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Tabs defaultValue="search">
          <TabsList>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="add">Add Data</TabsTrigger>
          </TabsList>
          <TabsContent value="search" className="mt-4"><SearchTripsheet /></TabsContent>
          <TabsContent value="add" className="mt-4"><AddTripsheet /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
