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
```

## Project Overview

PlayMon is a League of Legends match notification app for the Korean (KR) region. Users can search for players by Riot ID, view profiles, and subscribe to receive push notifications when subscribed players start matches.

## Architecture Overview

Expo SDK 54 React Native app using file-based routing with expo-router.

### App Structure
```
app/
├── _layout.tsx              # Root layout with providers (Auth, Subscriptions, Notifications)
├── (onboarding)/            # First-time user tutorial flow
│   └── tutorial.tsx         # 4-slide Korean tutorial
├── (tabs)/                  # Main tab navigation
│   ├── index.tsx            # Player search screen
│   ├── subscriptions.tsx    # Subscribed players list
│   └── settings.tsx         # Settings & account
├── player/[riotId].tsx      # Player profile (dynamic route)
└── auth/login.tsx           # Google OAuth modal
```

### Key Directories
- `components/` - Reusable UI components (ThemedText, ThemedView, Button, Card, Avatar, Badge)
- `contexts/` - React Context providers (AuthContext, SubscriptionsContext, NotificationsContext)
- `services/api/` - API client and endpoint functions (players, subscriptions, auth)
- `hooks/` - Custom hooks (useColorScheme, useThemeColor)
- `constants/` - Theme colors, API config, Korean i18n strings (`i18n.ts`)
- `types/` - TypeScript interfaces (Player, Subscription, Auth)
- `utils/` - Utility functions (riot-id parsing, rank formatting)

### State Management
Uses React Context for global state:
- `AuthContext` - User authentication, Google OAuth, token management
- `SubscriptionsContext` - Player subscriptions CRUD
- `NotificationsContext` - Push notification registration and handling

### Backend API Contract
The app expects a backend with these endpoints:
```
GET  /api/players/search?gameName=&tagLine=  → Player
GET  /api/players/:puuid/profile             → PlayerProfile
GET  /api/subscriptions                      → Subscription[] (auth required)
POST /api/subscriptions                      → Subscription
DELETE /api/subscriptions/:id                → void
POST /api/auth/google                        → AuthResponse
POST /api/auth/push-token                    → void
```

### Path Aliases
- `@/*` maps to project root (e.g., `import { KR } from '@/constants/i18n'`)

### Key Dependencies
- `expo-notifications` - Push notification handling
- `@react-native-google-signin/google-signin` - Google OAuth (requires dev build)
- `@react-native-async-storage/async-storage` - Local storage
- `expo-router` - File-based navigation

### Environment Variables
```
EXPO_PUBLIC_API_BASE_URL - Backend API URL
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID - Google OAuth web client ID
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID - Google OAuth iOS client ID
```
