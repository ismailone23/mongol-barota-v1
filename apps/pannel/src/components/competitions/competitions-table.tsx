"use client";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CompetitionsSelect } from "@workspace/db/schema";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Calendar, MapPin, Pencil, Star, Trash2, Trophy } from "lucide-react";
import { useCallback } from "react";
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
          trpc.competition.getCompetitions.queryOptions(),
        );
      },
      onError: (error, _vars, ctx) => {
        toast.error("Failed to delete competition", {
          description: error.message,
          id: ctx?.toastId,
        });
      },
    }),
  );

  const deleteCompetitionCallback = useCallback(
    (competition: CompetitionsSelect) => {
      if (
        confirm(`Are you sure that you want to delete ${competition.name}?`)
      ) {
        deleteCompetition.mutate({ id: competition.id });
      }
    },
    [deleteCompetition],
  );

  return (
    <div className="rounded-md border p-4">
      {isLoading ? (
        <div className="h-24 flex items-center justify-center text-muted-foreground">
          Loading...
        </div>
      ) : !competitions || competitions.length === 0 ? (
        <div className="h-24 flex items-center justify-center text-muted-foreground">
          No competitions found
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {competitions.map((competition) => (
            <Card key={competition.id} className="overflow-hidden border-muted">
              <img
                src={competition.image}
                alt={competition.name}
                className="h-44 w-full object-cover"
              />
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold line-clamp-2">
                    {competition.name}
                  </p>
                  {competition.featured && (
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 shrink-0" />
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {competition.region.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">
                    {new Date(competition.year).getFullYear()}
                  </Badge>
                </div>

                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="inline-flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{competition.location}</span>
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    <span className="line-clamp-1">{competition.result}</span>
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(competition.year).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex justify-end gap-1 items-center">
                  <EditCompetitionDialog
                    refetch={refetch}
                    competition={competition}
                    trigger={<Pencil className="w-4 h-4" />}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteCompetitionCallback(competition)}
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
