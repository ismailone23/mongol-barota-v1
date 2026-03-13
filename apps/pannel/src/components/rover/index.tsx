"use client";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";

import React from "react";
import RoverTable from "./rover-table";
import CreateRoverDialog from "./create-rover";

export default function Rover() {
  const trpc = useTRPC();

  const { data, isLoading, isError, error, refetch } = useQuery(
    trpc.competition.getRovers.queryOptions(),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Rovers</h2>
          <p className="text-sm text-muted-foreground">
            Manage and view all rovers ({data?.length ?? 0} total)
          </p>
        </div>
        <CreateRoverDialog refetch={refetch} />
      </div>
      <RoverTable refetch={refetch} isLoading={isLoading} rovers={data} />
    </div>
  );
}
