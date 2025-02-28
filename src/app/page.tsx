import Image from "next/image";

import Paginator from "@/components/paginator";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/db";
import { speciesTable } from "@/db/schema";

const PAGE_SIZE = 10;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { page = "1" } = await searchParams;

  const pokemonCount = await db.$count(speciesTable);
  const pokemon = await db.query.speciesTable.findMany({
    offset: Math.max(+page - 1, 0) * PAGE_SIZE,
    limit: PAGE_SIZE,
    with: {
      forms: {
        with: {
          modes: true,
        },
      },
    },
  });

  return (
    <div className="w-full">
      <h1 className="text-5xl sm:text-7xl font-bold text-center mb-5 sm:mb-10">
        Nuzlocke.gg
      </h1>

      <div className="flex flex-col gap-4">
        {pokemon.map((p) => (
          <Card key={p.id}>
            <div className="flex items-center">
              <div className="p-2">
                <Image
                  src={p.forms[0].modes[0].sprite}
                  alt={p.name}
                  width={64}
                  height={64}
                />
              </div>

              <CardHeader className="pl-0">
                <CardTitle>{p.name}</CardTitle>
                <CardDescription>
                  National Pokedex #{p.nationalDexNumber}
                </CardDescription>
              </CardHeader>
            </div>
          </Card>
        ))}

        <Paginator
          currentPage={+page}
          totalPages={Math.ceil(pokemonCount / PAGE_SIZE)}
        />
      </div>
    </div>
  );
}
