# UpGrade

UpGrade is an app designed to help students prepare for their school examinations by creating personalized revision timetables presented in a monthly calendar format. The app schedules revision sessions for each of the student's subjects equally based on available session slots and preferences, ensuring efficient use of study time leading up to exams.

## Features

- **User Authentication**: Secure login using your school email or social providers like Google, Facebook, and Apple.
- **Initial Setup**: Upon first login, set your preferred revision schedule and session duration.
- **Exam Management**: Add, edit, and delete exams, including details like subject, date, examination board, and teacher's name.
- **Personalized Revision Timetable**: Automatically generates a monthly calendar with scheduled revision sessions. The app distributes available revision sessions equally among all subjects, considering the period from the current date up to each exam.
  - **Concurrent Scheduling**: The app schedules regular revision sessions for all upcoming exams, ensuring continuous preparation across all subjects.
  - **Catch-Up Sessions**: In the week before each exam, the app marks revision sessions for that specific subject as "catch-up" sessions to help reinforce learning before the test.
- **Exclusion of Exam Dates**: Revision sessions are **not scheduled on the dates of exams**, allowing students to focus on their tests without additional study sessions.
- **Responsive Design**: Accessible on all devices with a user-friendly interface.
- **Exclusion of Past Exams**: The timetable only displays upcoming exams and associated revision sessions. Exams that have already occurred are not shown.
- **Accurate Session Scheduling**: Ensures that revision sessions are scheduled without duplication, providing a clear and organized timetable.

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
   - See a list of all your upcoming exams on the home page.
   - Exams display subject, date, exam board, and teacher's name.
   - **Note**: Exams that have already passed are not displayed.
2. **Edit or Delete Exams**
   - (Future Functionality) Options to edit or delete exams will be available.

### 5. Viewing Revision Timetable

1. **Access Timetable**
   - Scroll down to the "Revision Timetable" section.
2. **Understand the Schedule**
   - The app generates a personalized revision timetable.
   - Revision sessions are scheduled equally among all your subjects.
   - The timetable considers your availability preferences and schedules sessions from the current date up to each exam.
   - **Catch-Up Sessions**:
     - In the week before each exam, revision sessions for that specific subject are marked as **"catch-up"** sessions.
     - This helps you focus more on subjects that are approaching their exam dates.
   - **Concurrent Scheduling**: Regular revision sessions for all upcoming exams are scheduled, ensuring continuous preparation across all subjects.
   - **No sessions are scheduled for a subject on or after its exam date.**
   - **No revision sessions are scheduled on exam dates, allowing you to focus on your exams.**
   - **Exam Dates**: Exam days are highlighted with a red border.
   - **Only upcoming exams and revision sessions are displayed; past exams are excluded.**
   - Each day displays the scheduled revision sessions with the subject allocated.
   - Duplicate sessions are eliminated, ensuring a clear timetable.
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