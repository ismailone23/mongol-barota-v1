"use client";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";

import React from "react";
import SponsorTable from "./sponsor-table";
import CreateSponsorDialog from "./create-sponsor";

export default function Sponsor() {
  const trpc = useTRPC();

  const { data, isLoading, isError, error, refetch } = useQuery(
    trpc.team.getSponsorsWithRelations.queryOptions(),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Sponsors</h2>
          <p className="text-sm text-muted-foreground">
            Manage and view all sponsors ({data?.length ?? 0} total)
          </p>
        </div>
        <CreateSponsorDialog refetch={refetch} />
      </div>
      <SponsorTable refetch={refetch} isLoading={isLoading} sponsors={data} />
    </div>
  );
}
