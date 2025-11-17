"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateSponsorSchema } from "@workspace/types";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useForm } from "react-hook-form";
import z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { toast } from "sonner";
import { useCallback, useState } from "react";

type FormValues = z.infer<typeof CreateSponsorSchema>;

export default function CreateSponsorDialog({ refetch }: { refetch: any }) {
  const trpc = useTRPC();
  const [open, setOpen] = useState(false);

  // Fetch plans and competitions for dropdowns
  const { data: plans, isLoading: plansLoading } = useQuery(
    trpc.team.getSponsorshipPlans.queryOptions()
  );
  const { data: competitions, isLoading: competitionsLoading } = useQuery(
    trpc.competition.getCompetitions.queryOptions()
  );

  const createSponsor = useMutation(
    trpc.team.createSponsor.mutationOptions({
      onMutate: () => {
        const toastId = toast.loading("Adding Sponsor...");
        return { toastId };
      },
      onSuccess: async (_data, _vars, ctx) => {
        toast.success("Sponsor Added", { id: ctx.toastId });
        refetch();
        form.reset();
        setOpen(false);
      },
      onError: (error, _vars, ctx) => {
        toast.error("Failed to add sponsor", {
          description: error.message,
          id: ctx?.toastId,
        });
      },
    })
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(CreateSponsorSchema),
    defaultValues: {
      sponsorCompanyName: "",
      sponsorCompanyDesctiption: "",
      sponsorCompanyWebsite: "",
      sponsorCompanylogo: "",
      sponsorshipPlan: "",
      competitionId: undefined,
    },
  });

  const onSubmit = useCallback(
    (values: FormValues) => {
      createSponsor.mutate(values);
    },
    [createSponsor]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Sponsor</Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-full sm:max-w-[640px] md:max-w-[760px] max-h-[80vh] overflow-y-auto">
        <div>
          <DialogHeader className="mb-5">
            <DialogTitle>New Sponsor</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              id="create-sponsor-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 w-full max-w-full"
            >
              <FormField
                control={form.control}
                name="sponsorCompanyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="Tech Corp Inc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sponsorCompanyDesctiption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="w-full"
                        placeholder="Describe the sponsor company and their mission..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sponsorCompanyWebsite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Website</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="https://www.example.com"
                        type="url"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sponsorCompanylogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Logo URL</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="https://example.com/logo.png"
                        type="url"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sponsorshipPlan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sponsorship Plan</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a sponsorship plan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {plansLoading ? (
                          <SelectItem value="loading" disabled>
                            Loading plans...
                          </SelectItem>
                        ) : plans && plans.length > 0 ? (
                          plans.map((plan) => (
                            <SelectItem key={plan.id} value={plan.id}>
                              {plan.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-plans" disabled>
                            No plans available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="competitionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Competition (optional)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a competition (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {competitionsLoading ? (
                          <SelectItem value="loading" disabled>
                            Loading competitions...
                          </SelectItem>
                        ) : competitions && competitions.length > 0 ? (
                          competitions.map((competition) => (
                            <SelectItem
                              key={competition.id}
                              value={competition.id}
                            >
                              {competition.competitionName}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-competitions" disabled>
                            No competitions available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-full items-end justify-end flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="cursor-pointer"
                  type="submit"
                  disabled={createSponsor.isPending}
                >
                  {createSponsor.isPending ? "Creating..." : "Create Sponsor"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
