"use client";

import { FileText, Inbox, LayoutGrid, Settings, Users } from "lucide-react";
import { useState } from "react";

import { GlassRail } from "@/components/genesis/glass-rail";

/**
 * The Insider rail.
 *
 * Selection is local state only: every destination except the inbox belongs
 * to the Workspace build, which is out of scope here. Wiring it to routes
 * that do not exist would be worse than leaving it inert.
 */
export function InsiderRail() {
  const [active, setActive] = useState("inbox");

  return (
    <div className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
      <GlassRail
        activeId={active}
        items={[
          { id: "inbox", label: "Inbound", icon: Inbox, onSelect: () => setActive("inbox") },
          { id: "clients", label: "Clients & brands", icon: Users, onSelect: () => setActive("clients") },
          { id: "projects", label: "Projects", icon: LayoutGrid, onSelect: () => setActive("projects") },
          { id: "content", label: "Content pipeline", icon: FileText, onSelect: () => setActive("content") },
          { id: "settings", label: "Settings", icon: Settings, onSelect: () => setActive("settings") },
        ]}
      />
    </div>
  );
}
