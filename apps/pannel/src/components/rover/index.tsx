"use client";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";

import React from "react";
import RoverTable from "./rover-table";
import CreateRoverDialog from "./create-rover";

export default function Rover() {
  const trpc = useTRPC();

  const { data, isLoading, isError, error, refetch } = useQuery(
    trpc.competition.getRovers.queryOptions()
  );

  return (
    <div>
      <div className="bg-white rounded-lg ">
        <div className="py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              All Rover Data
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage and view all Rover ({data?.length} total)
            </p>
          </div>
          <CreateRoverDialog refetch={refetch} />
        </div>

        <RoverTable refetch={refetch} isLoading={isLoading} rovers={data} />
      </div>
    </div>
  );
}
