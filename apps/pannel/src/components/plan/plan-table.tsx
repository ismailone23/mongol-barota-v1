"use client";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SponsorshipPlans } from "@workspace/db/schema";
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
import EditSponsorshipPlanDialog from "./edit-plan";

export default function SponsorshipPlanTable({
  plans,
  isLoading,
  refetch,
}: {
  isLoading: boolean;
  refetch: any;
  plans: SponsorshipPlans[] | undefined;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deletePlan = useMutation(
    trpc.team.deleteSponsorshipPlan.mutationOptions({
      onMutate: () => {
        const toastId = toast.loading("Deleting plan...");
        return { toastId };
      },
      onSuccess: (_data, _vars, ctx) => {
        toast.success("Plan Deleted", { id: ctx.toastId });
        void queryClient.invalidateQueries(
          trpc.team.getSponsorshipPlans.queryOptions()
        );
      },
      onError: (error, _vars, ctx) => {
        toast.error("Failed to delete plan", {
          description: error.message,
          id: ctx?.toastId,
        });
      },
    })
  );

  const deletePlanCallback = useCallback(
    (plan: SponsorshipPlans) => {
      if (confirm(`Are you sure you want to delete "${plan.name}"?`)) {
        deletePlan.mutate({ id: plan.id });
      }
    },
    [deletePlan]
  );

  return (
    <div className="border border-gray-200 overflow-hidden rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Plan Name</TableHead>
            <TableHead>Subtitle</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Popular</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Benefits</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center h-24">
                Loading.....
              </TableCell>
            </TableRow>
          ) : !plans || plans.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center h-24">
                No sponsorship plans found
              </TableCell>
            </TableRow>
          ) : (
            plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.name}</TableCell>
                <TableCell>
                  {plan.subtitle || (
                    <span className="text-gray-400 text-sm">No subtitle</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-semibold">
                    ${plan.price.toLocaleString()}
                  </div>
                  {plan.priceLabel && (
                    <div className="text-xs text-gray-500">
                      {plan.priceLabel}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={plan.isActive ? "default" : "secondary"}>
                    {plan.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {plan.isPopular && (
                    <Badge variant="destructive">Popular</Badge>
                  )}
                </TableCell>
                <TableCell>{plan.displayOrder}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 max-w-xs">
                    {plan.benefits && plan.benefits.length > 0 ? (
                      plan.benefits.slice(0, 2).map((benefit, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                        >
                          {benefit}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs">No benefits</span>
                    )}
                    {plan.benefits && plan.benefits.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{plan.benefits.length - 2} more
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 items-center">
                    <EditSponsorshipPlanDialog
                      refetch={refetch}
                      plan={plan}
                      trigger={
                        <Button variant="ghost" size="sm">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      }
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletePlanCallback(plan)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
