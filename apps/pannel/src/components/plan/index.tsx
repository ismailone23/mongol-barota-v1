"use client";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";

import React from "react";
import PlanTable from "./plan-table";
import CreatePlanDialog from "./create-plan";

export default function Plan() {
  const trpc = useTRPC();

  const { data, isLoading, isError, error, refetch } = useQuery(
    trpc.team.getPlans.queryOptions(),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Sponsorship Plans
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage and view all plans ({data?.length ?? 0} total)
          </p>
        </div>
        <CreatePlanDialog refetch={refetch} />
      </div>
      <PlanTable refetch={refetch} isLoading={isLoading} plans={data} />
    </div>
  );
}
