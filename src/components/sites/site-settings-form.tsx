"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateSite } from "@/lib/actions/sites";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  domain: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type FormValues = z.infer<typeof schema>;

interface SiteSettingsFormProps {
  site: {
    domain: string | null;
    id: string;
    name: string;
  };
}

export default function SiteSettingsForm({ site }: SiteSettingsFormProps) {
  const router = useRouter();

  const form = useForm<FormValues>({
    defaultValues: { domain: site.domain ?? "", name: site.name },
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: FormValues) {
    console.debug("[START: update-site-form]", { id: site.id });
    try {
      await updateSite({
        domain: values.domain || null,
        id: site.id,
        name: values.name,
      });
      console.debug("[END: update-site-form]", { id: site.id });
      toast.success("Settings saved");
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to save settings";
      console.debug("[END: update-site-form] error", { msg });
      toast.error(msg);
    }
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Site name</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="My Site"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="domain"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Custom domain</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="www.example.com"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <div>
        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? "Saving..." : "Save settings"}
        </Button>
      </div>
    </form>
  );
}
