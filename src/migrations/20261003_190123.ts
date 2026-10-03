import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_loading_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__loading_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "loading_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "loading" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT false,
  	"frame_ms" numeric DEFAULT 500,
  	"overlay_color" varchar DEFAULT '#0B0B0B',
  	"overlay_opacity" numeric DEFAULT 55,
  	"_status" "enum_loading_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_loading_v_version_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_loading_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_enabled" boolean DEFAULT false,
  	"version_frame_ms" numeric DEFAULT 500,
  	"version_overlay_color" varchar DEFAULT '#0B0B0B',
  	"version_overlay_opacity" numeric DEFAULT 55,
  	"version__status" "enum__loading_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "media" ADD COLUMN "sizes_sm_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_sm_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_sm_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_sm_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_sm_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_sm_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_md_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_md_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_md_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_md_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_md_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_md_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_lg_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_lg_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_lg_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_lg_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_lg_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_lg_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_xl_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_xl_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_xl_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_xl_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_xl_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_xl_filename" varchar;
  ALTER TABLE "loading_images" ADD CONSTRAINT "loading_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "loading_images" ADD CONSTRAINT "loading_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."loading"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_loading_v_version_images" ADD CONSTRAINT "_loading_v_version_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_loading_v_version_images" ADD CONSTRAINT "_loading_v_version_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_loading_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "loading_images_order_idx" ON "loading_images" USING btree ("_order");
  CREATE INDEX "loading_images_parent_id_idx" ON "loading_images" USING btree ("_parent_id");
  CREATE INDEX "loading_images_image_idx" ON "loading_images" USING btree ("image_id");
  CREATE INDEX "loading__status_idx" ON "loading" USING btree ("_status");
  CREATE INDEX "_loading_v_version_images_order_idx" ON "_loading_v_version_images" USING btree ("_order");
  CREATE INDEX "_loading_v_version_images_parent_id_idx" ON "_loading_v_version_images" USING btree ("_parent_id");
  CREATE INDEX "_loading_v_version_images_image_idx" ON "_loading_v_version_images" USING btree ("image_id");
  CREATE INDEX "_loading_v_version_version__status_idx" ON "_loading_v" USING btree ("version__status");
  CREATE INDEX "_loading_v_created_at_idx" ON "_loading_v" USING btree ("created_at");
  CREATE INDEX "_loading_v_updated_at_idx" ON "_loading_v" USING btree ("updated_at");
  CREATE INDEX "_loading_v_latest_idx" ON "_loading_v" USING btree ("latest");
  CREATE INDEX "media_sizes_sm_sizes_sm_filename_idx" ON "media" USING btree ("sizes_sm_filename");
  CREATE INDEX "media_sizes_md_sizes_md_filename_idx" ON "media" USING btree ("sizes_md_filename");
  CREATE INDEX "media_sizes_lg_sizes_lg_filename_idx" ON "media" USING btree ("sizes_lg_filename");
  CREATE INDEX "media_sizes_xl_sizes_xl_filename_idx" ON "media" USING btree ("sizes_xl_filename");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "loading_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "loading" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_loading_v_version_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_loading_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "loading_images" CASCADE;
  DROP TABLE "loading" CASCADE;
  DROP TABLE "_loading_v_version_images" CASCADE;
  DROP TABLE "_loading_v" CASCADE;
  DROP INDEX "media_sizes_sm_sizes_sm_filename_idx";
  DROP INDEX "media_sizes_md_sizes_md_filename_idx";
  DROP INDEX "media_sizes_lg_sizes_lg_filename_idx";
  DROP INDEX "media_sizes_xl_sizes_xl_filename_idx";
  ALTER TABLE "media" DROP COLUMN "sizes_sm_url";
  ALTER TABLE "media" DROP COLUMN "sizes_sm_width";
  ALTER TABLE "media" DROP COLUMN "sizes_sm_height";
  ALTER TABLE "media" DROP COLUMN "sizes_sm_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_sm_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_sm_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_md_url";
  ALTER TABLE "media" DROP COLUMN "sizes_md_width";
  ALTER TABLE "media" DROP COLUMN "sizes_md_height";
  ALTER TABLE "media" DROP COLUMN "sizes_md_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_md_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_md_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_lg_url";
  ALTER TABLE "media" DROP COLUMN "sizes_lg_width";
  ALTER TABLE "media" DROP COLUMN "sizes_lg_height";
  ALTER TABLE "media" DROP COLUMN "sizes_lg_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_lg_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_lg_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_xl_url";
  ALTER TABLE "media" DROP COLUMN "sizes_xl_width";
  ALTER TABLE "media" DROP COLUMN "sizes_xl_height";
  ALTER TABLE "media" DROP COLUMN "sizes_xl_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_xl_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_xl_filename";
  DROP TYPE "public"."enum_loading_status";
  DROP TYPE "public"."enum__loading_v_version_status";`)
}
