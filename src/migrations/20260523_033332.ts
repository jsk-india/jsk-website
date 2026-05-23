import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_settings_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"cta_href" varchar DEFAULT '/businesses'
  );
  
  CREATE TABLE "site_settings_hero_slides_locales" (
  	"eyebrow" varchar,
  	"headline" varchar NOT NULL,
  	"subheadline" varchar,
  	"cta_label" varchar DEFAULT 'Explore Businesses',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "site_settings" ADD COLUMN "brochure_id" integer;
  ALTER TABLE "site_settings_hero_slides" ADD CONSTRAINT "site_settings_hero_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_hero_slides" ADD CONSTRAINT "site_settings_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_hero_slides_locales" ADD CONSTRAINT "site_settings_hero_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_hero_slides_order_idx" ON "site_settings_hero_slides" USING btree ("_order");
  CREATE INDEX "site_settings_hero_slides_parent_id_idx" ON "site_settings_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "site_settings_hero_slides_image_idx" ON "site_settings_hero_slides" USING btree ("image_id");
  CREATE UNIQUE INDEX "site_settings_hero_slides_locales_locale_parent_id_unique" ON "site_settings_hero_slides_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_brochure_id_media_id_fk" FOREIGN KEY ("brochure_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_brochure_idx" ON "site_settings" USING btree ("brochure_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings_hero_slides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_hero_slides_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_settings_hero_slides" CASCADE;
  DROP TABLE "site_settings_hero_slides_locales" CASCADE;
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_brochure_id_media_id_fk";
  
  DROP INDEX "site_settings_brochure_idx";
  ALTER TABLE "site_settings" DROP COLUMN "brochure_id";`)
}
