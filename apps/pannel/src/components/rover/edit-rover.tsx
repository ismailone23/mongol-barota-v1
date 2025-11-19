"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateRoverSchema } from "@workspace/types";
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
import { useCallback, useEffect, useState } from "react";
import { RoversInsert } from "@workspace/db/schema";
import { Plus, X } from "lucide-react";
import { uploadImage } from "@/utils";

type FormValues = z.infer<typeof UpdateRoverSchema>;

interface EditRoverDialogProps {
  rover: RoversInsert;
  trigger?: React.ReactNode;
  refetch: any;
}

export default function EditRoverDialog({
  refetch,
  rover,
  trigger,
}: EditRoverDialogProps) {
  const trpc = useTRPC();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const updateRover = useMutation(
    trpc.competition.updateRover.mutationOptions({
      onMutate: () => {
        const toastId = toast.loading("Updating rover...");
        return { toastId };
      },
      onSuccess: (_data, _vars, ctx) => {
        toast.success("Rover Updated", { id: ctx.toastId });
        refetch();
        setOpen(false);
        setSelectedFile(null);
        setPreviewUrl("");
      },
      onError: (error, _vars, ctx) => {
        toast.error("Failed to update rover", {
          description: error.message,
          id: ctx?.toastId,
        });
      },
    })
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(UpdateRoverSchema),
    defaultValues: {
      id: rover.id,
      name: rover.name,
      image: rover.image,
      description: rover.description,
      spec: rover.spec,
      features: rover.features,
      status: rover.status,
      achievements: rover.achievements,
      year: rover.year,
      ended: rover.ended || undefined,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        id: rover.id,
        name: rover.name,
        image: rover.image,
        status: rover.status,
        description: rover.description,
        features: rover.features,
        achievements: rover.achievements,
        spec: rover.spec,
        year: rover.year,
        ended: rover.ended || undefined,
      });
      setSelectedFile(null);
      setPreviewUrl("");
    }
  }, [rover, form, open]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFile(file);
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
        updateRover.mutate({
          ...values,
          image: imageUrl,
        });
      } catch (error) {
        toast.error("An error occurred");
        console.log(error);
      }
    },
    [updateRover, selectedFile]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Edit</Button>}
      </DialogTrigger>

      <DialogContent className="w-full max-w-full sm:max-w-[640px] md:max-w-[760px] max-h-[80vh] overflow-y-auto">
        <div>
          <DialogHeader className="mb-5">
            <DialogTitle>Edit Rover</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              id="edit-rover-form"
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="Current Status"
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
                    name="spec.weight"
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
                    name="spec.power"
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

              <div className="flex flex-col sm:flex-row sm:space-x-4 w-full gap-4 sm:gap-0">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="spec.arm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Arm</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full"
                            placeholder="30cm adolf"
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
                    name="spec.dimensions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dimensions</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full"
                            placeholder="1.1m x 1.2m"
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
                name="achievements"
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
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Active year</FormLabel>
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
                    name="ended"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Active ended (optional)</FormLabel>
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
                  Update Rover
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
