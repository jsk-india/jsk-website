import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_content_certifications_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_content_certifications_items_locales" (
  	"label" varchar NOT NULL,
  	"hint" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_content_locales" (
  	"manifesto_headline_part1" varchar,
  	"manifesto_headline_highlight" varchar,
  	"manifesto_headline_part3" varchar,
  	"manifesto_body" varchar,
  	"manifesto_brochure_button_label" varchar,
  	"vision_eyebrow" varchar,
  	"vision_headline" varchar,
  	"vision_body" varchar,
  	"mission_eyebrow" varchar,
  	"mission_headline" varchar,
  	"mission_body" varchar,
  	"certifications_heading" varchar,
  	"certifications_footnote" varchar,
  	"enquiry_cta_headline" varchar,
  	"enquiry_cta_body" varchar,
  	"enquiry_cta_button_label" varchar,
  	"section_headings_products_heading" varchar,
  	"section_headings_view_all_products_link" varchar,
  	"section_headings_verticals_heading" varchar,
  	"section_headings_clients_heading" varchar,
  	"section_headings_view_all_clients_link" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "strengths_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar NOT NULL
  );
  
  CREATE TABLE "strengths_items_locales" (
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "strengths" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "strengths_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "page_content_careers_why_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar NOT NULL
  );
  
  CREATE TABLE "page_content_careers_why_items_locales" (
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "page_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "page_content_locales" (
  	"about_headline" varchar,
  	"about_intro" jsonb,
  	"about_leadership_heading" varchar,
  	"about_manufacturing_heading" varchar,
  	"about_certifications_heading" varchar,
  	"businesses_headline" varchar,
  	"businesses_body" varchar,
  	"businesses_new_verticals_card_title" varchar,
  	"businesses_new_verticals_card_body" varchar,
  	"new_verticals_headline" varchar,
  	"new_verticals_body" varchar,
  	"clients_headline" varchar,
  	"clients_body" varchar,
  	"clients_footnote" varchar,
  	"news_headline" varchar,
  	"news_body" varchar,
  	"news_empty_title" varchar,
  	"news_empty_body" varchar,
  	"stories_headline" varchar,
  	"stories_body" varchar,
  	"stories_empty_title" varchar,
  	"stories_empty_body" varchar,
  	"careers_hero_title" varchar,
  	"careers_hero_body" varchar,
  	"careers_why_heading" varchar,
  	"careers_open_positions_heading" varchar,
  	"careers_empty_title" varchar,
  	"careers_empty_body" varchar,
  	"careers_empty_cta_label" varchar,
  	"contact_headline" varchar,
  	"contact_body" varchar,
  	"contact_enquiry_cta_title" varchar,
  	"contact_enquiry_cta_body" varchar,
  	"contact_enquiry_cta_button" varchar,
  	"enquiry_headline" varchar,
  	"enquiry_body" varchar,
  	"enquiry_product_label" varchar,
  	"investors_headline" varchar,
  	"investors_body" varchar,
  	"investors_empty_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "products" ADD COLUMN "card_image_id" integer;
  ALTER TABLE "_products_v" ADD COLUMN "version_card_image_id" integer;
  ALTER TABLE "verticals" ADD COLUMN "card_image_id" integer;
  ALTER TABLE "_verticals_v" ADD COLUMN "version_card_image_id" integer;
  ALTER TABLE "home_content_certifications_items" ADD CONSTRAINT "home_content_certifications_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_content_certifications_items_locales" ADD CONSTRAINT "home_content_certifications_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_content_certifications_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_content_locales" ADD CONSTRAINT "home_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "strengths_items" ADD CONSTRAINT "strengths_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."strengths"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "strengths_items_locales" ADD CONSTRAINT "strengths_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."strengths_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "strengths_locales" ADD CONSTRAINT "strengths_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."strengths"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_content_careers_why_items" ADD CONSTRAINT "page_content_careers_why_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_content_careers_why_items_locales" ADD CONSTRAINT "page_content_careers_why_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_content_careers_why_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_content_locales" ADD CONSTRAINT "page_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_content"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_content_certifications_items_order_idx" ON "home_content_certifications_items" USING btree ("_order");
  CREATE INDEX "home_content_certifications_items_parent_id_idx" ON "home_content_certifications_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_content_certifications_items_locales_locale_parent_id_u" ON "home_content_certifications_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_content_locales_locale_parent_id_unique" ON "home_content_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "strengths_items_order_idx" ON "strengths_items" USING btree ("_order");
  CREATE INDEX "strengths_items_parent_id_idx" ON "strengths_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "strengths_items_locales_locale_parent_id_unique" ON "strengths_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "strengths_locales_locale_parent_id_unique" ON "strengths_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_content_careers_why_items_order_idx" ON "page_content_careers_why_items" USING btree ("_order");
  CREATE INDEX "page_content_careers_why_items_parent_id_idx" ON "page_content_careers_why_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_content_careers_why_items_locales_locale_parent_id_uniq" ON "page_content_careers_why_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "page_content_locales_locale_parent_id_unique" ON "page_content_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "products" ADD CONSTRAINT "products_card_image_id_media_id_fk" FOREIGN KEY ("card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_card_image_id_media_id_fk" FOREIGN KEY ("version_card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "verticals" ADD CONSTRAINT "verticals_card_image_id_media_id_fk" FOREIGN KEY ("card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_verticals_v" ADD CONSTRAINT "_verticals_v_version_card_image_id_media_id_fk" FOREIGN KEY ("version_card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "products_card_image_idx" ON "products" USING btree ("card_image_id");
  CREATE INDEX "_products_v_version_version_card_image_idx" ON "_products_v" USING btree ("version_card_image_id");
  CREATE INDEX "verticals_card_image_idx" ON "verticals" USING btree ("card_image_id");
  CREATE INDEX "_verticals_v_version_version_card_image_idx" ON "_verticals_v" USING btree ("version_card_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_content_certifications_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_content_certifications_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_content_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "strengths_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "strengths_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "strengths" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "strengths_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_content_careers_why_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_content_careers_why_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_content_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "home_content_certifications_items" CASCADE;
  DROP TABLE "home_content_certifications_items_locales" CASCADE;
  DROP TABLE "home_content" CASCADE;
  DROP TABLE "home_content_locales" CASCADE;
  DROP TABLE "strengths_items" CASCADE;
  DROP TABLE "strengths_items_locales" CASCADE;
  DROP TABLE "strengths" CASCADE;
  DROP TABLE "strengths_locales" CASCADE;
  DROP TABLE "page_content_careers_why_items" CASCADE;
  DROP TABLE "page_content_careers_why_items_locales" CASCADE;
  DROP TABLE "page_content" CASCADE;
  DROP TABLE "page_content_locales" CASCADE;
  ALTER TABLE "products" DROP CONSTRAINT "products_card_image_id_media_id_fk";
  
  ALTER TABLE "_products_v" DROP CONSTRAINT "_products_v_version_card_image_id_media_id_fk";
  
  ALTER TABLE "verticals" DROP CONSTRAINT "verticals_card_image_id_media_id_fk";
  
  ALTER TABLE "_verticals_v" DROP CONSTRAINT "_verticals_v_version_card_image_id_media_id_fk";
  
  DROP INDEX "products_card_image_idx";
  DROP INDEX "_products_v_version_version_card_image_idx";
  DROP INDEX "verticals_card_image_idx";
  DROP INDEX "_verticals_v_version_version_card_image_idx";
  ALTER TABLE "products" DROP COLUMN "card_image_id";
  ALTER TABLE "_products_v" DROP COLUMN "version_card_image_id";
  ALTER TABLE "verticals" DROP COLUMN "card_image_id";
  ALTER TABLE "_verticals_v" DROP COLUMN "version_card_image_id";`)
}
