"use client";

import { useNode } from "@craftjs/core";

interface ContainerProps {
  children?: React.ReactNode;
}

function createContainerPrimitive(tag: string) {
  function Primitive({ children }: ContainerProps) {
    const {
      connectors: { connect, drag },
      isSelected,
    } = useNode((node) => ({
      isSelected: node.events.selected,
    }));

    const Tag = tag as React.ElementType;

    return (
      <Tag
        className={`min-h-8 ${isSelected ? "ring-2 ring-primary/50 ring-offset-1" : ""}`}
        ref={(el: HTMLElement | null) => {
          if (el) connect(drag(el));
        }}
      >
        {children}
      </Tag>
    );
  }

  Primitive.craft = {
    displayName: tag,
    props: {},
    rules: {
      canDrag: () => true,
      canMoveIn: () => true,
    },
  };

  return Primitive;
}

export const Article = createContainerPrimitive("article");
export const Aside = createContainerPrimitive("aside");
export const Div = createContainerPrimitive("div");
export const Footer = createContainerPrimitive("footer");
export const Header = createContainerPrimitive("header");
export const Main = createContainerPrimitive("main");
export const Nav = createContainerPrimitive("nav");
export const Section = createContainerPrimitive("section");
