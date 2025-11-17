"use client";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";

import React from "react";
import CreateCompetitionDialog from "./create-competition";
import CompetitionTable from "./competitions-table";

export default function Competition() {
  const trpc = useTRPC();

  const { data, isLoading, isError, error, refetch } = useQuery(
    trpc.competition.getCompetitions.queryOptions()
  );

  return (
    <div>
      <div className="bg-white rounded-lg ">
        <div className="py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              All Competition Data
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage and view all Competitions ({data?.length} total)
            </p>
          </div>
          <CreateCompetitionDialog refetch={refetch} />
        </div>

        <CompetitionTable
          refetch={refetch}
          isLoading={isLoading}
          competitions={data}
        />
      </div>
    </div>
  );
}
