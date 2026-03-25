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
import { SettingsPanel } from "@/components/editor/settings-panel";
import { Toolbar } from "@/components/editor/toolbar";
import { Toolbox } from "@/components/editor/toolbox";
import { Editor, Element, Frame } from "@craftjs/core";

interface EditorCanvasProps {
  initialContent: string | null;
  orgSlug: string;
  pageId: string;
  pageTitle: string;
  siteId: string;
  status: string;
}

const RESOLVER = {
  a: A,
  article: Article,
  aside: Aside,
  button: Btn,
  div: Div,
  footer: Footer,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  header: Header,
  Hero,
  img: Img,
  main: Main,
  nav: Nav,
  Navbar,
  p: P,
  section: Section,
  span: Span,
};

export default function EditorCanvas({
  initialContent,
  orgSlug,
  pageId,
  pageTitle,
  siteId,
  status,
}: EditorCanvasProps) {
  return (
    <Editor resolver={RESOLVER}>
      <div className="flex h-screen flex-col overflow-hidden">
        <Toolbar
          orgSlug={orgSlug}
          pageId={pageId}
          pageTitle={pageTitle}
          siteId={siteId}
          status={status}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Toolbox — left panel */}
          <aside className="w-52 shrink-0 overflow-y-auto border-r bg-background">
            <Toolbox />
          </aside>

          {/* Canvas — center */}
          <main className="flex-1 overflow-auto bg-muted/30 p-8">
            <div className="min-h-full rounded-lg bg-background shadow-sm">
              <Frame json={initialContent ?? undefined}>
                <Element canvas is={Div} />
              </Frame>
            </div>
          </main>

          {/* Settings — right panel */}
          <aside className="w-64 shrink-0 overflow-y-auto border-l bg-background">
            <SettingsPanel />
          </aside>
        </div>
      </div>
    </Editor>
  );
}
