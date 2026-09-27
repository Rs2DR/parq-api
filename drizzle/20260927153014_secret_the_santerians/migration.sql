CREATE TYPE "session_status" AS ENUM('active', 'completed', 'expired');--> statement-breakpoint
CREATE TABLE "parking_lots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL,
	"latitude" numeric(10,7) NOT NULL,
	"longitude" numeric(10,7) NOT NULL,
	"price_per_hour" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parking_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"parking_spot_id" uuid NOT NULL,
	"start_time" timestamp DEFAULT now() NOT NULL,
	"end_time" timestamp NOT NULL,
	"total_price" integer NOT NULL,
	"status" "session_status" DEFAULT 'active'::"session_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parking_spots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"parking_lot_id" uuid NOT NULL,
	"spot_number" varchar(50) NOT NULL,
	"is_occupied" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"license_plate" varchar(50) NOT NULL UNIQUE,
	"brand" varchar(100),
	"model" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "passwordHash" TO "password_hash";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "parking_sessions" ADD CONSTRAINT "parking_sessions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "parking_sessions" ADD CONSTRAINT "parking_sessions_vehicle_id_vehicles_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id");--> statement-breakpoint
ALTER TABLE "parking_sessions" ADD CONSTRAINT "parking_sessions_parking_spot_id_parking_spots_id_fkey" FOREIGN KEY ("parking_spot_id") REFERENCES "parking_spots"("id");--> statement-breakpoint
ALTER TABLE "parking_spots" ADD CONSTRAINT "parking_spots_parking_lot_id_parking_lots_id_fkey" FOREIGN KEY ("parking_lot_id") REFERENCES "parking_lots"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;