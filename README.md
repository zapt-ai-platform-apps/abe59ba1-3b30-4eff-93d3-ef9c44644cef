# UpGrade

UpGrade is an app designed to help students prepare for their school examinations by creating personalized revision timetables presented in a monthly calendar format.

## Features

- **User Authentication**: Secure login using your school email or social providers like Google, Facebook, and Apple.
- **Initial Setup**: Upon first login, set your preferred revision schedule and session duration.
- **Exam Management**: Add, edit, and delete exams, including details like subject, date, examination board, and teacher's name.
- **Personalized Revision Timetable**: Automatically generates a monthly calendar with scheduled revision sessions based on your preferences and upcoming exams.
- **Responsive Design**: Accessible on all devices with a user-friendly interface.

## User Journeys

### 1. Account Creation and Login

1. **Open the App**
   - Navigate to the UpGrade app.
   - See the title "Sign in with ZAPT" above the authentication form.
2. **Learn About ZAPT**
   - Click on the "Learn more about ZAPT" link to visit the ZAPT marketing site in a new tab.
3. **Sign Up or Login**
   - Choose to sign up with your email or use a social provider (Google, Facebook, Apple).
   - If signing up with email:
     - Enter your school email address.
     - Receive a magic link in your email to complete the sign-up process.
   - If logging in:
     - Enter your credentials to access your account.
4. **Authentication Handling**
   - The app automatically updates the UI upon successful login without requiring a page refresh.

### 2. Initial Setup - Setting Revision Preferences

1. **Set Revision Schedule**
   - Upon first login, you're prompted to select your preferred revision times for each day of the week.
   - For each day (Monday to Sunday), choose one of the following:
     - **None**: No revision session.
     - **Morning**: Revision session in the morning.
     - **Afternoon**: Revision session in the afternoon.
     - **Both**: Revision sessions in both morning and afternoon.
2. **Set Session Duration**
   - Select how long each revision session should last.
   - Choose a duration between a minimum of **30 minutes** and a maximum of **2 hours**, in 15-minute increments.
3. **Save Preferences**
   - Click on "Save Preferences" to save your settings.
   - A loading state indicates the saving process.
   - Upon success, you're directed to the home page.

### 3. Adding Exams

1. **Access Exam Management**
   - On the home page, click on "Add New Exam" to open the exam form.
2. **Fill Exam Details**
   - **Subject**: Enter the subject of the exam.
   - **Exam Date**: Select the date of the exam from a date picker.
   - **Examination Board**: Enter the examination board (e.g., AQA, Edexcel).
   - **Teacher's Name**: Enter the name of your teacher for the subject.
3. **Save Exam**
   - Click on "Save Exam" to save the exam details.
   - A loading state indicates the saving process.
   - Upon success, the exam list updates automatically.

### 4. Viewing and Managing Exams

1. **View Exams**
   - See a list of all your exams on the home page.
   - Exams display subject, date, exam board, and teacher's name.
2. **Edit or Delete Exams**
   - (Future Functionality) Options to edit or delete exams will be available.

### 5. Viewing Revision Timetable

1. **Access Timetable**
   - Scroll down to the "Revision Timetable" section.
2. **Understand the Schedule**
   - See a monthly calendar view with each day showing scheduled revision sessions based on your preferences.
   - Exam dates are highlighted with a red border.
   - Each day displays whether a revision session is scheduled (Morning, Afternoon, Both, or None).
3. **Detailed View**
   - Click on a date to view detailed revision tasks (Future Functionality).

### 6. Logging Out

1. **Sign Out**
   - Click on the "Sign Out" button at the top right corner.
   - The app returns to the login page, and the UI updates automatically.

## External APIs and Services

- **Supabase Authentication**: Used for secure user authentication and account management.
- **Neon Postgres Database**: Stores exam information, user data, and preferences.
- **Date-fns**: Handles date formatting and manipulation.

## Environment Variables

The app requires the following environment variables:

- `VITE_PUBLIC_APP_ID`: Your Supabase project URL.
- `VITE_PUBLIC_ANON_KEY`: Your Supabase public anonymous key.
- `NEON_DB_URL`: Connection string for the Neon Postgres database.

Ensure these variables are set in your environment to run the app successfully.

Create a `.env` file in the root directory of your project and add the following:

```
VITE_PUBLIC_APP_ID=your_supabase_project_url
VITE_PUBLIC_ANON_KEY=your_supabase_anon_key
NEON_DB_URL=your_neon_db_url_here
```

**Note:** Remember to set these environment variables when deploying to platforms like Vercel.
