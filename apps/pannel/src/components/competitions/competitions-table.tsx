"use client";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CompetitionsSelect } from "@workspace/db/schema";
import { Button } from "@workspace/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Pencil, Trash2, Star } from "lucide-react";
import React, { useCallback } from "react";
import { toast } from "sonner";
import EditCompetitionDialog from "./edit-competition";

export default function CompetitionTable({
  competitions,
  isLoading,
  refetch,
}: {
  isLoading: boolean;
  refetch: any;
  competitions: CompetitionsSelect[] | undefined;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteCompetition = useMutation(
    trpc.competition.deleteCompetition.mutationOptions({
      onMutate: () => {
        const toastId = toast.loading("Deleting competition...");
        return { toastId };
      },
      onSuccess: (_data, _vars, ctx) => {
        toast.success("Competition Deleted", { id: ctx.toastId });
        void queryClient.invalidateQueries(
          trpc.competition.getCompetitions.queryOptions()
        );
      },
      onError: (error, _vars, ctx) => {
        toast.error("Failed to delete competition", {
          description: error.message,
          id: ctx?.toastId,
        });
      },
    })
  );

  const deleteCompetitionCallback = useCallback(
    (competition: CompetitionsSelect) => {
      if (
        confirm(
          `Are you sure that you want to delete ${competition.competitionName}?`
        )
      ) {
        deleteCompetition.mutate({ id: competition.id });
      }
    },
    [deleteCompetition]
  );

  return (
    <div className="border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Image</TableHead>
            <TableHead>Competition Name</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Result</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center h-24">
                Loading.....
              </TableCell>
            </TableRow>
          ) : !competitions || competitions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center h-24">
                No competitions found
              </TableCell>
            </TableRow>
          ) : (
            competitions.map((competition) => (
              <TableRow key={competition.id}>
                <TableCell>
                  <img
                    src={competition.image}
                    alt={competition.competitionName}
                    className="w-10 h-10 rounded object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {competition.competitionName}
                </TableCell>
                <TableCell>{competition.competitionRegionName}</TableCell>
                <TableCell>{competition.location}</TableCell>
                <TableCell>
                  {new Date(competition.participationYear).getFullYear()}
                </TableCell>
                <TableCell>
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: competition.bgColor,
                      color: competition.color,
                    }}
                  >
                    {competition.competitionResult}
                  </span>
                </TableCell>
                <TableCell>
                  {competition.featured && (
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 items-center">
                    <EditCompetitionDialog
                      refetch={refetch}
                      competition={competition}
                      trigger={<Pencil className="w-4 h-4" />}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteCompetitionCallback(competition)}
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
