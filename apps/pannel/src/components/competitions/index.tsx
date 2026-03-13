"use client";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";

import React from "react";
import CreateCompetitionDialog from "./create-competition";
import CompetitionTable from "./competitions-table";

export default function Competition() {
  const trpc = useTRPC();

  const { data, isLoading, isError, error, refetch } = useQuery(
    trpc.competition.getCompetitions.queryOptions(),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Competitions
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage and view all competitions ({data?.length ?? 0} total)
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
  );
}
