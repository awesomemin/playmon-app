# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm install              # Install dependencies
npx expo start           # Start development server (opens options for iOS/Android/Web)
npm run ios              # Start on iOS simulator
npm run android          # Start on Android emulator
npm run web              # Start on web browser
npm run lint             # Run ESLint
npm run reset-project    # Move current app/ to app-example/ and create fresh app/
```

## Architecture Overview

This is an Expo SDK 54 React Native app using file-based routing with expo-router.

### Routing Structure
- `app/` - Main application code using file-based routing
- `app/_layout.tsx` - Root layout (Stack navigator)
- `app/(tabs)/` - Tab-based screens (grouped route)
- Route files export React components; the filename determines the route path

### Reference Code
- `app-example/` - Contains template code from create-expo-app, useful as reference for:
  - Theme system (`constants/theme.ts` - Colors, Fonts)
  - Reusable components (`components/` - ThemedText, ThemedView, ParallaxScrollView)
  - Hooks (`hooks/` - useColorScheme, useThemeColor)

### Path Aliases
- `@/*` maps to project root (e.g., `import { Colors } from '@/constants/theme'`)

### Enabled Features
- React Native New Architecture
- Typed Routes (expo-router)
- React Compiler
- Strict TypeScript mode
