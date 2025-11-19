"use client";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RoversSelect } from "@workspace/db/schema";
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
          trpc.competition.getRovers.queryOptions()
        );
      },
      onError: (error, _vars, ctx) => {
        toast.error("Failed to delete rover", {
          description: error.message,
          id: ctx?.toastId,
        });
      },
    })
  );

  const deleteRoverCallback = useCallback(
    (rover: RoversSelect) => {
      if (confirm(`Are you sure that you want to delete ${rover.name}?`)) {
        deleteRover.mutate({ id: rover.id });
      }
    },
    [deleteRover]
  );

  return (
    <div className="border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Features</TableHead>
            <TableHead>Achievements</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>Power</TableHead>
            <TableHead>Dimensions</TableHead>
            <TableHead>Arm</TableHead>
            <TableHead>Autonomy</TableHead>
            <TableHead>Active Period</TableHead>
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
          ) : !rovers || rovers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center h-24">
                No rovers found
              </TableCell>
            </TableRow>
          ) : (
            rovers.map((rover) => (
              <TableRow key={rover.id}>
                <TableCell>
                  <img
                    src={rover.image}
                    alt={rover.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{rover.name}</TableCell>
                <TableCell>{rover.status}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {rover.features && rover.features.length > 0 ? (
                      rover.features.map((features, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
                        >
                          {features}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs">No feature</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {rover.achievements && rover.achievements.length > 0 ? (
                      rover.achievements.map((achievements, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
                        >
                          {achievements}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs">
                        No achievements
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{rover.spec.weight}</TableCell>
                <TableCell>{rover.spec.power}</TableCell>
                <TableCell>{rover.spec.dimensions}</TableCell>
                <TableCell>{rover.spec.arm}</TableCell>
                <TableCell>{rover.spec.autonomy}</TableCell>
                <TableCell>
                  <div className="text-sm flex ">
                    <div>{new Date(rover.year).getFullYear()}</div>
                    {rover.ended && (
                      <div>-{new Date(rover.ended).getFullYear()}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 items-center">
                    <EditRoverDialog
                      refetch={refetch}
                      rover={rover}
                      trigger={<Pencil className="w-4 h-4" />}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteRoverCallback(rover)}
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
