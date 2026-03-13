"use client";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RoversSelect } from "@workspace/db/schema";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Pencil, Trash2 } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import EditRoverDialog from "./edit-rover";

export default function RoverTable({
  rovers,
  isLoading,
  refetch,
}: {
  isLoading: boolean;
  refetch: any;
  rovers: RoversSelect[] | undefined;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteRover = useMutation(
    trpc.competition.deleteRover.mutationOptions({
      onMutate: () => {
        const toastId = toast.loading("Deleting rover...");
        return { toastId };
      },
      onSuccess: (_data, _vars, ctx) => {
        toast.success("Rover Deleted", { id: ctx.toastId });
        void queryClient.invalidateQueries(
          trpc.competition.getRovers.queryOptions(),
        );
      },
      onError: (error, _vars, ctx) => {
        toast.error("Failed to delete rover", {
          description: error.message,
          id: ctx?.toastId,
        });
      },
    }),
  );

  const deleteRoverCallback = useCallback(
    (rover: RoversSelect) => {
      if (confirm(`Are you sure that you want to delete ${rover.name}?`)) {
        deleteRover.mutate({ id: rover.id });
      }
    },
    [deleteRover],
  );

  return (
    <div className="rounded-md border p-4">
      {isLoading ? (
        <div className="h-24 flex items-center justify-center text-muted-foreground">
          Loading...
        </div>
      ) : !rovers || rovers.length === 0 ? (
        <div className="h-24 flex items-center justify-center text-muted-foreground">
          No rovers found
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rovers.map((rover) => (
            <Card key={rover.id} className="overflow-hidden border-muted">
              <img
                src={rover.image}
                alt={rover.name}
                className="h-44 w-full object-cover"
              />
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{rover.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(rover.year).getFullYear()}
                      {rover.ended &&
                        ` - ${new Date(rover.ended).getFullYear()}`}
                    </p>
                  </div>
                  <Badge variant="secondary">{rover.status}</Badge>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">Features</p>
                  <div className="flex flex-wrap gap-1">
                    {rover.features?.length ? (
                      rover.features.slice(0, 3).map((feature, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {feature}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        None
                      </span>
                    )}
                    {rover.features && rover.features.length > 3 && (
                      <span className="text-xs text-muted-foreground self-center">
                        +{rover.features.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Specs</p>
                  <p className="text-xs text-muted-foreground">
                    {rover.spec.weight} · {rover.spec.power}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {rover.spec.dimensions}
                  </p>
                </div>

                <div className="flex justify-end gap-1 items-center">
                  <EditRoverDialog
                    refetch={refetch}
                    rover={rover}
                    trigger={<Pencil className="w-4 h-4" />}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteRoverCallback(rover)}
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
