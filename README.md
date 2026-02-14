# CubeRubik

Educational 3D Rubik's Cube simulator with step-by-step tutorials.

## Features

- Interactive 3D visualization
- Step-by-step beginner tutorials
- Keyboard and mouse controls
- Move history and notation display
- Scramble and reset functionality

## Tech Stack

- **TypeScript** - Type-safe development
- **Three.js** - 3D rendering
- **Vite** - Fast build tool
- **Vitest** - Unit testing

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Controls

- **Mouse**: Rotate camera (drag)
- **Keyboard**: Execute moves (R, U, F, D, L, B)
- **Shift + Key**: Inverse move (e.g., Shift+R = R')

## Project Structure

```
src/
├── domain/         # Pure logic (no Three.js)
├── presentation/   # Three.js visualization
├── application/    # Coordination layer
└── ui/            # DOM manipulation
```

## License

MIT

## Author

Spiros Nikoloudakis
