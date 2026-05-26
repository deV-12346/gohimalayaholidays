import AdminSidebar from "@/components/admin/sidebar/Sidebar";
import AdminNavbar from "@/components/admin/navbar/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-400 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Fixed Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <AdminSidebar />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <AdminNavbar />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
      
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-64 right-0 h-[500px] bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}
