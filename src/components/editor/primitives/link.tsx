"use client";

import {
  SettingField,
  SettingInput,
  SettingSelect,
} from "@/components/editor/settings-field";
import { useNode } from "@craftjs/core";

type LinkTarget = "_blank" | "_self";

export interface AProps {
  children?: React.ReactNode;
  href?: string;
  target?: LinkTarget;
}

const LINK_TARGETS: LinkTarget[] = ["_self", "_blank"];

function ASettings() {
  const {
    actions: { setProp },
    href,
    target,
  } = useNode((node) => ({
    href: node.data.props.href as string,
    target: node.data.props.target as LinkTarget,
  }));

  return (
    <div className="flex flex-col gap-3">
      <SettingField label="href">
        <SettingInput
          onChange={(v) =>
            setProp((p: AProps) => {
              p.href = v;
            })
          }
          placeholder="https://... or /path"
          value={href ?? ""}
        />
      </SettingField>
      <SettingField label="target">
        <SettingSelect
          onChange={(v) =>
            setProp((p: AProps) => {
              p.target = v as LinkTarget;
            })
          }
          options={LINK_TARGETS}
          value={target ?? "_self"}
        />
      </SettingField>
    </div>
  );
}

export function A({ children, href = "#", target = "_self" }: AProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((node) => ({
    isSelected: node.events.selected,
  }));

  return (
    <a
      className={`min-w-8 ${isSelected ? "ring-2 ring-primary/50 ring-offset-1" : ""}`}
      href={href}
      ref={(el: HTMLAnchorElement | null) => {
        if (el) connect(drag(el));
      }}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      target={target}
    >
      {children}
    </a>
  );
}

A.craft = {
  displayName: "a",
  props: { href: "#", target: "_self" },
  related: { settings: ASettings },
  rules: {
    canDrag: () => true,
    canMoveIn: () => true,
  },
};
