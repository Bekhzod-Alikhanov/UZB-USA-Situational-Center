"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Download, Loader2, UploadCloud } from "lucide-react";
import type { RoadmapRegionId } from "@/data/roadmaps";
import type { VisitMaterialType } from "@/data/visit-prep";
import { useGateRole } from "@/components/roadmaps/live";
import { intlLocale } from "@/components/brief/brief-data";

interface UploadedFile {
  id: string;
  title: string;
  type: VisitMaterialType;
  ownerOrg: string | null;
  fileName: string;
  fileSize: number | null;
  uploadedBy: string;
  createdAt: string;
  url: string | null;
}

const TYPE_OPTIONS: VisitMaterialType[] = ["presentation", "speech", "agenda", "briefing", "other"];

/**
 * Stage-2 block under a visit dossier's material registry: files actually
 * uploaded to the platform (private Supabase bucket, 1-hour signed download
 * links) plus the upload form. Region roles upload only for their region's
 * visits; the server re-checks every request. Renders nothing until the
 * session role is known — the page itself is already behind the gate.
 */
export function MaterialUploadsPanel({ visitId, region }: { visitId: string; region?: RoadmapRegionId }) {
  const t = useTranslations("prepare.uploads");
  const locale = useLocale();
  const { role, loaded: roleLoaded } = useGateRole();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [listLoaded, setListLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorText, setErrorText] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<VisitMaterialType>("presentation");
  const fileInput = useRef<HTMLInputElement>(null);

  const canUpload = role === "admin" || (region !== undefined && role === region);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch(`/api/visit-materials?visit=${encodeURIComponent(visitId)}`, {
        cache: "no-store",
      });
      if (!response.ok) return;
      const data = (await response.json()) as { files?: UploadedFile[] };
      setFiles(data.files ?? []);
    } catch {
      // degrade silently — the static registry above still renders
    } finally {
      setListLoaded(true);
    }
  }, [visitId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetch-on-mount, state set after await
    void refresh();
  }, [refresh]);

  const upload = async () => {
    const file = fileInput.current?.files?.[0];
    if (!file || !title.trim()) return;
    setBusy(true);
    setStatus("idle");
    try {
      const form = new FormData();
      form.set("visitId", visitId);
      form.set("title", title.trim());
      form.set("type", type);
      form.set("file", file);
      const response = await fetch("/api/visit-materials", { method: "POST", body: form });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `HTTP ${response.status}`);
      }
      setStatus("saved");
      setTitle("");
      if (fileInput.current) fileInput.current.value = "";
      await refresh();
    } catch (error) {
      setStatus("error");
      setErrorText(error instanceof Error ? error.message : "upload failed");
    } finally {
      setBusy(false);
    }
  };

  const dateFmt = new Intl.DateTimeFormat(intlLocale(locale), { day: "numeric", month: "short", year: "numeric" });
  const sizeLabel = (bytes: number | null) =>
    bytes === null
      ? ""
      : bytes > 1024 * 1024
        ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
        : `${Math.ceil(bytes / 1024)} KB`;

  if (!roleLoaded && !listLoaded) return null;
  if (files.length === 0 && !canUpload) return null;

  return (
    <div className="mt-3 border-t border-dashed border-[var(--color-border)] pt-2.5">
      <h4 className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
        {t("title")} · {files.length}
      </h4>
      {files.length > 0 ? (
        <ul className="mt-2 space-y-1.5">
          {files.map((file) => (
            <li key={file.id} className="flex items-start gap-1.5 text-[12px] leading-snug">
              <Download className="mt-0.5 size-3 shrink-0 text-[var(--color-ink-faint)]" />
              <span className="min-w-0">
                {file.url ? (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-[var(--color-primary)] hover:underline"
                  >
                    {file.title}
                  </a>
                ) : (
                  <span className="font-medium text-[var(--color-ink)]">{file.title}</span>
                )}
                <span className="block text-[10.5px] text-[var(--color-ink-faint)]">
                  {t(`type.${file.type}`)} · {file.fileName}
                  {file.fileSize ? ` · ${sizeLabel(file.fileSize)}` : ""} · {file.uploadedBy} ·{" "}
                  {dateFmt.format(new Date(file.createdAt))}
                </span>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1.5 text-[11px] text-[var(--color-ink-faint)]">{t("empty")}</p>
      )}

      {canUpload ? (
        <div className="mt-2.5 rounded-md border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-2)] p-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              placeholder={t("titlePlaceholder")}
              aria-label={t("titleLabel")}
              className="min-w-[180px] flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-[12px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-primary)] focus:outline-none"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as VisitMaterialType)}
              aria-label={t("typeLabel")}
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-[12px] text-[var(--color-ink)] focus:border-[var(--color-primary)] focus:outline-none"
            >
              {TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {t(`type.${option}`)}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <input
              ref={fileInput}
              type="file"
              accept=".pdf,.pptx,.ppt,.docx,.doc,.xlsx,.xls,.zip,.png,.jpg,.jpeg"
              aria-label={t("fileLabel")}
              className="flex-1 text-[11.5px] text-[var(--color-ink-muted)] file:mr-2 file:rounded-md file:border file:border-[var(--color-border)] file:bg-[var(--color-surface)] file:px-2.5 file:py-1 file:text-[11.5px] file:text-[var(--color-ink)]"
            />
            <button
              type="button"
              onClick={() => void upload()}
              disabled={busy || !title.trim()}
              className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-primary)] px-3 py-1.5 text-[12px] font-medium text-[var(--color-primary-contrast)] transition hover:bg-[var(--color-primary-2)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? <Loader2 className="size-3.5 animate-spin" /> : <UploadCloud className="size-3.5" />}
              {t("upload")}
            </button>
          </div>
          <p className="mt-1.5 text-[10.5px] text-[var(--color-ink-faint)]">{t("limits")}</p>
          {status === "saved" ? <p className="mt-1 text-[11px] text-[var(--color-pos)]">{t("saved")}</p> : null}
          {status === "error" ? (
            <p className="mt-1 text-[11px] text-[var(--color-neg)]">
              {t("error")}: {errorText}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
