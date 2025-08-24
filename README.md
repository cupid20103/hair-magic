# 🎨 HairMagic - AI Hairstyle Changer

HairMagic is a cross-platform mobile app built with **Expo** and **NativeWind** that uses **Replicate AI** to generate new hairstyles from a photo and a text prompt.

Upload a selfie, describe the hairstyle you want, and the app returns an AI-generated transformation with a before and after comparison.

---

## 🚀 Features

- Built with **Expo (SDK 52)** and the **new React Native architecture**.
- Styled with **NativeWind** (Tailwind CSS for React Native), including dark mode.
- File-based routing with **Expo Router**, including a server API route.
- **Replicate AI** integration for hairstyle transformations.
- Capture from camera or pick from gallery, then generate and refine the result.
- Popular style presets that pre-fill the prompt with a single tap.

---

## 🧱 Tech Stack

| Area | Choice |
| --- | --- |
| Framework | Expo SDK 52, React Native 0.76 |
| Language | TypeScript (strict) |
| Routing | Expo Router (typed routes, server output) |
| Styling | NativeWind 4, Tailwind CSS |
| Animation | React Native Reanimated |
| AI backend | Replicate Predictions API |
| Package manager | Yarn |

---

## 📂 Project Structure

```
src/
  app/                 Expo Router routes
    _layout.tsx        Root layout (providers, splash, status bar)
    index.tsx          Home route
    +not-found.tsx     Fallback route
    api/hair+api.ts    Server route that calls Replicate
  assets/images/       App icons, splash, and preset images
  components/          Reusable UI (HairStyle, SkeletonImage, UploadModal, Wrapper)
  config/env.ts        Environment variable access
  lib/                 Constants and helpers (cn, toast, isEmpty, image and API utils)
  screens/main/        Screen-level views (AppScreen, NotFoundScreen)
  types/               Shared TypeScript types
```

---

## 📋 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) **v22+**
- [Git](https://git-scm.com/)
- [Yarn](https://yarnpkg.com/) (preferred package manager)
- [Expo Go](https://expo.dev/client) or a development build for testing on a device
- A [Replicate](https://replicate.com/) account and API token

---

## 📦 Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/cupid20103/expo-nativewind-boilerplate.git
cd expo-nativewind-boilerplate
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```bash
APP_ENV=development
REPLICATE_API_TOKEN=your_replicate_api_token
```

| Variable | Description |
| --- | --- |
| `APP_ENV` | `development` or `production`. In development the app calls the local server route; in production it calls the hosted route. |
| `REPLICATE_API_TOKEN` | Replicate API token used by the server route to run predictions. |

### 4. Start the development server

```bash
yarn start
```

### 5. Run the app

- On a physical device: install Expo Go and scan the QR code shown after `yarn start`.
- On a simulator or emulator:
  - iOS (requires Xcode): `yarn ios`
  - Android (requires Android Studio): `yarn android`
- In the browser: `yarn web`

---

## 🔄 How It Works

1. The user uploads a photo (camera or gallery) and enters a prompt describing the desired hairstyle.
2. The photo is converted to a base64 string and sent to the `POST /api/hair` server route.
3. The server route creates a Replicate prediction, polls until it succeeds or fails, and returns the generated image URL.
4. The screen renders the result with a before and after comparison and allows further refinement.

---

## 🧪 Scripts

| Command | Description |
| --- | --- |
| `yarn start` | Start the Expo development server. |
| `yarn android` | Run on an Android emulator or device. |
| `yarn ios` | Run on an iOS simulator or device. |
| `yarn web` | Run in the browser. |
| `yarn lint` | Lint the project with ESLint. |
| `yarn test` | Run tests in watch mode (Jest). |

---

## 🚀 Deployment (EAS Workflows)

Builds and deploys are automated through EAS workflows in `.eas/workflows/`, triggered by branch:

| Branch | Workflow | Output |
| --- | --- | --- |
| `develop` | Development build | iOS simulator and Android development client |
| `staging` | Preview build | iOS and Android internal preview |
| `main` | Production build | iOS and Android production |
| any branch | Hosting deploy | Web and server routes |

The hosted app and server routes are served from `https://hair-magic-mvp.expo.app`.
