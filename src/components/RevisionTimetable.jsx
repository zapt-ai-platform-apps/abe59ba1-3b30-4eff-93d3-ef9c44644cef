import { createMemo } from 'solid-js';
import { For } from 'solid-js';
import { format, eachDayOfInterval, isSameDay, getDay, addDays } from 'date-fns';

export default function RevisionTimetable(props) {
  const { exams, preferences } = props;

  const timetable = createMemo(() => {
    const today = new Date();

    // Compute the revision end date for each exam (exam date - 7 days)
    const examRevisionEndDates = exams().map(exam => {
      const examDate = new Date(exam.examDate);
      const revisionEndDate = addDays(examDate, -7); // Subtract 7 days
      return revisionEndDate;
    });

    // Find the latest revision end date among all exams
    const latestRevisionEndDate = examRevisionEndDates.reduce((latest, current) => {
      return latest > current ? latest : current;
    }, today);

    // Collect all dates from today to latestRevisionEndDate
    const days = eachDayOfInterval({ start: today, end: latestRevisionEndDate });

    // Collect all available sessions
    const availableSessions = [];

    days.forEach(day => {
      const dayIndex = getDay(day); // 0 (Sunday) to 6 (Saturday)
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = dayNames[dayIndex];

      const sessionPreference = preferences()[dayName];

      if (sessionPreference === 'morning' || sessionPreference === 'both') {
        availableSessions.push({ date: day, time: 'Morning' });
      }

      if (sessionPreference === 'afternoon' || sessionPreference === 'both') {
        availableSessions.push({ date: day, time: 'Afternoon' });
      }
    });

    // Get list of subjects (exam subjects)
    const subjects = exams().map(exam => exam.subject);
    const numSubjects = subjects.length;

    // Assign subjects to sessions equally
    availableSessions.forEach((session, index) => {
      const subjectIndex = index % numSubjects;
      session.subject = subjects[subjectIndex];
    });

    // Group sessions by date
    const timetableMap = {};

    availableSessions.forEach(session => {
      const dateKey = session.date.toDateString();
      if (!timetableMap[dateKey]) {
        timetableMap[dateKey] = { date: session.date, sessions: [] };
      }
      timetableMap[dateKey].sessions.push(session);
    });

    // Convert timetableMap to an array sorted by date
    const timetableArray = Object.values(timetableMap).sort((a, b) => a.date - b.date);

    // Add exams on that date
    timetableArray.forEach(day => {
      const examsOnDay = exams().filter(exam => {
        const examDate = new Date(exam.examDate);
        return isSameDay(day.date, examDate);
      });
      day.exams = examsOnDay;
      day.isExamDay = examsOnDay.length > 0;
    });

    return timetableArray;
  });

  return (
    <div class="mt-8">
      <h2 class="text-2xl font-bold mb-4 text-purple-600">Revision Timetable</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <For each={timetable()}>
          {(day) => (
            <div
              class={`bg-white p-4 rounded-lg shadow-md ${day.isExamDay ? 'border-2 border-red-500' : ''}`}
            >
              <p class="font-semibold text-lg text-purple-600 mb-2">{format(day.date, 'EEEE, MMMM do')}</p>
              {day.sessions.length > 0 ? (
                <For each={day.sessions}>
                  {(session) => (
                    <p class="text-gray-800">
                      {session.time}: {session.subject}
                    </p>
                  )}
                </For>
              ) : (
                <p class="text-gray-800">No revision session scheduled.</p>
              )}
              <For each={day.exams}>
                {(exam) => (
                  <div class="mt-2">
                    <p class="text-red-600 font-semibold">Exam: {exam.subject}</p>
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