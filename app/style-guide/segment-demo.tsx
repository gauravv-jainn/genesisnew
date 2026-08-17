"use client";

import { useState } from "react";

import { GlassSegment } from "@/components/genesis/glass-button";

/** Stateful wrapper so the style guide page itself can stay a server component. */
export function SegmentDemo() {
  const [value, setValue] = useState("call");

  return (
    <GlassSegment
      value={value}
      onChange={setValue}
      options={[
        { value: "call", label: "Schedule a call" },
        { value: "contact", label: "Contact us" },
      ]}
    />
  );
}
