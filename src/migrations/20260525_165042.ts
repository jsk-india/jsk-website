import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "page_content_news_category_labels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "page_content_news_category_labels_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "page_content_investors_category_labels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "page_content_investors_category_labels_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enquiry_country_default" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "forms_locales" (
  	"enquiry_name_label" varchar,
  	"enquiry_email_label" varchar,
  	"enquiry_phone_label" varchar,
  	"enquiry_company_label" varchar,
  	"enquiry_country_label" varchar,
  	"enquiry_message_label" varchar,
  	"enquiry_message_placeholder" varchar,
  	"enquiry_submit_label" varchar,
  	"enquiry_submitting_label" varchar,
  	"enquiry_success_title" varchar,
  	"enquiry_success_body" varchar,
  	"application_name_label" varchar,
  	"application_email_label" varchar,
  	"application_phone_label" varchar,
  	"application_resume_label" varchar,
  	"application_resume_hint" varchar,
  	"application_cover_letter_label" varchar,
  	"application_cover_letter_placeholder" varchar,
  	"application_submit_label" varchar,
  	"application_submitting_label" varchar,
  	"application_success_title" varchar,
  	"application_success_body_template" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "page_content_locales" ADD COLUMN "product_detail_gallery_heading" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "product_detail_specifications_heading" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "product_detail_standards_heading" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "product_detail_applications_heading" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "product_detail_cta_title" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "product_detail_cta_body" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "product_detail_cta_button" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "product_detail_brochure_button" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "product_detail_related_heading" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "product_detail_breadcrumb_businesses" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "vertical_detail_partner_eyebrow" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "vertical_detail_visit_partner_link" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "vertical_detail_cta_title_template" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "vertical_detail_cta_body" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "vertical_detail_cta_button" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "vertical_detail_breadcrumb_businesses" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "vertical_detail_breadcrumb_new_verticals" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "career_detail_responsibilities_heading" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "career_detail_qualifications_heading" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "career_detail_apply_heading" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "career_detail_summary_heading" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "career_detail_department_label" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "career_detail_location_label" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "career_detail_type_label" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "career_detail_posted_label" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "career_detail_breadcrumb_careers" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "news_detail_breadcrumb_news" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "news_detail_empty_body_message" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "category_listing_breadcrumb_businesses" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "category_listing_empty_message" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "not_found_code" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "not_found_title" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "not_found_body" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "not_found_cta_label" varchar;
  ALTER TABLE "page_content_locales" ADD COLUMN "loading_sr_label" varchar;
  ALTER TABLE "page_content_news_category_labels" ADD CONSTRAINT "page_content_news_category_labels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_content_news_category_labels_locales" ADD CONSTRAINT "page_content_news_category_labels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_content_news_category_labels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_content_investors_category_labels" ADD CONSTRAINT "page_content_investors_category_labels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_content_investors_category_labels_locales" ADD CONSTRAINT "page_content_investors_category_labels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_content_investors_category_labels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_locales" ADD CONSTRAINT "forms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "page_content_news_category_labels_order_idx" ON "page_content_news_category_labels" USING btree ("_order");
  CREATE INDEX "page_content_news_category_labels_parent_id_idx" ON "page_content_news_category_labels" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_content_news_category_labels_locales_locale_parent_id_u" ON "page_content_news_category_labels_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_content_investors_category_labels_order_idx" ON "page_content_investors_category_labels" USING btree ("_order");
  CREATE INDEX "page_content_investors_category_labels_parent_id_idx" ON "page_content_investors_category_labels" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "page_content_investors_category_labels_locales_locale_parent" ON "page_content_investors_category_labels_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_locales_locale_parent_id_unique" ON "forms_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "page_content_news_category_labels" CASCADE;
  DROP TABLE "page_content_news_category_labels_locales" CASCADE;
  DROP TABLE "page_content_investors_category_labels" CASCADE;
  DROP TABLE "page_content_investors_category_labels_locales" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "forms_locales" CASCADE;
  ALTER TABLE "page_content_locales" DROP COLUMN "product_detail_gallery_heading";
  ALTER TABLE "page_content_locales" DROP COLUMN "product_detail_specifications_heading";
  ALTER TABLE "page_content_locales" DROP COLUMN "product_detail_standards_heading";
  ALTER TABLE "page_content_locales" DROP COLUMN "product_detail_applications_heading";
  ALTER TABLE "page_content_locales" DROP COLUMN "product_detail_cta_title";
  ALTER TABLE "page_content_locales" DROP COLUMN "product_detail_cta_body";
  ALTER TABLE "page_content_locales" DROP COLUMN "product_detail_cta_button";
  ALTER TABLE "page_content_locales" DROP COLUMN "product_detail_brochure_button";
  ALTER TABLE "page_content_locales" DROP COLUMN "product_detail_related_heading";
  ALTER TABLE "page_content_locales" DROP COLUMN "product_detail_breadcrumb_businesses";
  ALTER TABLE "page_content_locales" DROP COLUMN "vertical_detail_partner_eyebrow";
  ALTER TABLE "page_content_locales" DROP COLUMN "vertical_detail_visit_partner_link";
  ALTER TABLE "page_content_locales" DROP COLUMN "vertical_detail_cta_title_template";
  ALTER TABLE "page_content_locales" DROP COLUMN "vertical_detail_cta_body";
  ALTER TABLE "page_content_locales" DROP COLUMN "vertical_detail_cta_button";
  ALTER TABLE "page_content_locales" DROP COLUMN "vertical_detail_breadcrumb_businesses";
  ALTER TABLE "page_content_locales" DROP COLUMN "vertical_detail_breadcrumb_new_verticals";
  ALTER TABLE "page_content_locales" DROP COLUMN "career_detail_responsibilities_heading";
  ALTER TABLE "page_content_locales" DROP COLUMN "career_detail_qualifications_heading";
  ALTER TABLE "page_content_locales" DROP COLUMN "career_detail_apply_heading";
  ALTER TABLE "page_content_locales" DROP COLUMN "career_detail_summary_heading";
  ALTER TABLE "page_content_locales" DROP COLUMN "career_detail_department_label";
  ALTER TABLE "page_content_locales" DROP COLUMN "career_detail_location_label";
  ALTER TABLE "page_content_locales" DROP COLUMN "career_detail_type_label";
  ALTER TABLE "page_content_locales" DROP COLUMN "career_detail_posted_label";
  ALTER TABLE "page_content_locales" DROP COLUMN "career_detail_breadcrumb_careers";
  ALTER TABLE "page_content_locales" DROP COLUMN "news_detail_breadcrumb_news";
  ALTER TABLE "page_content_locales" DROP COLUMN "news_detail_empty_body_message";
  ALTER TABLE "page_content_locales" DROP COLUMN "category_listing_breadcrumb_businesses";
  ALTER TABLE "page_content_locales" DROP COLUMN "category_listing_empty_message";
  ALTER TABLE "page_content_locales" DROP COLUMN "not_found_code";
  ALTER TABLE "page_content_locales" DROP COLUMN "not_found_title";
  ALTER TABLE "page_content_locales" DROP COLUMN "not_found_body";
  ALTER TABLE "page_content_locales" DROP COLUMN "not_found_cta_label";
  ALTER TABLE "page_content_locales" DROP COLUMN "loading_sr_label";`)
}
