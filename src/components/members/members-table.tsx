"use client";

import MemberActions from "@/components/members/member-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Member {
  createdAt: Date;
  id: string;
  organizationId: string;
  role: string;
  user: {
    email: string;
    id: string;
    image?: string | null;
    name: string;
  };
  userId: string;
}

interface MembersTableProps {
  currentUserId: string;
  members: Member[];
  organizationId: string;
}

const ROLE_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  admin: "default",
  member: "secondary",
  owner: "outline",
};

export default function MembersTable({
  currentUserId,
  members,
  organizationId,
}: MembersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => {
          const memberInitials = initials(member.user.name);

          return (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    {member.user.image && (
                      <AvatarImage
                        alt={member.user.name}
                        src={member.user.image}
                      />
                    )}
                    <AvatarFallback>{memberInitials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.user.email}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={ROLE_VARIANT[member.role] ?? "secondary"}>
                  {member.role}
                </Badge>
              </TableCell>
              <TableCell>
                {member.role !== "owner" && (
                  <MemberActions
                    currentUserId={currentUserId}
                    memberId={member.id}
                    memberName={member.user.name}
                    organizationId={organizationId}
                    role={member.role}
                    userId={member.userId}
                  />
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
