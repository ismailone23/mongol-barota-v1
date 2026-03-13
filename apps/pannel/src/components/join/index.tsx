"use client";

import { useTRPC } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FaqSelect, RecruitmentOpeningSelect } from "@workspace/db/schema";
import {
  CreateFaqSchema,
  CreateRecruitmentOpeningSchema,
} from "@workspace/types";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Textarea } from "@workspace/ui/components/textarea";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

type OpeningFormShape = Omit<
  z.infer<typeof CreateRecruitmentOpeningSchema>,
  "skills"
> & {
  skillsText: string;
};

function OpeningForm({
  item,
  onDone,
}: {
  item?: RecruitmentOpeningSelect;
  onDone: () => void;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createOpening = useMutation(
    trpc.join.createOpening.mutationOptions({
      onSuccess: () => {
        toast.success("Opening created");
        void queryClient.invalidateQueries(
          trpc.join.getAllOpenings.queryOptions(),
        );
        onDone();
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const updateOpening = useMutation(
    trpc.join.updateOpening.mutationOptions({
      onSuccess: () => {
        toast.success("Opening updated");
        void queryClient.invalidateQueries(
          trpc.join.getAllOpenings.queryOptions(),
        );
        onDone();
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const form = useForm<OpeningFormShape>({
    resolver: zodResolver(
      CreateRecruitmentOpeningSchema.extend({
        skillsText: z.string(),
      }),
    ),
    defaultValues: {
      teamName: item?.teamName ?? "",
      description: item?.description ?? "",
      skillsText: item?.skills.join(", ") ?? "",
      openPositions: item?.openPositions ?? 0,
      displayOrder: item?.displayOrder ?? 0,
      isActive: item?.isActive ?? true,
    },
  });

  const onSubmit = useCallback(
    (values: OpeningFormShape) => {
      const payload = {
        teamName: values.teamName,
        description: values.description,
        skills: values.skillsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        openPositions: values.openPositions,
        displayOrder: values.displayOrder,
        isActive: values.isActive,
      };

      if (item) {
        updateOpening.mutate({ id: item.id, ...payload });
      } else {
        createOpening.mutate(payload);
      }
    },
    [item, createOpening, updateOpening],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="teamName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="openPositions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Open Positions</FormLabel>
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
        <FormField
          control={form.control}
          name="skillsText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skills (comma separated)</FormLabel>
              <FormControl>
                <Input placeholder="CAD, C++, ROS" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">{item ? "Update" : "Create"}</Button>
        </div>
      </form>
    </Form>
  );
}

function FaqForm({ item, onDone }: { item?: FaqSelect; onDone: () => void }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createFaq = useMutation(
    trpc.join.createFaq.mutationOptions({
      onSuccess: () => {
        toast.success("FAQ created");
        void queryClient.invalidateQueries(trpc.join.getAllFaqs.queryOptions());
        onDone();
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const updateFaq = useMutation(
    trpc.join.updateFaq.mutationOptions({
      onSuccess: () => {
        toast.success("FAQ updated");
        void queryClient.invalidateQueries(trpc.join.getAllFaqs.queryOptions());
        onDone();
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const form = useForm<z.infer<typeof CreateFaqSchema>>({
    resolver: zodResolver(CreateFaqSchema),
    defaultValues: {
      question: item?.question ?? "",
      answer: item?.answer ?? "",
      category: item?.category ?? "join",
      displayOrder: item?.displayOrder ?? 0,
      isActive: item?.isActive ?? true,
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof CreateFaqSchema>) => {
      if (item) {
        updateFaq.mutate({ id: item.id, ...values });
      } else {
        createFaq.mutate(values);
      }
    },
    [item, createFaq, updateFaq],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Answer</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">{item ? "Update" : "Create"}</Button>
        </div>
      </form>
    </Form>
  );
}

export default function JoinManager() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: openings = [] } = useQuery(
    trpc.join.getAllOpenings.queryOptions(),
  );
  const { data: faqs = [] } = useQuery(trpc.join.getAllFaqs.queryOptions());

  const [openingsDialog, setOpeningsDialog] = useState(false);
  const [faqDialog, setFaqDialog] = useState(false);
  const [editingOpening, setEditingOpening] =
    useState<RecruitmentOpeningSelect>();
  const [editingFaq, setEditingFaq] = useState<FaqSelect>();

  const deleteOpening = useMutation(
    trpc.join.deleteOpening.mutationOptions({
      onSuccess: () => {
        toast.success("Opening deleted");
        void queryClient.invalidateQueries(
          trpc.join.getAllOpenings.queryOptions(),
        );
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const deleteFaq = useMutation(
    trpc.join.deleteFaq.mutationOptions({
      onSuccess: () => {
        toast.success("FAQ deleted");
        void queryClient.invalidateQueries(trpc.join.getAllFaqs.queryOptions());
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Join</h2>
        <p className="text-sm text-muted-foreground">
          Manage recruitment openings and FAQs
        </p>
      </div>

      <Tabs defaultValue="openings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="openings">Openings</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>

        <TabsContent value="openings" className="space-y-4">
          <Dialog open={openingsDialog} onOpenChange={setOpeningsDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Opening
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>
                  {editingOpening ? "Edit Opening" : "Create Opening"}
                </DialogTitle>
              </DialogHeader>
              <OpeningForm
                item={editingOpening}
                onDone={() => {
                  setOpeningsDialog(false);
                  setEditingOpening(undefined);
                }}
              />
            </DialogContent>
          </Dialog>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {openings.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary">{item.openPositions} open</Badge>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingOpening(item);
                          setOpeningsDialog(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm(`Delete opening ${item.teamName}?`)) {
                            deleteOpening.mutate({ id: item.id });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-semibold">{item.teamName}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faqs" className="space-y-4">
          <Dialog open={faqDialog} onOpenChange={setFaqDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add FAQ
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>
                  {editingFaq ? "Edit FAQ" : "Create FAQ"}
                </DialogTitle>
              </DialogHeader>
              <FaqForm
                item={editingFaq}
                onDone={() => {
                  setFaqDialog(false);
                  setEditingFaq(undefined);
                }}
              />
            </DialogContent>
          </Dialog>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {faqs.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <Badge variant="outline">{"General"}</Badge>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingFaq(item);
                          setFaqDialog(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm("Delete FAQ?")) {
                            deleteFaq.mutate({ id: item.id });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-semibold line-clamp-2">
                    {item.question}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {item.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
