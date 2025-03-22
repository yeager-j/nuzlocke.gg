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
- **APIs**: PokeAPI
- **Hosting**: Vercel

## Project Structure

```
├── __mocks__/                # Mock implementations for testing
│   └── fs/                   # Filesystem mocks
├── __tests__/                # Test files
│   ├── __fixtures__/         # Test fixtures for PokeAPI
│   ├── integration/          # Integration tests
│   │   └── pokeapi/          # Tests for PokeAPI integration
│   └── unit/                 # Unit tests
├── public/                   # Static assets
│   └── games/                # Generated game data
├── scripts/                  # Utility scripts
├── src/                      # Source code
│   ├── app/                  # Next.js app directory
│   ├── components/           # React components
│   │   └── ui/               # UI components
│   └── lib/                  # Core libraries
│       └── pokeapi/          # PokeAPI integration
│           └── games/        # Game-specific configurations
```
## Data Model

This application manages two main data types:

- **Encounters**: This is a list of per-game encounters, account for version-exclusives. I use this to display the nuzlocke tracker layout
- **Pokemon**: This is a simplified representation of a Pokemon. I only need its name, sprite, and types.

## Development

### Prerequisites

- Node.js 18+
- pnpm

### Setup

1. Clone the repository
   ```
   git clone https://github.com/yeager-j/nuzlocke.gg.git
   cd nuzlocke.gg
   ```

2. Install dependencies
   ```
   pnpm install
   ```
3. Run the development server
   ```
   pnpm run dev
   ```

### Downloading Pokémon Data

The application uses preprocessed Pokémon data to minimize API calls. To update the data:

```
pnpm run generate-json
```

This fetches data from PokéAPI and transforms it into an optimized format.

## Contributing

> *Perfection is lots of little things done well*
> 
> — Marco Pierre White

Contributions are welcome! Please check the issues page for current tasks or create a new issue before submitting a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Style Guide

1. Give functions clear names and purposes. Each function should have one job and do it well. Avoid side effects where possible.
2. Avoid inline comments. If your code needs a comment to be understood, try refactoring it by extracting variables or creating functions. However, always write JSDocs.
3. When writing TypeScript types, be as strict as is practical. Additionally, if you write a type that inherits another type, consider if you could use composition instead. Be careful about coupling.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Data provided by [PokéAPI](https://pokeapi.co/)
- Inspired by the Pokémon community and Nuzlocke challenge creators, especially **pchal**.