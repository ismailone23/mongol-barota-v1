"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateRoverSchema } from "@workspace/types";
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
import { Textarea } from "@workspace/ui/components/textarea";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { toast } from "sonner";
import { useCallback, useState } from "react";
import { Plus, X } from "lucide-react";

type FormValues = z.infer<typeof CreateRoverSchema>;

export default function CreateRoverDialog({ refetch }: { refetch: any }) {
  const trpc = useTRPC();
  const [open, setOpen] = useState(false);

  const createRover = useMutation(
    trpc.competition.createRover.mutationOptions({
      onMutate: () => {
        const toastId = toast.loading("Adding Rover...");
        return { toastId };
      },
      onSuccess: async (_data, _vars, ctx) => {
        toast.success("Rover Added", { id: ctx.toastId });
        refetch();
        form.reset();
        setOpen(false);
      },
      onError: (error, _vars, ctx) => {
        toast.error("Failed to add rover", {
          description: error.message,
          id: ctx?.toastId,
        });
      },
    })
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(CreateRoverSchema),
    defaultValues: {
      name: "",
      image: "",
      description: "",
      weight: "",
      power: "",
      arm: "",
      dimentions: "",
      from: new Date(),
      until: undefined,
    },
  });

  const onSubmit = useCallback(
    (values: FormValues) => {
      createRover.mutate(values);
    },
    [createRover]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Rover</Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-full sm:max-w-[640px] md:max-w-[760px] max-h-[80vh] overflow-y-auto">
        <div>
          <DialogHeader className="mb-5">
            <DialogTitle>New Rover</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              id="create-rover-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 w-full max-w-full"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rover Name</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="Mars Explorer"
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
                        placeholder="https://example.com/rover.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => {
                  const tags = field.value || [];
                  const addTag = () => {
                    field.onChange([...tags, ""]);
                  };
                  const removeTag = (index: number) => {
                    field.onChange(tags.filter((_, i) => i !== index));
                  };
                  const updateTag = (index: number, value: string) => {
                    const updated = [...tags];
                    updated[index] = value;
                    field.onChange(updated);
                  };

                  return (
                    <FormItem>
                      <FormLabel>tags (optional)</FormLabel>
                      <div className="space-y-2">
                        {tags.map((tag, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              className="flex-1"
                              placeholder="e.g., Autonomous navigation"
                              value={tag}
                              onChange={(e) => updateTag(index, e.target.value)}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeTag(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addTag}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Tag
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
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
                        placeholder="Describe the rover's purpose and capabilities..."
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
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full"
                            placeholder="25 kg"
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
                    name="power"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Power</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full"
                            placeholder="100W Solar"
                            {...field}
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
                name="arm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arm Details</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="5-DOF robotic arm with gripper"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dimentions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dimensions</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="120cm x 80cm x 60cm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="features"
                render={({ field }) => {
                  const features = field.value || [];
                  const addFeature = () => {
                    field.onChange([...features, ""]);
                  };
                  const removeFeature = (index: number) => {
                    field.onChange(features.filter((_, i) => i !== index));
                  };
                  const updateFeature = (index: number, value: string) => {
                    const updated = [...features];
                    updated[index] = value;
                    field.onChange(updated);
                  };

                  return (
                    <FormItem>
                      <FormLabel>Features (optional)</FormLabel>
                      <div className="space-y-2">
                        {features.map((feature, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              className="flex-1"
                              placeholder="e.g., Autonomous navigation"
                              value={feature}
                              onChange={(e) =>
                                updateFeature(index, e.target.value)
                              }
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeFeature(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addFeature}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Feature
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="keyAchievements"
                render={({ field }) => {
                  const achievements = field.value || [];
                  const addAchievement = () => {
                    field.onChange([...achievements, ""]);
                  };
                  const removeAchievement = (index: number) => {
                    field.onChange(achievements.filter((_, i) => i !== index));
                  };
                  const updateAchievement = (index: number, value: string) => {
                    const updated = [...achievements];
                    updated[index] = value;
                    field.onChange(updated);
                  };

                  return (
                    <FormItem>
                      <FormLabel>Key Achievements (optional)</FormLabel>
                      <div className="space-y-2">
                        {achievements.map((achievement, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              className="flex-1"
                              placeholder="e.g., First place in regional competition"
                              value={achievement}
                              onChange={(e) =>
                                updateAchievement(index, e.target.value)
                              }
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeAchievement(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addAchievement}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Achievement
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div className="flex flex-col sm:flex-row sm:space-x-4 w-full gap-4 sm:gap-0">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="from"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Active From</FormLabel>
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

                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="until"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Active Until (optional)</FormLabel>
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
                                : undefined;
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

              <div className="w-full items-end justify-end flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button className="cursor-pointer" type="submit">
                  Create Rover
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
