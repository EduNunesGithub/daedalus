"use client";

import SiteActions from "@/components/sites/site-actions";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GlobeIcon } from "lucide-react";

interface Site {
  createdAt: Date;
  domain: string | null;
  id: string;
  name: string;
  slug: string;
}

interface SitesTableProps {
  appUrl: string;
  sites: Site[];
  workspaceSlug: string;
}

export default function SitesTable({
  appUrl,
  sites,
  workspaceSlug,
}: SitesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>URL</TableHead>
          <TableHead>Domain</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {sites.map((s) => (
          <TableRow key={s.id}>
            <TableCell className="font-medium">{s.name}</TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {appUrl}/p/{s.slug}
            </TableCell>
            <TableCell>
              {s.domain ? (
                <div className="flex items-center gap-2">
                  <GlobeIcon className="size-3 text-muted-foreground" />
                  <span className="text-sm">{s.domain}</span>
                </div>
              ) : (
                <Badge variant="secondary">No domain</Badge>
              )}
            </TableCell>
            <TableCell>
              <SiteActions
                siteId={s.id}
                siteName={s.name}
                workspaceSlug={workspaceSlug}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
