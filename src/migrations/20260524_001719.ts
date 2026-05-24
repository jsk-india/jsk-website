import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_languages_code" AS ENUM('en', 'hi', 'te', 'ta');
  CREATE TABLE "plants_locales" (
  	"area" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "certifications_locales" (
  	"name" varchar NOT NULL,
  	"issuer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "news_articles_tags_locales" (
  	"tag" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_news_articles_v_version_tags_locales" (
  	"tag" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings_addresses_locales" (
  	"label" varchar NOT NULL,
  	"line1" varchar NOT NULL,
  	"line2" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_languages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"code" "enum_site_settings_languages_code" NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"native_label" varchar,
  	"flag" varchar,
  	"order" numeric DEFAULT 0
  );
  
  ALTER TABLE "awards_locales" ADD COLUMN "issuer" varchar;
  ALTER TABLE "plants_locales" ADD CONSTRAINT "plants_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "certifications_locales" ADD CONSTRAINT "certifications_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."certifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_articles_tags_locales" ADD CONSTRAINT "news_articles_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_articles_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_articles_v_version_tags_locales" ADD CONSTRAINT "_news_articles_v_version_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_articles_v_version_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_addresses_locales" ADD CONSTRAINT "site_settings_addresses_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_addresses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_languages" ADD CONSTRAINT "site_settings_languages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "plants_locales_locale_parent_id_unique" ON "plants_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "certifications_locales_locale_parent_id_unique" ON "certifications_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "news_articles_tags_locales_locale_parent_id_unique" ON "news_articles_tags_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_news_articles_v_version_tags_locales_locale_parent_id_uniqu" ON "_news_articles_v_version_tags_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "site_settings_addresses_locales_locale_parent_id_unique" ON "site_settings_addresses_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_languages_order_idx" ON "site_settings_languages" USING btree ("_order");
  CREATE INDEX "site_settings_languages_parent_id_idx" ON "site_settings_languages" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_languages_code_idx" ON "site_settings_languages" USING btree ("code");
  -- Preserve existing data: copy from parent tables into new _locales tables
  -- using the default locale ('en') BEFORE dropping the original columns.
  INSERT INTO "plants_locales" ("area", "_locale", "_parent_id")
    SELECT "area", 'en', "id" FROM "plants" WHERE "area" IS NOT NULL AND "area" <> '';
  INSERT INTO "certifications_locales" ("name", "issuer", "_locale", "_parent_id")
    SELECT "name", "issuer", 'en', "id" FROM "certifications" WHERE "name" IS NOT NULL;
  UPDATE "awards_locales" SET "issuer" = (
    SELECT "issuer" FROM "awards" WHERE "awards"."id" = "awards_locales"."_parent_id"
  ) WHERE "_locale" = 'en';
  INSERT INTO "news_articles_tags_locales" ("tag", "_locale", "_parent_id")
    SELECT "tag", 'en', "id" FROM "news_articles_tags" WHERE "tag" IS NOT NULL AND "tag" <> '';
  INSERT INTO "site_settings_addresses_locales" ("label", "line1", "line2", "_locale", "_parent_id")
    SELECT "label", "line1", "line2", 'en', "id" FROM "site_settings_addresses" WHERE "label" IS NOT NULL;

  ALTER TABLE "plants" DROP COLUMN "area";
  ALTER TABLE "certifications" DROP COLUMN "name";
  ALTER TABLE "certifications" DROP COLUMN "issuer";
  ALTER TABLE "awards" DROP COLUMN "issuer";
  ALTER TABLE "news_articles_tags" DROP COLUMN "tag";
  ALTER TABLE "_news_articles_v_version_tags" DROP COLUMN "tag";
  ALTER TABLE "site_settings_addresses" DROP COLUMN "label";
  ALTER TABLE "site_settings_addresses" DROP COLUMN "line1";
  ALTER TABLE "site_settings_addresses" DROP COLUMN "line2";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "plants_locales" CASCADE;
  DROP TABLE "certifications_locales" CASCADE;
  DROP TABLE "news_articles_tags_locales" CASCADE;
  DROP TABLE "_news_articles_v_version_tags_locales" CASCADE;
  DROP TABLE "site_settings_addresses_locales" CASCADE;
  DROP TABLE "site_settings_languages" CASCADE;
  ALTER TABLE "plants" ADD COLUMN "area" varchar;
  ALTER TABLE "certifications" ADD COLUMN "name" varchar NOT NULL;
  ALTER TABLE "certifications" ADD COLUMN "issuer" varchar;
  ALTER TABLE "awards" ADD COLUMN "issuer" varchar;
  ALTER TABLE "news_articles_tags" ADD COLUMN "tag" varchar;
  ALTER TABLE "_news_articles_v_version_tags" ADD COLUMN "tag" varchar;
  ALTER TABLE "site_settings_addresses" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "site_settings_addresses" ADD COLUMN "line1" varchar NOT NULL;
  ALTER TABLE "site_settings_addresses" ADD COLUMN "line2" varchar;
  ALTER TABLE "awards_locales" DROP COLUMN "issuer";
  DROP TYPE "public"."enum_site_settings_languages_code";`)
}
