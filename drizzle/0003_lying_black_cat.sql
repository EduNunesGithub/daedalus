CREATE TABLE "page" (
	"content" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"site_id" text NOT NULL,
	"slug" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"title" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"workspace_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"domain" text,
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"workspace_id" text NOT NULL,
	CONSTRAINT "site_domain_unique" UNIQUE("domain"),
	CONSTRAINT "site_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "page" ADD CONSTRAINT "page_site_id_site_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "page_siteId_idx" ON "page" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "page_siteId_slug_idx" ON "page" USING btree ("site_id","slug");--> statement-breakpoint
CREATE INDEX "page_workspaceId_idx" ON "page" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "site_domain_idx" ON "site" USING btree ("domain");--> statement-breakpoint
CREATE INDEX "site_workspaceId_idx" ON "site" USING btree ("workspace_id");