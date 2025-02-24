import { PrismaClient } from "@prisma/client";
import Image from "next/image";

import Paginator from "@components/paginator";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";

const client = new PrismaClient();

const PAGE_SIZE = 10;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { page = "1" } = await searchParams;

  const pokemonCount = await client.species.count();
  const pokemon = await client.species.findMany({
    skip: Math.max(+page - 1, 0) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: {
      forms: {
        include: {
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
