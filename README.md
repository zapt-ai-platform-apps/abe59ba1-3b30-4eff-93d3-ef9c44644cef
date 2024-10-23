# UpGrade

UpGrade is an app designed to help students prepare for their school examinations by creating personalized revision timetables presented in a monthly calendar format.

## Features

- **User Authentication**: Create an account using your school email address and set a password.
- **Exam Management**: Add and manage exams, including subject, date, examination board, and teacher's name.
- **Revision Timetable**: Generate a monthly calendar view of your revision schedule leading up to your exams.

## User Journeys

### 1. Account Creation and Login

1. **Sign Up**
   - Open the app and see the "Sign in with ZAPT" title.
   - Click on "Sign Up" to create a new account.
   - Enter your school email address and set a password.
   - Submit the form to create your account.

2. **Login**
   - Enter your email and password to log in.
   - Alternatively, use social providers like Google, Facebook, or Apple to log in.

### 2. Adding Exams

1. After logging in, you're directed to the home page.
2. Click on "Add Exam".
3. Fill out the form with the following details:
   - **Subject**: The subject of the exam.
   - **Date**: The date of the exam.
   - **Examination Board**: The examination board for the exam.
   - **Teacher's Name**: The name of your teacher for the subject.
4. Submit the form to save the exam information.

### 3. Viewing Revision Timetable

1. Navigate to the "Revision Timetable" page.
2. View your personalized revision timetable in a monthly calendar format.
3. Exam dates are highlighted, and revision sessions are scheduled leading up to each exam.
4. Click on any date to see detailed revision tasks for that day.

### 4. Managing Exams

1. View a list of all your added exams.
2. Edit or delete any exam entries as needed.
3. Updated exams are reflected in your revision timetable.

### 5. Logging Out

1. Click on "Sign Out" at any time to log out.
2. After signing out, you're redirected to the login page.

## External APIs and Services

- **Supabase Authentication**: Used for user authentication and account management.
- **Neon Postgres Database**: Used for storing exam information and user data.

## Environment Variables

The app requires the following environment variables:

- `VITE_PUBLIC_APP_ID`: Your Supabase project URL.
- `VITE_PUBLIC_ANON_KEY`: Your Supabase public anonymous key.
- `NEON_DB_URL`: Connection string for the Neon Postgres database.

Please ensure these variables are set in your environment to run the app successfully.