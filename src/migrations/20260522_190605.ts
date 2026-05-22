import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'hi', 'te', 'ta');
  CREATE TYPE "public"."enum_users_role" AS ENUM('super_admin', 'admin', 'editor', 'contributor');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('en', 'hi', 'te', 'ta');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_published_locale" AS ENUM('en', 'hi', 'te', 'ta');
  CREATE TYPE "public"."enum_verticals_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__verticals_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__verticals_v_published_locale" AS ENUM('en', 'hi', 'te', 'ta');
  CREATE TYPE "public"."enum_clients_sector" AS ENUM('utility', 'epc', 'manufacturer', 'trader', 'steel', 'renewable', 'other');
  CREATE TYPE "public"."enum_news_articles_category" AS ENUM('press', 'event', 'award', 'exhibition', 'announcement');
  CREATE TYPE "public"."enum_news_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_articles_v_version_category" AS ENUM('press', 'event', 'award', 'exhibition', 'announcement');
  CREATE TYPE "public"."enum__news_articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_articles_v_published_locale" AS ENUM('en', 'hi', 'te', 'ta');
  CREATE TYPE "public"."enum_stories_sector" AS ENUM('power_td', 'railway', 'renewable', 'steel', 'other');
  CREATE TYPE "public"."enum_stories_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__stories_v_version_sector" AS ENUM('power_td', 'railway', 'renewable', 'steel', 'other');
  CREATE TYPE "public"."enum__stories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__stories_v_published_locale" AS ENUM('en', 'hi', 'te', 'ta');
  CREATE TYPE "public"."enum_investor_documents_category" AS ENUM('annual_report', 'financial_result', 'shareholding_pattern', 'corporate_governance', 'corporate_announcement', 'notice', 'agm', 'postal_ballot', 'annual_return', 'policy', 'credit_rating', 'disclosure', 'secretarial_compliance', 'iepf', 'committee_composition', 'investor_grievance', 'corporate_presentation', 'other');
  CREATE TYPE "public"."enum_job_openings_employment_type" AS ENUM('full_time', 'part_time', 'contract', 'internship');
  CREATE TYPE "public"."enum_job_openings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__job_openings_v_version_employment_type" AS ENUM('full_time', 'part_time', 'contract', 'internship');
  CREATE TYPE "public"."enum__job_openings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__job_openings_v_published_locale" AS ENUM('en', 'hi', 'te', 'ta');
  CREATE TYPE "public"."enum_job_applications_status" AS ENUM('new', 'reviewing', 'shortlisted', 'rejected', 'hired');
  CREATE TYPE "public"."enum_enquiries_status" AS ENUM('new', 'in_progress', 'closed');
  CREATE TYPE "public"."enum_contact_messages_status" AS ENUM('new', 'read', 'replied');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"hero_image_id" integer,
  	"parent_id" integer,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"body" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_hero_image_id" integer,
  	"version_parent_id" integer,
  	"version_seo_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar,
  	"version_body" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "product_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"hero_image_id" integer,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "product_categories_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "products_standards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "products_applications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products_applications_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_specs_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "products_specs_table_locales" (
  	"property" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"slug" varchar,
  	"category_id" integer,
  	"construction_image_id" integer,
  	"brochure_pdf_id" integer,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_products_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "products_locales" (
  	"name" varchar,
  	"short_description" varchar,
  	"long_description" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  CREATE TABLE "_products_v_version_standards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_applications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_applications_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_version_specs_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_specs_table_locales" (
  	"property" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_version_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_code" varchar,
  	"version_slug" varchar,
  	"version_category_id" integer,
  	"version_construction_image_id" integer,
  	"version_brochure_pdf_id" integer,
  	"version_seo_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__products_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__products_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_products_v_locales" (
  	"version_name" varchar,
  	"version_short_description" varchar,
  	"version_long_description" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  CREATE TABLE "verticals_downloads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer
  );
  
  CREATE TABLE "verticals_downloads_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "verticals" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"hero_image_id" integer,
  	"partner_name" varchar,
  	"partner_logo_id" integer,
  	"partner_website" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_verticals_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "verticals_locales" (
  	"name" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"partner_description" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_verticals_v_version_downloads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_verticals_v_version_downloads_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_verticals_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_hero_image_id" integer,
  	"version_partner_name" varchar,
  	"version_partner_logo_id" integer,
  	"version_partner_website" varchar,
  	"version_seo_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__verticals_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__verticals_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_verticals_v_locales" (
  	"version_name" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_partner_description" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "persons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"photo_id" integer,
  	"linkedin_url" varchar,
  	"is_founder" boolean DEFAULT false,
  	"is_board" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "persons_locales" (
  	"role" varchar NOT NULL,
  	"bio" jsonb,
  	"qualifications" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "clients" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer,
  	"sector" "enum_clients_sector",
  	"website" varchar,
  	"is_featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "plants_capacities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "plants_capacities_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "plants_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "plants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"address" varchar,
  	"city" varchar,
  	"area" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "plants_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"certifications_id" integer
  );
  
  CREATE TABLE "certifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"issuer" varchar,
  	"valid_from" timestamp(3) with time zone,
  	"valid_until" timestamp(3) with time zone,
  	"image_id" integer,
  	"document_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "awards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" numeric NOT NULL,
  	"issuer" varchar,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "awards_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "news_articles_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "news_articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"cover_id" integer,
  	"category" "enum_news_articles_category",
  	"published_at" timestamp(3) with time zone,
  	"author" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_news_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "news_articles_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_news_articles_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_news_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_cover_id" integer,
  	"version_category" "enum__news_articles_v_version_category",
  	"version_published_at" timestamp(3) with time zone,
  	"version_author" varchar,
  	"version_seo_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__news_articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__news_articles_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_news_articles_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "stories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"hero_id" integer,
  	"sector" "enum_stories_sector",
  	"client_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"author" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_stories_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "stories_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "stories_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  CREATE TABLE "_stories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_hero_id" integer,
  	"version_sector" "enum__stories_v_version_sector",
  	"version_client_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_author" varchar,
  	"version_seo_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__stories_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__stories_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_stories_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_stories_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  CREATE TABLE "investor_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"category" "enum_investor_documents_category" NOT NULL,
  	"sub_category" varchar,
  	"fy" varchar,
  	"file_id" integer,
  	"external_url" varchar,
  	"published_at" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "investor_documents_locales" (
  	"title" varchar NOT NULL,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "job_openings_responsibilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "job_openings_responsibilities_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "job_openings_qualifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "job_openings_qualifications_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "job_openings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"department" varchar,
  	"location" varchar,
  	"employment_type" "enum_job_openings_employment_type",
  	"posted_at" timestamp(3) with time zone,
  	"closes_at" timestamp(3) with time zone,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_job_openings_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "job_openings_locales" (
  	"title" varchar,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_job_openings_v_version_responsibilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_job_openings_v_version_responsibilities_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_job_openings_v_version_qualifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_job_openings_v_version_qualifications_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_job_openings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_department" varchar,
  	"version_location" varchar,
  	"version_employment_type" "enum__job_openings_v_version_employment_type",
  	"version_posted_at" timestamp(3) with time zone,
  	"version_closes_at" timestamp(3) with time zone,
  	"version_is_active" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__job_openings_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__job_openings_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_job_openings_v_locales" (
  	"version_title" varchar,
  	"version_description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "job_applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"job_opening_id" integer,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"resume_file_id" integer NOT NULL,
  	"cover_letter" varchar,
  	"source" varchar,
  	"status" "enum_job_applications_status" DEFAULT 'new',
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "enquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"company" varchar,
  	"country" varchar,
  	"product_interest_id" integer,
  	"message" varchar NOT NULL,
  	"source" varchar,
  	"status" "enum_enquiries_status" DEFAULT 'new',
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contact_messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"subject" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"status" "enum_contact_messages_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"pages_id" integer,
  	"product_categories_id" integer,
  	"products_id" integer,
  	"verticals_id" integer,
  	"persons_id" integer,
  	"clients_id" integer,
  	"plants_id" integer,
  	"certifications_id" integer,
  	"awards_id" integer,
  	"news_articles_id" integer,
  	"stories_id" integer,
  	"investor_documents_id" integer,
  	"job_openings_id" integer,
  	"job_applications_id" integer,
  	"enquiries_id" integer,
  	"contact_messages_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_addresses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"line1" varchar NOT NULL,
  	"line2" varchar,
  	"city" varchar NOT NULL,
  	"state" varchar,
  	"pin" varchar,
  	"country" varchar DEFAULT 'India',
  	"phone" varchar,
  	"fax" varchar,
  	"email" varchar,
  	"maps_url" varchar
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_name" varchar DEFAULT 'JSK Industries Pvt. Ltd.' NOT NULL,
  	"primary_email" varchar DEFAULT 'jsk@jskindia.in',
  	"primary_phone" varchar DEFAULT '+91 22 6625 3700',
  	"social_linkedin" varchar,
  	"social_twitter" varchar,
  	"social_facebook" varchar,
  	"social_youtube" varchar,
  	"default_seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"tagline" varchar DEFAULT 'Powering Growth',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "navigation_header_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_header_children_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_header_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_href" varchar DEFAULT '/enquiry',
  	"announcement_enabled" boolean DEFAULT false,
  	"announcement_link" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_locales" (
  	"cta_label" varchar DEFAULT 'Enquire Now',
  	"announcement_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "footer_columns_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "footer_columns_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "footer_legal_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_locales" (
  	"copyright_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_parent_id_pages_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_categories_locales" ADD CONSTRAINT "product_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_standards" ADD CONSTRAINT "products_standards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_applications" ADD CONSTRAINT "products_applications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_applications_locales" ADD CONSTRAINT "products_applications_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_specs_table" ADD CONSTRAINT "products_specs_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_specs_table_locales" ADD CONSTRAINT "products_specs_table_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_specs_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_gallery_images" ADD CONSTRAINT "products_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_gallery_images" ADD CONSTRAINT "products_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_construction_image_id_media_id_fk" FOREIGN KEY ("construction_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_brochure_pdf_id_media_id_fk" FOREIGN KEY ("brochure_pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_standards" ADD CONSTRAINT "_products_v_version_standards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_applications" ADD CONSTRAINT "_products_v_version_applications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_applications_locales" ADD CONSTRAINT "_products_v_version_applications_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_specs_table" ADD CONSTRAINT "_products_v_version_specs_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_specs_table_locales" ADD CONSTRAINT "_products_v_version_specs_table_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_specs_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_gallery_images" ADD CONSTRAINT "_products_v_version_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_version_gallery_images" ADD CONSTRAINT "_products_v_version_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_category_id_product_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_construction_image_id_media_id_fk" FOREIGN KEY ("version_construction_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_brochure_pdf_id_media_id_fk" FOREIGN KEY ("version_brochure_pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_locales" ADD CONSTRAINT "_products_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "verticals_downloads" ADD CONSTRAINT "verticals_downloads_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "verticals_downloads" ADD CONSTRAINT "verticals_downloads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."verticals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "verticals_downloads_locales" ADD CONSTRAINT "verticals_downloads_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."verticals_downloads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "verticals" ADD CONSTRAINT "verticals_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "verticals" ADD CONSTRAINT "verticals_partner_logo_id_media_id_fk" FOREIGN KEY ("partner_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "verticals" ADD CONSTRAINT "verticals_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "verticals_locales" ADD CONSTRAINT "verticals_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."verticals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_verticals_v_version_downloads" ADD CONSTRAINT "_verticals_v_version_downloads_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_verticals_v_version_downloads" ADD CONSTRAINT "_verticals_v_version_downloads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_verticals_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_verticals_v_version_downloads_locales" ADD CONSTRAINT "_verticals_v_version_downloads_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_verticals_v_version_downloads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_verticals_v" ADD CONSTRAINT "_verticals_v_parent_id_verticals_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."verticals"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_verticals_v" ADD CONSTRAINT "_verticals_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_verticals_v" ADD CONSTRAINT "_verticals_v_version_partner_logo_id_media_id_fk" FOREIGN KEY ("version_partner_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_verticals_v" ADD CONSTRAINT "_verticals_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_verticals_v_locales" ADD CONSTRAINT "_verticals_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_verticals_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "persons" ADD CONSTRAINT "persons_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "persons_locales" ADD CONSTRAINT "persons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."persons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clients" ADD CONSTRAINT "clients_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "plants_capacities" ADD CONSTRAINT "plants_capacities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "plants_capacities_locales" ADD CONSTRAINT "plants_capacities_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."plants_capacities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "plants_photos" ADD CONSTRAINT "plants_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "plants_photos" ADD CONSTRAINT "plants_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "plants_rels" ADD CONSTRAINT "plants_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "plants_rels" ADD CONSTRAINT "plants_rels_certifications_fk" FOREIGN KEY ("certifications_id") REFERENCES "public"."certifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "certifications" ADD CONSTRAINT "certifications_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certifications" ADD CONSTRAINT "certifications_document_id_media_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "awards" ADD CONSTRAINT "awards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "awards_locales" ADD CONSTRAINT "awards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_articles_tags" ADD CONSTRAINT "news_articles_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_articles" ADD CONSTRAINT "news_articles_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_articles" ADD CONSTRAINT "news_articles_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_articles_locales" ADD CONSTRAINT "news_articles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_articles_v_version_tags" ADD CONSTRAINT "_news_articles_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_articles_v" ADD CONSTRAINT "_news_articles_v_parent_id_news_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news_articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_articles_v" ADD CONSTRAINT "_news_articles_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_articles_v" ADD CONSTRAINT "_news_articles_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_articles_v_locales" ADD CONSTRAINT "_news_articles_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories" ADD CONSTRAINT "stories_hero_id_media_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories" ADD CONSTRAINT "stories_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories" ADD CONSTRAINT "stories_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_locales" ADD CONSTRAINT "stories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_rels" ADD CONSTRAINT "stories_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_rels" ADD CONSTRAINT "stories_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_parent_id_stories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_version_hero_id_media_id_fk" FOREIGN KEY ("version_hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_version_client_id_clients_id_fk" FOREIGN KEY ("version_client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_locales" ADD CONSTRAINT "_stories_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_rels" ADD CONSTRAINT "_stories_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_rels" ADD CONSTRAINT "_stories_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investor_documents" ADD CONSTRAINT "investor_documents_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "investor_documents_locales" ADD CONSTRAINT "investor_documents_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investor_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_openings_responsibilities" ADD CONSTRAINT "job_openings_responsibilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."job_openings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_openings_responsibilities_locales" ADD CONSTRAINT "job_openings_responsibilities_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."job_openings_responsibilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_openings_qualifications" ADD CONSTRAINT "job_openings_qualifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."job_openings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_openings_qualifications_locales" ADD CONSTRAINT "job_openings_qualifications_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."job_openings_qualifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_openings_locales" ADD CONSTRAINT "job_openings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."job_openings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_job_openings_v_version_responsibilities" ADD CONSTRAINT "_job_openings_v_version_responsibilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_job_openings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_job_openings_v_version_responsibilities_locales" ADD CONSTRAINT "_job_openings_v_version_responsibilities_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_job_openings_v_version_responsibilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_job_openings_v_version_qualifications" ADD CONSTRAINT "_job_openings_v_version_qualifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_job_openings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_job_openings_v_version_qualifications_locales" ADD CONSTRAINT "_job_openings_v_version_qualifications_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_job_openings_v_version_qualifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_job_openings_v" ADD CONSTRAINT "_job_openings_v_parent_id_job_openings_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."job_openings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_job_openings_v_locales" ADD CONSTRAINT "_job_openings_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_job_openings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_opening_id_job_openings_id_fk" FOREIGN KEY ("job_opening_id") REFERENCES "public"."job_openings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_resume_file_id_media_id_fk" FOREIGN KEY ("resume_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_product_interest_id_products_id_fk" FOREIGN KEY ("product_interest_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_verticals_fk" FOREIGN KEY ("verticals_id") REFERENCES "public"."verticals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_persons_fk" FOREIGN KEY ("persons_id") REFERENCES "public"."persons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_plants_fk" FOREIGN KEY ("plants_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_certifications_fk" FOREIGN KEY ("certifications_id") REFERENCES "public"."certifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_awards_fk" FOREIGN KEY ("awards_id") REFERENCES "public"."awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_articles_fk" FOREIGN KEY ("news_articles_id") REFERENCES "public"."news_articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_stories_fk" FOREIGN KEY ("stories_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_investor_documents_fk" FOREIGN KEY ("investor_documents_id") REFERENCES "public"."investor_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_job_openings_fk" FOREIGN KEY ("job_openings_id") REFERENCES "public"."job_openings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_job_applications_fk" FOREIGN KEY ("job_applications_id") REFERENCES "public"."job_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enquiries_fk" FOREIGN KEY ("enquiries_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_messages_fk" FOREIGN KEY ("contact_messages_id") REFERENCES "public"."contact_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_addresses" ADD CONSTRAINT "site_settings_addresses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_seo_image_id_media_id_fk" FOREIGN KEY ("default_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_header_children" ADD CONSTRAINT "navigation_header_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_header_children_locales" ADD CONSTRAINT "navigation_header_children_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_header_children"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_header" ADD CONSTRAINT "navigation_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_header_locales" ADD CONSTRAINT "navigation_header_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_locales" ADD CONSTRAINT "navigation_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links_locales" ADD CONSTRAINT "footer_columns_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_locales" ADD CONSTRAINT "footer_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal_links" ADD CONSTRAINT "footer_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal_links_locales" ADD CONSTRAINT "footer_legal_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_legal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_hero_image_idx" ON "pages" USING btree ("hero_image_id");
  CREATE INDEX "pages_parent_idx" ON "pages" USING btree ("parent_id");
  CREATE INDEX "pages_seo_seo_og_image_idx" ON "pages" USING btree ("seo_og_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_hero_image_idx" ON "_pages_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_pages_v_version_version_parent_idx" ON "_pages_v" USING btree ("version_parent_id");
  CREATE INDEX "_pages_v_version_seo_version_seo_og_image_idx" ON "_pages_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "product_categories_slug_idx" ON "product_categories" USING btree ("slug");
  CREATE INDEX "product_categories_hero_image_idx" ON "product_categories" USING btree ("hero_image_id");
  CREATE INDEX "product_categories_updated_at_idx" ON "product_categories" USING btree ("updated_at");
  CREATE INDEX "product_categories_created_at_idx" ON "product_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "product_categories_locales_locale_parent_id_unique" ON "product_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_standards_order_idx" ON "products_standards" USING btree ("_order");
  CREATE INDEX "products_standards_parent_id_idx" ON "products_standards" USING btree ("_parent_id");
  CREATE INDEX "products_applications_order_idx" ON "products_applications" USING btree ("_order");
  CREATE INDEX "products_applications_parent_id_idx" ON "products_applications" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_applications_locales_locale_parent_id_unique" ON "products_applications_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_specs_table_order_idx" ON "products_specs_table" USING btree ("_order");
  CREATE INDEX "products_specs_table_parent_id_idx" ON "products_specs_table" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_specs_table_locales_locale_parent_id_unique" ON "products_specs_table_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_gallery_images_order_idx" ON "products_gallery_images" USING btree ("_order");
  CREATE INDEX "products_gallery_images_parent_id_idx" ON "products_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "products_gallery_images_image_idx" ON "products_gallery_images" USING btree ("image_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");
  CREATE INDEX "products_construction_image_idx" ON "products" USING btree ("construction_image_id");
  CREATE INDEX "products_brochure_pdf_idx" ON "products" USING btree ("brochure_pdf_id");
  CREATE INDEX "products_seo_seo_og_image_idx" ON "products" USING btree ("seo_og_image_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products__status_idx" ON "products" USING btree ("_status");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_products_id_idx" ON "products_rels" USING btree ("products_id");
  CREATE INDEX "_products_v_version_standards_order_idx" ON "_products_v_version_standards" USING btree ("_order");
  CREATE INDEX "_products_v_version_standards_parent_id_idx" ON "_products_v_version_standards" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_applications_order_idx" ON "_products_v_version_applications" USING btree ("_order");
  CREATE INDEX "_products_v_version_applications_parent_id_idx" ON "_products_v_version_applications" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_products_v_version_applications_locales_locale_parent_id_un" ON "_products_v_version_applications_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_version_specs_table_order_idx" ON "_products_v_version_specs_table" USING btree ("_order");
  CREATE INDEX "_products_v_version_specs_table_parent_id_idx" ON "_products_v_version_specs_table" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_products_v_version_specs_table_locales_locale_parent_id_uni" ON "_products_v_version_specs_table_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_version_gallery_images_order_idx" ON "_products_v_version_gallery_images" USING btree ("_order");
  CREATE INDEX "_products_v_version_gallery_images_parent_id_idx" ON "_products_v_version_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_gallery_images_image_idx" ON "_products_v_version_gallery_images" USING btree ("image_id");
  CREATE INDEX "_products_v_parent_idx" ON "_products_v" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_version_slug_idx" ON "_products_v" USING btree ("version_slug");
  CREATE INDEX "_products_v_version_version_category_idx" ON "_products_v" USING btree ("version_category_id");
  CREATE INDEX "_products_v_version_version_construction_image_idx" ON "_products_v" USING btree ("version_construction_image_id");
  CREATE INDEX "_products_v_version_version_brochure_pdf_idx" ON "_products_v" USING btree ("version_brochure_pdf_id");
  CREATE INDEX "_products_v_version_seo_version_seo_og_image_idx" ON "_products_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_products_v_version_version_updated_at_idx" ON "_products_v" USING btree ("version_updated_at");
  CREATE INDEX "_products_v_version_version_created_at_idx" ON "_products_v" USING btree ("version_created_at");
  CREATE INDEX "_products_v_version_version__status_idx" ON "_products_v" USING btree ("version__status");
  CREATE INDEX "_products_v_created_at_idx" ON "_products_v" USING btree ("created_at");
  CREATE INDEX "_products_v_updated_at_idx" ON "_products_v" USING btree ("updated_at");
  CREATE INDEX "_products_v_snapshot_idx" ON "_products_v" USING btree ("snapshot");
  CREATE INDEX "_products_v_published_locale_idx" ON "_products_v" USING btree ("published_locale");
  CREATE INDEX "_products_v_latest_idx" ON "_products_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_products_v_locales_locale_parent_id_unique" ON "_products_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_rels_order_idx" ON "_products_v_rels" USING btree ("order");
  CREATE INDEX "_products_v_rels_parent_idx" ON "_products_v_rels" USING btree ("parent_id");
  CREATE INDEX "_products_v_rels_path_idx" ON "_products_v_rels" USING btree ("path");
  CREATE INDEX "_products_v_rels_products_id_idx" ON "_products_v_rels" USING btree ("products_id");
  CREATE INDEX "verticals_downloads_order_idx" ON "verticals_downloads" USING btree ("_order");
  CREATE INDEX "verticals_downloads_parent_id_idx" ON "verticals_downloads" USING btree ("_parent_id");
  CREATE INDEX "verticals_downloads_file_idx" ON "verticals_downloads" USING btree ("file_id");
  CREATE UNIQUE INDEX "verticals_downloads_locales_locale_parent_id_unique" ON "verticals_downloads_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "verticals_slug_idx" ON "verticals" USING btree ("slug");
  CREATE INDEX "verticals_hero_image_idx" ON "verticals" USING btree ("hero_image_id");
  CREATE INDEX "verticals_partner_partner_logo_idx" ON "verticals" USING btree ("partner_logo_id");
  CREATE INDEX "verticals_seo_seo_og_image_idx" ON "verticals" USING btree ("seo_og_image_id");
  CREATE INDEX "verticals_updated_at_idx" ON "verticals" USING btree ("updated_at");
  CREATE INDEX "verticals_created_at_idx" ON "verticals" USING btree ("created_at");
  CREATE INDEX "verticals__status_idx" ON "verticals" USING btree ("_status");
  CREATE UNIQUE INDEX "verticals_locales_locale_parent_id_unique" ON "verticals_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_verticals_v_version_downloads_order_idx" ON "_verticals_v_version_downloads" USING btree ("_order");
  CREATE INDEX "_verticals_v_version_downloads_parent_id_idx" ON "_verticals_v_version_downloads" USING btree ("_parent_id");
  CREATE INDEX "_verticals_v_version_downloads_file_idx" ON "_verticals_v_version_downloads" USING btree ("file_id");
  CREATE UNIQUE INDEX "_verticals_v_version_downloads_locales_locale_parent_id_uniq" ON "_verticals_v_version_downloads_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_verticals_v_parent_idx" ON "_verticals_v" USING btree ("parent_id");
  CREATE INDEX "_verticals_v_version_version_slug_idx" ON "_verticals_v" USING btree ("version_slug");
  CREATE INDEX "_verticals_v_version_version_hero_image_idx" ON "_verticals_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_verticals_v_version_partner_version_partner_logo_idx" ON "_verticals_v" USING btree ("version_partner_logo_id");
  CREATE INDEX "_verticals_v_version_seo_version_seo_og_image_idx" ON "_verticals_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_verticals_v_version_version_updated_at_idx" ON "_verticals_v" USING btree ("version_updated_at");
  CREATE INDEX "_verticals_v_version_version_created_at_idx" ON "_verticals_v" USING btree ("version_created_at");
  CREATE INDEX "_verticals_v_version_version__status_idx" ON "_verticals_v" USING btree ("version__status");
  CREATE INDEX "_verticals_v_created_at_idx" ON "_verticals_v" USING btree ("created_at");
  CREATE INDEX "_verticals_v_updated_at_idx" ON "_verticals_v" USING btree ("updated_at");
  CREATE INDEX "_verticals_v_snapshot_idx" ON "_verticals_v" USING btree ("snapshot");
  CREATE INDEX "_verticals_v_published_locale_idx" ON "_verticals_v" USING btree ("published_locale");
  CREATE INDEX "_verticals_v_latest_idx" ON "_verticals_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_verticals_v_locales_locale_parent_id_unique" ON "_verticals_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "persons_photo_idx" ON "persons" USING btree ("photo_id");
  CREATE INDEX "persons_updated_at_idx" ON "persons" USING btree ("updated_at");
  CREATE INDEX "persons_created_at_idx" ON "persons" USING btree ("created_at");
  CREATE UNIQUE INDEX "persons_locales_locale_parent_id_unique" ON "persons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "clients_logo_idx" ON "clients" USING btree ("logo_id");
  CREATE INDEX "clients_updated_at_idx" ON "clients" USING btree ("updated_at");
  CREATE INDEX "clients_created_at_idx" ON "clients" USING btree ("created_at");
  CREATE INDEX "plants_capacities_order_idx" ON "plants_capacities" USING btree ("_order");
  CREATE INDEX "plants_capacities_parent_id_idx" ON "plants_capacities" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "plants_capacities_locales_locale_parent_id_unique" ON "plants_capacities_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "plants_photos_order_idx" ON "plants_photos" USING btree ("_order");
  CREATE INDEX "plants_photos_parent_id_idx" ON "plants_photos" USING btree ("_parent_id");
  CREATE INDEX "plants_photos_image_idx" ON "plants_photos" USING btree ("image_id");
  CREATE UNIQUE INDEX "plants_slug_idx" ON "plants" USING btree ("slug");
  CREATE INDEX "plants_updated_at_idx" ON "plants" USING btree ("updated_at");
  CREATE INDEX "plants_created_at_idx" ON "plants" USING btree ("created_at");
  CREATE INDEX "plants_rels_order_idx" ON "plants_rels" USING btree ("order");
  CREATE INDEX "plants_rels_parent_idx" ON "plants_rels" USING btree ("parent_id");
  CREATE INDEX "plants_rels_path_idx" ON "plants_rels" USING btree ("path");
  CREATE INDEX "plants_rels_certifications_id_idx" ON "plants_rels" USING btree ("certifications_id");
  CREATE INDEX "certifications_image_idx" ON "certifications" USING btree ("image_id");
  CREATE INDEX "certifications_document_idx" ON "certifications" USING btree ("document_id");
  CREATE INDEX "certifications_updated_at_idx" ON "certifications" USING btree ("updated_at");
  CREATE INDEX "certifications_created_at_idx" ON "certifications" USING btree ("created_at");
  CREATE INDEX "awards_image_idx" ON "awards" USING btree ("image_id");
  CREATE INDEX "awards_updated_at_idx" ON "awards" USING btree ("updated_at");
  CREATE INDEX "awards_created_at_idx" ON "awards" USING btree ("created_at");
  CREATE UNIQUE INDEX "awards_locales_locale_parent_id_unique" ON "awards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "news_articles_tags_order_idx" ON "news_articles_tags" USING btree ("_order");
  CREATE INDEX "news_articles_tags_parent_id_idx" ON "news_articles_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "news_articles_slug_idx" ON "news_articles" USING btree ("slug");
  CREATE INDEX "news_articles_cover_idx" ON "news_articles" USING btree ("cover_id");
  CREATE INDEX "news_articles_seo_seo_og_image_idx" ON "news_articles" USING btree ("seo_og_image_id");
  CREATE INDEX "news_articles_updated_at_idx" ON "news_articles" USING btree ("updated_at");
  CREATE INDEX "news_articles_created_at_idx" ON "news_articles" USING btree ("created_at");
  CREATE INDEX "news_articles__status_idx" ON "news_articles" USING btree ("_status");
  CREATE UNIQUE INDEX "news_articles_locales_locale_parent_id_unique" ON "news_articles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_news_articles_v_version_tags_order_idx" ON "_news_articles_v_version_tags" USING btree ("_order");
  CREATE INDEX "_news_articles_v_version_tags_parent_id_idx" ON "_news_articles_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_news_articles_v_parent_idx" ON "_news_articles_v" USING btree ("parent_id");
  CREATE INDEX "_news_articles_v_version_version_slug_idx" ON "_news_articles_v" USING btree ("version_slug");
  CREATE INDEX "_news_articles_v_version_version_cover_idx" ON "_news_articles_v" USING btree ("version_cover_id");
  CREATE INDEX "_news_articles_v_version_seo_version_seo_og_image_idx" ON "_news_articles_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_news_articles_v_version_version_updated_at_idx" ON "_news_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_articles_v_version_version_created_at_idx" ON "_news_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_news_articles_v_version_version__status_idx" ON "_news_articles_v" USING btree ("version__status");
  CREATE INDEX "_news_articles_v_created_at_idx" ON "_news_articles_v" USING btree ("created_at");
  CREATE INDEX "_news_articles_v_updated_at_idx" ON "_news_articles_v" USING btree ("updated_at");
  CREATE INDEX "_news_articles_v_snapshot_idx" ON "_news_articles_v" USING btree ("snapshot");
  CREATE INDEX "_news_articles_v_published_locale_idx" ON "_news_articles_v" USING btree ("published_locale");
  CREATE INDEX "_news_articles_v_latest_idx" ON "_news_articles_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_news_articles_v_locales_locale_parent_id_unique" ON "_news_articles_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "stories_slug_idx" ON "stories" USING btree ("slug");
  CREATE INDEX "stories_hero_idx" ON "stories" USING btree ("hero_id");
  CREATE INDEX "stories_client_idx" ON "stories" USING btree ("client_id");
  CREATE INDEX "stories_seo_seo_og_image_idx" ON "stories" USING btree ("seo_og_image_id");
  CREATE INDEX "stories_updated_at_idx" ON "stories" USING btree ("updated_at");
  CREATE INDEX "stories_created_at_idx" ON "stories" USING btree ("created_at");
  CREATE INDEX "stories__status_idx" ON "stories" USING btree ("_status");
  CREATE UNIQUE INDEX "stories_locales_locale_parent_id_unique" ON "stories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "stories_rels_order_idx" ON "stories_rels" USING btree ("order");
  CREATE INDEX "stories_rels_parent_idx" ON "stories_rels" USING btree ("parent_id");
  CREATE INDEX "stories_rels_path_idx" ON "stories_rels" USING btree ("path");
  CREATE INDEX "stories_rels_products_id_idx" ON "stories_rels" USING btree ("products_id");
  CREATE INDEX "_stories_v_parent_idx" ON "_stories_v" USING btree ("parent_id");
  CREATE INDEX "_stories_v_version_version_slug_idx" ON "_stories_v" USING btree ("version_slug");
  CREATE INDEX "_stories_v_version_version_hero_idx" ON "_stories_v" USING btree ("version_hero_id");
  CREATE INDEX "_stories_v_version_version_client_idx" ON "_stories_v" USING btree ("version_client_id");
  CREATE INDEX "_stories_v_version_seo_version_seo_og_image_idx" ON "_stories_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_stories_v_version_version_updated_at_idx" ON "_stories_v" USING btree ("version_updated_at");
  CREATE INDEX "_stories_v_version_version_created_at_idx" ON "_stories_v" USING btree ("version_created_at");
  CREATE INDEX "_stories_v_version_version__status_idx" ON "_stories_v" USING btree ("version__status");
  CREATE INDEX "_stories_v_created_at_idx" ON "_stories_v" USING btree ("created_at");
  CREATE INDEX "_stories_v_updated_at_idx" ON "_stories_v" USING btree ("updated_at");
  CREATE INDEX "_stories_v_snapshot_idx" ON "_stories_v" USING btree ("snapshot");
  CREATE INDEX "_stories_v_published_locale_idx" ON "_stories_v" USING btree ("published_locale");
  CREATE INDEX "_stories_v_latest_idx" ON "_stories_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_stories_v_locales_locale_parent_id_unique" ON "_stories_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_stories_v_rels_order_idx" ON "_stories_v_rels" USING btree ("order");
  CREATE INDEX "_stories_v_rels_parent_idx" ON "_stories_v_rels" USING btree ("parent_id");
  CREATE INDEX "_stories_v_rels_path_idx" ON "_stories_v_rels" USING btree ("path");
  CREATE INDEX "_stories_v_rels_products_id_idx" ON "_stories_v_rels" USING btree ("products_id");
  CREATE INDEX "investor_documents_file_idx" ON "investor_documents" USING btree ("file_id");
  CREATE INDEX "investor_documents_updated_at_idx" ON "investor_documents" USING btree ("updated_at");
  CREATE INDEX "investor_documents_created_at_idx" ON "investor_documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "investor_documents_locales_locale_parent_id_unique" ON "investor_documents_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "job_openings_responsibilities_order_idx" ON "job_openings_responsibilities" USING btree ("_order");
  CREATE INDEX "job_openings_responsibilities_parent_id_idx" ON "job_openings_responsibilities" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "job_openings_responsibilities_locales_locale_parent_id_uniqu" ON "job_openings_responsibilities_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "job_openings_qualifications_order_idx" ON "job_openings_qualifications" USING btree ("_order");
  CREATE INDEX "job_openings_qualifications_parent_id_idx" ON "job_openings_qualifications" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "job_openings_qualifications_locales_locale_parent_id_unique" ON "job_openings_qualifications_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "job_openings_slug_idx" ON "job_openings" USING btree ("slug");
  CREATE INDEX "job_openings_updated_at_idx" ON "job_openings" USING btree ("updated_at");
  CREATE INDEX "job_openings_created_at_idx" ON "job_openings" USING btree ("created_at");
  CREATE INDEX "job_openings__status_idx" ON "job_openings" USING btree ("_status");
  CREATE UNIQUE INDEX "job_openings_locales_locale_parent_id_unique" ON "job_openings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_job_openings_v_version_responsibilities_order_idx" ON "_job_openings_v_version_responsibilities" USING btree ("_order");
  CREATE INDEX "_job_openings_v_version_responsibilities_parent_id_idx" ON "_job_openings_v_version_responsibilities" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_job_openings_v_version_responsibilities_locales_locale_pare" ON "_job_openings_v_version_responsibilities_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_job_openings_v_version_qualifications_order_idx" ON "_job_openings_v_version_qualifications" USING btree ("_order");
  CREATE INDEX "_job_openings_v_version_qualifications_parent_id_idx" ON "_job_openings_v_version_qualifications" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_job_openings_v_version_qualifications_locales_locale_parent" ON "_job_openings_v_version_qualifications_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_job_openings_v_parent_idx" ON "_job_openings_v" USING btree ("parent_id");
  CREATE INDEX "_job_openings_v_version_version_slug_idx" ON "_job_openings_v" USING btree ("version_slug");
  CREATE INDEX "_job_openings_v_version_version_updated_at_idx" ON "_job_openings_v" USING btree ("version_updated_at");
  CREATE INDEX "_job_openings_v_version_version_created_at_idx" ON "_job_openings_v" USING btree ("version_created_at");
  CREATE INDEX "_job_openings_v_version_version__status_idx" ON "_job_openings_v" USING btree ("version__status");
  CREATE INDEX "_job_openings_v_created_at_idx" ON "_job_openings_v" USING btree ("created_at");
  CREATE INDEX "_job_openings_v_updated_at_idx" ON "_job_openings_v" USING btree ("updated_at");
  CREATE INDEX "_job_openings_v_snapshot_idx" ON "_job_openings_v" USING btree ("snapshot");
  CREATE INDEX "_job_openings_v_published_locale_idx" ON "_job_openings_v" USING btree ("published_locale");
  CREATE INDEX "_job_openings_v_latest_idx" ON "_job_openings_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_job_openings_v_locales_locale_parent_id_unique" ON "_job_openings_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "job_applications_job_opening_idx" ON "job_applications" USING btree ("job_opening_id");
  CREATE INDEX "job_applications_resume_file_idx" ON "job_applications" USING btree ("resume_file_id");
  CREATE INDEX "job_applications_updated_at_idx" ON "job_applications" USING btree ("updated_at");
  CREATE INDEX "job_applications_created_at_idx" ON "job_applications" USING btree ("created_at");
  CREATE INDEX "enquiries_product_interest_idx" ON "enquiries" USING btree ("product_interest_id");
  CREATE INDEX "enquiries_updated_at_idx" ON "enquiries" USING btree ("updated_at");
  CREATE INDEX "enquiries_created_at_idx" ON "enquiries" USING btree ("created_at");
  CREATE INDEX "contact_messages_updated_at_idx" ON "contact_messages" USING btree ("updated_at");
  CREATE INDEX "contact_messages_created_at_idx" ON "contact_messages" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_product_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("product_categories_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_verticals_id_idx" ON "payload_locked_documents_rels" USING btree ("verticals_id");
  CREATE INDEX "payload_locked_documents_rels_persons_id_idx" ON "payload_locked_documents_rels" USING btree ("persons_id");
  CREATE INDEX "payload_locked_documents_rels_clients_id_idx" ON "payload_locked_documents_rels" USING btree ("clients_id");
  CREATE INDEX "payload_locked_documents_rels_plants_id_idx" ON "payload_locked_documents_rels" USING btree ("plants_id");
  CREATE INDEX "payload_locked_documents_rels_certifications_id_idx" ON "payload_locked_documents_rels" USING btree ("certifications_id");
  CREATE INDEX "payload_locked_documents_rels_awards_id_idx" ON "payload_locked_documents_rels" USING btree ("awards_id");
  CREATE INDEX "payload_locked_documents_rels_news_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("news_articles_id");
  CREATE INDEX "payload_locked_documents_rels_stories_id_idx" ON "payload_locked_documents_rels" USING btree ("stories_id");
  CREATE INDEX "payload_locked_documents_rels_investor_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("investor_documents_id");
  CREATE INDEX "payload_locked_documents_rels_job_openings_id_idx" ON "payload_locked_documents_rels" USING btree ("job_openings_id");
  CREATE INDEX "payload_locked_documents_rels_job_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("job_applications_id");
  CREATE INDEX "payload_locked_documents_rels_enquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("enquiries_id");
  CREATE INDEX "payload_locked_documents_rels_contact_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_messages_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_addresses_order_idx" ON "site_settings_addresses" USING btree ("_order");
  CREATE INDEX "site_settings_addresses_parent_id_idx" ON "site_settings_addresses" USING btree ("_parent_id");
  CREATE INDEX "site_settings_default_seo_image_idx" ON "site_settings" USING btree ("default_seo_image_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_header_children_order_idx" ON "navigation_header_children" USING btree ("_order");
  CREATE INDEX "navigation_header_children_parent_id_idx" ON "navigation_header_children" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_header_children_locales_locale_parent_id_unique" ON "navigation_header_children_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_header_order_idx" ON "navigation_header" USING btree ("_order");
  CREATE INDEX "navigation_header_parent_id_idx" ON "navigation_header" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_header_locales_locale_parent_id_unique" ON "navigation_header_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "navigation_locales_locale_parent_id_unique" ON "navigation_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_columns_links_order_idx" ON "footer_columns_links" USING btree ("_order");
  CREATE INDEX "footer_columns_links_parent_id_idx" ON "footer_columns_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_columns_links_locales_locale_parent_id_unique" ON "footer_columns_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_columns_locales_locale_parent_id_unique" ON "footer_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_legal_links_order_idx" ON "footer_legal_links" USING btree ("_order");
  CREATE INDEX "footer_legal_links_parent_id_idx" ON "footer_legal_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_legal_links_locales_locale_parent_id_unique" ON "footer_legal_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "product_categories" CASCADE;
  DROP TABLE "product_categories_locales" CASCADE;
  DROP TABLE "products_standards" CASCADE;
  DROP TABLE "products_applications" CASCADE;
  DROP TABLE "products_applications_locales" CASCADE;
  DROP TABLE "products_specs_table" CASCADE;
  DROP TABLE "products_specs_table_locales" CASCADE;
  DROP TABLE "products_gallery_images" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "_products_v_version_standards" CASCADE;
  DROP TABLE "_products_v_version_applications" CASCADE;
  DROP TABLE "_products_v_version_applications_locales" CASCADE;
  DROP TABLE "_products_v_version_specs_table" CASCADE;
  DROP TABLE "_products_v_version_specs_table_locales" CASCADE;
  DROP TABLE "_products_v_version_gallery_images" CASCADE;
  DROP TABLE "_products_v" CASCADE;
  DROP TABLE "_products_v_locales" CASCADE;
  DROP TABLE "_products_v_rels" CASCADE;
  DROP TABLE "verticals_downloads" CASCADE;
  DROP TABLE "verticals_downloads_locales" CASCADE;
  DROP TABLE "verticals" CASCADE;
  DROP TABLE "verticals_locales" CASCADE;
  DROP TABLE "_verticals_v_version_downloads" CASCADE;
  DROP TABLE "_verticals_v_version_downloads_locales" CASCADE;
  DROP TABLE "_verticals_v" CASCADE;
  DROP TABLE "_verticals_v_locales" CASCADE;
  DROP TABLE "persons" CASCADE;
  DROP TABLE "persons_locales" CASCADE;
  DROP TABLE "clients" CASCADE;
  DROP TABLE "plants_capacities" CASCADE;
  DROP TABLE "plants_capacities_locales" CASCADE;
  DROP TABLE "plants_photos" CASCADE;
  DROP TABLE "plants" CASCADE;
  DROP TABLE "plants_rels" CASCADE;
  DROP TABLE "certifications" CASCADE;
  DROP TABLE "awards" CASCADE;
  DROP TABLE "awards_locales" CASCADE;
  DROP TABLE "news_articles_tags" CASCADE;
  DROP TABLE "news_articles" CASCADE;
  DROP TABLE "news_articles_locales" CASCADE;
  DROP TABLE "_news_articles_v_version_tags" CASCADE;
  DROP TABLE "_news_articles_v" CASCADE;
  DROP TABLE "_news_articles_v_locales" CASCADE;
  DROP TABLE "stories" CASCADE;
  DROP TABLE "stories_locales" CASCADE;
  DROP TABLE "stories_rels" CASCADE;
  DROP TABLE "_stories_v" CASCADE;
  DROP TABLE "_stories_v_locales" CASCADE;
  DROP TABLE "_stories_v_rels" CASCADE;
  DROP TABLE "investor_documents" CASCADE;
  DROP TABLE "investor_documents_locales" CASCADE;
  DROP TABLE "job_openings_responsibilities" CASCADE;
  DROP TABLE "job_openings_responsibilities_locales" CASCADE;
  DROP TABLE "job_openings_qualifications" CASCADE;
  DROP TABLE "job_openings_qualifications_locales" CASCADE;
  DROP TABLE "job_openings" CASCADE;
  DROP TABLE "job_openings_locales" CASCADE;
  DROP TABLE "_job_openings_v_version_responsibilities" CASCADE;
  DROP TABLE "_job_openings_v_version_responsibilities_locales" CASCADE;
  DROP TABLE "_job_openings_v_version_qualifications" CASCADE;
  DROP TABLE "_job_openings_v_version_qualifications_locales" CASCADE;
  DROP TABLE "_job_openings_v" CASCADE;
  DROP TABLE "_job_openings_v_locales" CASCADE;
  DROP TABLE "job_applications" CASCADE;
  DROP TABLE "enquiries" CASCADE;
  DROP TABLE "contact_messages" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_addresses" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "navigation_header_children" CASCADE;
  DROP TABLE "navigation_header_children_locales" CASCADE;
  DROP TABLE "navigation_header" CASCADE;
  DROP TABLE "navigation_header_locales" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "navigation_locales" CASCADE;
  DROP TABLE "footer_columns_links" CASCADE;
  DROP TABLE "footer_columns_links_locales" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer_columns_locales" CASCADE;
  DROP TABLE "footer_legal_links" CASCADE;
  DROP TABLE "footer_legal_links_locales" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum__products_v_version_status";
  DROP TYPE "public"."enum__products_v_published_locale";
  DROP TYPE "public"."enum_verticals_status";
  DROP TYPE "public"."enum__verticals_v_version_status";
  DROP TYPE "public"."enum__verticals_v_published_locale";
  DROP TYPE "public"."enum_clients_sector";
  DROP TYPE "public"."enum_news_articles_category";
  DROP TYPE "public"."enum_news_articles_status";
  DROP TYPE "public"."enum__news_articles_v_version_category";
  DROP TYPE "public"."enum__news_articles_v_version_status";
  DROP TYPE "public"."enum__news_articles_v_published_locale";
  DROP TYPE "public"."enum_stories_sector";
  DROP TYPE "public"."enum_stories_status";
  DROP TYPE "public"."enum__stories_v_version_sector";
  DROP TYPE "public"."enum__stories_v_version_status";
  DROP TYPE "public"."enum__stories_v_published_locale";
  DROP TYPE "public"."enum_investor_documents_category";
  DROP TYPE "public"."enum_job_openings_employment_type";
  DROP TYPE "public"."enum_job_openings_status";
  DROP TYPE "public"."enum__job_openings_v_version_employment_type";
  DROP TYPE "public"."enum__job_openings_v_version_status";
  DROP TYPE "public"."enum__job_openings_v_published_locale";
  DROP TYPE "public"."enum_job_applications_status";
  DROP TYPE "public"."enum_enquiries_status";
  DROP TYPE "public"."enum_contact_messages_status";`)
}
