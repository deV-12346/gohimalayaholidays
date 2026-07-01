"use client";

import { useState } from "react";
import { Package, Trash2, Loader2, IndianRupee, Clock, Users } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import CreatePackageModal from "@/components/admin/modals/CreatePackageModal";
import EditPackageModal from "@/components/admin/modals/EditPackageModal";
import DataTable, { DataTableColumn } from "@/components/admin/common/DataTable";
import {
  useGetPackagesQuery,
  useDeletePackageMutation,
} from "@/services/packages/packageApi";
import type { Pkg } from "@/models/package.model"; // adjust import path to your actual Package type

export default function PackagesPage() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // NOTE: update useGetPackagesQuery (and the packageApi endpoint) to accept
  // { page, limit, search } and to return { packages, totalCount } from the server.
  const { data, isLoading, isFetching } = useGetPackagesQuery({
    page,
    limit: rowsPerPage,
    search,
  });
  const [deletePackage] = useDeletePackageMutation();
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

  const columns: DataTableColumn<Pkg>[] = [
    {
      header: "Image",
      cell: (pkg) => (
        <div className="relative h-12 w-12 overflow-hidden rounded-lg">
          {pkg.packageImages?.[0] && (
            <Image
              src={pkg.packageImages[0].secure_url}
              alt={pkg.title}
              fill
              className="object-cover"
            />
          )}
        </div>
      ),
    },
    {
      header: "Title",
      cell: (pkg) => <span className="font-medium text-white">{pkg.title}</span>,
    },
    {
      header: "Price",
      cell: (pkg) => (
        <div className="flex items-center gap-1 text-emerald-400">
          <IndianRupee className="h-4 w-4" />
          <span className="font-semibold">{pkg.price}</span>
        </div>
      ),
    },
    {
      header: "Duration",
      cell: (pkg) => (
        <div className="flex items-center gap-1 text-cyan-400">
          <Clock className="h-4 w-4" />
          <span>{pkg.duration} days</span>
        </div>
      ),
    },
    {
      header: "Slots",
      cell: (pkg) => (
        <div className="flex items-center gap-1 text-blue-400">
          <Users className="h-4 w-4" />
          <span>{pkg.slots}</span>
        </div>
      ),
    },
    {
      header: "Actions",
      cell: (pkg) => (
        <div className="flex gap-2">
          <EditPackageModal pkg={pkg} />
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
        </div>
      ),
    },
  ];

  return (
    <DataTable<Pkg>
      title="Packages"
      description="Manage travel packages"
      data={data?.packages}
      isLoading={isLoading}
      isFetching={isFetching}
      columns={columns}
      keyExtractor={(pkg) => pkg._id}
      emptyIcon={Package}
      emptyTitle="No packages found"
      emptyDescription="Create your first package to get started"
      searchPlaceholder="Search packages..."
      headerAction={<CreatePackageModal />}
      totalItems={data?.totalCount ?? 0}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={setPage}
      onRowsPerPageChange={setRowsPerPage}
      onSearchChange={setSearch}
    />
  );
}
