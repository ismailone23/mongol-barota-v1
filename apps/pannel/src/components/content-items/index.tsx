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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Checkbox } from "@workspace/ui/components/checkbox";
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
import {
  CreateContentItemSchema,
  ContentSectionEnum,
  ContentSectionRecord,
  type ContentSection,
} from "@workspace/types";
import {
  Globe,
  GripVertical,
  LayoutGrid,
  Mail,
  Pencil,
  Phone,
  Plus,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import type { ContentItemSelect } from "@workspace/db/schema";
import { Skeleton } from "@workspace/ui/components/skeleton";

const sections = ContentSectionEnum.options;

const sectionColors: Record<string, string> = {
  core_value: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  sponsorship_benefit:
    "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  contact_person:
    "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  social_link: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  stat_card:
    "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  hero_highlight:
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
};

type FormValues = z.infer<typeof CreateContentItemSchema>;

function ContentItemForm({
  item,
  onDone,
}: {
  item?: ContentItemSelect;
  onDone: () => void;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const create = useMutation(
    trpc.content.createContentItem.mutationOptions({
      onSuccess: () => {
        toast.success("Content item created");
        void queryClient.invalidateQueries(
          trpc.content.getAllContentItems.queryOptions(),
        );
        onDone();
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const update = useMutation(
    trpc.content.updateContentItem.mutationOptions({
      onSuccess: () => {
        toast.success("Content item updated");
        void queryClient.invalidateQueries(
          trpc.content.getAllContentItems.queryOptions(),
        );
        onDone();
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(CreateContentItemSchema),
    defaultValues: {
      section: (item?.section as ContentSection) ?? "core_value",
      title: item?.title ?? "",
      subtitle: item?.subtitle ?? "",
      description: item?.description ?? "",
      icon: item?.icon ?? "",
      iconColor: item?.iconColor ?? "",
      url: item?.url ?? "",
      email: item?.email ?? "",
      phone: item?.phone ?? "",
      image: item?.image ?? "",
      category: item?.category ?? "",
      displayOrder: item?.displayOrder ?? 0,
      isActive: item?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        section: item.section as ContentSection,
        title: item.title,
        subtitle: item.subtitle ?? "",
        description: item.description ?? "",
        icon: item.icon ?? "",
        iconColor: item.iconColor ?? "",
        url: item.url ?? "",
        email: item.email ?? "",
        phone: item.phone ?? "",
        image: item.image ?? "",
        category: item.category ?? "",
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

  const watchSection = form.watch("section");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="section"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Section</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sections.map((s) => (
                      <SelectItem key={s} value={s}>
                        {ContentSectionRecord[s]}
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
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Subtitle / role" {...field} />
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
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Icon (Lucide name)</FormLabel>
                <FormControl>
                  <Input placeholder="Target, Users, Mail..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="iconColor"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Icon Color</FormLabel>
                <FormControl>
                  <Input placeholder="text-blue-600" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {(watchSection === "contact_person" ||
          watchSection === "social_link") && (
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {watchSection === "contact_person" && (
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+880..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category (optional grouping)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Team Leadership, Faculty Advisors"
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

function ContentCard({
  item,
  onEdit,
  onDelete,
}: {
  item: ContentItemSelect;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const colorClass =
    sectionColors[item.section] ?? "bg-muted text-muted-foreground";

  return (
    <Card className="group relative hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge className={`text-[10px] font-medium ${colorClass} border-0`}>
            {ContentSectionRecord[item.section as ContentSection] ??
              item.section}
          </Badge>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={onEdit}
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
                    onClick={onDelete}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <h3 className="font-semibold text-sm mb-0.5 line-clamp-1">
          {item.title}
        </h3>
        {item.subtitle && (
          <p className="text-xs text-muted-foreground mb-1">{item.subtitle}</p>
        )}
        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mt-1">
            {item.description}
          </p>
        )}

        {(item.email || item.phone || item.url) && (
          <>
            <Separator className="my-2" />
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {item.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {item.email}
                </span>
              )}
              {item.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {item.phone}
                </span>
              )}
              {item.url && (
                <span className="flex items-center gap-1">
                  <Globe className="h-3 w-3" /> Link
                </span>
              )}
            </div>
          </>
        )}

        <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
          {item.category && <span>{item.category}</span>}
          <div className="flex items-center gap-2 ml-auto">
            {!item.isActive && (
              <Badge variant="outline" className="text-[10px] h-4">
                Draft
              </Badge>
            )}
            <span className="flex items-center gap-1">
              <GripVertical className="h-3 w-3" /> {item.displayOrder}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ContentItems() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(
    trpc.content.getAllContentItems.queryOptions(),
  );
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ContentItemSelect | undefined>();

  const deleteItem = useMutation(
    trpc.content.deleteContentItem.mutationOptions({
      onSuccess: () => {
        toast.success("Deleted");
        void queryClient.invalidateQueries(
          trpc.content.getAllContentItems.queryOptions(),
        );
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const grouped = useMemo(() => {
    if (!data) return {};
    const map: Record<string, ContentItemSelect[]> = {};
    for (const item of data) {
      const key = item.section;
      if (!map[key]) map[key] = [];
      map[key]!.push(item);
    }
    return map;
  }, [data]);

  const activeSections = Object.keys(grouped);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Content Items
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage values, benefits, contacts, social links, and stats
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
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[640px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Content Item" : "New Content Item"}
              </DialogTitle>
            </DialogHeader>
            <ContentItemForm
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
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <LayoutGrid className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No content items</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Add content items like core values, sponsorship benefits, contact
              persons, and social links.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue={activeSections[0] ?? "all"}>
          <TabsList className="mb-4 flex-wrap h-auto gap-1">
            {activeSections.map((section) => (
              <TabsTrigger key={section} value={section} className="text-xs">
                {ContentSectionRecord[section as ContentSection] ?? section}
                <Badge
                  variant="secondary"
                  className="ml-1.5 h-4 px-1 text-[10px]"
                >
                  {grouped[section]?.length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {activeSections.map((section) => (
            <TabsContent key={section} value={section}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {grouped[section]?.map((item) => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    onEdit={() => {
                      setEditing(item);
                      setOpen(true);
                    }}
                    onDelete={() => {
                      if (confirm(`Delete "${item.title}"?`)) {
                        deleteItem.mutate({ id: item.id });
                      }
                    }}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      <p className="text-xs text-muted-foreground">
        {data?.length ?? 0} {(data?.length ?? 0) === 1 ? "item" : "items"} total
        across {activeSections.length}{" "}
        {activeSections.length === 1 ? "section" : "sections"}
      </p>
    </div>
  );
}
