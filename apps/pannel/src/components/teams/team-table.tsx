"use client";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MemberSelect } from "@workspace/db/schema";
import { SubTeamRecord } from "@workspace/types";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Github, Linkedin, Mail, Pencil, Trash2 } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import EditMemberDialog from "./edit-member";

export default function TeamTable({
  paginatedMembers,
  isLoading,
  refetch,
}: {
  isLoading: boolean;
  refetch: any;
  paginatedMembers: MemberSelect[];
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const deleteMember = useMutation(
    trpc.team.deleteMember.mutationOptions({
      onMutate: () => {
        const toastId = toast.loading("Deleting member...");
        toast.loading("Adding member", { id: toastId });
        return { toastId };
      },
      onSuccess: (_data, _vars, ctx) => {
        toast.success("Member Deleted", { id: ctx.toastId });
        void queryClient.invalidateQueries(
          trpc.team.getPaginatedMembers.queryOptions({}),
        );
      },
      onError: (error, _vars, ctx) => {
        toast.error("Failed to create member", {
          description: error.message,
          id: ctx?.toastId,
        });
      },
    }),
  );
  const deleteMemberCallback = useCallback(
    (member: MemberSelect) => {
      if (confirm(`Are you sure that you want to delete ${member.name} ?`)) {
        deleteMember.mutate({ id: member.id });
      }
    },
    [deleteMember],
  );

  return (
    <div className="rounded-md border p-4">
      {isLoading ? (
        <div className="h-24 flex items-center justify-center text-muted-foreground">
          Loading...
        </div>
      ) : paginatedMembers.length === 0 ? (
        <div className="h-24 flex items-center justify-center text-muted-foreground">
          No members found
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {paginatedMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden border-muted">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate">{member.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {member.role}
                    </p>
                    {member.title && (
                      <p className="text-xs text-muted-foreground truncate">
                        {member.title}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground line-clamp-2">
                    {member.department}
                  </p>
                  <Badge variant="secondary" className="w-fit">
                    {SubTeamRecord[member.subTeam]}
                  </Badge>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-1">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border text-muted-foreground hover:text-foreground"
                        title={member.email}
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border text-muted-foreground hover:text-foreground"
                        title="LinkedIn"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border text-muted-foreground hover:text-foreground"
                        title="GitHub"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <EditMemberDialog
                      refetch={refetch}
                      member={member}
                      trigger={<Pencil className="w-4 h-4" />}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMemberCallback(member)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
