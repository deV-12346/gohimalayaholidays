"use client";

import { ReactNode, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search, LucideIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/admin/common/EmptyState";
import { TableSkeleton } from "@/components/admin/common/LoadingSkeleton";

export interface DataTableColumn<T> {
  /** Column header label */
  header: string;
  /** Renders the cell content for a given row */
  cell: (row: T) => ReactNode;
  /** Optional extra classes for the <TableCell> (desktop table only) */
  className?: string;
  /**
   * Hide this column in the mobile card view (e.g. redundant info, or an
   * image thumbnail that doesn't work as a label:value row). Defaults to false.
   */
  hideOnMobile?: boolean;
}

export interface DataTableProps<T> {
  title: string;
  description: string;
  data: T[] | undefined;
  isLoading: boolean;
  isFetching?: boolean;
  columns: DataTableColumn<T>[];
  keyExtractor: (row: T) => string;
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
  searchPlaceholder?: string;
  headerAction?: ReactNode;
  rowsPerPageOptions?: number[];

  /* --- server-side pagination / search --- */
  totalItems: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onSearchChange: (term: string) => void;
  searchDebounceMs?: number;

  /* --- mobile card layout --- */
  /**
   * Header of the column to use as each mobile card's title (e.g. "Customer",
   * "Title"). Defaults to the first column's header.
   */
  mobileCardTitleColumn?: string;
  /**
   * Header of the column to render as a bottom action row on mobile cards
   * (e.g. "Actions"). If found, it's pulled out of the label:value list and
   * shown as a right-aligned row at the bottom of the card. Defaults to "Actions".
   */
  mobileActionsColumn?: string;
}

export default function DataTable<T>({
  title,
  description,
  data,
  isLoading,
  isFetching = false,
  columns,
  keyExtractor,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  searchPlaceholder = "Search...",
  headerAction,
  rowsPerPageOptions = [10, 20, 50, 100],
  totalItems,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onSearchChange,
  searchDebounceMs = 400,
  mobileCardTitleColumn,
  mobileActionsColumn = "Actions",
}: DataTableProps<T>) {
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const handle = setTimeout(() => {
      onSearchChange(searchInput.trim());
    }, searchDebounceMs);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const rows = data ?? [];
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const rangeStart = totalItems === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const rangeEnd = Math.min(page * rowsPerPage, totalItems);

  const handleSearchInput = (value: string) => {
    setSearchInput(value);
    onPageChange(1);
  };

  const handleRowsPerPageChange = (value: number) => {
    onRowsPerPageChange(value);
    onPageChange(1);
  };

  // Split columns for the mobile card view: a title column, an actions
  // column (rendered at the bottom), and the rest as label:value rows.
  const titleHeader = mobileCardTitleColumn ?? columns[0]?.header;
  const titleCol = columns.find((c) => c.header === titleHeader);
  const actionsCol = columns.find((c) => c.header === mobileActionsColumn);
  const bodyCols = columns.filter(
    (c) =>
      c.header !== titleCol?.header &&
      c.header !== actionsCol?.header &&
      !c.hideOnMobile
  );

  const paginationFooter = (
    <div className="mt-4 flex flex-col gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
        <span>Rows per page</span>
        <select
          value={rowsPerPage}
          onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
          className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-white focus:outline-none"
        >
          {rowsPerPageOptions.map((opt) => (
            <option key={opt} value={opt} className="bg-zinc-900">
              {opt}
            </option>
          ))}
        </select>
        <span className="hidden sm:inline">
          · Showing {rangeStart}-{rangeEnd} of {totalItems}
        </span>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button
          size="icon"
          variant="outline"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="min-w-[90px] text-center text-sm text-zinc-400">
          Page {page} of {totalPages}
        </span>
        <Button
          size="icon"
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          className="border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header: stacks on phone, splits into a row from tablet (sm) up,
          title/search/action wrap independently on narrow tablets. */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-zinc-500 sm:mt-2 sm:text-base">
            {description}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64 lg:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder={searchPlaceholder}
              value={searchInput}
              onChange={(e) => handleSearchInput(e.target.value)}
              className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-zinc-500"
            />
          </div>
          {headerAction}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:rounded-3xl sm:p-6">
        {isLoading ? (
          <TableSkeleton rows={rowsPerPage} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={searchInput ? "Try a different search term" : emptyDescription}
          />
        ) : (
          <>
            {/* Desktop / tablet: real table, scrolls horizontally if it ever
                doesn't fit (e.g. many columns on a tablet in portrait). */}
            <div
              className={`hidden overflow-x-auto md:block ${
                isFetching ? "opacity-60 transition-opacity" : ""
              }`}
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    {columns.map((col) => (
                      <TableHead key={col.header} className="text-zinc-400">
                        {col.header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={keyExtractor(row)}
                      className="border-white/10 hover:bg-white/5"
                    >
                      {columns.map((col) => (
                        <TableCell key={col.header} className={col.className}>
                          {col.cell(row)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Phone: stacked cards instead of a cramped, scrolling table. */}
            <div
              className={`space-y-3 md:hidden ${
                isFetching ? "opacity-60 transition-opacity" : ""
              }`}
            >
              {rows.map((row) => (
                <div
                  key={keyExtractor(row)}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  {titleCol && (
                    <div className="mb-3 text-base">{titleCol.cell(row)}</div>
                  )}
                  <div
                    className={`space-y-2 ${
                      titleCol ? "border-t border-white/10 pt-3" : ""
                    }`}
                  >
                    {bodyCols.map((col) => (
                      <div
                        key={col.header}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <span className="shrink-0 text-zinc-500">{col.header}</span>
                        <span className="text-right text-white">{col.cell(row)}</span>
                      </div>
                    ))}
                  </div>
                  {actionsCol && (
                    <div className="mt-3 flex justify-end gap-2 border-t border-white/10 pt-3">
                      {actionsCol.cell(row)}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {paginationFooter}
          </>
        )}
      </div>
    </div>
  );
}
