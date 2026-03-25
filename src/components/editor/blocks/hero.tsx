"use client";

import { Btn } from "@/components/editor/primitives/button";
import { Section } from "@/components/editor/primitives/container";
import { H1, P } from "@/components/editor/primitives/text";
import { Element, useNode } from "@craftjs/core";

export function Hero() {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div
      ref={(el: HTMLDivElement | null) => {
        if (el) connect(drag(el));
      }}
    >
      <Element canvas id="hero-root" is={Section}>
        <Element id="hero-heading" is={H1} text="Hero Title" />
        <Element
          id="hero-subheading"
          is={P}
          text="Add a description that tells visitors what this page is about."
        />
        <Element id="hero-cta" is={Btn} text="Get started" />
      </Element>
    </div>
  );
}

Hero.craft = {
  displayName: "Hero",
};
