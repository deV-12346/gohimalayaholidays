"use client";

import { useState } from "react";
import { MapPin, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CreateDestinationModal from "@/components/admin/modals/CreateDestinationModal";
import EditDestinationModal from "@/components/admin/modals/EditDestinationModal";
import DataTable, { DataTableColumn } from "@/components/admin/common/DataTable";
import {
  useGetDestinationsQuery,
  useDeleteDestinationMutation,
} from "@/services/destinations/destinationApi";
import { Destination } from "@/services/destinations/destinationApi";

export default function DestinationsPage() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // NOTE: update useGetDestinationsQuery (and the destinationApi endpoint) to accept
  // { page, limit, search } and to return { destinations, totalCount } from the server.
  const { data, isLoading, isFetching } = useGetDestinationsQuery({
    page,
    limit: rowsPerPage,
    search,
  });
  const [deleteDestination] = useDeleteDestinationMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this destination?")) return;

    setDeletingId(id);
    try {
      const result = await deleteDestination({ destinationId: id }).unwrap();
      toast.success(result.message || "Destination deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete destination");
    } finally {
      setDeletingId(null);
    }
  };

  const columns: DataTableColumn<Destination>[] = [
    {
      header: "Image",
      cell: (destination) => (
        <div className="relative h-12 w-12 overflow-hidden rounded-lg">
          {destination.image && (
            <Image
              src={destination.image}
              alt={destination.title}
              fill
              className="object-cover"
            />
          )}
        </div>
      ),
    },
    {
      header: "Title",
      cell: (destination) => (
        <span className="font-medium text-white">{destination.title}</span>
      ),
    },
    {
      header: "Location",
      cell: (destination) => (
        <span className="text-zinc-400">{destination.destinationLocation}</span>
      ),
    },
    {
      header: "Popular Places",
      cell: (destination) => (
        <div className="flex flex-wrap gap-1">
          {destination.popularPlaces.slice(0, 3).map((place, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className="border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
            >
              {place}
            </Badge>
          ))}
          {destination.popularPlaces.length > 3 && (
            <Badge variant="outline" className="border-white/20 text-zinc-400">
              +{destination.popularPlaces.length - 3}
            </Badge>
          )}
        </div>
      ),
    },
    {
      header: "Actions",
      cell: (destination) => (
        <div className="flex gap-2">
          <EditDestinationModal destination={destination} />
          <Button
            size="icon"
            variant="outline"
            onClick={() => handleDelete(destination._id)}
            disabled={deletingId === destination._id}
            className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
          >
            {deletingId === destination._id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable<Destination>
      title="Destinations"
      description="Manage travel destinations"
      data={data?.destinations}
      isLoading={isLoading}
      isFetching={isFetching}
      columns={columns}
      keyExtractor={(destination) => destination._id}
      emptyIcon={MapPin}
      emptyTitle="No destinations found"
      emptyDescription="Create your first destination to get started"
      searchPlaceholder="Search destinations..."
      headerAction={<CreateDestinationModal />}
      totalItems={data?.totalCount ?? 0}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={setPage}
      onRowsPerPageChange={setRowsPerPage}
      onSearchChange={setSearch}
    />
  );
}
