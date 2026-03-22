# 🔍 Lost & Found Management System

A full-stack, premium Lost & Found web application designed for campus communities. It allows users to report lost or found items, manage claims, and receive real-time updates—all with a stunning, modern user interface.

---

## 🔥 Key Features

- **🔐 Secure Authentication**: Integrated with Firebase Auth (Email/Password & Google Sign-In).
- **🎨 Premium UI/UX**: Redesigned from the ground up with **Tailwind CSS 4.0**, featuring glassmorphism, modern typography (Outfit & Inter), and full responsiveness.
- **⚡ Real-time Updates**: Instant listing of items and notifications using Firestore's live synchronization.
- **📦 Comprehensive Reporting**: 
  - Detailed reporting for both Lost and Found items.
  - Image upload support (via Cloudinary/Firebase).
- **📋 Claim Management System**:
  - Found items can be claimed by owners.
  - Finders can review, approve, or reject incoming claims.
  - Real-time status tracking for all claim activities.
- **🔔 Notification Feed**: Stay informed about claim requests and status changes.

---

## 🛠 Tech Stack

### Frontend
- **React 19+** (Vite Hub)
- **Tailwind CSS 4.0** (Newest Engine)
- **Lucide React** (Consistent Iconography)
- **React Router 7+** (Advanced Navigation)
- **React Hot Toast** (Polished Feedback)

### Backend / Infrastructure
- **Firebase Authentication**
- **Cloud Firestore** (Real-time NoSQL Database)
- **Firebase Hosting** (Optionally configured)
- **Docker-ready** (Standardized Development)

---

## 🐳 Docker Setup

The project is fully containerized for a smooth development experience across different team environments.

1.  **Ensure you have Docker & Docker Compose installed.**
2.  **Create your `.env` file** (see `.env.example`).
3.  **Spin up the development environment:**
    ```bash
    docker compose up --build
    ```
4.  **Access the application:**
    Open [http://localhost:5173](http://localhost:5173) in your browser.

> [!TIP]
> Changes made to the code locally will automatically reflect inside the Docker container thanks to volume mapping.

---

## 📦 Local Installation (Non-Docker)

1. **Clone & Install:**
   ```bash
   git clone <repository-url>
   cd lost-found-frontend
   npm install
   ```
2. **Setup Environment Variables:**
   Copy `.env.example` to `.env` and fill in your Firebase credentials.
3. **Run Dev Server:**
   ```bash
   npm run dev
   ```

---

## 👥 Contributors

- **Tanmay** – Backend & Firebase Logic
- **Anmol** – Frontend UI & User Experience
- **Antigravity AI** – Tailwind 4.0 Redesign & Modern Architecture

---

## 📄 License & Standards

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). Please respect our [Architecture Guidelines](ARCHITECTURE.md) during development.
