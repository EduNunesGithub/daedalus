"use client";

import { SettingField, SettingInput } from "@/components/editor/settings-field";
import { useNode } from "@craftjs/core";
import { useEffect, useState } from "react";

interface TextProps {
  text?: string;
}

function TextSettings() {
  const {
    actions: { setProp },
    text,
  } = useNode((node) => ({
    text: node.data.props.text as string,
  }));

  return (
    <div className="flex flex-col gap-3">
      <SettingField label="text">
        <SettingInput
          onChange={(v) =>
            setProp((p: TextProps) => {
              p.text = v;
            })
          }
          value={text ?? ""}
        />
      </SettingField>
    </div>
  );
}

function createTextPrimitive(tag: string) {
  function Primitive({ text = tag }: TextProps) {
    const {
      actions: { setProp },
      connectors: { connect, drag },
      isSelected,
    } = useNode((node) => ({
      isSelected: node.events.selected,
    }));

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
      if (!isSelected) setIsEditing(false);
    }, [isSelected]);

    const Tag = tag as React.ElementType;

    return (
      <Tag
        className={isSelected ? "ring-2 ring-primary/50 ring-offset-1" : ""}
        contentEditable={isEditing}
        onBlur={(e: React.FocusEvent<HTMLElement>) => {
          setIsEditing(false);
          setProp((p: TextProps) => {
            p.text = e.currentTarget.textContent ?? "";
          });
        }}
        onDoubleClick={() => setIsEditing(true)}
        ref={(el: HTMLElement | null) => {
          if (el) connect(drag(el));
        }}
        suppressContentEditableWarning
      >
        {text}
      </Tag>
    );
  }

  Primitive.craft = {
    displayName: tag,
    props: { text: tag },
    related: { settings: TextSettings },
    rules: { canDrag: () => true },
  };

  return Primitive;
}

export const H1 = createTextPrimitive("h1");
export const H2 = createTextPrimitive("h2");
export const H3 = createTextPrimitive("h3");
export const H4 = createTextPrimitive("h4");
export const H5 = createTextPrimitive("h5");
export const H6 = createTextPrimitive("h6");
export const P = createTextPrimitive("p");
export const Span = createTextPrimitive("span");
