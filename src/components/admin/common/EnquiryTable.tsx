"use client";
import { Enquiry } from "@/models/enquiry.model";
import { useGetEnquiriesQuery } from "@/services/enquiries/enquiriesApi";
import { useState } from "react";

export default function EnquiriesTable() {
  const { data, isLoading, isError, refetch } = useGetEnquiriesQuery();
  const [search, setSearch] = useState("");

  const filtered = data?.equiries.filter((e) =>
    [e.name, e.email, e.phoneNumber, e.message]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (isLoading) return <EnquiriesSkeleton />;

  if (isError)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-red-500 font-medium">Failed to load enquiries.</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500 mt-0.5">
            {filtered?.length ?? 0} total enquiries
          </p>
        </div>
        <input
          type="text"
          placeholder="Search by name, email, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-md">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">#</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Phone</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Message</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered && filtered.length > 0 ? (
                filtered.map((enquiry, index) => (
                  <EnquiryRow key={enquiry._id} enquiry={enquiry} index={index + 1} />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    No enquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function EnquiryRow({ enquiry, index }: { enquiry: Enquiry; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <tr className="transition-colors text-md">
      <td className="px-4 py-3 text-gray-400 font-mono">{index}</td>
      <td className="px-4 py-3 font-medium text-gray-200 whitespace-nowrap">
        {enquiry.name}
      </td>
      <td className="px-4 py-3 text-gray-200">
        <a href={`mailto:${enquiry.email}`} className="hover:text-indigo-600">
          {enquiry.email}
        </a>
      </td>
      <td className="px-4 py-3 text-gray-200 whitespace-nowrap">
        <a href={`tel:${enquiry.phoneNumber}`} className="hover:text-indigo-600">
          {enquiry.phoneNumber}
        </a>
      </td>
      <td className="px-4 py-3 text-gray-200 max-w-xs">
        <span
          className={`block ${!expanded ? "truncate" : ""} cursor-pointer`}
          onClick={() => setExpanded(!expanded)}
          title={!expanded ? enquiry.message : undefined}
        >
          {enquiry.message}
        </span>
        {enquiry.message.length > 60 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-indigo-500 text-xs mt-0.5 hover:underline"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </td>
      <td className="px-4 py-3 text-gray-200 whitespace-nowrap ">
        {enquiry.createdAt
          ? new Date(enquiry.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "—"}
      </td>
    </tr>
  );
}

function EnquiriesSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="h-9 w-64 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {["#", "Name", "Email", "Phone", "Message", "Date"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="h-4 bg-gray-100 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}