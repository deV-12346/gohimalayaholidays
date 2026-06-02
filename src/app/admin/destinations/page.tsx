"use client";

import { useState } from "react";
import { MapPin, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CreateDestinationModal from "@/components/admin/modals/CreateDestinationModal";
import EditDestinationModal from "@/components/admin/modals/EditDestinationModal";
import EmptyState from "@/components/admin/common/EmptyState";
import { TableSkeleton } from "@/components/admin/common/LoadingSkeleton";
import {
  useGetDestinationsQuery,
  useDeleteDestinationMutation,
} from "@/services/destinations/destinationApi";
import Image from "next/image";

export default function DestinationsPage() {
  const { data, isLoading } = useGetDestinationsQuery();
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Destinations</h1>
          <p className="mt-2 text-zinc-500">Manage travel destinations</p>
        </div>
        <CreateDestinationModal />
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : !data?.destinations || data.destinations.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="No destinations found"
            description="Create your first destination to get started"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-zinc-400">Image</TableHead>
                <TableHead className="text-zinc-400">Title</TableHead>
                <TableHead className="text-zinc-400">Location</TableHead>
                <TableHead className="text-zinc-400">Popular Places</TableHead>
                <TableHead className="text-zinc-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.destinations.map((destination) => (
                <TableRow
                  key={destination._id}
                  className="border-white/10 hover:bg-white/5"
                >
                  <TableCell>
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
                  </TableCell>
                  <TableCell className="font-medium text-white">
                    {destination.title}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {destination.destinationLocation}
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}