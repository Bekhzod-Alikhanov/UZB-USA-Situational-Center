"use client";
import { useSettings, type Theme } from "@/lib/store/settings";
import * as Switch from "@radix-ui/react-switch";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function SettingsPanel() {
  const t = useTranslations("admin");
  const {
    hideDemo,
    setHideDemo,
    presentationMode,
    setPresentationMode,
    theme,
    setTheme,
    aiEnabled,
    setAiEnabled,
  } = useSettings();

  return (
    <div className="flex flex-col gap-3">
      <SettingRow
        title={t("hideDemo")}
        desc={t("hideDemoDesc")}
        checked={hideDemo}
        onChange={setHideDemo}
      />
      <SettingRow
        title={t("presentation")}
        desc={t("presentationDesc")}
        checked={presentationMode}
        onChange={setPresentationMode}
      />
      <SettingRow
        title={t("ai")}
        desc={t("aiDesc")}
        checked={aiEnabled}
        onChange={setAiEnabled}
      />

      <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[13px] font-medium text-[var(--color-ink)]">{t("theme")}</div>
            <div className="text-[11px] text-[var(--color-ink-muted)]">Light / dark color scheme</div>
          </div>
          <SegmentedTheme value={theme} onChange={setTheme} />
        </div>
      </div>
    </div>
  );
}

function SettingRow({
  title,
  desc,
  checked,
  onChange,
}: {
  title: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3 transition hover:bg-[var(--color-surface-2)]">
      <div>
        <div className="text-[13px] font-medium text-[var(--color-ink)]">{title}</div>
        <div className="text-[11px] text-[var(--color-ink-muted)]">{desc}</div>
      </div>
      <Switch.Root
        checked={checked}
        onCheckedChange={onChange}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition",
          checked ? "bg-[var(--color-primary)]" : "bg-[var(--color-surface-2)] ring-1 ring-[var(--color-border)]",
        )}
      >
        <Switch.Thumb
          className={cn(
            "block size-4 translate-x-0.5 rounded-full bg-white shadow transition",
            checked ? "translate-x-[18px]" : "",
          )}
        />
      </Switch.Root>
    </label>
  );
}

function SegmentedTheme({ value, onChange }: { value: Theme; onChange: (v: Theme) => void }) {
  return (
    <div className="flex items-center gap-0.5 rounded-md border border-[var(--color-border)] p-0.5">
      {(["light", "dark"] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={cn(
            "rounded px-2.5 py-1 text-[11.5px] font-medium capitalize transition",
            value === v ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]",
          )}
        >
          {v}
        </button>
      ))}
    </div>
  );
}
