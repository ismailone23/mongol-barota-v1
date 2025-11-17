"use client";
import { useTRPC } from "@/trpc/react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import React, { useEffect, useMemo, useState } from "react";
import TeamTable from "./team-table";
import Pagination from "./pagination";
import CreateMemberDialog from "./create-member";

export default function Team() {
  const trpc = useTRPC();
  const itemsPerPage = 10;
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
    trpc.team.getAllMembers.infiniteQueryOptions(
      { limit: itemsPerPage },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    )
  );

  const members = data?.pages.flatMap((page) => page.members) ?? [];

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
    <div>
      <div className="bg-white rounded-lg ">
        <div className="py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Team Members
            </h2>
            <p className="text-sm text-gray-600 mt-1">
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
    </div>
  );
}
