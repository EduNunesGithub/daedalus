"use client";

import { SettingField, SettingInput } from "@/components/editor/settings-field";
import { useNode } from "@craftjs/core";

export interface ImgProps {
  alt?: string;
  src?: string;
}

function ImgSettings() {
  const {
    actions: { setProp },
    alt,
    src,
  } = useNode((node) => ({
    alt: node.data.props.alt as string,
    src: node.data.props.src as string,
  }));

  return (
    <div className="flex flex-col gap-3">
      <SettingField label="src">
        <SettingInput
          onChange={(v) =>
            setProp((p: ImgProps) => {
              p.src = v;
            })
          }
          placeholder="https://..."
          value={src ?? ""}
        />
      </SettingField>
      <SettingField label="alt">
        <SettingInput
          onChange={(v) =>
            setProp((p: ImgProps) => {
              p.alt = v;
            })
          }
          placeholder="Image description"
          value={alt ?? ""}
        />
      </SettingField>
    </div>
  );
}

export function Img({ alt = "", src = "" }: ImgProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((node) => ({
    isSelected: node.events.selected,
  }));

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      className={`block max-w-full ${isSelected ? "ring-2 ring-primary/50 ring-offset-1" : ""}`}
      ref={(el: HTMLImageElement | null) => {
        if (el) connect(drag(el));
      }}
      src={src || "https://placehold.co/400x200?text=img"}
    />
  );
}

Img.craft = {
  displayName: "img",
  props: { alt: "", src: "" },
  related: { settings: ImgSettings },
  rules: { canDrag: () => true },
};
