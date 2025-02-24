import { seedDatabase } from "@lib/pokemon/database";

seedDatabase()
  .then(() => console.log("Database seeded!"))
  .catch(console.error);
