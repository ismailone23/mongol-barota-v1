"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateMemberSchema,
  SubTeamKey,
  SubTeamRecord,
} from "@workspace/types";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogClose,
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
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { toast } from "sonner";
import { useCallback, useState } from "react";
import { uploadImage } from "@/utils";

type FormValues = z.infer<typeof CreateMemberSchema>;

export default function CreateMemberDialog({ refetch }: { refetch: any }) {
  const trpc = useTRPC();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const createMember = useMutation(
    trpc.team.createMember.mutationOptions({
      onMutate: () => {
        const toastId = toast.loading("Adding member...");
        return { toastId };
      },
      onSuccess: async (_data, _vars, ctx) => {
        toast.success("Member Created", { id: ctx.toastId });
        refetch();
        form.reset();
        setOpen(false);
        setSelectedFile(null);
        setPreviewUrl("");
      },
      onError: (error, _vars, ctx) => {
        toast.error("Failed to create member", {
          description: error.message,
          id: ctx?.toastId,
        });
      },
    }),
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(CreateMemberSchema),
    defaultValues: {
      name: "",
      image: "",
      department: "",
      subTeam: "ST",
      about: "",
      email: "",
      phone: "",
      linkedin: "",
      github: "",
      bio: "",
      title: "",
    },
  });

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
    [],
  );

  const onSubmit = useCallback(
    async (values: FormValues) => {
      try {
        let imageUrl = values.image;

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

        // Mutate with the uploaded image URL
        createMember.mutate({
          ...values,
          image: imageUrl,
        });
      } catch (error) {
        toast.error(`An error occurred ${error}`);
        console.log(error);
      }
    },
    [createMember],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Member</Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-full sm:max-w-[640px] md:max-w-[760px] max-h-[80vh] overflow-y-auto">
        <div>
          <DialogHeader className="mb-5">
            <DialogTitle>New Member</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              id="create-member-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 w-full max-w-full"
            >
              <div className="flex flex-col sm:flex-row sm:space-x-4 w-full gap-4 sm:gap-0">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full"
                            placeholder="John Doe"
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
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full"
                            placeholder="Lt Col | Lecturer"
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
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Member Photo</FormLabel>
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
                        {previewUrl && (
                          <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                            <img
                              src={previewUrl}
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
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="Team Lead | Team Leader"
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
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full"
                            placeholder="Engineering"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-full sm:w-56">
                  <FormField
                    control={form.control}
                    name="subTeam"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sub Team</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value ?? ""}
                            onValueChange={(val) => field.onChange(val)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select member type" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                              {Object.keys(SubTeamRecord).map((label) => (
                                <SelectItem value={label} key={label}>
                                  {SubTeamRecord[label as SubTeamKey]}
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
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About</FormLabel>
                    <FormControl>
                      <Textarea
                        className="w-full"
                        placeholder="Short about text..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        className="w-full"
                        placeholder="Long bio..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (optional)</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="example@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (optional)</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="+1234567890"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn (optional)</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="https://linkedin.com/in/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="github"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub (optional)</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="https://github.com/..."
                        {...field}
                      />
                    </FormControl>
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
                  Create Team Member
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
