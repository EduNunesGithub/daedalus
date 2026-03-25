"use client";

import { useEditor } from "@craftjs/core";
import { Trash2Icon } from "lucide-react";
import React from "react";

export function SettingsPanel() {
  const { actions, selected } = useEditor((state, query) => {
    const selectedIds = [...state.events.selected];
    const currentId = selectedIds[0];

    if (!currentId) return { selected: null };

    return {
      selected: {
        id: currentId,
        isDeletable: query.node(currentId).isDeletable(),
        name:
          state.nodes[currentId]?.data?.displayName ??
          state.nodes[currentId]?.data?.name,
        settings: state.nodes[currentId]?.related?.settings as
          | React.ComponentType
          | undefined,
      },
    };
  });

  if (!selected) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-center text-xs text-muted-foreground">
          Select an element to edit its properties
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-medium">{selected.name}</span>
        {selected.isDeletable && (
          <button
            className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            onClick={() => actions.delete(selected.id)}
            title="Delete element"
          >
            <Trash2Icon className="size-3.5" />
          </button>
        )}
      </div>

      <div className="h-px bg-border" />

      {selected.settings ? (
        React.createElement(selected.settings)
      ) : (
        <p className="text-xs text-muted-foreground">No settings available</p>
      )}
    </div>
  );
}
