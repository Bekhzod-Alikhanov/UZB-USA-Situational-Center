"use client";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { commitments, type Commitment, type CommitmentStatus } from "@/data/commitments";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Search } from "lucide-react";
import { useTranslations } from "next-intl";

const STATUS_COLOR: Record<CommitmentStatus, string> = {
  done: "border-[var(--color-pos)]/30 bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  progress: "border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  watch: "border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  overdue: "border-[var(--color-neg)]/30 bg-[var(--color-neg-soft)] text-[var(--color-neg)]",
};

const VALID_STATUSES: ReadonlyArray<CommitmentStatus | "all"> = ["all", "done", "progress", "watch", "overdue"];

export function CommitmentsTable() {
  const ts = useTranslations("commitments.statuses");
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialStatus = (() => {
    const q = searchParams.get("status");
    return (VALID_STATUSES.includes(q as CommitmentStatus | "all") ? q : "all") as CommitmentStatus | "all";
  })();

  const [sorting, setSorting] = useState<SortingState>([{ id: "dueDate", desc: false }]);
  const [statusFilter, setStatusFilter] = useState<CommitmentStatus | "all">(initialStatus);
  const [search, setSearch] = useState(searchParams.get("q") ?? "");

  // Sync URL <-> state
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (statusFilter === "all") params.delete("status");
    else params.set("status", statusFilter);
    if (!search) params.delete("q");
    else params.set("q", search);
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : "?", { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, search]);

  const data = useMemo(
    () =>
      commitments.filter((c) => {
        if (statusFilter !== "all" && c.status !== statusFilter) return false;
        if (search && !`${c.title} ${c.owner}`.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [statusFilter, search],
  );

  const columns = useMemo<ColumnDef<Commitment>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ getValue }) => <span className="mono text-[11px] text-[var(--color-ink-muted)]">{String(getValue())}</span>,
      },
      {
        accessorKey: "title",
        header: "Commitment",
        cell: ({ row }) => <span className="font-medium text-[var(--color-ink)]">{row.original.title}</span>,
      },
      {
        accessorKey: "owner",
        header: "Owner",
        cell: ({ row }) => <span className="text-[var(--color-ink-muted)]">{row.original.owner}</span>,
      },
      {
        accessorKey: "sphere",
        header: "Sphere",
        cell: ({ row }) => (
          <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 py-0.5 text-[10.5px] uppercase tracking-wider text-[var(--color-ink-muted)]">
            {row.original.sphere}
          </span>
        ),
      },
      {
        accessorKey: "dueDate",
        header: "Due",
        cell: ({ getValue }) => <span className="mono text-[12px]">{String(getValue())}</span>,
      },
      {
        accessorKey: "progressPct",
        header: "Progress",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
              <div
                className="h-full rounded-full bg-[var(--color-primary)]"
                style={{ width: `${row.original.progressPct}%` }}
              />
            </div>
            <span className="mono text-[11px] text-[var(--color-ink-muted)] tabular">
              {row.original.progressPct}%
            </span>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider",
              STATUS_COLOR[row.original.status],
            )}
          >
            {ts(row.original.status)}
          </span>
        ),
      },
    ],
    [ts],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 12 } },
  });

  const counts = commitments.reduce<Record<string, number>>((acc, c) => {
    acc[c.status] = (acc[c.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {(["all", "done", "progress", "watch", "overdue"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={cn(
                "rounded-md border px-2.5 py-1 text-[11.5px] font-medium transition",
                statusFilter === s
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]",
              )}
            >
              {s === "all" ? "All" : ts(s)}
              {s !== "all" ? (
                <span className="ml-1 text-[10px] opacity-70">{counts[s] ?? 0}</span>
              ) : (
                <span className="ml-1 text-[10px] opacity-70">{commitments.length}</span>
              )}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[12px]">
          <Search className="size-3.5 text-[var(--color-ink-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by title or owner"
            className="w-56 bg-transparent outline-none placeholder:text-[var(--color-ink-faint)]"
          />
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} className="select-none">
                    <button
                      type="button"
                      onClick={h.column.getToggleSortingHandler()}
                      className="flex items-center gap-1"
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getIsSorted() === "asc" ? (
                        <ArrowUp className="size-3" />
                      ) : h.column.getIsSorted() === "desc" ? (
                        <ArrowDown className="size-3" />
                      ) : null}
                    </button>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-[12px] text-[var(--color-ink-muted)]">
        <div>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 disabled:opacity-40"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
