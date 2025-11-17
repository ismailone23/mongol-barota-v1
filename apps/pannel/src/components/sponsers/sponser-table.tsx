"use client";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CompetitionsSelect,
  Sponsors,
  SponsorshipPlans,
} from "@workspace/db/schema";
import { Button } from "@workspace/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Pencil, Trash2 } from "lucide-react";
import React, { useCallback } from "react";
import { toast } from "sonner";
import EditSponserDialog from "./edit-sponser";

export interface SponsersWithRelation {
  sponsor: Sponsors;
  plan: SponsorshipPlans;
  competition: CompetitionsSelect;
}

export default function SponserTable({
  sponsers,
  isLoading,
  refetch,
}: {
  isLoading: boolean;
  refetch: any;
  sponsers: SponsersWithRelation[] | undefined;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteSponsor = useMutation(
    trpc.team.deleteSponsor.mutationOptions({
      onMutate: () => {
        const toastId = toast.loading("Deleting sponsor...");
        return { toastId };
      },
      onSuccess: (_data, _vars, ctx) => {
        toast.success("Sponsor Deleted", { id: ctx.toastId });
        void queryClient.invalidateQueries(
          trpc.team.getSponsors.queryOptions()
        );
      },
      onError: (error, _vars, ctx) => {
        toast.error("Failed to delete sponsor", {
          description: error.message,
          id: ctx?.toastId,
        });
      },
    })
  );

  const deleteSponsorCallback = useCallback(
    (sponsor: Sponsors) => {
      if (
        confirm(
          `Are you sure that you want to delete ${sponsor.sponsorCompanyName}?`
        )
      ) {
        deleteSponsor.mutate({ sponsorId: sponsor.sponsorId });
      }
    },
    [deleteSponsor]
  );

  return (
    <div className="border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Image</TableHead>
            <TableHead>Sponsor Name</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Competition</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24">
                Loading.....
              </TableCell>
            </TableRow>
          ) : !sponsers || sponsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24">
                No sponsors found
              </TableCell>
            </TableRow>
          ) : (
            sponsers.map((item) => (
              <TableRow key={item.sponsor.sponsorId}>
                <TableCell>
                  <img
                    src={item.sponsor.sponsorCompanylogo}
                    alt={item.sponsor.sponsorCompanyName}
                    className="w-10 h-10 rounded object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {item.sponsor.sponsorCompanyName}
                </TableCell>
                <TableCell>
                  {item.sponsor.sponsorCompanyWebsite ? (
                    <a
                      href={item.sponsor.sponsorCompanyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">No website</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                    {item.plan.name}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                    {item.competition.competitionName}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 items-center">
                    <EditSponserDialog
                      refetch={refetch}
                      sponsor={item}
                      trigger={<Pencil className="w-4 h-4" />}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSponsorCallback(item.sponsor)}
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
