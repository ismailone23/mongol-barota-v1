"use client";

import { useTRPC } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  GalleryCategorySelect,
  GalleryImageSelect,
  GalleryVideoSelect,
} from "@workspace/db/schema";
import {
  CreateGalleryCategorySchema,
  CreateGalleryImageSchema,
  CreateGalleryVideoSchema,
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
import { uploadImage } from "@/utils";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const GalleryImageFormSchema = CreateGalleryImageSchema.extend({
  src: z.string().optional(),
});

type CategoryFormValues = z.input<typeof CreateGalleryCategorySchema>;
type ImageFormValues = z.input<typeof GalleryImageFormSchema>;
type VideoFormValues = z.input<typeof CreateGalleryVideoSchema>;

function CategoryForm({
  item,
  onDone,
}: {
  item?: GalleryCategorySelect;
  onDone: () => void;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(CreateGalleryCategorySchema),
    defaultValues: {
      slug: item?.slug ?? "",
      name: item?.name ?? "",
      icon: item?.icon ?? "",
      description: item?.description ?? "",
      displayOrder: item?.displayOrder ?? 0,
      isActive: item?.isActive ?? true,
    },
  });

  const createCategory = useMutation(
    trpc.gallery.createCategory.mutationOptions({
      onSuccess: () => {
        toast.success("Category created");
        void queryClient.invalidateQueries(
          trpc.gallery.getAllCategories.queryOptions(),
        );
        onDone();
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const updateCategory = useMutation(
    trpc.gallery.updateCategory.mutationOptions({
      onSuccess: () => {
        toast.success("Category updated");
        void queryClient.invalidateQueries(
          trpc.gallery.getAllCategories.queryOptions(),
        );
        onDone();
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const onSubmit = useCallback(
    (values: CategoryFormValues) => {
      if (item) {
        updateCategory.mutate({ id: item.id, ...values });
      } else {
        createCategory.mutate(values);
      }
    },
    [item, createCategory, updateCategory],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
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
                  <Input {...field} />
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
                <Textarea rows={3} {...field} />
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

function ImageForm({
  item,
  categories,
  onDone,
}: {
  item?: GalleryImageSelect;
  categories: GalleryCategorySelect[];
  onDone: () => void;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const form = useForm<ImageFormValues>({
    resolver: zodResolver(GalleryImageFormSchema),
    defaultValues: {
      categoryId: item?.categoryId ?? categories[0]?.id ?? "",
      src: item?.src ?? "",
      title: item?.title ?? "",
      description: item?.description ?? "",
      date: item?.date ?? "",
      location: item?.location ?? "",
      tag: item?.tag ?? "",
      displayOrder: item?.displayOrder ?? 0,
      isActive: item?.isActive ?? true,
    },
  });

  const createImage = useMutation(
    trpc.gallery.createImage.mutationOptions({
      onSuccess: () => {
        toast.success("Image created");
        void queryClient.invalidateQueries(
          trpc.gallery.getAllImages.queryOptions(),
        );
        onDone();
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  useEffect(() => {
    setSelectedImageFile(null);
    form.reset({
      categoryId: item?.categoryId ?? categories[0]?.id ?? "",
      src: item?.src ?? "",
      title: item?.title ?? "",
      description: item?.description ?? "",
      date: item?.date ?? "",
      location: item?.location ?? "",
      tag: item?.tag ?? "",
      displayOrder: item?.displayOrder ?? 0,
      isActive: item?.isActive ?? true,
    });
  }, [item, categories, form]);

  const updateImage = useMutation(
    trpc.gallery.updateImage.mutationOptions({
      onSuccess: () => {
        toast.success("Image updated");
        void queryClient.invalidateQueries(
          trpc.gallery.getAllImages.queryOptions(),
        );
        onDone();
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const onSubmit = useCallback(
    async (values: ImageFormValues) => {
      try {
        let src = values.src;
        if (selectedImageFile) {
          const toastId = toast.loading("Uploading image...");
          src = await uploadImage(selectedImageFile);
          toast.success("Image uploaded", { id: toastId });
        }

        if (!src) {
          toast.error("Please upload an image");
          return;
        }

        const payload = { ...values, src };

        if (item) {
          updateImage.mutate({ id: item.id, ...payload });
        } else {
          createImage.mutate(payload);
        }
      } catch (error) {
        toast.error("Failed to upload image");
        console.error(error);
      }
    },
    [item, createImage, updateImage, selectedImageFile],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <select
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          <FormItem>
            <FormLabel>Upload Image</FormLabel>
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
                : item?.src
                  ? "No new file selected. Existing image will be kept."
                  : "Upload an image for this gallery entry."}
            </p>
          </FormItem>
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
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

function VideoForm({
  item,
  onDone,
}: {
  item?: GalleryVideoSelect;
  onDone: () => void;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [selectedThumbnailFile, setSelectedThumbnailFile] =
    useState<File | null>(null);
  const form = useForm<VideoFormValues>({
    resolver: zodResolver(CreateGalleryVideoSchema),
    defaultValues: {
      title: item?.title ?? "",
      description: item?.description ?? "",
      thumbnail: item?.thumbnail ?? "",
      url: item?.url ?? "",
      duration: item?.duration ?? "",
      date: item?.date ?? "",
      displayOrder: item?.displayOrder ?? 0,
      isActive: item?.isActive ?? true,
    },
  });

  useEffect(() => {
    setSelectedThumbnailFile(null);
    form.reset({
      title: item?.title ?? "",
      description: item?.description ?? "",
      thumbnail: item?.thumbnail ?? "",
      url: item?.url ?? "",
      duration: item?.duration ?? "",
      date: item?.date ?? "",
      displayOrder: item?.displayOrder ?? 0,
      isActive: item?.isActive ?? true,
    });
  }, [item, form]);

  const createVideo = useMutation(
    trpc.gallery.createVideo.mutationOptions({
      onSuccess: () => {
        toast.success("Video created");
        void queryClient.invalidateQueries(
          trpc.gallery.getAllVideos.queryOptions(),
        );
        onDone();
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const updateVideo = useMutation(
    trpc.gallery.updateVideo.mutationOptions({
      onSuccess: () => {
        toast.success("Video updated");
        void queryClient.invalidateQueries(
          trpc.gallery.getAllVideos.queryOptions(),
        );
        onDone();
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const onSubmit = useCallback(
    async (values: VideoFormValues) => {
      try {
        let thumbnail = values.thumbnail;
        if (selectedThumbnailFile) {
          const toastId = toast.loading("Uploading thumbnail...");
          thumbnail = await uploadImage(selectedThumbnailFile);
          toast.success("Thumbnail uploaded", { id: toastId });
        }

        const payload = { ...values, thumbnail };

        if (item) {
          updateVideo.mutate({ id: item.id, ...payload });
        } else {
          createVideo.mutate(payload);
        }
      } catch (error) {
        toast.error("Failed to upload thumbnail");
        console.error(error);
      }
    },
    [item, createVideo, updateVideo, selectedThumbnailFile],
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
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">{item ? "Update" : "Create"}</Button>
          <FormItem>
            <FormLabel>Upload Thumbnail (optional)</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setSelectedThumbnailFile(e.target.files?.[0] ?? null)
                }
              />
            </FormControl>
            <p className="text-xs text-muted-foreground">
              {selectedThumbnailFile
                ? `Selected: ${selectedThumbnailFile.name}`
                : item?.thumbnail
                  ? "No new file selected. Existing thumbnail will be kept."
                  : "Upload a thumbnail if needed."}
            </p>
          </FormItem>
        </div>
      </form>
    </Form>
  );
}

export default function GalleryManager() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery(
    trpc.gallery.getAllCategories.queryOptions(),
  );
  const { data: images = [] } = useQuery(
    trpc.gallery.getAllImages.queryOptions(),
  );
  const { data: videos = [] } = useQuery(
    trpc.gallery.getAllVideos.queryOptions(),
  );

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  const [editingCategory, setEditingCategory] =
    useState<GalleryCategorySelect>();
  const [editingImage, setEditingImage] = useState<GalleryImageSelect>();
  const [editingVideo, setEditingVideo] = useState<GalleryVideoSelect>();

  const deleteCategory = useMutation(
    trpc.gallery.deleteCategory.mutationOptions({
      onSuccess: () => {
        toast.success("Category deleted");
        void queryClient.invalidateQueries(
          trpc.gallery.getAllCategories.queryOptions(),
        );
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const deleteImage = useMutation(
    trpc.gallery.deleteImage.mutationOptions({
      onSuccess: () => {
        toast.success("Image deleted");
        void queryClient.invalidateQueries(
          trpc.gallery.getAllImages.queryOptions(),
        );
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const deleteVideo = useMutation(
    trpc.gallery.deleteVideo.mutationOptions({
      onSuccess: () => {
        toast.success("Video deleted");
        void queryClient.invalidateQueries(
          trpc.gallery.getAllVideos.queryOptions(),
        );
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Gallery</h2>
        <p className="text-sm text-muted-foreground">
          Manage gallery categories, images, and videos
        </p>
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <Dialog open={categoryOpen} onOpenChange={setCategoryOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[680px]">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? "Edit Category" : "Create Category"}
                </DialogTitle>
              </DialogHeader>
              <CategoryForm
                item={editingCategory}
                onDone={() => {
                  setCategoryOpen(false);
                  setEditingCategory(undefined);
                }}
              />
            </DialogContent>
          </Dialog>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary">{item.slug}</Badge>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingCategory(item);
                          setCategoryOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm(`Delete category ${item.name}?`)) {
                            deleteCategory.mutate({ id: item.id });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Dialog open={imageOpen} onOpenChange={setImageOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Image
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[680px]">
              <DialogHeader>
                <DialogTitle>
                  {editingImage ? "Edit Image" : "Create Image"}
                </DialogTitle>
              </DialogHeader>
              <ImageForm
                item={editingImage}
                categories={categories}
                onDone={() => {
                  setImageOpen(false);
                  setEditingImage(undefined);
                }}
              />
            </DialogContent>
          </Dialog>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {images.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <Badge variant="outline">{item.tag || "image"}</Badge>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingImage(item);
                          setImageOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm(`Delete image ${item.title}?`)) {
                            deleteImage.mutate({ id: item.id });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-semibold line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Video
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[680px]">
              <DialogHeader>
                <DialogTitle>
                  {editingVideo ? "Edit Video" : "Create Video"}
                </DialogTitle>
              </DialogHeader>
              <VideoForm
                item={editingVideo}
                onDone={() => {
                  setVideoOpen(false);
                  setEditingVideo(undefined);
                }}
              />
            </DialogContent>
          </Dialog>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {videos.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <Badge variant="outline">{item.duration || "video"}</Badge>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingVideo(item);
                          setVideoOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm(`Delete video ${item.title}?`)) {
                            deleteVideo.mutate({ id: item.id });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-semibold line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
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
