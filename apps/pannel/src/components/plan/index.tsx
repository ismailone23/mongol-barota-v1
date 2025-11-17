"use client";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";

import React from "react";
import PlanTable from "./plan-table";
import CreateSponserDialog from "./create-plan";

export default function Plan() {
  const trpc = useTRPC();

  const { data, isLoading, isError, error, refetch } = useQuery(
    trpc.team.getSponsorshipPlans.queryOptions()
  );

  return (
    <div>
      <div className="bg-white rounded-lg ">
        <div className="py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              All Sponsership Plans
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage and view all Sponser ({data?.length} total)
            </p>
          </div>
          <CreateSponserDialog refetch={refetch} />
        </div>

        <PlanTable refetch={refetch} isLoading={isLoading} plans={data} />
      </div>
    </div>
  );
}
