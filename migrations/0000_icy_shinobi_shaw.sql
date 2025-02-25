CREATE TABLE "pkmn_evolutions" (
	"evolves_from" text NOT NULL,
	"evolves_to" text NOT NULL,
	CONSTRAINT "pkmn_evolutions_evolves_from_evolves_to_pk" PRIMARY KEY("evolves_from","evolves_to")
);
--> statement-breakpoint
CREATE TABLE "pkmn_forms" (
	"id" serial PRIMARY KEY NOT NULL,
	"species_id" integer NOT NULL,
	"form_name" text NOT NULL,
	"move_pool" jsonb NOT NULL,
	CONSTRAINT "pkmn_forms_form_name_unique" UNIQUE("form_name")
);
--> statement-breakpoint
CREATE TABLE "pkmn_modes" (
	"id" serial PRIMARY KEY NOT NULL,
	"form_id" integer NOT NULL,
	"mode_name" text NOT NULL,
	"sprite" text NOT NULL,
	"is_default" boolean NOT NULL,
	"primary_type" text NOT NULL,
	"secondary_type" text,
	"base_stats" jsonb NOT NULL,
	"abilities" jsonb NOT NULL,
	CONSTRAINT "pkmn_modes_mode_name_unique" UNIQUE("mode_name")
);
--> statement-breakpoint
CREATE TABLE "pkmn_species" (
	"id" serial PRIMARY KEY NOT NULL,
	"national_dex_number" integer NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "pkmn_species_national_dex_number_unique" UNIQUE("national_dex_number"),
	CONSTRAINT "pkmn_species_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "pkmn_evolutions" ADD CONSTRAINT "pkmn_evolutions_evolves_from_pkmn_forms_form_name_fk" FOREIGN KEY ("evolves_from") REFERENCES "public"."pkmn_forms"("form_name") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pkmn_evolutions" ADD CONSTRAINT "pkmn_evolutions_evolves_to_pkmn_forms_form_name_fk" FOREIGN KEY ("evolves_to") REFERENCES "public"."pkmn_forms"("form_name") ON DELETE no action ON UPDATE no action;