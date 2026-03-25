"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { toSlug } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers and hyphens",
    ),
});

type FormValues = z.infer<typeof schema>;

export default function CreateWorkspacePage() {
  const router = useRouter();

  const form = useForm<FormValues>({
    defaultValues: { name: "", slug: "" },
    resolver: zodResolver(schema),
  });

  const { error, isPending, mutate } = useMutation({
    mutationFn: async (values: FormValues) => {
      console.debug("[START: create-workspace]", { slug: values.slug });
      const result = await authClient.organization.create({
        name: values.name,
        slug: values.slug,
      });
      if (result.error) throw new Error(result.error.message);
      console.debug("[END: create-workspace]", { slug: values.slug });
      return result;
    },
    onSuccess: (result) => router.push(`/dashboard/${result.data?.slug}`),
  });

  const name = form.watch("name");

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Create workspace</CardTitle>
          <CardDescription>
            Set up your first workspace to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit((values) => mutate(values))}
            className="flex flex-col gap-4"
          >
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Workspace name</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="My Company"
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
                    placeholder="my-company"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {error && (
              <p className="text-sm text-destructive">{error.message}</p>
            )}
            <Button
              className="w-full"
              disabled={isPending || !name}
              type="submit"
            >
              {isPending ? "Creating..." : "Create workspace"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
