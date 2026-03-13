"use client";
import { useTRPC } from "@/trpc/react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import React, { useEffect, useMemo, useState } from "react";
import TeamTable from "./team-table";
import Pagination from "./pagination";
import CreateMemberDialog from "./create-member";

export default function Team() {
  const trpc = useTRPC();
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery(
    trpc.team.getPaginatedMembers.infiniteQueryOptions(
      { limit: itemsPerPage },
      { getNextPageParam: (lastPage) => lastPage.nextCursor },
    ),
  );

  const members = data?.pages.flatMap((page) => page.currentMembers) ?? [];

  // Auto-fetch pages as user navigates
  useEffect(() => {
    const requiredPages = currentPage;
    const loadedPages = data?.pages.length ?? 0;

    if (requiredPages > loadedPages && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [
    currentPage,
    data?.pages.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return members.slice(startIndex, endIndex);
  }, [members, currentPage, itemsPerPage]);

  // Update pagination to show "?" when total count unknown
  const totalPages = hasNextPage
    ? Math.max(Math.ceil(members.length / itemsPerPage), currentPage + 1)
    : Math.ceil(members.length / itemsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Team Members
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage and view all team members ({members.length} total)
          </p>
        </div>
        <CreateMemberDialog refetch={refetch} />
      </div>

      <TeamTable
        refetch={refetch}
        isLoading={isLoading}
        paginatedMembers={paginatedMembers}
      />

      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        members={members}
        hasNextPage={hasNextPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
