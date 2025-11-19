"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateCompetitionSchema,
  RegionRecord,
  RegionKey,
} from "@workspace/types";
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
import { uploadImage } from "@/utils";

type FormValues = z.infer<typeof UpdateCompetitionSchema>;

interface EditCompetitionDialogProps {
  competition: CompetitionsInsert & {
    teamMemberCompetitions?: Array<{ teamMemberId: string }>;
  };
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const { data: rovers, isLoading: roversLoading } = useQuery(
    trpc.competition.getRovers.queryOptions()
  );

  const { data: teamMembers, isLoading: teamMembersLoading } = useQuery(
    trpc.team.getMembers.queryOptions()
  );

  const { data: competitionWithMembers } = useQuery(
    trpc.competition.getCompetitionWithMembers.queryOptions(
      {
        id: competition.id!,
      },
      { enabled: !!competition }
    )
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
        setSelectedFile(null);
        setPreviewUrl("");
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
      region: competition.region,
      name: competition.name,
      description: competition.description,
      location: competition.location,
      roverId: competition.roverId,
      result: competition.result,
      featured: competition.featured ?? false,
      image: competition.image,
      iconColor: competition.iconColor,
      iconBg: competition.iconBg,
      icon: competition.icon,
      highlights: competition.highlights,
      year: competition.year,
      teamMemberIds: [], // Will be set when data loads
    },
  });

  // NEW: Update form when competition with members data loads
  useEffect(() => {
    if (competitionWithMembers) {
      const memberIds =
        competitionWithMembers.competitionMembers?.map(
          (tc) => tc.teamMember.id
        ) || [];

      form.reset({
        id: competition.id,
        region: competition.region,
        name: competition.name,
        description: competition.description,
        location: competition.location,
        roverId: competition.roverId,
        result: competition.result,
        featured: competition.featured ?? false,
        image: competition.image,
        iconColor: competition.iconColor,
        iconBg: competition.iconBg,
        highlights: competition.highlights,
        icon: competition.icon,
        year: competition.year,
        teamMemberIds: memberIds,
      });
      setSelectedFile(null);
      setPreviewUrl("");
    }
  }, [competitionWithMembers, competition, form]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        // Create preview URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    },
    []
  );

  const onSubmit = useCallback(
    async (values: FormValues) => {
      try {
        let imageUrl = values.image;

        // Only upload if a new file was selected
        if (selectedFile) {
          const uploadToastId = toast.loading("Uploading image...");
          try {
            imageUrl = await uploadImage(selectedFile);
            toast.success("Image uploaded", { id: uploadToastId });
          } catch (error) {
            toast.error(`Failed to upload image: ${error}`, {
              id: uploadToastId,
            });
            return;
          }
        }

        // Update with the new image URL (or keep the old one)
        updateCompetition.mutate({
          ...values,
          image: imageUrl,
        });
      } catch (error) {
        toast.error("An error occurred");
        console.log(error);
      }
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
                name="region"
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
                          {Object.keys(RegionRecord).map((region) => (
                            <SelectItem value={region} key={region}>
                              {RegionRecord[region as RegionKey]}
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
                name="name"
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
                name="description"
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
                    name="year"
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

              {/* NEW: Team Members Multi-Select */}
              <FormField
                control={form.control}
                name="teamMemberIds"
                render={({ field }) => {
                  const selectedIds = field.value || [];

                  const toggleMember = (memberId: string) => {
                    const newIds = selectedIds.includes(memberId)
                      ? selectedIds.filter((id) => id !== memberId)
                      : [...selectedIds, memberId];
                    field.onChange(newIds);
                  };

                  return (
                    <FormItem>
                      <FormLabel>Team Members</FormLabel>
                      <FormDescription>
                        Select team members who participated in this competition
                      </FormDescription>
                      <FormControl>
                        <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                          {teamMembersLoading ? (
                            <p className="text-sm text-muted-foreground">
                              Loading team members...
                            </p>
                          ) : !teamMembers || teamMembers.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              No team members available
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {teamMembers.map((member) => (
                                <div
                                  key={member.id}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    checked={selectedIds.includes(member.id)}
                                    onCheckedChange={() =>
                                      toggleMember(member.id)
                                    }
                                  />
                                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                    {member.name} - {member.role}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      {selectedIds.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          {selectedIds.length} member
                          {selectedIds.length !== 1 ? "s" : ""} selected
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="result"
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
                    <FormLabel>Rover Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full"
                          />
                        </div>
                        {(previewUrl || field.value) && (
                          <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                            <img
                              src={previewUrl || field.value}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
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
                              <Icon className="w-4 h-4" />
                              {value}
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
                    name="iconColor"
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
                    name="iconBg"
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
