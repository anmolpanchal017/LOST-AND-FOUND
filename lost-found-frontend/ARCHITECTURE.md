# Project Architecture

This document describes the architectural overview and high-level structure of the **Lost & Found** platform.

## 🚀 Tech Stack Highlights

- **Frontend**: [React 19+](https://react.dev/) — Interactive UI library.
- **Build Tool**: [Vite 6+](https://vite.dev/) — Lightning-fast development and build process.
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) — Modern, utility-first CSS framework.
- **Backend as a Service (BaaS)**: [Firebase](https://firebase.google.com/) — Handling authentication, real-time database (Firestore), and asset storage.
- **State Management**: [React Context API](https://react.dev/reference/react/useContext) — Simple and effective global state for user authentication.

---

## 📂 Directory Structure

The project follows a standard React feature-based structure for better maintainability:

```text
src/
├── app/          # Core app component, global routing, and main entry points
├── components/   # Reusable UI components (buttons, navbars, cards, etc.)
│   └── common/   # Global components used across different features
├── context/      # React Context providers (e.g., AuthContext)
├── firebase/     # Firebase configuration and initialization
├── pages/        # Main application views/screens
│   ├── auth/     # Login, Signup, and Authentication pages
│   ├── dashboard/# User's main activity hub
│   ├── items/    # Item display and detail logic
│   ├── lost/     # Lost item reporting and management
│   └── found/    # Found item reporting and management
└── utils/        # Generic helper functions and global utilities
```

## 🔐 Core Workflows

1. **Authentication**: Handled by Firebase Auth (Email/Password & Google).
2. **Real-time Data**: Using Firestore's `onSnapshot` for live updates on item lists and notifications.
3. **Asset Handling**: Images are uploaded to Firebase or Cloudinary and referenced in Firestore documents.
4. **Claim Logic**: Users can trigger a "claim" transition on found items, creating a link between the finder and the potential owner.

---

## 🛠 Engineering Standards

- **Consistency**: Use `.editorconfig` for cross-environment spacing (2 spaces).
- **Styling**: All new UI should strictly follow the **Tailwind CSS 4.0** theme defined in `src/index.css`.
- **Testing**: Unit tests are managed with **Jest**, focusing on pure logic and core component rendering.
