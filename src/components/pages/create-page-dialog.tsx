"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createPage } from "@/lib/actions/pages";
import { toSlug } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers and hyphens",
    ),
  title: z.string().min(2, "Title must be at least 2 characters"),
});

type FormValues = z.infer<typeof schema>;

interface CreatePageDialogProps {
  siteId: string;
  workspaceId: string;
}

export default function CreatePageDialog({
  siteId,
  workspaceId,
}: CreatePageDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: { slug: "", title: "" },
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: FormValues) {
    console.debug("[START: create-page-form]", { slug: values.slug });
    try {
      await createPage({
        siteId,
        slug: values.slug,
        title: values.title,
        workspaceId,
      });
      console.debug("[END: create-page-form]", { slug: values.slug });
      toast.success("Page created");
      form.reset();
      setOpen(false);
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create page";
      console.debug("[END: create-page-form] error", { msg });
      toast.error(msg);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <PlusIcon className="size-4" />
        New page
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create page</DialogTitle>
          <DialogDescription>Add a new page to this site.</DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Controller
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="About"
                  onChange={(e) => {
                    field.onChange(e);
                    form.setValue("slug", toSlug(e.target.value), {
                      shouldValidate: true,
                    });
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="slug"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="about"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <DialogFooter>
            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? "Creating..." : "Create page"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
