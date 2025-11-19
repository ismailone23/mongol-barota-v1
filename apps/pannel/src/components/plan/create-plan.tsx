"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePlanSchema } from "@workspace/types";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@workspace/ui/components/form";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { useForm } from "react-hook-form";
import z from "zod";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { toast } from "sonner";
import { useCallback, useState } from "react";
import { Plus, X } from "lucide-react";
import { tailwindColors, competitionIcons } from "@/constants/route";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

type FormValues = z.infer<typeof CreatePlanSchema>;

export default function CreatePlanDialog({ refetch }: { refetch: any }) {
  const trpc = useTRPC();
  const [open, setOpen] = useState(false);

  const createPlan = useMutation(
    trpc.team.createPlan.mutationOptions({
      onMutate: () => {
        const toastId = toast.loading("Creating plan...");
        return { toastId };
      },
      onSuccess: async (_data, _vars, ctx) => {
        toast.success("Plan Created", { id: ctx.toastId });
        refetch();
        form.reset();
        setOpen(false);
      },
      onError: (error, _vars, ctx) => {
        toast.error("Failed to create plan", {
          description: error.message,
          id: ctx?.toastId,
        });
      },
    })
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(CreatePlanSchema),
    defaultValues: {
      name: "",
      subtitle: "",
      price: 0,
      priceLabel: "",
      icon: competitionIcons[2]?.value,
      iconColor: tailwindColors[0]?.hex,
      iconBgColor: tailwindColors[2]?.hex,
      borderColor: tailwindColors[3]?.hex,
      isPopular: false,
      displayOrder: 0,
      benefits: [],
      isActive: true,
    },
  });

  const onSubmit = useCallback(
    (values: FormValues) => {
      createPlan.mutate(values);
    },
    [createPlan]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Plan</Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-full sm:max-w-[640px] md:max-w-[760px] max-h-[80vh] overflow-y-auto">
        <div>
          <DialogHeader className="mb-5">
            <DialogTitle>New Sponsorship Plan</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              id="create-plan-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 w-full max-w-full"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Gold Sponsor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Best Value" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="5000"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priceLabel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Label (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="per year" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Icon</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(val) => field.onChange(val)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select an icon" />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            {competitionIcons.map(({ icon: Icon, name }, i) => (
                              <SelectItem value={name} key={i}>
                                <Icon className={`w-4 h-4`} />
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="iconColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon Color</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(val) => field.onChange(val)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a color" />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            {tailwindColors.map(({ hex, name }, i) => (
                              <SelectItem value={hex} key={i}>
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="borderColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Border Color</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(val) => field.onChange(val)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a color" />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            {tailwindColors.map(({ hex, name }, i) => (
                              <SelectItem value={hex} key={i}>
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="iconBgColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon Background Color</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(val) => field.onChange(val)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a color" />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            {tailwindColors.map(({ hex, name }, i) => (
                              <SelectItem value={hex} key={i}>
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="displayOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="benefits"
                render={({ field }) => {
                  const benefits = field.value || [];
                  const addBenefit = () => {
                    field.onChange([...benefits, ""]);
                  };
                  const removeBenefit = (index: number) => {
                    field.onChange(benefits.filter((_, i) => i !== index));
                  };
                  const updateBenefit = (index: number, value: string) => {
                    const updated = [...benefits];
                    updated[index] = value;
                    field.onChange(updated);
                  };

                  return (
                    <FormItem>
                      <FormLabel>Benefits</FormLabel>
                      <div className="space-y-2">
                        {benefits.map((benefit, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              className="flex-1"
                              placeholder="e.g., Logo on website"
                              value={benefit}
                              onChange={(e) =>
                                updateBenefit(index, e.target.value)
                              }
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeBenefit(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addBenefit}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Benefit
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div className="flex gap-6">
                <FormField
                  control={form.control}
                  name="isPopular"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="mt-0!">Mark as Popular</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="mt-0!">Active</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full items-end justify-end flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createPlan.isPending}>
                  {createPlan.isPending ? "Creating..." : "Create Plan"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
