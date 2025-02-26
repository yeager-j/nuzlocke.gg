# Nuzlocke.gg (WIP)

A web-based tool for tracking Pokémon Nuzlocke and Soul Link challenge runs.

## Overview

Nuzlocke.gg helps Pokémon players manage their Nuzlocke challenge runs, with special focus on making Soul Link co-op runs easier to coordinate. The application allows multiple players to track their encounters in real-time, enforce challenge rules, and collaborate seamlessly.

## Upcoming Features

- **Solo Nuzlocke Tracking**: Track encounters, team status, and Nuzlocke rules for single-player runs
- **Soul Link Co-op Support**: Coordinate with teammates in real-time for Soul Link challenges
- **Route & Encounter Management**: Log caught Pokémon by route with automatic rule enforcement
- **Party Status Tracking**: Mark Pokémon as alive, dead, or boxed with real-time updates
- **Rule Enforcement**: Automatic validation of Soul Link rules and other challenge constraints
- **Randomizer Support**: Compatible with randomized game runs
- **Damage Calculator**: Built-in tools to estimate damage against key battles

## Tech Stack

- **Frontend**: TypeScript, Next.js (React)
- **Backend**: Next.js
- **Database**: NeonDB PostgreSQL
- **Hosting**: Vercel

## Project Structure

```
nuzlocke.gg/
└── src/                            # Source code directory
    ├── app/                        # Next.js application routes and pages
    ├── components/                 # React components
    │   └── ui/                     # shadcn/ui components
    ├── data/                       # Preprocessed and static data
    │   ├── pokemon/                # Generated Pokemon data (JSON)
    │   │   └── manifest.ts         # TypeScript type definitions
    │   └── games/                  # Game-specific data
    │       ├── common.ts           # Shared game data definitions
    │       └── generation-x/       # Game data for X generation
    │           ├── locations.ts    # Route and encounter data
    │           └── pokedex.ts      # Available Pokémon
    ├── db/                         # Database configuration and schemas
    │   └── schema/                 # Database table definitions
    │       ├── index.ts
    │       └── pokemon.ts          # Pokemon-related tables
    ├── hooks/                      # React hooks
    └── lib/                        # Core library functionality
        └── pokemon/                # Pokemon data handling
            ├── types.ts            # Type definitions
            ├── utils.ts            # Utility functions
            ├── conversion.ts       # Data transformation
            ├── download.ts         # API download scripts
            ├── database.ts         # Database operations
            ├── games.ts            # Game definitions
            └── tests/              # Unit tests
```

## Data Model

The application manages several key data types:

- **Pokémon Species**: Base information about a Pokémon species
- **Pokémon Forms**: Variants like regional forms (e.g., Alolan, Galarian)
- **Pokémon Modes**: In-battle transformations (e.g., Mega Evolution, Dynamax)
- **Games**: Pokémon game titles and their associated data
- **Routes**: Locations within games where Pokémon can be encountered
- **Encounters**: Specific Pokémon available on each route

## Development

### Prerequisites

- Node.js 18+
- pnpm
- NeonDB account (for database)

### Setup

1. Clone the repository
   ```
   git clone https://github.com/yeager-j/nuzlocke.gg.git
   cd nuzlocke.gg
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Configure environment variables
   ```
   DATABASE_URL=""
   ```
   You'll need to configure your NeonDB connection here. Make sure to use the `-pooler` connection string. Since NeonDB supports branches, use a separate `dev` branch for local development.
4. Set up your development database
   
   First run the database migrations
   ```
   npm run db:migrate
   ```
   Then seed the database using the JSON files in `src/data/pokemon`
   ```
   npm run db:seed
   ```
5. Run the development server
   ```
   npm run dev
   ```

### Downloading Pokémon Data

The application uses preprocessed Pokémon data to minimize API calls. To update the data:

```
npm run download-data
```

This fetches data from PokéAPI, transforms it into our optimized format, and generates TypeScript type definitions.

## Database Schema

The database uses the following key tables:

- `pkmn_species`: Base Pokémon species information
- `pkmn_forms`: Variants of each species
- `pkmn_modes`: In-battle transformations
- `pkmn_evolutions`: Evolution relationships

## Contributing

Contributions are welcome! Please check the issues page for current tasks or create a new issue before submitting a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Data provided by [PokéAPI](https://pokeapi.co/)
- Inspired by the Pokémon community and Nuzlocke challenge creators, especially **pchal**.