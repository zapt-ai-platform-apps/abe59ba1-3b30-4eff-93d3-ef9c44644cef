import { createMemo } from 'solid-js';
import { For } from 'solid-js';
import { format, eachDayOfInterval, isSameDay, getDay, addDays, isBefore, isAfter } from 'date-fns';

export default function RevisionTimetable(props) {
  const { exams, preferences } = props;

  const timetable = createMemo(() => {
    const today = new Date();

    // Filter out exams that have already passed
    const futureExams = exams().filter((exam) => {
      const examDate = new Date(exam.examDate);
      return isAfter(examDate, today) || isSameDay(examDate, today);
    });

    if (futureExams.length === 0) {
      return [];
    }

    // Collect all dates from today to the latest exam date
    const latestExamDate = futureExams.reduce((latest, exam) => {
      const examDate = new Date(exam.examDate);
      return examDate > latest ? examDate : latest;
    }, today);

    const days = eachDayOfInterval({ start: today, end: latestExamDate });

    // Collect all available sessions
    const availableSessions = [];

    days.forEach((day) => {
      const dayIndex = getDay(day); // 0 (Sunday) to 6 (Saturday)
      const dayNames = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ];
      const dayName = dayNames[dayIndex];

      const sessionPreference = preferences()[dayName];

      if (sessionPreference === 'morning' || sessionPreference === 'both') {
        availableSessions.push({ date: day, time: 'Morning' });
      }

      if (sessionPreference === 'afternoon' || sessionPreference === 'both') {
        availableSessions.push({ date: day, time: 'Afternoon' });
      }
    });

    // Prepare a map to store sessions for each subject
    const subjectSessionsMap = {};

    futureExams.forEach((exam) => {
      const subject = exam.subject;
      const examDate = new Date(exam.examDate);

      // Skip exams that have passed
      if (isBefore(examDate, today)) {
        return;
      }

      // Calculate regular revision period and catch-up period
      const catchUpStartDate = addDays(examDate, -7);
      const revisionEndDate = addDays(examDate, -1);

      subjectSessionsMap[subject] = {
        regular: [],
        catchUp: [],
      };

      availableSessions.forEach((session) => {
        const sessionDate = session.date;

        // Exclude sessions after exam date
        if (isAfter(sessionDate, revisionEndDate)) {
          return;
        }

        // Exclude sessions before today
        if (isBefore(sessionDate, today)) {
          return;
        }

        if (
          isAfter(sessionDate, catchUpStartDate) &&
          isBefore(sessionDate, examDate)
        ) {
          // Catch-up session
          subjectSessionsMap[subject].catchUp.push(session);
        } else if (isBefore(sessionDate, catchUpStartDate) || isSameDay(sessionDate, catchUpStartDate)) {
          // Regular session
          subjectSessionsMap[subject].regular.push(session);
        }
      });
    });

    // Distribute regular sessions equally among subjects
    const regularSessions = [];
    const regularSessionList = [];

    Object.keys(subjectSessionsMap).forEach((subject) => {
      regularSessions.push(...subjectSessionsMap[subject].regular);
    });

    regularSessions.sort((a, b) => a.date - b.date);

    const subjects = Object.keys(subjectSessionsMap);
    const numSubjects = subjects.length;

    regularSessions.forEach((session, index) => {
      const subjectIndex = index % numSubjects;
      const subject = subjects[subjectIndex];
      session.subject = subject;
      regularSessionList.push(session);
    });

    // Assign catch-up sessions
    const catchUpSessions = [];

    Object.keys(subjectSessionsMap).forEach((subject) => {
      const catchUpList = subjectSessionsMap[subject].catchUp;
      catchUpList.forEach((session) => {
        session.subject = subject;
        session.isCatchUp = true;
        catchUpSessions.push(session);
      });
    });

    // Combine all sessions
    const allSessions = [...regularSessionList, ...catchUpSessions];

    // Group sessions by date and time to avoid duplicates
    const timetableMap = {};

    allSessions.forEach((session) => {
      const dateKey = session.date.toDateString();
      if (!timetableMap[dateKey]) {
        timetableMap[dateKey] = { date: session.date, sessions: [], exams: [], isExamDay: false };
      }
      // Check if the session already exists
      const exists = timetableMap[dateKey].sessions.find(
        (s) => s.time === session.time && s.subject === session.subject
      );
      if (!exists) {
        timetableMap[dateKey].sessions.push(session);
      }
    });

    // Add exams on that date
    days.forEach((day) => {
      const dateKey = day.toDateString();
      if (!timetableMap[dateKey]) {
        timetableMap[dateKey] = { date: day, sessions: [], exams: [], isExamDay: false };
      }
      const examsOnDay = futureExams.filter((exam) => {
        const examDate = new Date(exam.examDate);
        return isSameDay(day, examDate);
      });
      timetableMap[dateKey].exams = examsOnDay;
      timetableMap[dateKey].isExamDay = examsOnDay.length > 0;
    });

    // Convert timetableMap to an array sorted by date
    const timetableArray = Object.values(timetableMap).sort(
      (a, b) => a.date - b.date
    );

    return timetableArray;
  });

  return (
    <div class="mt-8">
      <h2 class="text-2xl font-bold mb-4 text-purple-600">Revision Timetable</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <For each={timetable()}>
          {(day) => (
            <div
              class={`bg-white p-4 rounded-lg shadow-md ${
                day.isExamDay ? 'border-2 border-red-500' : ''
              }`}
            >
              <p class="font-semibold text-lg text-purple-600 mb-2">
                {format(day.date, 'EEEE, MMMM do')}
              </p>
              {day.sessions.length > 0 ? (
                <For each={day.sessions}>
                  {(session) => (
                    <p class="text-gray-800">
                      {session.time}: {session.subject}{' '}
                      {session.isCatchUp ? '(Catch-Up)' : ''}
                    </p>
                  )}
                </For>
              ) : (
                <p class="text-gray-800">No revision session scheduled.</p>
              )}
              <For each={day.exams}>
                {(exam) => (
                  <div class="mt-2">
                    <p class="text-red-600 font-semibold">
                      Exam: {exam.subject}
                    </p>
                  </div>
                )}
              </For>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}