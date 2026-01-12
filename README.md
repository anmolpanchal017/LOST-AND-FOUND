# 🔍 Lost & Found Management System

A full-stack Lost & Found web application that helps users report lost or found items, claim ownership, and receive real-time notifications — built using modern Google technologies.
<img width="1920" height="1200" alt="Screenshot 2026-01-12 154827" src="https://github.com/user-attachments/assets/681d7713-0592-4948-9f0e-0c434dc9e0f5" />

---

## 🚀 Features

### 🔐 Authentication
- Login / Signup with Email & Password
- Google Authentication (Firebase Auth)

- <img width="1920" height="1200" alt="Screenshot 2026-01-12 154751" src="https://github.com/user-attachments/assets/e8110478-8a5d-40bf-ad98-00da526f8ec5" />


### 📦 Lost & Found Items
- Report Lost Items
- Report Found Items with image upload
- Cloudinary used for image storage
- Real-time item listing (Firestore onSnapshot)
<img width="1920" height="1200" alt="Screenshot 2026-01-12 155001" src="https://github.com/user-attachments/assets/96f3e945-b4bc-44a0-b5fa-fa37aea0bac8" />
<img width="1920" height="1200" alt="Screenshot 2026-01-12 155014" src="https://github.com/user-attachments/assets/66e74718-1e57-4e4e-a23b-7163b8ec5a3f" />

### 🧾 Claim System
- Users can claim found items
- Claim status: **Pending / Approved / Rejected**
- Finder can manage incoming claims
- <img width="1920" height="1200" alt="Screenshot 2026-01-12 155032" src="https://github.com/user-attachments/assets/e6df76a3-377e-4b2d-a7f8-a684c027e93e" />


### 🔔 Notifications
- Real-time notifications using Firestore
- Unread notification badge in Navbar
- Mark notifications as read
<img width="1920" height="1200" alt="Screenshot 2026-01-12 155119" src="https://github.com/user-attachments/assets/373032b0-de3c-417b-bfb9-67cad5d454cc" />


### 🎨 UI & UX
- Fully custom UI (no Tailwind)
- Responsive dashboard layout
- Modern Navbar & Footer
- Toast notifications instead of alerts

---

## 🛠 Tech Stack

### Frontend
- React.js (Vite)
- Custom CSS
- React Router

### Backend / Services
- **Firebase Authentication**
- **Cloud Firestore (Database)**
- **Firebase Security Rules**
- **Cloudinary (Image Uploads)**

### Other Tools
- react-hot-toast (notifications)
- Git & GitHub (team collaboration)

---

## 📂 Project Structure
src/
│── components/
│ ├── common/
│ │ ├── Navbar.jsx
│ │ ├── Footer.jsx
│
│── pages/
│ ├── auth/
│ ├── dashboard/
│ ├── lost/
│ ├── found/
│ ├── claims/
│ ├── notifications/
│
│── firebase/
│ └── firebaseConfig.js
│
│── context/
│ └── AuthContext.jsx
│
│── utils/
│ └── notify.js


👥 Team Members

Tanmay – Backend & Firebase Logic

Anmol – Frontend UI & User Experience


🎯 Future Enhancements

Admin dashboard

AI-based item matching

Email notifications

Campus-specific access control
