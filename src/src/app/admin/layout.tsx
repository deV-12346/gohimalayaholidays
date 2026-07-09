import AdminLayoutClient from "./AdminLayoutClient";
import AuthProvider from "@/providers/AuthProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminLayoutClient>
        {children}
      </AdminLayoutClient>
    </AuthProvider>
  );
}