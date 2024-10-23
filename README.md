# UpGrade

UpGrade is an app designed to help students prepare for their school examinations by creating personalized revision timetables presented in a monthly calendar format.

## Features

- **User Authentication**: Secure login using your school email or social providers like Google, Facebook, and Apple.
- **Exam Management**: Add, edit, and delete exams, including details like subject, date, examination board, and teacher's name.
- **Personalized Revision Timetable**: Automatically generates a monthly calendar with scheduled revision sessions leading up to each exam.
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

### 2. Adding Exams

1. **Access Exam Management**
   - After logging in, you're directed to the home page.
   - Click on "Add New Exam" to open the exam form.
2. **Fill Exam Details**
   - **Subject**: Enter the subject of the exam.
   - **Exam Date**: Select the date of the exam from a date picker.
   - **Examination Board**: Enter the examination board (e.g., AQA, Edexcel).
   - **Teacher's Name**: Enter the name of your teacher for the subject.
3. **Save Exam**
   - Click on "Save Exam" to save the exam details.
   - A loading state indicates the saving process.
   - Upon success, the exam list updates automatically.

### 3. Viewing and Managing Exams

1. **View Exams**
   - See a list of all your exams on the home page.
   - Exams display subject, date, exam board, and teacher's name.
2. **Edit or Delete Exams**
   - (Future Functionality) Options to edit or delete exams will be available.

### 4. Viewing Revision Timetable

1. **Access Timetable**
   - Scroll down to the "Revision Timetable" section.
2. **Understand the Schedule**
   - See a monthly calendar view with each day showing scheduled revision sessions.
   - Exam dates are highlighted.
3. **Detailed View**
   - Click on a date to view detailed revision tasks (Future Functionality).

### 5. Logging Out

1. **Sign Out**
   - Click on the "Sign Out" button at the top right corner.
   - The app returns to the login page, and the UI updates automatically.

## External APIs and Services

- **Supabase Authentication**: Used for secure user authentication and account management.
- **Neon Postgres Database**: Stores exam information and user data.
- **Date-fns**: Handles date formatting and manipulation.

## Environment Variables

The app requires the following environment variables:

- `VITE_PUBLIC_APP_ID`: Your Supabase project URL.
- `VITE_PUBLIC_ANON_KEY`: Your Supabase public anonymous key.
- `NEON_DB_URL`: Connection string for the Neon Postgres database.

Ensure these variables are set in your environment to run the app successfully.