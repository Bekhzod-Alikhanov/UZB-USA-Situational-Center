"use client";
import dynamic from "next/dynamic";
import { useSearch } from "@/lib/store/search";

/**
 * Lazy wrapper for the global Cmd-K command palette.
 *
 * Why: the real <SearchCommand /> bundles Fuse.js, cmdk, Radix Dialog, plus
 * the visits/counterparts/investments/agreements datasets — ~30 KB extra on
 * every route's first-load JS, even though most users never press Cmd-K.
 *
 * How: subscribe to the same `useSearch` store the keyboard shortcut and
 * Topbar button already toggle. The heavy module is `import()`-ed only after
 * the user opens the palette for the first time. Once loaded it stays in
 * memory for the rest of the session, so subsequent opens are instant.
 */
const SearchCommandImpl = dynamic(() => import("./SearchCommand").then((m) => ({ default: m.SearchCommand })), {
  ssr: false,
  loading: () => null,
});

export function SearchCommandLazy() {
  const open = useSearch((s) => s.open);
  if (!open) return null;
  return <SearchCommandImpl />;
}
