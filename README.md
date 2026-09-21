AURA++ Simplify Events, Amplify Experiences with AURA++
Team Members
| Maliha Pervin | 20230104077 | parvinmaliha26@gmail.com | Frontend| | Ohidur Rahman Rifat | 20230104090 | rifator44@gmail.com | Lead, Backend | | Hisham Mhamhud | 20230104096 | hishammd123545@gmail.com | Backend, Frontend |

Project Overview
AURA++ is a dynamic event management platform that simplifies the process of organizing, booking, and managing events. The platform is designed to streamline attendee registration, event scheduling, and ticket booking, providing a seamless experience for both event organizers and participants.

Key Features
Attendee Registration
Simple sign-up and registration process.
Automated email confirmations upon successful registration.
Schedule Management
Easily create and manage event schedules.
Real-time ticket updates to keep participants informed about event changes.
Admin Panel
Efficient tools for organizing, overseeing, and modifying event details.
Manage attendee data, bookings, and event performance insights.
Target Audience
AURA++ is designed for a wide range of users:

Event Organizers: Simplifying event planning, registration handling, and ticket management.
Businesses & Organizations: Perfect for conferences, workshops, corporate events, and more.
Attendees: Providing an easy-to-use platform for exploring and registering for events.
Event Planners & Agencies: Scalable solutions to manage multiple events simultaneously.
Figma Design
https://www.figma.com/make/H8CHBf3n7KZBXLgskA3p3W/Ticket-Booking-Website?p=f&t=PwngXGLQgkqlc01w-0

Project Milestones
Checkpoint 1
Design landing pages and dashboard UI using Figma.
Implement home page frontend.
Implement events page frontend.
Checkpoint 2
Develop user authentication (registration & login) for both frontend and backend.
Implement the "About Us" page frontend.
Checkpoint 3
Develop backend booking functionality.
Finalize UI/UX design with responsive capabilities.
Integrate frontend with backend.
Deploy the web application.
Usage Instructions
Prerequisites
Before getting started, ensure the following tools are installed:

PHP (for the backend)
Composer (for managing PHP dependencies)
Node.js (for running the React frontend)
XAMPP (for running the MySQL database and backend server)
Installation Steps
Clone the repository.

Install necessary dependencies:

For React Frontend: ```bash npm install npm install axios npm install coreui npm install dayjs npm install moment ```
For Laravel Backend: ```bash composer install composer require fruitcake/laravel-cors ```
Install Laravel Installer globally: ```bash composer global require laravel/installer ```

Configure your .env file for both frontend and backend.

Run the following Laravel commands: ```bash php artisan storage:link php artisan vendor:publish php artisan install:api ```

Start the development servers:

React Frontend: ```bash npm run dev ```
Laravel Backend: ```bash php artisan serve ```
Ensure your XAMPP server is running with the MySQL database configured.

Accessing the Platform
Once both frontend and backend are running, access the platform via the provided local address.

Admin Features:

Create and modify event schedules.
Oversee attendee data and bookings.
User Features:

Register for events.
Book tickets for events. EOF
4. Stage and commit the file
git add README.md git commit -m "Initial commit: AURA++ Project Proposal"

82. Connect and push to GitHub (Replace with your actual repo link)
git branch -M main git remote add origin <YOUR_GITHUB_REPO_URL> git push -u origin main

---

## Behavior Anomaly Detection (ML Component)
AURA++ includes a small-scale, Zero Trust User Behavior Anomaly Detection system. It logs user activities (like logins, event creation, ticket bookings), extracts behavioral features, and uses a scikit-learn Isolation Forest model (served via FastAPI) to detect anomalies in real-time.

### Complete Flow
1. **User action**: A user performs a sensitive action (e.g., login, booking).
2. **Laravel activity log**: The action is logged to the `user_activity_logs` table.
3. **Behavioral features**: The system aggregates the user's history into numeric features (e.g., `login_attempts`, `tickets_booked`).
4. **CSV/training data**: An artisan command exports this data for training.
5. **Isolation Forest**: A Python script trains the anomaly detection model.
6. **Anomaly prediction**: The FastAPI service predicts if the behavior is an anomaly based on the features.
7. **Laravel Zero Trust**: The backend stores the prediction in `behavior_anomaly_results`. If the behavior is flagged as anomalous, Laravel immediately invokes a Zero Trust response: it soft-deletes the user account and revokes all active JSON Web Tokens (JWT), instantly blocking the user.
8. **Admin display**: The React admin dashboard displays the flagged behavior in the "Behavior Anomalies" tab.

### Setup Instructions

#### 1. ML Environment Setup
Navigate to the root directory and set up the Python environment:
```bash
python3 -m venv ml/.venv
source ml/.venv/bin/activate
pip install -r ml/requirements.txt
```

#### 2. Training the Model
You can train the model on AURA++ generated data, or use an external dataset (for testing/learning):

**Export AURA++ behavior data:**
```bash
cd server
php artisan ml:export-behavior
```
*Note: This generates `data/behavior.csv` based on your local database.*

**Train the model:**
```bash
cd ml
# To train on the AURA++ exported data:
python train.py ../data/behavior.csv

# To train on the Kaggle external dataset (User Behaviour Dataset):
python train.py --external
```

#### 3. Starting the ML API
The ML API must be running for AURA++ to evaluate predictions dynamically. To avoid port conflicts with Laravel, the ML API is configured to run on Port 8002.
```bash
cd ml
source .venv/bin/activate
uvicorn app:app --host 127.0.0.1 --port 8002
```

#### 4. Starting AURA++ Services
Open separate terminals for the Frontend, Backend, and ML API.

1. **MySQL / XAMPP**: Ensure your MySQL server is running via XAMPP. If on Kali/Ubuntu, ensure you stop the default system database first (`sudo service mysql stop`) and start XAMPP (`sudo /opt/lampp/lampp startmysql`).
2. **Laravel Backend**: Start this *before* the ML API to ensure it safely grabs Port 8000.
```bash
cd server
php artisan serve
```
3. **React Frontend**:
```bash
cd client
npm run dev
```
4. **ML API**: Start this on Port 8002. (See step 3 above)

#### 5. Testing a Prediction Directly
You can manually test the FastAPI prediction endpoint using `curl`:
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