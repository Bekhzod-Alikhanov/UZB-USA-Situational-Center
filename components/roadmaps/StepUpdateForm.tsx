"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Loader2 } from "lucide-react";
import type { RoadmapStep, RoadmapStepState } from "@/data/roadmaps";
import { cn } from "@/lib/utils";

/**
 * Inline hokimiyat/Center form under an expanded roadmap task: mark the step
 * done / in progress / back to plan, and/or leave a note. Appears only for
 * roles allowed to edit the project's region (the server re-checks). Writes
 * go to the append-only roadmap_step_update journal.
 */
export function StepUpdateForm({
  step,
  currentState,
  onSaved,
}: {
  step: RoadmapStep;
  currentState: RoadmapStepState;
  onSaved: () => Promise<void>;
}) {
  const t = useTranslations("roadmaps.form");
  const [state, setState] = useState<"done" | "in-progress" | "reset" | "">("");
  const [note, setNote] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorText, setErrorText] = useState("");

  const submit = async () => {
    if (!state && !note.trim()) return;
    setBusy(true);
    setStatus("idle");
    try {
      const response = await fetch("/api/roadmaps/step-updates", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          stepId: step.id,
          state: state || undefined,
          note: note.trim() || undefined,
          authorName: authorName.trim() || undefined,
        }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `HTTP ${response.status}`);
      }
      setStatus("saved");
      setState("");
      setNote("");
      await onSaved();
    } catch (error) {
      setStatus("error");
      setErrorText(error instanceof Error ? error.message : "request failed");
    } finally {
      setBusy(false);
    }
  };

  const stateChips: Array<{ value: "done" | "in-progress" | "reset"; label: string }> = [
    { value: "done", label: t("markDone") },
    { value: "in-progress", label: t("markInProgress") },
    { value: "reset", label: t("markReset") },
  ];

  return (
    <div className="mt-2 rounded-md border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-2)] p-2.5">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
          {t("stateLabel")}
        </span>
        {stateChips.map((chip) => (
          <button
            key={chip.value}
            type="button"
            disabled={busy || (chip.value === "reset" && currentState === null)}
            onClick={() => setState((prev) => (prev === chip.value ? "" : chip.value))}
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition disabled:cursor-not-allowed disabled:opacity-40",
              state === chip.value
                ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:border-[var(--color-border-strong)]",
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        maxLength={2000}
        placeholder={t("notePlaceholder")}
        aria-label={t("noteLabel")}
        className="mt-2 w-full resize-y rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-[12px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-primary)] focus:outline-none"
      />
      <div className="mt-1.5 flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          maxLength={120}
          placeholder={t("authorPlaceholder")}
          aria-label={t("authorLabel")}
          className="min-w-[160px] flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-[12px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-primary)] focus:outline-none"
        />
        <button
          type="button"
          onClick={() => void submit()}
          disabled={busy || (!state && !note.trim())}
          className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-primary)] px-3 py-1.5 text-[12px] font-medium text-[var(--color-primary-contrast)] transition hover:bg-[var(--color-primary-2)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? <Loader2 className="size-3.5 animate-spin" /> : null}
          {t("save")}
        </button>
      </div>
      {status === "saved" ? (
        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-[var(--color-pos)]">
          <CheckCircle2 className="size-3.5" /> {t("saved")}
        </p>
      ) : null}
      {status === "error" ? (
        <p className="mt-1.5 text-[11px] text-[var(--color-neg)]">
          {t("error")}: {errorText}
        </p>
      ) : null}
    </div>
  );
}
