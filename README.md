# AURA++ 🚀
> **Simplify Events, Amplify Experiences**

AURA++ is a state-of-the-art, dynamic event management and ticket booking platform. Designed to streamline attendee registration, event scheduling, and real-time ticketing, AURA++ pairs a sleek, modern UI/UX with a robust backend architecture and integrated Machine Learning for real-time Zero-Trust Behavior Anomaly Detection.

---

## 👥 Team Members

| Name | Student ID | Email | Project Role |
| :--- | :---: | :--- | :--- |
| **Maliha Pervin** | 20230104077 | `parvinmaliha26@gmail.com` | **Frontend Lead** |
| **Ohidur Rahman Rifat** | 20230104090 | `rifator44@gmail.com` | **Project Lead & Backend** |
| **Hisham Mhamhud** | 20230104096 | `hishammd123545@gmail.com` | **Full Stack Developer** |

---

## ✨ Key Features

### 🎨 Frontend & UI/UX (Led by Maliha Pervin)
- **Modern Responsive Design**: Dynamic layouts crafted with high-fidelity glassmorphism elements, custom micro-animations, and fluid transitions.
- **Event Discovery & Filtering**: Search and filter upcoming events by category, date, and availability.
- **Seamless Ticket Booking**: Interactive modal workflows with instant seat reservation and bKash payment verification integration.
- **Interactive Navbar & Notifications**: Real-time notification bell displaying unread updates, subscription alerts, and status changes.
- **Admin Dashboard**: Comprehensive admin control panel for event creation, attendee management, and security oversight.

### ⚙️ Backend & API Architecture
- **Laravel 10 REST API**: Clean controller-driven API managing users, events, subscriptions, and ticket bookings.
- **Authentication & Security**: Secure JWT authentication, password hashing, and role-based access control (RBAC).
- **Automated Email System**: Instant email receipts and verification alerts (`UserBookingResult`, `AdminBookingVerify`).

### 🛡️ Machine Learning & Zero-Trust Anomaly Detection
- **Isolation Forest Model**: Real-time behavioral feature evaluation using Scikit-Learn.
- **FastAPI Microservice**: High-performance Python API running on Port 8002 for live prediction.
- **Automated Threat Response**: Flags anomalous activity (e.g., suspicious booking/login rates) and triggers instant session revocation and soft-deletion in Laravel.

---

## 🛠️ Technology Stack

| Domain | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, CoreUI, DayJS, Axios |
| **Backend** | PHP 8.1+, Laravel 10, MySQL (XAMPP) |
| **Machine Learning** | Python 3.10, FastAPI, Scikit-Learn, Pandas, Uvicorn |
| **Design & Prototyping** | Figma, Vanilla CSS, Custom Micro-animations |

---

## 🎯 Target Audience

- **Event Organizers**: Effortless event creation, schedule management, and attendee tracking.
- **Attendees & Participants**: Intuitive platform to discover, book, and verify tickets.
- **Businesses & Agencies**: Scalable multi-event management solution for conferences, workshops, and corporate events.

---

## 🔗 Design Assets

🎨 **[Figma Interactive Prototype](https://www.figma.com/make/H8CHBf3n7KZBXLgskA3p3W/Ticket-Booking-Website?p=f&t=PwngXGLQgkqlc01w-0)**

---

## 📌 Project Milestones

- [x] **Checkpoint 1**: Figma wireframing, frontend landing pages, events overview UI, and design system setup.
- [x] **Checkpoint 2**: Frontend & backend user authentication (JWT), About Us page, and API integration.
- [x] **Checkpoint 3**: Backend booking engine, bKash transaction confirmation flow, responsive polish, and ML Zero-Trust anomaly engine integration.

---

## 🚀 Installation & Setup Guide

### 1. Prerequisites
Ensure you have the following installed on your environment:
- **Node.js** (v18+) & **npm**
- **PHP** (v8.1+) & **Composer**
- **XAMPP** (MySQL Database Server)
- **Python** (v3.10+)

---

### 2. Frontend Setup (React + Vite)

```bash
cd client
npm install
npm run dev
```
*Frontend local address: `http://localhost:5173`*

---

### 3. Backend Setup (Laravel REST API)

```bash
cd server
composer install
cp .env.example .env
php artisan key:generate
php artisan storage:link
php artisan migrate --seed
php artisan serve
```
*Backend local address: `http://127.0.0.1:8000`*

---

### 4. Machine Learning API Setup (Behavior Anomaly Service)

```bash
# Set up Python virtual environment
python3 -m venv ml/.venv
source ml/.venv/bin/activate    # On Windows: ml\.venv\Scripts\activate
pip install -r ml/requirements.txt

# Export behavior data & train model
cd server
php artisan ml:export-behavior
cd ../ml
python train.py ../data/behavior.csv

# Launch FastAPI Microservice on Port 8002
uvicorn app:app --host 127.0.0.1 --port 8002
```

---

## 🧪 Testing ML Anomaly Prediction

Test the prediction endpoint directly via `curl`:

```bash
curl -X POST http://127.0.0.1:8002/predict \
-H "Content-Type: application/json" \
-d '{
  "login_attempts": 3,
  "failed_logins": 1,
  "session_duration": 500,
  "pages_accessed": 8,
  "tickets_viewed": 3,
  "tickets_booked": 1,
  "events_viewed": 5,
  "events_created": 0,
  "total_actions": 18,
  "requests_per_minute": 0.8
}'
```

---

## 📝 License & Group Project Guidelines

This repository is maintained by the **AURA++ Group Team**. All pushes to remote branches (including **`Noon`**) follow strict version control guidelines without force pushing (`--force` prohibited) to preserve team contributions and commit history.