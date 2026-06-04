"use client";

import { MessageSquare } from "lucide-react";
import EmptyState from "@/components/admin/common/EmptyState";
import EnquiriesTable from "@/components/admin/common/EnquiryTable";

export default function EnquiriesPage() {
  return (
    <div className="space-y-2">
      <div>
        <h1 className="text-3xl font-bold text-white">Enquiries</h1>
        <p className="mt-2 text-zinc-500">Manage customer enquiries</p>
      </div>
        <EnquiriesTable/>
    </div>
  );
}