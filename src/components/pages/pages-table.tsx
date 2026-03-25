"use client";

import PageActions from "@/components/pages/page-actions";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Page {
  id: string;
  slug: string;
  status: string;
  title: string;
  updatedAt: Date;
}

interface PagesTableProps {
  pages: Page[];
  siteSlug: string;
}

const STATUS_VARIANT: Record<string, "default" | "secondary"> = {
  draft: "secondary",
  published: "default",
};

export default function PagesTable({ pages, siteSlug }: PagesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {pages.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-medium">{p.title}</TableCell>
            <TableCell className="text-muted-foreground text-sm">
              /p/{siteSlug}/{p.slug}
            </TableCell>
            <TableCell>
              <Badge variant={STATUS_VARIANT[p.status] ?? "secondary"}>
                {p.status}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {new Intl.DateTimeFormat("en", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }).format(p.updatedAt)}
            </TableCell>
            <TableCell>
              <PageActions
                pageId={p.id}
                pageTitle={p.title}
                status={p.status}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
