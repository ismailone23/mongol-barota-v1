"use client";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CompetitionsSelect,
  Sponsors,
  PlansSelect,
} from "@workspace/db/schema";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import EditSponsorDialog from "./edit-sponsor";

export interface SponsorWithRelation {
  sponsor: Sponsors;
  plan: PlansSelect;
  competition: CompetitionsSelect | null;
}

export default function SponsorTable({
  sponsors,
  isLoading,
  refetch,
}: {
  isLoading: boolean;
  refetch: any;
  sponsors: SponsorWithRelation[] | undefined;
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
          trpc.team.getSponsorsWithRelations.queryOptions(),
        );
      },
      onError: (error, _vars, ctx) => {
        toast.error("Failed to delete sponsor", {
          description: error.message,
          id: ctx?.toastId,
        });
      },
    }),
  );

  const deleteSponsorCallback = useCallback(
    (sponsor: Sponsors) => {
      if (confirm(`Are you sure that you want to delete ${sponsor.name}?`)) {
        deleteSponsor.mutate({ id: sponsor.id });
      }
    },
    [deleteSponsor],
  );

  return (
    <div className="rounded-md border p-4">
      {isLoading ? (
        <div className="h-24 flex items-center justify-center text-muted-foreground">
          Loading...
        </div>
      ) : !sponsors || sponsors.length === 0 ? (
        <div className="h-24 flex items-center justify-center text-muted-foreground">
          No sponsors found
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sponsors.map((item) => (
            <Card key={item.sponsor.id} className="border-muted">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <img
                    src={item.sponsor.logo}
                    alt={item.sponsor.name}
                    className="w-12 h-12 rounded object-cover border"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate">
                      {item.sponsor.name}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.sponsor.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{item.plan.name}</Badge>
                  <Badge variant="outline">
                    {item.competition
                      ? item.competition.name
                      : "No competition"}
                  </Badge>
                </div>

                {item.sponsor.website && (
                  <a
                    href={item.sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    Visit website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                <div className="flex justify-end gap-1 items-center">
                  <EditSponsorDialog
                    refetch={refetch}
                    sponsor={item}
                    trigger={<Pencil className="w-4 h-4" />}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteSponsorCallback(item.sponsor)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
