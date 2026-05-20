"use client";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { GripVertical } from "lucide-react";

type Stage = "plan" | "coord" | "brief" | "exec" | "follow";

const STAGE_LABEL: Record<Stage, string> = {
  plan: "Plan",
  coord: "Coordination",
  brief: "Briefing",
  exec: "Execution",
  follow: "Follow-up",
};

const STAGE_ACCENT: Record<Stage, string> = {
  plan: "border-[var(--color-primary)]/40",
  coord: "border-[var(--color-warn)]/40",
  brief: "border-[var(--color-primary-2)]/40",
  exec: "border-[var(--color-pos)]/40",
  follow: "border-[var(--color-ink-muted)]/30",
};

interface Task {
  id: string;
  stage: Stage;
  title: string;
  owner: string;
  due?: string;
  priority?: "high" | "medium" | "low";
  done?: boolean;
}

const SEED: Task[] = [
  {
    id: "t-01",
    stage: "plan",
    title: "Confirm delegation composition (11 members — optimizer result)",
    owner: "Center",
    due: "D-30",
    priority: "high",
  },
  {
    id: "t-02",
    stage: "plan",
    title: "Draft working agenda (3 parallel tracks)",
    owner: "MFA",
    due: "D-28",
    priority: "high",
  },
  {
    id: "t-03",
    stage: "plan",
    title: "Lock bilateral meeting list (Rubio, Waltz, Gor, Landau)",
    owner: "MFA + Embassy DC",
    due: "D-25",
  },
  {
    id: "t-04",
    stage: "plan",
    title: "Coordinate Trump-side window + fallback slot",
    owner: "Center",
    due: "D-25",
    priority: "high",
  },

  { id: "t-05", stage: "coord", title: "Letter of request to State Department", owner: "MFA", due: "D-21" },
  {
    id: "t-06",
    stage: "coord",
    title: "Venue and security clearance (Blair House / St. Regis)",
    owner: "SSO",
    due: "D-18",
  },
  {
    id: "t-07",
    stage: "coord",
    title: "Protocol schedule (gifts, anthems, seating)",
    owner: "Protocol Dept.",
    due: "D-16",
  },
  { id: "t-08", stage: "coord", title: "Press plan + pool list", owner: "Press service", due: "D-14" },

  {
    id: "t-09",
    stage: "brief",
    title: "Counterparts pack — 14 briefing cards",
    owner: "MFA Americas Dept.",
    due: "D-10",
  },
  {
    id: "t-10",
    stage: "brief",
    title: "Trade talking points — $1.0B turnover, balance −$420M",
    owner: "MIIT",
    due: "D-10",
  },
  { id: "t-11", stage: "brief", title: "Critical Minerals follow-up dossier", owner: "MinEnergy", due: "D-8" },
  {
    id: "t-12",
    stage: "brief",
    title: "Opposition-research memo for Congress outreach",
    owner: "Embassy DC",
    due: "D-7",
  },

  {
    id: "t-13",
    stage: "exec",
    title: "President's plenary — statement drafts (EN/UZ)",
    owner: "Speechwriting",
    due: "D-3",
    priority: "high",
  },
  { id: "t-14", stage: "exec", title: "Business round-table with AUCC", owner: "MIIT + AUCC", due: "D-2" },
  { id: "t-15", stage: "exec", title: "Minerals MoU signing ceremony", owner: "MinEnergy + State Dept.", due: "D-1" },

  { id: "t-16", stage: "follow", title: "Outcome memo → Center", owner: "MFA", due: "D+3" },
  {
    id: "t-17",
    stage: "follow",
    title: "Commitments registry update (10–15 new items)",
    owner: "Situational Center",
    due: "D+5",
  },
  { id: "t-18", stage: "follow", title: "Press debrief + infographics", owner: "Press service", due: "D+2" },
];

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(SEED);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  // Mount gate — @dnd-kit emits server/client mismatched aria-describedby IDs
  // (DndDescribedBy-0 vs DndDescribedBy-1) under React 19 strict hydration.
  // Render a static skeleton on SSR and the live DndContext only after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const byStage = useMemo(() => {
    const m = {
      plan: [] as Task[],
      coord: [] as Task[],
      brief: [] as Task[],
      exec: [] as Task[],
      follow: [] as Task[],
    };
    for (const t of tasks) m[t.stage].push(t);
    return m;
  }, [tasks]);

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over) return;
    const overStage = over.id as Stage;
    setTasks((list) => list.map((t) => (t.id === active.id ? { ...t, stage: overStage } : t)));
  }

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-5" aria-busy="true" suppressHydrationWarning>
        {(Object.keys(STAGE_LABEL) as Stage[]).map((s) => (
          <ColumnSkeleton key={s} stage={s} tasks={byStage[s]} />
        ))}
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {(Object.keys(STAGE_LABEL) as Stage[]).map((s) => (
          <Column key={s} stage={s} tasks={byStage[s]} />
        ))}
      </div>
    </DndContext>
  );
}

function ColumnSkeleton({ stage, tasks }: { stage: Stage; tasks: Task[] }) {
  return (
    <div className={cn("flex flex-col gap-2 rounded-md border bg-[var(--color-surface)] p-2.5", STAGE_ACCENT[stage])}>
      <div className="flex items-center justify-between px-1 pb-1">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-ink)]">
          {STAGE_LABEL[stage]}
        </span>
        <span className="mono text-[10.5px] text-[var(--color-ink-muted)]">{tasks.length}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {tasks.map((t) => (
          <div key={t.id} className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] p-2.5">
            <div className="flex items-start gap-1.5">
              <GripVertical className="mt-0.5 size-3 shrink-0 text-[var(--color-ink-faint)]" />
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] font-medium leading-snug text-[var(--color-ink)]">{t.title}</div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="rounded-sm bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[var(--color-ink-muted)]">
                    {t.owner}
                  </span>
                  {t.due ? <span className="mono text-[var(--color-ink-muted)]">{t.due}</span> : null}
                  {t.priority === "high" ? (
                    <span className="rounded-sm bg-[var(--color-neg-soft)] px-1.5 py-0.5 font-medium uppercase tracking-wider text-[var(--color-neg)]">
                      priority
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ))}
        {tasks.length === 0 ? (
          <div className="rounded-md border border-dashed border-[var(--color-border)] p-3 text-center text-[11px] text-[var(--color-ink-faint)]">
            Drop here
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Column({ stage, tasks }: { stage: Stage; tasks: Task[] }) {
  const { isOver, setNodeRef } = useDroppable({ id: stage });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col gap-2 rounded-md border bg-[var(--color-surface)] p-2.5 transition",
        STAGE_ACCENT[stage],
        isOver ? "bg-[var(--color-surface-2)] shadow-[var(--shadow-hover)]" : "",
      )}
    >
      <div className="flex items-center justify-between px-1 pb-1">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-ink)]">
          {STAGE_LABEL[stage]}
        </span>
        <span className="mono text-[10.5px] text-[var(--color-ink-muted)]">{tasks.length}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {tasks.map((t) => (
          <TaskCard key={t.id} task={t} />
        ))}
        {tasks.length === 0 ? (
          <div className="rounded-md border border-dashed border-[var(--color-border)] p-3 text-center text-[11px] text-[var(--color-ink-faint)]">
            Drop here
          </div>
        ) : null}
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined;
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group cursor-grab rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] p-2.5 text-left transition",
        "hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-hover)]",
        isDragging ? "cursor-grabbing opacity-60" : "",
      )}
    >
      <div className="flex items-start gap-1.5">
        <GripVertical className="mt-0.5 size-3 shrink-0 text-[var(--color-ink-faint)] group-hover:text-[var(--color-ink-muted)]" />
        <div className="min-w-0 flex-1">
          <div className="text-[12.5px] font-medium leading-snug text-[var(--color-ink)]">{task.title}</div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px]">
            <span className="rounded-sm bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[var(--color-ink-muted)]">
              {task.owner}
            </span>
            {task.due ? <span className="mono text-[var(--color-ink-muted)]">{task.due}</span> : null}
            {task.priority === "high" ? (
              <span className="rounded-sm bg-[var(--color-neg-soft)] px-1.5 py-0.5 font-medium uppercase tracking-wider text-[var(--color-neg)]">
                priority
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
