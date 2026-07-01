"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import DataTable, { DataTableColumn } from "@/components/admin/common/DataTable";
import { useGetEnquiriesQuery } from "@/services/enquiries/enquiriesApi";
import type { Enquiry } from "@/models/enquiry.model";

function MessageCell({ message }: { message: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="max-w-xs">
      <span
        className={`block ${!expanded ? "truncate" : ""} cursor-pointer`}
        onClick={() => setExpanded(!expanded)}
        title={!expanded ? message : undefined}
      >
        {message}
      </span>
      {message.length > 60 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-indigo-500 text-xs mt-0.5 hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

export default function EnquiriesPage() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // NOTE: update useGetEnquiriesQuery (and the enquiriesApi endpoint) to accept
  // { page, limit, search } and to return { equiries, totalCount } from the server.
  const { data, isLoading, isFetching } = useGetEnquiriesQuery({
    page,
    limit: rowsPerPage,
    search,
  });

  const columns: DataTableColumn<Enquiry>[] = [
    {
      header: "Name",
      cell: (enquiry) => (
        <span className="font-medium text-white">{enquiry.name}</span>
      ),
    },
    {
      header: "Email",
      cell: (enquiry) => (
        <a
          href={`mailto:${enquiry.email}`}
          className="text-zinc-300 hover:text-indigo-400"
        >
          {enquiry.email}
        </a>
      ),
    },
    {
      header: "Phone",
      cell: (enquiry) => (
        <a
          href={`tel:${enquiry.phoneNumber}`}
          className="text-zinc-300 hover:text-indigo-400"
        >
          {enquiry.phoneNumber}
        </a>
      ),
    },
    {
      header: "Message",
      cell: (enquiry) => <MessageCell message={enquiry.message} />,
    },
    {
      header: "Date",
      cell: (enquiry) => (
        <span className="text-zinc-400">
          {enquiry.createdAt
            ? new Date(enquiry.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "—"}
        </span>
      ),
    },
  ];

  return (
    <DataTable<Enquiry>
      title="Enquiries"
      description="Manage customer enquiries"
      data={data?.equiries}
      isLoading={isLoading}
      isFetching={isFetching}
      columns={columns}
      keyExtractor={(enquiry) => enquiry._id}
      emptyIcon={MessageSquare}
      emptyTitle="No enquiries found"
      emptyDescription="No enquiries yet"
      searchPlaceholder="Search by name, email, phone..."
      totalItems={data?.totalCount ?? 0}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={setPage}
      onRowsPerPageChange={setRowsPerPage}
      onSearchChange={setSearch}
    />
  );
}
