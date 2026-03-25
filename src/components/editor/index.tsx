"use client";

import dynamic from "next/dynamic";

const EditorCanvas = dynamic(() => import("@/components/editor/canvas"), {
  loading: () => (
    <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
      Loading editor...
    </div>
  ),
  ssr: false,
});

export { EditorCanvas };
