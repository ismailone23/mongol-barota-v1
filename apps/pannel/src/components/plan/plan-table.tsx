"use client";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlansSelect } from "@workspace/db/schema";
import { Button } from "@workspace/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Badge } from "@workspace/ui/components/badge";
import { Pencil, Trash2 } from "lucide-react";
import React, { useCallback } from "react";
import { toast } from "sonner";
import EditPlanDialog from "./edit-plan";

export default function PlanTable({
  plans,
  isLoading,
  refetch,
}: {
  isLoading: boolean;
  refetch: any;
  plans: PlansSelect[] | undefined;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deletePlan = useMutation(
    trpc.team.deletePlan.mutationOptions({
      onMutate: () => {
        const toastId = toast.loading("Deleting plan...");
        return { toastId };
      },
      onSuccess: (_data, _vars, ctx) => {
        toast.success("Plan Deleted", { id: ctx.toastId });
        void queryClient.invalidateQueries(trpc.team.getPlans.queryOptions());
      },
      onError: (error, _vars, ctx) => {
        toast.error("Failed to delete plan", {
          description: error.message,
          id: ctx?.toastId,
        });
      },
    }),
  );

  const deletePlanCallback = useCallback(
    (plan: PlansSelect) => {
      if (confirm(`Are you sure you want to delete "${plan.name}"?`)) {
        deletePlan.mutate({ id: plan.id });
      }
    },
    [deletePlan],
  );

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Plan Name</TableHead>
            <TableHead className="hidden sm:table-cell">Price</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">Popular</TableHead>
            <TableHead className="hidden lg:table-cell">Order</TableHead>
            <TableHead className="hidden lg:table-cell">Benefits</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center h-24 text-muted-foreground"
              >
                Loading...
              </TableCell>
            </TableRow>
          ) : !plans || plans.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center h-24 text-muted-foreground"
              >
                No plans found
              </TableCell>
            </TableRow>
          ) : (
            plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">
                  <div>{plan.name}</div>
                  {plan.subtitle && (
                    <div className="text-xs text-muted-foreground">
                      {plan.subtitle}
                    </div>
                  )}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="font-semibold">
                    ${plan.price.toLocaleString()}
                  </div>
                  {plan.priceLabel && (
                    <div className="text-xs text-muted-foreground">
                      {plan.priceLabel}
                    </div>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant={plan.isActive ? "default" : "secondary"}>
                    {plan.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {plan.isPopular && (
                    <Badge variant="destructive">Popular</Badge>
                  )}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {plan.displayOrder}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex flex-col gap-1 max-w-xs">
                    {plan.benefits && plan.benefits.length > 0 ? (
                      plan.benefits.slice(0, 2).map((benefit, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs"
                        >
                          {benefit}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-xs">
                        None
                      </span>
                    )}
                    {plan.benefits && plan.benefits.length > 2 && (
                      <span className="text-xs text-muted-foreground">
                        +{plan.benefits.length - 2} more
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 items-center">
                    <EditPlanDialog
                      refetch={refetch}
                      plan={plan}
                      trigger={
                        <Button variant="ghost" size="icon">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deletePlanCallback(plan)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
