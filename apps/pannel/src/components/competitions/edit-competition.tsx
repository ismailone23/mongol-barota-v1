"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateCompetitionSchema, competitionRegions } from "@workspace/types";
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
} from "@workspace/ui/components/form";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@workspace/ui/components/select";
import { Textarea } from "@workspace/ui/components/textarea";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { CompetitionsInsert } from "@workspace/db/schema";
import { Plus, X } from "lucide-react";
import { competitionIcons, tailwindColors } from "@/constants/route";
type FormValues = z.infer<typeof UpdateCompetitionSchema>;

interface EditCompetitionDialogProps {
  competition: CompetitionsInsert;
  trigger?: React.ReactNode;
  refetch: any;
}

export default function EditCompetitionDialog({
  refetch,
  competition,
  trigger,
}: EditCompetitionDialogProps) {
  const trpc = useTRPC();
  const [open, setOpen] = useState(false);

  // Fetch rovers for the select dropdown
  const { data: rovers, isLoading: roversLoading } = useQuery(
    trpc.competition.getRovers.queryOptions()
  );

  const updateCompetition = useMutation(
    trpc.competition.updateCompetition.mutationOptions({
      onMutate: () => {
        const toastId = toast.loading("Updating competition...");
        return { toastId };
      },
      onSuccess: (_data, _vars, ctx) => {
        toast.success("Competition Updated", { id: ctx.toastId });
        refetch();
        setOpen(false);
      },
      onError: (error, _vars, ctx) => {
        toast.error("Failed to update competition", {
          description: error.message,
          id: ctx?.toastId,
        });
      },
    })
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(UpdateCompetitionSchema),
    defaultValues: {
      id: competition.id,
      competitionRegionName: competition.competitionRegionName,
      competitionName: competition.competitionName,
      competitionDescription: competition.competitionDescription,
      location: competition.location,
      roverId: competition.roverId,
      competitionResult: competition.competitionResult,
      featured: competition.featured ?? false,
      image: competition.image,
      color: competition.color,
      bgColor: competition.bgColor,
      icon: competition.icon,
      participationYear: competition.participationYear,
    },
  });

  // Reset form when competition prop changes
  useEffect(() => {
    form.reset({
      id: competition.id,
      competitionRegionName: competition.competitionRegionName,
      competitionName: competition.competitionName,
      competitionDescription: competition.competitionDescription,
      location: competition.location,
      roverId: competition.roverId,
      competitionResult: competition.competitionResult,
      featured: competition.featured ?? false,
      image: competition.image,
      color: competition.color,
      bgColor: competition.bgColor,
      icon: competition.icon,
      participationYear: competition.participationYear,
    });
  }, [competition, form]);

  const onSubmit = useCallback(
    (values: FormValues) => {
      updateCompetition.mutate(values);
    },
    [updateCompetition]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Edit</Button>}
      </DialogTrigger>

      <DialogContent className="w-full max-w-full sm:max-w-[640px] md:max-w-[760px] max-h-[80vh] overflow-y-auto">
        <div>
          <DialogHeader className="mb-5">
            <DialogTitle>Edit Competition</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              id="edit-competition-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 w-full max-w-full"
            >
              <FormField
                control={form.control}
                name="competitionRegionName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Competition Region</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(val) => field.onChange(val)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select competition region" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          {competitionRegions.map((region) => (
                            <SelectItem value={region} key={region}>
                              {region}
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
                name="competitionName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Competition Name</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="URC 2024"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="competitionDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="w-full"
                        placeholder="Describe the competition..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row sm:space-x-4 w-full gap-4 sm:gap-0">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full"
                            placeholder="Utah, USA"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="participationYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Participation Year</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="w-full"
                            value={
                              field.value
                                ? new Date(field.value)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(e) => {
                              const date = e.target.value
                                ? new Date(e.target.value)
                                : new Date();
                              field.onChange(date);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="roverId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rover</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(val) => field.onChange(val)}
                        disabled={roversLoading}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a rover" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          {rovers?.map((rover) => (
                            <SelectItem value={rover.id} key={rover.id}>
                              {rover.name}
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
                name="competitionResult"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Competition Result</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="1st Place"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="https://example.com/competition.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(val) => field.onChange(val)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an icon" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          {competitionIcons.map(({ icon: Icon, value }, i) => (
                            <SelectItem value={value} key={i}>
                              <Icon className="w-4 h-4" /> {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row sm:space-x-4 w-full gap-4 sm:gap-0">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
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

                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="bgColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Background Color</FormLabel>
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
              </div>

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured Competition</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="highlights"
                render={({ field }) => {
                  const highlights = field.value || [];
                  const addHighlight = () => {
                    field.onChange([...highlights, ""]);
                  };
                  const removeHighlight = (index: number) => {
                    field.onChange(highlights.filter((_, i) => i !== index));
                  };
                  const updateHighlight = (index: number, value: string) => {
                    const updated = [...highlights];
                    updated[index] = value;
                    field.onChange(updated);
                  };

                  return (
                    <FormItem>
                      <FormLabel>Highlights (optional)</FormLabel>
                      <div className="space-y-2">
                        {highlights.map((highlight, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              className="flex-1"
                              placeholder="e.g., Won autonomous navigation task"
                              value={highlight}
                              onChange={(e) =>
                                updateHighlight(index, e.target.value)
                              }
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeHighlight(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addHighlight}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Highlight
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
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
                  Update Competition
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
