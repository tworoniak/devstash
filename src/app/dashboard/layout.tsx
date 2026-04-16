import { TopBar } from "@/components/layout/top-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar placeholder */}
        <aside className="w-56 shrink-0 border-r border-border bg-background overflow-y-auto p-4">
          <h2 className="text-sm font-semibold text-muted-foreground">Sidebar</h2>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
