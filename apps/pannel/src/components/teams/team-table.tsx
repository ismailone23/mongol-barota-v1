"use client";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TeamMembersSelect } from "@workspace/db/schema";
import { memberAtLabels } from "@workspace/types";
import { Button } from "@workspace/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Github, Linkedin, Mail, Pencil, Trash2 } from "lucide-react";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";
import EditMemberDialog from "./edit-member";

export default function TeamTable({
  paginatedMembers,
  isLoading,
  refetch,
}: {
  isLoading: boolean;
  refetch: any;
  paginatedMembers: TeamMembersSelect[];
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
          trpc.team.getAllMembers.queryOptions({})
        );
      },
      onError: (error, _vars, ctx) => {
        toast.error("Failed to create member", {
          description: error.message,
          id: ctx?.toastId,
        });
      },
    })
  );
  const deleteMemberCallback = useCallback((member: TeamMembersSelect) => {
    if (confirm(`Are you sure that you want to delete ${member.name} ?`)) {
      deleteMember.mutate({ id: member.id });
    }
  }, []);
  return (
    <div className="border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center h-24">
                Loading.....
              </TableCell>
            </TableRow>
          ) : paginatedMembers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center h-24">
                No members found
              </TableCell>
            </TableRow>
          ) : (
            paginatedMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-10 h-10 rounded-full"
                  />
                </TableCell>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.designation}</TableCell>
                <TableCell>{member.department}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {memberAtLabels[member.memberAt]}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
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
                        className="text-gray-400 hover:text-blue-600 transition-colors"
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
                        className="text-gray-400 hover:text-gray-900 transition-colors"
                        title="GitHub"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 items-center">
                    {/* <Button variant="ghost" size="sm"> */}
                    <EditMemberDialog
                      refetch={refetch}
                      member={member}
                      trigger={<Pencil className="w-4 h-4" />}
                    />
                    {/* </Button> */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMemberCallback(member)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
