"use client";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateSiteContentSchema } from "@workspace/types";
import { FileText, ImageIcon, Pencil, Plus, Trash2, Clock } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import type { SiteContentSelect } from "@workspace/db/schema";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { uploadImage } from "@/utils";

type FormValues = z.infer<typeof CreateSiteContentSchema>;

function ContentForm({
  item,
  onDone,
}: {
  item?: SiteContentSelect;
  onDone: () => void;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const upsert = useMutation(
    trpc.content.upsertSiteContent.mutationOptions({
      onMutate: () => {
        const toastId = toast.loading(item ? "Updating..." : "Creating...");
        return { toastId };
      },
      onSuccess: (_data, _vars, ctx) => {
        toast.success(item ? "Content updated" : "Content created", {
          id: ctx.toastId,
        });
        void queryClient.invalidateQueries(
          trpc.content.getSiteContent.queryOptions(),
        );
        onDone();
      },
      onError: (error, _vars, ctx) => {
        toast.error("Failed", { description: error.message, id: ctx?.toastId });
      },
    }),
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(CreateSiteContentSchema),
    defaultValues: {
      key: item?.key ?? "",
      title: item?.title ?? "",
      body: item?.body ?? "",
      image: item?.image ?? "",
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        key: item.key,
        title: item.title ?? "",
        body: item.body,
        image: item.image ?? "",
      });
    }
  }, [item, form]);

  const onSubmit = useCallback(
    async (values: FormValues) => {
      try {
        let image = values.image;
        if (selectedImageFile) {
          const toastId = toast.loading("Uploading image...");
          image = await uploadImage(selectedImageFile);
          toast.success("Image uploaded", { id: toastId });
        }

        upsert.mutate({
          ...values,
          image,
        });
      } catch (error) {
        toast.error("Failed to upload image");
        console.error(error);
      }
    },
    [upsert, selectedImageFile],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. mission, vision, about_hero"
                  disabled={!!item}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Section title" {...field} />
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
                <Textarea rows={6} placeholder="Content body..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Upload Image (optional)</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setSelectedImageFile(e.target.files?.[0] ?? null)
              }
            />
          </FormControl>
          <p className="text-xs text-muted-foreground">
            {selectedImageFile
              ? `Selected: ${selectedImageFile.name}`
              : item?.image
                ? "No new file selected. Existing image will be kept."
                : "Upload an image if this section needs one."}
          </p>
        </FormItem>
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={upsert.isPending}>
            {upsert.isPending ? "Saving..." : item ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function SiteContent() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(
    trpc.content.getSiteContent.queryOptions(),
  );
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SiteContentSelect | undefined>();

  const deleteContent = useMutation(
    trpc.content.deleteSiteContent.mutationOptions({
      onMutate: () => {
        const toastId = toast.loading("Deleting...");
        return { toastId };
      },
      onSuccess: (_data, _vars, ctx) => {
        toast.success("Deleted", { id: ctx.toastId });
        void queryClient.invalidateQueries(
          trpc.content.getSiteContent.queryOptions(),
        );
      },
      onError: (error, _vars, ctx) => {
        toast.error("Failed", { description: error.message, id: ctx?.toastId });
      },
    }),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Site Content
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage key-value content blocks used across website pages
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
              <Plus className="mr-2 h-4 w-4" /> Add Content
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[640px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Content" : "New Content"}
              </DialogTitle>
            </DialogHeader>
            <ContentForm
              item={editing}
              onDone={() => {
                setOpen(false);
                setEditing(undefined);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No content yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Add your first content block — things like mission, vision, and
              hero text that appear across website pages.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <Card
              key={item.id}
              className="group relative hover:shadow-md transition-shadow"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {item.key}
                  </Badge>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => {
                              setEditing(item);
                              setOpen(true);
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => {
                              if (confirm(`Delete "${item.key}"?`)) {
                                deleteContent.mutate({ id: item.id });
                              }
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {item.title && (
                  <h3 className="font-semibold text-sm mb-1.5 line-clamp-1">
                    {item.title}
                  </h3>
                )}

                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {item.body}
                </p>

                <Separator className="my-3" />

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </div>
                  {item.image && (
                    <div className="flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" />
                      Has image
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {data?.length ?? 0} content{" "}
        {(data?.length ?? 0) === 1 ? "block" : "blocks"} total
      </p>
    </div>
  );
}
