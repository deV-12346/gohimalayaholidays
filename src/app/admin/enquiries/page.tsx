"use client";

import { MessageSquare } from "lucide-react";
import EmptyState from "@/components/admin/common/EmptyState";

export default function EnquiriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Enquiries</h1>
        <p className="mt-2 text-zinc-500">Manage customer enquiries</p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <EmptyState
          icon={MessageSquare}
          title="No enquiries yet"
          description="Customer enquiries will appear here"
        />
      </div>
    </div>
  );
}