import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/option";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await getServerSession(authOptions);

  return (
    <AdminLayoutClient
      user={session?.user}
    >
      {children}
    </AdminLayoutClient>
  );
}