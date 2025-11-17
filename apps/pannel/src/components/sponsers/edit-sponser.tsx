"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateSponsorSchema } from "@workspace/types";
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
import { useForm } from "react-hook-form";
import z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { SponsersWithRelation } from "./sponser-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

type FormValues = z.infer<typeof UpdateSponsorSchema>;

interface EditSponsorDialogProps {
  sponsor: SponsersWithRelation;
  trigger?: React.ReactNode;
  refetch: any;
}

export default function EditSponsorDialog({
  refetch,
  sponsor,
  trigger,
}: EditSponsorDialogProps) {
  const trpc = useTRPC();
  const [open, setOpen] = useState(false);

  // Fetch plans and competitions for dropdowns
  const { data: plans } = useQuery(
    trpc.team.getSponsorshipPlans.queryOptions()
  );
  const { data: competitions } = useQuery(
    trpc.competition.getCompetitions.queryOptions()
  );

  const updateSponsor = useMutation(
    trpc.team.updateSponsor.mutationOptions({
      onMutate: () => {
        const toastId = toast.loading("Updating sponsor...");
        return { toastId };
      },
      onSuccess: (_data, _vars, ctx) => {
        toast.success("Sponsor Updated", { id: ctx.toastId });
        refetch();
        setOpen(false);
      },
      onError: (error, _vars, ctx) => {
        toast.error("Failed to update sponsor", {
          description: error.message,
          id: ctx?.toastId,
        });
      },
    })
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(UpdateSponsorSchema),
    defaultValues: {
      sponsorId: sponsor.sponsor.sponsorId,
      sponsorCompanyName: sponsor.sponsor.sponsorCompanyName,
      sponsorCompanyDesctiption:
        sponsor.sponsor.sponsorCompanyDesctiption || "",
      sponsorCompanyWebsite: sponsor.sponsor.sponsorCompanyWebsite || "",
      sponsorCompanylogo: sponsor.sponsor.sponsorCompanylogo,
      sponsorshipPlan: sponsor.plan.id,
      competitionId: sponsor.competition.id,
    },
  });

  // Reset form when sponsor prop changes
  useEffect(() => {
    form.reset({
      sponsorId: sponsor.sponsor.sponsorId,
      sponsorCompanyName: sponsor.sponsor.sponsorCompanyName,
      sponsorCompanyDesctiption:
        sponsor.sponsor.sponsorCompanyDesctiption || "",
      sponsorCompanyWebsite: sponsor.sponsor.sponsorCompanyWebsite || "",
      sponsorCompanylogo: sponsor.sponsor.sponsorCompanylogo,
      sponsorshipPlan: sponsor.plan.id,
      competitionId: sponsor.competition.id,
    });
  }, [sponsor, form]);

  const onSubmit = useCallback(
    (values: FormValues) => {
      updateSponsor.mutate(values);
    },
    [updateSponsor]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Edit</Button>}
      </DialogTrigger>

      <DialogContent className="w-full max-w-full sm:max-w-[640px] md:max-w-[760px] max-h-[80vh] overflow-y-auto">
        <div>
          <DialogHeader className="mb-5">
            <DialogTitle>Edit Sponsor</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              id="edit-sponsor-form"
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
                        placeholder="Describe the sponsor company..."
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
                          <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {plans?.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name}
                          </SelectItem>
                        ))}
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
                          <SelectValue placeholder="Select a competition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {competitions?.map((competition) => (
                          <SelectItem
                            key={competition.id}
                            value={competition.id}
                          >
                            {competition.competitionName}
                          </SelectItem>
                        ))}
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
                <Button className="cursor-pointer" type="submit">
                  Update Sponsor
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
