"use client";

import { A } from "@/components/editor/primitives/link";
import { Nav } from "@/components/editor/primitives/container";
import { Span } from "@/components/editor/primitives/text";
import { Element, useNode } from "@craftjs/core";

export function Navbar() {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div
      ref={(el: HTMLDivElement | null) => {
        if (el) connect(drag(el));
      }}
    >
      <Element canvas id="navbar-root" is={Nav}>
        <Element canvas id="navbar-link-home" is={A} href="/">
          <Element id="navbar-link-home-text" is={Span} text="Home" />
        </Element>
        <Element canvas id="navbar-link-about" is={A} href="/about">
          <Element id="navbar-link-about-text" is={Span} text="About" />
        </Element>
      </Element>
    </div>
  );
}

Navbar.craft = {
  displayName: "Navbar",
};
