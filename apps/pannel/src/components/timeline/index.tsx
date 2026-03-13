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
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTimelineEventSchema } from "@workspace/types";
import { Calendar, Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import type { TimelineEventSelect } from "@workspace/db/schema";
import { Skeleton } from "@workspace/ui/components/skeleton";

type FormValues = z.infer<typeof CreateTimelineEventSchema>;

function TimelineForm({
  item,
  onDone,
}: {
  item?: TimelineEventSelect;
  onDone: () => void;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const create = useMutation(
    trpc.content.createTimelineEvent.mutationOptions({
      onSuccess: () => {
        toast.success("Timeline event created");
        void queryClient.invalidateQueries(
          trpc.content.getAllTimelineEvents.queryOptions(),
        );
        onDone();
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const update = useMutation(
    trpc.content.updateTimelineEvent.mutationOptions({
      onSuccess: () => {
        toast.success("Timeline event updated");
        void queryClient.invalidateQueries(
          trpc.content.getAllTimelineEvents.queryOptions(),
        );
        onDone();
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(CreateTimelineEventSchema),
    defaultValues: {
      year: item?.year ?? "",
      title: item?.title ?? "",
      description: item?.description ?? "",
      displayOrder: item?.displayOrder ?? 0,
      isActive: item?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        year: item.year,
        title: item.title,
        description: item.description,
        displayOrder: item.displayOrder,
        isActive: item.isActive,
      });
    }
  }, [item, form]);

  const onSubmit = useCallback(
    (values: FormValues) => {
      if (item) {
        update.mutate({ ...values, id: item.id });
      } else {
        create.mutate(values);
      }
    },
    [item, create, update],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input placeholder="2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="displayOrder"
            render={({ field }) => (
              <FormItem className="w-28">
                <FormLabel>Order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Event title" {...field} />
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
                  rows={3}
                  placeholder="Event description..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="mt-0!">Active</FormLabel>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={create.isPending || update.isPending}>
            {create.isPending || update.isPending
              ? "Saving..."
              : item
                ? "Update"
                : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function Timeline() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(
    trpc.content.getAllTimelineEvents.queryOptions(),
  );
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TimelineEventSelect | undefined>();

  const deleteEvent = useMutation(
    trpc.content.deleteTimelineEvent.mutationOptions({
      onSuccess: () => {
        toast.success("Deleted");
        void queryClient.invalidateQueries(
          trpc.content.getAllTimelineEvents.queryOptions(),
        );
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Timeline</h2>
          <p className="text-sm text-muted-foreground">
            Manage milestones and history events shown on the website
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
              <Plus className="mr-2 h-4 w-4" /> Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Event" : "New Timeline Event"}
              </DialogTitle>
            </DialogHeader>
            <TimelineForm
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
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 items-start">
              <Skeleton className="h-10 w-16 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No events yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Create timeline milestones that will appear on the About page
              history section.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[39px] top-0 bottom-0 w-px bg-border" />

          <div className="space-y-4">
            {data.map((item) => (
              <div key={item.id} className="relative flex gap-4 group">
                {/* Year pill on the timeline */}
                <div className="relative z-10 shrink-0">
                  <div
                    className={`flex h-10 items-center justify-center rounded-md border px-2.5 text-sm font-bold ${
                      item.isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-muted-foreground border-muted"
                    }`}
                  >
                    {item.year}
                  </div>
                </div>

                {/* Content card */}
                <Card className="flex-1 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm truncate">
                            {item.title}
                          </h3>
                          {!item.isActive && (
                            <Badge
                              variant="outline"
                              className="text-[10px] shrink-0"
                            >
                              Draft
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
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
                                  if (confirm(`Delete "${item.title}"?`)) {
                                    deleteEvent.mutate({ id: item.id });
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

                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>Order: {item.displayOrder}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {data?.length ?? 0} {(data?.length ?? 0) === 1 ? "event" : "events"}{" "}
        total
      </p>
    </div>
  );
}
