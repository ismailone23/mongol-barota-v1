"use client";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { LoadingSpinner } from "@workspace/ui/components/loading-spinner";
import { Button } from "@workspace/ui/components/button";
import { Check, XIcon, Trash2, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

export default function Account() {
  const api = useTRPC();
  const query = useQuery(api.auth.allUsers.queryOptions());
  const verifyEmail = useMutation(
    api.auth.verifyUser.mutationOptions({
      onSuccess: ({ message }) => {
        refetch();
        toast.success(message);
      },
      onError: ({ message }) => {
        toast.error(message);
      },
    }),
  );
  const deleteUser = useMutation(
    api.auth.deleteUser.mutationOptions({
      onSuccess: ({ message }) => {
        refetch();
        toast.info(message);
      },
      onError: ({ message }) => {
        toast.error(message);
      },
    }),
  );

  const { data, isLoading } = query;
  const handleVerify = (id: string) => {
    verifyEmail.mutate({ id });
  };
  const handleDeleteUser = (id: string) => {
    deleteUser.mutate({ id });
  };
  const refetch = () => {
    query.refetch();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Accounts</h2>
          <p className="text-sm text-muted-foreground">
            Manage users who can access this panel
          </p>
        </div>
        <Button onClick={refetch} variant="outline" size="sm">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden sm:table-cell">MIST ID</TableHead>
              <TableHead className="hidden md:table-cell">Verified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  <LoadingSpinner className="mx-auto h-6 w-6" />
                </TableCell>
              </TableRow>
            ) : !data || data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center h-24 text-muted-foreground"
                >
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              data.map((user, i) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{i + 1}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {user.mistId}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.emailVerified
                      ? new Date(user.emailVerified).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {!user.emailVerified && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleVerify(user.id)}
                          title="Verify user"
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete user"
                      >
                        {!user.emailVerified ? (
                          <XIcon className="h-4 w-4 text-destructive" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-destructive" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
