"use client";

import { useState } from "react";
import { Package, Trash2, Loader2, IndianRupee, Clock, Users } from "lucide-react";
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
import CreatePackageModal from "@/components/admin/modals/CreatePackageModal";
import EmptyState from "@/components/admin/common/EmptyState";
import { TableSkeleton } from "@/components/admin/common/LoadingSkeleton";
import {
  useGetPackagesQuery,
  useDeletePackageMutation,
} from "@/services/packages/packageApi";
import Image from "next/image";

export default function PackagesPage() {
  const { data, isLoading } = useGetPackagesQuery();
  const [deletePackage, { isLoading: isDeleting }] = useDeletePackageMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    
    setDeletingId(id);
    try {
      const result = await deletePackage({ packageId: id }).unwrap();
      toast.success(result.message || "Package deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete package");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Packages</h1>
          <p className="mt-2 text-zinc-500">Manage travel packages</p>
        </div>
        <CreatePackageModal />
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : !data?.packages || data.packages.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No packages found"
            description="Create your first package to get started"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-zinc-400">Image</TableHead>
                <TableHead className="text-zinc-400">Title</TableHead>
                <TableHead className="text-zinc-400">Price</TableHead>
                <TableHead className="text-zinc-400">Duration</TableHead>
                <TableHead className="text-zinc-400">Slots</TableHead>
                <TableHead className="text-zinc-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.packages.map((pkg) => (
                <TableRow
                  key={pkg._id}
                  className="border-white/10 hover:bg-white/5"
                >
                  <TableCell>
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                      <Image
                        src={pkg.packageImages[0]?.secure_url || "/placeholder.png"}
                        alt={pkg.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-white">
                    {pkg.title}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-emerald-400">
                      <IndianRupee className="h-4 w-4" />
                      <span className="font-semibold">{pkg.price}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-cyan-400">
                      <Clock className="h-4 w-4" />
                      <span>{pkg.duration} days</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-blue-400">
                      <Users className="h-4 w-4" />
                      <span>{pkg.slots}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleDelete(pkg._id)}
                      disabled={deletingId === pkg._id}
                      className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    >
                      {deletingId === pkg._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
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