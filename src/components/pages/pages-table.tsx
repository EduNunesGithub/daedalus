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
import { EyeIcon, PencilIcon } from "lucide-react";
import Link from "next/link";

interface Page {
  id: string;
  slug: string;
  status: string;
  title: string;
  updatedAt: Date;
}

interface PagesTableProps {
  orgSlug: string;
  pages: Page[];
  siteId: string;
  siteSlug: string;
}

const STATUS_VARIANT: Record<string, "default" | "secondary"> = {
  draft: "secondary",
  published: "default",
};

export default function PagesTable({
  orgSlug,
  pages,
  siteId,
  siteSlug,
}: PagesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead className="w-28" />
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
              <div className="flex items-center justify-end gap-1">
                <Link
                  className="inline-flex size-8 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
                  href={`/p/${siteSlug}/${p.slug}`}
                  target="_blank"
                  title="View page"
                >
                  <EyeIcon className="size-4" />
                </Link>
                <Link
                  className="inline-flex size-8 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
                  href={`/dashboard/${orgSlug}/sites/${siteId}/pages/${p.id}/edit`}
                  title="Edit page"
                >
                  <PencilIcon className="size-4" />
                </Link>
                <PageActions
                  pageId={p.id}
                  pageTitle={p.title}
                  status={p.status}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
