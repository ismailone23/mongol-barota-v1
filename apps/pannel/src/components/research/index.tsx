"use client";

import { useTRPC } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ResearchPaperSelect } from "@workspace/db/schema";
import { CreateResearchPaperSchema } from "@workspace/types";
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
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

type FormValues = z.infer<typeof CreateResearchPaperSchema>;

type FormShape = Omit<FormValues, "authors" | "keywords"> & {
  authorsText: string;
  keywordsText: string;
};

function ResearchForm({
  item,
  onDone,
}: {
  item?: ResearchPaperSelect;
  onDone: () => void;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createResearch = useMutation(
    trpc.research.create.mutationOptions({
      onSuccess: () => {
        toast.success("Research paper created");
        void queryClient.invalidateQueries(trpc.research.getAll.queryOptions());
        onDone();
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const updateResearch = useMutation(
    trpc.research.update.mutationOptions({
      onSuccess: () => {
        toast.success("Research paper updated");
        void queryClient.invalidateQueries(trpc.research.getAll.queryOptions());
        onDone();
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const form = useForm<FormShape>({
    resolver: zodResolver(
      CreateResearchPaperSchema.extend({
        authorsText: z.string(),
        keywordsText: z.string(),
      }),
    ),
    defaultValues: {
      title: item?.title ?? "",
      authorsText: item?.authors?.join(", ") ?? "",
      journal: item?.journal ?? "",
      year: item?.year ?? "",
      doi: item?.doi ?? "",
      url: item?.url ?? "",
      abstract: item?.abstract ?? "",
      keywordsText: item?.keywords?.join(", ") ?? "",
      category: item?.category ?? "Conference Paper",
      venue: item?.venue ?? "",
      pages: item?.pages ?? "",
      publisher: item?.publisher ?? "",
      isOpenAccess: item?.isOpenAccess ?? false,
      displayOrder: item?.displayOrder ?? 0,
      isActive: item?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (!item) return;
    form.reset({
      title: item.title,
      authorsText: item.authors.join(", "),
      journal: item.journal,
      year: item.year,
      doi: item.doi ?? "",
      url: item.url ?? "",
      abstract: item.abstract ?? "",
      keywordsText: item.keywords.join(", "),
      category: item.category,
      venue: item.venue ?? "",
      pages: item.pages ?? "",
      publisher: item.publisher ?? "",
      isOpenAccess: item.isOpenAccess,
      displayOrder: item.displayOrder,
      isActive: item.isActive,
    });
  }, [item, form]);

  const onSubmit = useCallback(
    (values: FormShape) => {
      const payload: FormValues = {
        title: values.title,
        authors: values.authorsText
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean),
        journal: values.journal,
        year: values.year,
        doi: values.doi,
        url: values.url,
        abstract: values.abstract,
        keywords: values.keywordsText
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean),
        category: values.category,
        venue: values.venue,
        pages: values.pages,
        publisher: values.publisher,
        isOpenAccess: values.isOpenAccess,
        displayOrder: values.displayOrder,
        isActive: values.isActive,
      };

      if (item) {
        updateResearch.mutate({ id: item.id, ...payload });
      } else {
        createResearch.mutate(payload);
      }
    },
    [item, createResearch, updateResearch],
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
            name="journal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Journal/Platform</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="authorsText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Authors (comma separated)</FormLabel>
                <FormControl>
                  <Input placeholder="Author A, Author B" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="keywordsText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keywords (comma separated)</FormLabel>
                <FormControl>
                  <Input placeholder="Robotics, Mars Rover" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input {...field} />
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
            name="doi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DOI</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="venue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Venue</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="abstract"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Abstract</FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={createResearch.isPending || updateResearch.isPending}
          >
            {item ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function ResearchManager() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery(
    trpc.research.getAll.queryOptions(),
  );

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ResearchPaperSelect | undefined>();

  const deleteResearch = useMutation(
    trpc.research.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Research paper deleted");
        void queryClient.invalidateQueries(trpc.research.getAll.queryOptions());
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Research</h2>
          <p className="text-sm text-muted-foreground">
            Manage research papers ({data?.length ?? 0} total)
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
              <Plus className="mr-2 h-4 w-4" /> Add Paper
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[760px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Paper" : "Create Paper"}
              </DialogTitle>
            </DialogHeader>
            <ResearchForm
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
          No research papers found
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
                        if (confirm(`Delete paper: ${item.title}?`)) {
                          deleteResearch.mutate({ id: item.id });
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-semibold line-clamp-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.journal}</p>
                <p className="text-xs text-muted-foreground">{item.year}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
