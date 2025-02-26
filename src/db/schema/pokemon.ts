import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
} from "drizzle-orm/pg-core";

export const speciesTable = pgTable("pkmn_species", {
  id: serial().primaryKey(),
  nationalDexNumber: integer("national_dex_number").notNull().unique(),
  name: text().notNull().unique(),
});

export const speciesRelations = relations(speciesTable, ({ many }) => ({
  forms: many(formsTable),
}));

export const formsTable = pgTable("pkmn_forms", {
  id: serial().primaryKey(),
  speciesId: integer("species_id").notNull(),
  formName: text("form_name").notNull().unique(),
  movePool: jsonb("move_pool").notNull(),
});

export const formRelations = relations(formsTable, ({ one, many }) => ({
  species: one(speciesTable, {
    fields: [formsTable.speciesId],
    references: [speciesTable.id],
  }),
  evolvesInto: many(evolutionsTable),
  modes: many(modesTable),
}));

export const evolutionsTable = pgTable(
  "pkmn_evolutions",
  {
    evolvesFrom: text("evolves_from")
      .notNull()
      .references(() => formsTable.formName),
    evolvesTo: text("evolves_to")
      .notNull()
      .references(() => formsTable.formName),
  },
  (t) => [primaryKey({ columns: [t.evolvesFrom, t.evolvesTo] })],
);

export const evolutionRelations = relations(evolutionsTable, ({ one }) => ({
  evolvesFrom: one(formsTable, {
    fields: [evolutionsTable.evolvesFrom],
    references: [formsTable.formName],
  }),
  evolvesTo: one(formsTable, {
    fields: [evolutionsTable.evolvesTo],
    references: [formsTable.formName],
  }),
}));

export const modesTable = pgTable("pkmn_modes", {
  id: serial().primaryKey(),
  formId: integer("form_id").notNull(),
  modeName: text("mode_name").notNull().unique(),
  sprite: text("sprite").notNull(),
  isDefault: boolean("is_default").notNull(),
  primaryType: text("primary_type").notNull(),
  secondaryType: text("secondary_type"),
  baseStats: jsonb("base_stats").notNull(),
  abilities: jsonb("abilities").notNull(),
});

export const modeRelations = relations(modesTable, ({ one }) => ({
  form: one(formsTable, {
    fields: [modesTable.formId],
    references: [formsTable.id],
  }),
}));
