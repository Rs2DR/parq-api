ALTER TABLE "vehicles" ALTER COLUMN "license_plate" SET DATA TYPE varchar(8) USING "license_plate"::varchar(8);--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "brand" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "model" SET NOT NULL;