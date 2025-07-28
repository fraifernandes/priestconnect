# PriestConnect - MVP Web Application

<p align="center">
  <img src="https://placehold.co/600x300/6366f1/ffffff?text=PriestConnect&font=inter" alt="PriestConnect Banner">
</p>

A simple, mobile-responsive web application built to connect priests with religious institutions for booking services. This MVP (Minimum Viable Product) demonstrates a full-stack serverless architecture using HTML/CSS/JS on the frontend and Firebase for backend services.

**Live Demo:** `[Link to your deployed Replit, Glitch, or other hosting service]`

---

### About The Project

PriestConnect is a platform designed to solve the logistical challenge of scheduling priests for Masses, confessions, blessings, and other religious services. It provides two distinct user experiences: one for priests to manage their schedules and another for institutions to find and book them.

**Core Features:**

* **Dual User Roles:** Separate registration and dashboards for Priests and Institutions.
* **Priest Dashboard:**
    * Manage availability using an interactive calendar.
    * List services offered.
    * View and respond to booking requests (Accept/Reject).
* **Institution Dashboard:**
    * Search for available priests by date, service, and location.
    * Send booking requests to priests.
* **Firebase Integration:**
    * **Authentication:** Secure user login and registration.
    * **Firestore:** NoSQL database for storing all application data.
* **Google Calendar Sync:** Priests can authorize the app to automatically add accepted bookings to their primary Google Calendar.
* **Stripe Donations:** A simple, test-mode donation form.

### Built With

* **Frontend**:
    * HTML5
    * [Tailwind CSS](https://tailwindcss.com/)
    * Vanilla JavaScript (ES Modules)
* **Backend & Database**:
    * [Firebase Authentication](https://firebase.google.com/docs/auth)
    * [Firebase Firestore](https://firebase.google.com/docs/firestore)
* **Third-Party APIs**:
    * [Google Calendar API](https://developers.google.com/calendar/api)
    * [Stripe.js](https://stripe.com/docs/js)

### Getting Started

To get a local copy up and running, follow these simple steps.

#### Prerequisites

You will need to create accounts and get API keys from the following services:
* Firebase
* Google Cloud Platform
* Stripe

#### Installation & Setup

1.  **Clone the repo:**
    ```sh
    git clone [https://github.com/your-username/PriestConnect.git](https://github.com/your-username/PriestConnect.git)
    ```

2.  **Firebase Setup:**
    * Create a new project in the [Firebase Console](https://console.firebase.google.com/).
    * In your project, go to **Project Settings** > **General**.
    * Under "Your apps", click the web icon (`</>`) to register a new web app.
    * Give it a name and copy the `firebaseConfig` object provided.
    * Enable **Email/Password** as a sign-in method in the **Authentication** tab.
    * Create a **Firestore Database** in **Test Mode** (for development).

3.  **Google Cloud Platform Setup:**
    * Create a new project in the [Google Cloud Console](https://console.cloud.google.com/).
    * In the project dashboard, go to **APIs & Services** > **Library**.
    * Search for and enable the **Google Calendar API**.
    * Go to **APIs & Services** > **Credentials**.
    * Click **+ CREATE CREDENTIALS** and choose **API key**. Copy this key.
    * Click **+ CREATE CREDENTIALS** again and choose **OAuth client ID**.
        * Configure the consent screen first if prompted. Select "External" and provide an app name and user/developer contact emails.
        * For the application type, choose **Web application**.
        * Under **Authorized JavaScript origins**, add your local development URL (e.g., `http://localhost:5500`) and your deployed app's URL.
    * Create the client ID and copy it.

4.  **Stripe Setup:**
    * Sign up for a [Stripe](https://stripe.com/) account.
    * In your dashboard (ensure you are in **Test mode**), navigate to **Developers > API keys**.
    * Copy the **Publishable key** (it starts with `pk_test_...`).

5.  **Configure API Keys:**
    * Open the `app.js` file.
    * Replace the placeholder values for `firebaseConfig`, `GOOGLE_API_KEY`, `GOOGLE_CLIENT_ID`, and `STRIPE_PUBLISHABLE_KEY` with the keys you obtained in the steps above.

6.  **Run the Application:**
    * Since this project uses ES Modules, you need to serve the files from a local server.
    * You can use the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code. Simply right-click `index.html` and select "Open with Live Server".

### Firestore Data Structure

The database is structured into three main collections:

* **`users`**: Stores user profile information.
    * *Document ID*: `user.uid` from Firebase Auth.
    * *Fields*: `name`, `email`, `userType` ('priest' or 'institution'), `services` (array, for priests), `location` (string, for priests).

* **`availability`**: Stores a priest's available dates.
    * *Document ID*: `priest.uid`.
    * *Fields*: `availableDates` (array of date strings in 'YYYY-MM-DD' format).

* **`bookings`**: Stores records of all booking requests.
    * *Document ID*: Auto-generated by Firestore.
    * *Fields*: `priestId`, `institutionId`, `date`, `service`, `status` ('pending', 'accepted', 'rejected'), `createdAt` (timestamp).

### Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

### License

Distributed under the MIT License. See `LICENSE` for more information.

---
<p align="center">
  Made with ❤️ in Mangaluru, India
</p>

