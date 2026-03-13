"use client";

import { useTRPC } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MediaCoverageSelect } from "@workspace/db/schema";
import { CreateMediaCoverageSchema } from "@workspace/types";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { uploadImage } from "@/utils";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

type FormValues = z.input<typeof CreateMediaCoverageSchema>;

function MediaForm({
  item,
  onDone,
}: {
  item?: MediaCoverageSelect;
  onDone: () => void;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<File[]>([]);

  const createMedia = useMutation(
    trpc.media.create.mutationOptions({
      onSuccess: () => {
        toast.success("Media item created");
        void queryClient.invalidateQueries(trpc.media.getAll.queryOptions());
        onDone();
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const updateMedia = useMutation(
    trpc.media.update.mutationOptions({
      onSuccess: () => {
        toast.success("Media item updated");
        void queryClient.invalidateQueries(trpc.media.getAll.queryOptions());
        onDone();
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(CreateMediaCoverageSchema),
    defaultValues: {
      title: item?.title ?? "",
      outlet: item?.outlet ?? "",
      type: (item?.type as "tv" | "print" | "online") ?? "online",
      year: item?.year ?? "2026",
      date: item?.date ?? "",
      description: item?.description ?? "",
      image: item?.image ?? "",
      images: item?.images ?? [],
      link: item?.link ?? "",
      displayOrder: item?.displayOrder ?? 0,
      isActive: item?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (!item) return;
    form.reset({
      title: item.title,
      outlet: item.outlet,
      type: item.type as "tv" | "print" | "online",
      year: item.year,
      date: item.date,
      description: item.description ?? "",
      image: item.image ?? "",
      images: item.images ?? [],
      link: item.link ?? "",
      displayOrder: item.displayOrder,
      isActive: item.isActive,
    });
  }, [item, form]);

  const onSubmit = useCallback(
    async (values: FormValues) => {
      try {
        let coverImage = values.image;
        if (selectedCoverFile) {
          const toastId = toast.loading("Uploading cover image...");
          coverImage = await uploadImage(selectedCoverFile);
          toast.success("Cover image uploaded", { id: toastId });
        }

        let uploadedGalleryImages: string[] = [];
        if (selectedGalleryFiles.length > 0) {
          const toastId = toast.loading("Uploading gallery images...");
          uploadedGalleryImages = await Promise.all(
            selectedGalleryFiles.map((file) => uploadImage(file)),
          );
          toast.success("Gallery images uploaded", { id: toastId });
        }

        const payload: FormValues = {
          ...values,
          image: coverImage,
          images: [...(values.images ?? []), ...uploadedGalleryImages],
        };

        if (item) {
          updateMedia.mutate({ id: item.id, ...payload });
        } else {
          createMedia.mutate(payload);
        }
      } catch (error) {
        toast.error("Failed to upload image(s)");
        console.error(error);
      }
    },
    [item, createMedia, updateMedia, selectedCoverFile, selectedGalleryFiles],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="outlet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Outlet</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormItem>
            <FormLabel>Upload Cover Image</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setSelectedCoverFile(e.target.files?.[0] ?? null)
                }
              />
            </FormControl>
            <p className="text-xs text-muted-foreground mt-1">
              Upload a primary image for this post.
            </p>
          </FormItem>
          <FormItem>
            <FormLabel>Upload Multiple Gallery Images</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setSelectedGalleryFiles(Array.from(e.target.files ?? []))
                }
              />
            </FormControl>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedGalleryFiles.length > 0
                ? `${selectedGalleryFiles.length} files selected`
                : "Select one or more gallery images."}
            </p>
          </FormItem>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Input placeholder="tv / print / online" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date label</FormLabel>
                <FormControl>
                  <Input placeholder="June 2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>External Link</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={createMedia.isPending || updateMedia.isPending}
          >
            {item ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function MediaManager() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery(
    trpc.media.getAll.queryOptions(),
  );
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MediaCoverageSelect | undefined>();

  const deleteMedia = useMutation(
    trpc.media.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Media item deleted");
        void queryClient.invalidateQueries(trpc.media.getAll.queryOptions());
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Media</h2>
          <p className="text-sm text-muted-foreground">
            Manage media coverage ({data?.length ?? 0} total)
          </p>
        </div>
        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) setEditing(undefined);
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Media
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[720px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Media" : "Create Media"}
              </DialogTitle>
            </DialogHeader>
            <MediaForm
              item={editing}
              onDone={() => {
                setOpen(false);
                setEditing(undefined);
                void refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="rounded-md border p-8 text-center text-muted-foreground">
          Loading...
        </div>
      ) : !data || data.length === 0 ? (
        <div className="rounded-md border p-8 text-center text-muted-foreground">
          No media items found
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex gap-2">
                    <Badge variant="secondary">{item.type}</Badge>
                    <Badge variant="outline">{item.year}</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditing(item);
                        setOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        if (confirm(`Delete media: ${item.title}?`)) {
                          deleteMedia.mutate({ id: item.id });
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-semibold line-clamp-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.outlet}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
