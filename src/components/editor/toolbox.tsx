"use client";

import { Hero } from "@/components/editor/blocks/hero";
import { Navbar } from "@/components/editor/blocks/navbar";
import { Btn } from "@/components/editor/primitives/button";
import {
  Article,
  Aside,
  Div,
  Footer,
  Header,
  Main,
  Nav,
  Section,
} from "@/components/editor/primitives/container";
import { Img } from "@/components/editor/primitives/image";
import { A } from "@/components/editor/primitives/link";
import {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  P,
  Span,
} from "@/components/editor/primitives/text";
import { Element, useEditor } from "@craftjs/core";

interface ToolboxItemProps {
  label: string;
  onCreate: (ref: HTMLElement | null) => void;
}

function ToolboxItem({ label, onCreate }: ToolboxItemProps) {
  return (
    <div
      className="cursor-grab select-none rounded border bg-background px-3 py-2 font-mono text-xs hover:bg-accent active:cursor-grabbing"
      ref={onCreate}
    >
      {label}
    </div>
  );
}

export function Toolbox() {
  const { connectors } = useEditor();

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Text
        </span>
        <div className="flex flex-col gap-1">
          <ToolboxItem
            label="h1"
            onCreate={(ref) => connectors.create(ref!, <H1 />)}
          />
          <ToolboxItem
            label="h2"
            onCreate={(ref) => connectors.create(ref!, <H2 />)}
          />
          <ToolboxItem
            label="h3"
            onCreate={(ref) => connectors.create(ref!, <H3 />)}
          />
          <ToolboxItem
            label="h4"
            onCreate={(ref) => connectors.create(ref!, <H4 />)}
          />
          <ToolboxItem
            label="h5"
            onCreate={(ref) => connectors.create(ref!, <H5 />)}
          />
          <ToolboxItem
            label="h6"
            onCreate={(ref) => connectors.create(ref!, <H6 />)}
          />
          <ToolboxItem
            label="p"
            onCreate={(ref) => connectors.create(ref!, <P />)}
          />
          <ToolboxItem
            label="span"
            onCreate={(ref) => connectors.create(ref!, <Span />)}
          />
        </div>
      </div>

      <div className="h-px bg-border" />

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Layout
        </span>
        <div className="flex flex-col gap-1">
          <ToolboxItem
            label="div"
            onCreate={(ref) =>
              connectors.create(ref!, <Element canvas is={Div} />)
            }
          />
          <ToolboxItem
            label="section"
            onCreate={(ref) =>
              connectors.create(ref!, <Element canvas is={Section} />)
            }
          />
          <ToolboxItem
            label="article"
            onCreate={(ref) =>
              connectors.create(ref!, <Element canvas is={Article} />)
            }
          />
          <ToolboxItem
            label="main"
            onCreate={(ref) =>
              connectors.create(ref!, <Element canvas is={Main} />)
            }
          />
          <ToolboxItem
            label="nav"
            onCreate={(ref) =>
              connectors.create(ref!, <Element canvas is={Nav} />)
            }
          />
          <ToolboxItem
            label="header"
            onCreate={(ref) =>
              connectors.create(ref!, <Element canvas is={Header} />)
            }
          />
          <ToolboxItem
            label="footer"
            onCreate={(ref) =>
              connectors.create(ref!, <Element canvas is={Footer} />)
            }
          />
          <ToolboxItem
            label="aside"
            onCreate={(ref) =>
              connectors.create(ref!, <Element canvas is={Aside} />)
            }
          />
        </div>
      </div>

      <div className="h-px bg-border" />

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Elements
        </span>
        <div className="flex flex-col gap-1">
          <ToolboxItem
            label="img"
            onCreate={(ref) => connectors.create(ref!, <Img />)}
          />
          <ToolboxItem
            label="a"
            onCreate={(ref) =>
              connectors.create(ref!, <Element canvas is={A} href="#" />)
            }
          />
          <ToolboxItem
            label="button"
            onCreate={(ref) => connectors.create(ref!, <Btn />)}
          />
        </div>
      </div>

      <div className="h-px bg-border" />

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Blocks
        </span>
        <div className="flex flex-col gap-1">
          <ToolboxItem
            label="Hero"
            onCreate={(ref) => connectors.create(ref!, <Hero />)}
          />
          <ToolboxItem
            label="Navbar"
            onCreate={(ref) => connectors.create(ref!, <Navbar />)}
          />
        </div>
      </div>
    </div>
  );
}
