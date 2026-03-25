"use client";

import {
  SettingField,
  SettingInput,
  SettingSelect,
} from "@/components/editor/settings-field";
import { useNode } from "@craftjs/core";

type ButtonType = "button" | "reset" | "submit";

export interface BtnProps {
  text?: string;
  type?: ButtonType;
}

const BUTTON_TYPES: ButtonType[] = ["button", "submit", "reset"];

function BtnSettings() {
  const {
    actions: { setProp },
    text,
    type,
  } = useNode((node) => ({
    text: node.data.props.text as string,
    type: node.data.props.type as ButtonType,
  }));

  return (
    <div className="flex flex-col gap-3">
      <SettingField label="type">
        <SettingSelect
          onChange={(v) =>
            setProp((p: BtnProps) => {
              p.type = v as ButtonType;
            })
          }
          options={BUTTON_TYPES}
          value={type ?? "button"}
        />
      </SettingField>
      <SettingField label="text">
        <SettingInput
          onChange={(v) =>
            setProp((p: BtnProps) => {
              p.text = v;
            })
          }
          value={text ?? ""}
        />
      </SettingField>
    </div>
  );
}

export function Btn({ text = "Button", type = "button" }: BtnProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((node) => ({
    isSelected: node.events.selected,
  }));

  return (
    <button
      className={`px-4 py-2 ${isSelected ? "ring-2 ring-primary/50 ring-offset-1" : ""}`}
      ref={(el: HTMLButtonElement | null) => {
        if (el) connect(drag(el));
      }}
      type={type}
    >
      {text}
    </button>
  );
}

Btn.craft = {
  displayName: "button",
  props: { text: "Button", type: "button" },
  related: { settings: BtnSettings },
  rules: { canDrag: () => true },
};
