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
import { uploadImage } from "@/utils";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Fetch plans and competitions for dropdowns
  const { data: plans } = useQuery(trpc.team.getPlans.queryOptions());
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
        setSelectedFile(null);
        setPreviewUrl("");
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
      id: sponsor.sponsor.id,
      name: sponsor.sponsor.name,
      desctiption: sponsor.sponsor.desctiption || "",
      website: sponsor.sponsor.website || "",
      logo: sponsor.sponsor.logo,
      plan: sponsor.plan.id,
      competitionId: sponsor.competition.id,
    },
  });

  // Reset form when sponsor prop changes
  useEffect(() => {
    form.reset({
      id: sponsor.sponsor.id,
      name: sponsor.sponsor.name,
      desctiption: sponsor.sponsor.desctiption || "",
      website: sponsor.sponsor.website || "",
      logo: sponsor.sponsor.logo,
      plan: sponsor.plan.id,
      competitionId: sponsor.competition.id,
    });
    setSelectedFile(null);
    setPreviewUrl("");
  }, [sponsor, form]);
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
        let imageUrl = values.logo;

        // Only upload if a new file was selected
        if (selectedFile) {
          const uploadToastId = toast.loading("Uploading image...");
          try {
            imageUrl = await uploadImage(selectedFile);
            toast.success("Image uploaded", { id: uploadToastId });
          } catch (error) {
            toast.error("Failed to upload image", { id: uploadToastId });
            return;
          }
        }

        // Update with the new image URL (or keep the old one)
        updateSponsor.mutate({
          ...values,
          logo: imageUrl,
        });
      } catch (error) {
        toast.error("An error occurred");
        console.log(error);
      }
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
                name="name"
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
                name="desctiption"
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
                name="website"
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
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company logo</FormLabel>
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
                name="plan"
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
                            {competition.name}
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
