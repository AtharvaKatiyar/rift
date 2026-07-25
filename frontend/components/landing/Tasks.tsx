"use client";

import { useEffect, useState } from "react";
import type { TaskData } from "@/types/landing";
import { TASKS_DATA } from "@/data/landing";

function TaskTimeline({ task }: { task: TaskData }) {
  return (
    <div style={{ flex: 1, paddingLeft: 32 }}>
      {/* Permanent link section */}
      <div style={{ marginBottom: 32 }}>
        <div className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 12 }}>
          Permanent link
        </div>
        <div
          className="font-mono"
          style={{
            fontSize: 14,
            padding: "12px 16px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 3,
            color: "var(--text)",
          }}
        >
          {task.fullLink}
        </div>
      </div>

      {/* Destination history section */}
      <div>
        <div className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 16 }}>
          Destination history
        </div>

        <div style={{ position: "relative", paddingLeft: 24 }}>
          <div style={{ position: "absolute", left: 5, top: 8, bottom: 8, width: 1, background: "var(--border)" }} />

          {task.history.map((entry, index) => (
            <div key={index} style={{ position: "relative", marginBottom: 20 }}>
              <div
                style={{
                  position: "absolute",
                  left: -24,
                  top: 5,
                  width: 11,
                  height: 11,
                  borderRadius: "50%",
                  border: entry.isCurrent ? "none" : "1.5px solid var(--muted)",
                  background: entry.isCurrent ? "var(--accent)" : "transparent",
                }}
              />
              <div className="flex items-center justify-between">
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15.5, color: entry.isCurrent ? "var(--text)" : "var(--muted)", fontWeight: entry.isCurrent ? 500 : 400 }}>
                    {entry.destination}
                  </div>
                </div>
                <div>
                  {entry.isCurrent ? (
                    <span
                      style={{
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        padding: "4px 10px",
                        background: "rgba(166,80,59,0.12)",
                        color: "var(--accent)",
                        borderRadius: 2,
                        fontWeight: 500,
                      }}
                    >
                      current
                    </span>
                  ) : (
                    <span className="font-mono" style={{ fontSize: 12, color: "var(--faint)" }}>
                      {entry.date}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Tasks() {
  const [activeTask, setActiveTask] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 });

  const handleTaskClick = (index: number, event: React.MouseEvent<HTMLDivElement>) => {
    setActiveTask(index);
    const target = event.currentTarget;
    setIndicatorStyle({ top: target.offsetTop, height: target.offsetHeight });
  };

  useEffect(() => {
    const firstItem = document.querySelector('[data-task-index="0"]') as HTMLElement;
    if (firstItem) {
      setIndicatorStyle({ top: firstItem.offsetTop, height: firstItem.offsetHeight });
    }
  }, []);

  return (
    <section id="tasks" style={{ padding: "100px 48px 120px", background: "var(--bg-alt)" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        {/* Heading block */}
        <div style={{ marginBottom: 56 }}>
          <div className="font-mono uppercase" style={{ fontSize: 12, letterSpacing: "0.14em", color: "var(--muted)", marginBottom: 20 }}>
            One link per task
          </div>
          <h2 className="font-serif" style={{ fontSize: "clamp(32px,4.5vw,48px)", lineHeight: 1.15, marginBottom: 20, fontWeight: 300, color: "var(--text)" }}>
            Every task gets its own link.<br />
            <em style={{ fontStyle: "italic" }}>Every link is independent.</em>
          </h2>
          <p className="font-sans" style={{ fontSize: 17, color: "var(--muted)", lineHeight: 1.7, maxWidth: 720 }}>
            Updating your portfolio link has zero effect on your resume, startup, or anything else. Click any task to see its full history.
          </p>
        </div>

        {/* Two columns */}
        <div style={{ display: "flex", marginBottom: 32 }}>
          {/* Left column - task list */}
          <div style={{ width: 220, position: "relative" }}>
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 1, background: "var(--border)" }} />
            <div
              style={{
                position: "absolute",
                right: 0,
                width: 2,
                background: "var(--accent)",
                top: indicatorStyle.top,
                height: indicatorStyle.height,
                transition: "top 0.25s cubic-bezier(0.4,0,0.2,1), height 0.25s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
            {TASKS_DATA.map((task, index) => (
              <div
                key={index}
                data-task-index={index}
                onClick={(e) => handleTaskClick(index, e)}
                style={{ padding: "18px 0", cursor: "pointer" }}
              >
                <div style={{ fontSize: 15, fontWeight: 500, color: activeTask === index ? "var(--text)" : "var(--muted)" }}>
                  {task.name}
                </div>
                <div
                  className="font-mono"
                  style={{ fontSize: 11.5, marginTop: 6, opacity: activeTask === index ? 1 : 0, transition: "opacity 0.2s" }}
                >
                  <span style={{ color: "var(--accent)" }}>{task.slug}</span>
                  <span style={{ color: "var(--muted)" }}>/{task.publicId}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right column */}
          <TaskTimeline task={TASKS_DATA[activeTask]} />
        </div>

        {/* Footer note */}
        <div style={{ marginTop: 32, paddingTop: 32, borderTop: "0.5px solid var(--border)" }}>
          <p className="font-sans" style={{ fontSize: 15.5, color: "var(--muted)", lineHeight: 1.7, maxWidth: 840 }}>
            Update any destination inside Rift and every copy of that link — on a resume, a QR code, an old email — resolves to the new one immediately. No re-sharing required.
          </p>
        </div>
      </div>
    </section>
  );
}
