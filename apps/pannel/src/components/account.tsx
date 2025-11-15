"use client";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { User } from "@workspace/db/schema";
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
    })
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
    })
  );

  const { data, isLoading } = query;
  const handleVerify = async (id: string) => {
    verifyEmail.mutate({ id });
  };
  const handleDeleteUser = async (id: string) => {
    deleteUser.mutate({ id });
  };
  const refetch = () => {
    query.refetch();
  };
  if (isLoading) return;

  <Table>
    <TableCaption>A list of your recent invoices.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">No</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>MistId</TableHead>
        <TableHead>Joined</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <LoadingSpinner />;
    </TableBody>
  </Table>;

  return (
    <div className="w-full flex flex-col items-start">
      <div className="flex items-center justify-between w-full">
        <h1>All users who can controll this pannel</h1>
        <Button onClick={refetch} variant={"ghost"}>
          <RefreshCcw />
        </Button>
      </div>
      <AccountsTable
        handleDeleteUser={handleDeleteUser}
        data={data}
        handleVerify={handleVerify}
      />
    </div>
  );
}

export function AccountsTable({
  data,
  handleVerify,
  handleDeleteUser,
}: {
  data?: User[];
  handleVerify: (id: string) => void;
  handleDeleteUser: (id: string) => void;
}) {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">No</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>MistId</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!data ? (
          <p>No User</p>
        ) : (
          data.map((user, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{i + 1}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.mistId}</TableCell>
              <TableCell>{user.emailVerified?.toDateString()}</TableCell>
              <TableCell className="text-right">
                {!user.emailVerified ? (
                  <>
                    <Button
                      variant={"ghost"}
                      onClick={() => handleVerify(user.id)}
                    >
                      <Check className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteUser(user.id)}
                      variant={"ghost"}
                    >
                      <XIcon className="w-5 h-5 text-red-500" />
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => handleDeleteUser(user.id)}
                    variant={"ghost"}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
