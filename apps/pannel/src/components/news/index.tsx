"use client";

import { useTRPC } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { NewsArticleSelect } from "@workspace/db/schema";
import { CreateNewsArticleSchema } from "@workspace/types";
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

type FormValues = z.input<typeof CreateNewsArticleSchema>;

function NewsForm({
  item,
  onDone,
}: {
  item?: NewsArticleSelect;
  onDone: () => void;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<File[]>([]);

  const createNews = useMutation(
    trpc.news.create.mutationOptions({
      onSuccess: () => {
        toast.success("News created");
        void queryClient.invalidateQueries(trpc.news.getAll.queryOptions());
        onDone();
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const updateNews = useMutation(
    trpc.news.update.mutationOptions({
      onSuccess: () => {
        toast.success("News updated");
        void queryClient.invalidateQueries(trpc.news.getAll.queryOptions());
        onDone();
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(CreateNewsArticleSchema),
    defaultValues: {
      slug: item?.slug ?? "",
      title: item?.title ?? "",
      excerpt: item?.excerpt ?? "",
      body: item?.body ?? "",
      category: item?.category ?? "Achievement",
      image: item?.image ?? "",
      images: item?.images ?? [],
      isPublished: item?.isPublished ?? true,
      publishedAt: item?.publishedAt ?? new Date(),
    },
  });

  useEffect(() => {
    if (!item) return;
    form.reset({
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      body: item.body ?? "",
      category: item.category,
      image: item.image ?? "",
      images: item.images ?? [],
      isPublished: item.isPublished,
      publishedAt: item.publishedAt,
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
          updateNews.mutate({ id: item.id, ...payload });
        } else {
          createNews.mutate(payload);
        }
      } catch (error) {
        toast.error("Failed to upload image(s)");
        console.error(error);
      }
    },
    [item, createNews, updateNews, selectedCoverFile, selectedGalleryFiles],
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
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="urc-2026-announcement" {...field} />
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
          </FormItem>
          <p className="text-xs text-muted-foreground mt-1">
            Upload a primary image for this news post.
          </p>
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
          </FormItem>
          <p className="text-xs text-muted-foreground mt-1">
            {selectedGalleryFiles.length > 0
              ? `${selectedGalleryFiles.length} files selected`
              : "Select one or more gallery images."}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Achievement" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body</FormLabel>
              <FormControl>
                <Textarea rows={6} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={createNews.isPending || updateNews.isPending}
          >
            {item ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function NewsManager() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery(
    trpc.news.getAll.queryOptions(),
  );

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<NewsArticleSelect | undefined>();

  const deleteNews = useMutation(
    trpc.news.delete.mutationOptions({
      onSuccess: () => {
        toast.success("News deleted");
        void queryClient.invalidateQueries(trpc.news.getAll.queryOptions());
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">News</h2>
          <p className="text-sm text-muted-foreground">
            Manage news articles ({data?.length ?? 0} total)
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
              <Plus className="mr-2 h-4 w-4" /> Add News
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[720px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit News" : "Create News"}</DialogTitle>
            </DialogHeader>
            <NewsForm
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
          No news found
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="secondary">{item.category}</Badge>
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
                        if (confirm(`Delete news: ${item.title}?`)) {
                          deleteNews.mutate({ id: item.id });
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-semibold line-clamp-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {item.excerpt}
                </p>
                <p className="text-xs text-muted-foreground">
                  Slug: {item.slug}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
