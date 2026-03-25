"use client";

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
import { Hero } from "@/components/editor/blocks/hero";
import { Navbar } from "@/components/editor/blocks/navbar";
import { Editor, Frame } from "@craftjs/core";

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

interface PageRendererProps {
  content: string;
}

export default function PageRenderer({ content }: PageRendererProps) {
  return (
    <Editor enabled={false} resolver={RESOLVER}>
      <Frame json={content} />
    </Editor>
  );
}
