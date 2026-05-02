# Media Tracker Frontend

Frontend application for Media Tracker. Built with Vue 3, Vite, PrimeVue, and Tailwind CSS.

## Features

- **Modern UI**: Styled with Tailwind CSS and PrimeVue components (Aura Theme) for a premium, dynamic look.
- **State Management**: Uses Pinia for global state management and session handling.
- **Authentication**: JWT token management, Axios interceptors, and protected routing.
- **Media Search**: Integrated views to search and add music (Spotify) and movies (TMDb) to the global catalog directly from the UI.
- **Interactive Notifications**: Uses `vue-sonner` for elegant toast notifications.

## Tech Stack

- Vue 3 (Composition API)
- Vite
- PrimeVue v4
- Tailwind CSS
- Pinia
- Vue Router
- Axios
- Vue Sonner

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Make sure the backend API URL is correctly configured (default is `http://127.0.0.1:8000/api/v1` in `src/services/api.js`).

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   ```bash
   npm run build
   ```
