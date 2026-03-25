"use client";

import { updatePageContent, updatePageStatus } from "@/lib/actions/pages";
import { useEditor } from "@craftjs/core";
import { ArrowLeftIcon, Redo2Icon, SaveIcon, Undo2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ToolbarProps {
  orgSlug: string;
  pageId: string;
  pageTitle: string;
  siteId: string;
  status: string;
}

export function Toolbar({
  orgSlug,
  pageId,
  pageTitle,
  siteId,
  status: initialStatus,
}: ToolbarProps) {
  const router = useRouter();
  const { actions, canUndo, canRedo, query } = useEditor((state, q) => ({
    canRedo: q.history.canRedo(),
    canUndo: q.history.canUndo(),
  }));

  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  async function handleSave() {
    setSaving(true);
    const json = query.serialize();
    console.debug("[START: editor-save]", { pageId });
    try {
      await updatePageContent({ content: JSON.parse(json), id: pageId });
      console.debug("[END: editor-save]", { pageId });
      toast.success("Page saved");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save";
      console.debug("[END: editor-save] error", { msg });
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handlePublishToggle() {
    setPublishing(true);
    const next = status === "published" ? "draft" : "published";
    console.debug("[START: editor-publish]", { pageId, next });
    try {
      await updatePageStatus({ id: pageId, status: next });
      console.debug("[END: editor-publish]", { pageId, next });
      setStatus(next);
      toast.success(
        next === "published" ? "Page published" : "Page unpublished",
      );
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to update status";
      console.debug("[END: editor-publish] error", { msg });
      toast.error(msg);
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="flex h-12 shrink-0 items-center gap-3 border-b bg-background px-4">
      <Link
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        href={`/dashboard/${orgSlug}/sites/${siteId}/pages`}
      >
        <ArrowLeftIcon className="size-3.5" />
        Back
      </Link>

      <div className="h-4 w-px bg-border" />

      <span className="text-sm font-medium">{pageTitle}</span>

      <div className="ml-auto flex items-center gap-2">
        <button
          className="rounded p-1.5 text-muted-foreground hover:bg-accent disabled:opacity-40"
          disabled={!canUndo}
          onClick={() => actions.history.undo()}
          title="Undo"
        >
          <Undo2Icon className="size-3.5" />
        </button>
        <button
          className="rounded p-1.5 text-muted-foreground hover:bg-accent disabled:opacity-40"
          disabled={!canRedo}
          onClick={() => actions.history.redo()}
          title="Redo"
        >
          <Redo2Icon className="size-3.5" />
        </button>

        <div className="h-4 w-px bg-border" />

        <button
          className="flex items-center gap-1.5 rounded px-3 py-1.5 text-xs hover:bg-accent disabled:opacity-40"
          disabled={saving}
          onClick={handleSave}
        >
          <SaveIcon className="size-3.5" />
          {saving ? "Saving..." : "Save"}
        </button>

        <button
          className="rounded bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
          disabled={publishing}
          onClick={handlePublishToggle}
        >
          {publishing
            ? "..."
            : status === "published"
              ? "Unpublish"
              : "Publish"}
        </button>
      </div>
    </div>
  );
}
